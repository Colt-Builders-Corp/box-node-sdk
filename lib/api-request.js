/**
 * @fileoverview A Box API Request
 */
// @NOTE(fschott) 08/05/2014: THIS FILE SHOULD NOT BE ACCESSED DIRECTLY OUTSIDE OF API-REQUEST-MANAGER
// This module is used by APIRequestManager to make requests. If you'd like to make requests to the
// Box API, consider using APIRequestManager instead. {@Link APIRequestManager}
// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
import assert from 'assert';
import { EventEmitter } from 'events';
import httpStatusCodes from 'http-status';
import request from 'request';
import Config from './util/config';
import getRetryTimeout from './util/exponential-backoff';
// ------------------------------------------------------------------------------
// Private
// ------------------------------------------------------------------------------
// Message to replace removed headers with in the request
var REMOVED_HEADER_MESSAGE = '[REMOVED BY SDK]';
// Range of SERVER ERROR http status codes
var HTTP_STATUS_CODE_SERVER_ERROR_BLOCK_RANGE = [500, 599];
// Timer used to track elapsed time beginning from executing an async request to emitting the response.
var asyncRequestTimer;
// A map of HTTP status codes and whether or not they can be retried
var retryableStatusCodes = {};
retryableStatusCodes[httpStatusCodes.REQUEST_TIMEOUT] = true;
retryableStatusCodes[httpStatusCodes.TOO_MANY_REQUESTS] = true;
/**
 * Returns true if the response info indicates a temporary/transient error.
 *
 * @param {?APIRequest~ResponseObject} response The response info from an API request,
 * or undefined if the API request did not return any response info.
 * @returns {boolean} True if the API call error is temporary (and hence can
 * be retried). False otherwise.
 * @private
 */
function isTemporaryError(response) {
    var statusCode = response.statusCode;
    // An API error is a temporary/transient if it returns a 5xx HTTP Status, with the exception of the 507 status.
    // The API returns a 507 error when the user has run out of account space, in which case, it should be treated
    // as a permanent, non-retryable error.
    if (statusCode !== httpStatusCodes.INSUFFICIENT_STORAGE &&
        statusCode >= HTTP_STATUS_CODE_SERVER_ERROR_BLOCK_RANGE[0] &&
        statusCode <= HTTP_STATUS_CODE_SERVER_ERROR_BLOCK_RANGE[1]) {
        return true;
    }
    // An API error is a temporary/transient error if it returns a HTTP Status that indicates it is a temporary,
    if (retryableStatusCodes[statusCode]) {
        return true;
    }
    return false;
}
function isClientErrorResponse(response) {
    if (!response || typeof response !== 'object') {
        throw new Error(`Expecting response to be an object, got: ${String(response)}`);
    }
    const { statusCode } = response;
    if (typeof statusCode !== 'number') {
        throw new Error(`Expecting status code of response to be a number, got: ${String(statusCode)}`);
    }
    return 400 <= statusCode && statusCode < 500;
}
function createErrorForResponse(response) {
    var errorMessage = `${response.statusCode} - ${httpStatusCodes[response.statusCode]}`;
    return new Error(errorMessage);
}
/**
 * Determine whether a given request can be retried, based on its options
 * @param {Object} options The request options
 * @returns {boolean} Whether or not the request is retryable
 * @private
 */
function isRequestRetryable(options) {
    return !options.formData;
}
/**
 * Clean sensitive headers from the request object. This prevents this data from
 * propagating out to the SDK and getting unintentionally logged via the error or
 * response objects. Note that this function modifies the given object and returns
 * nothing.
 *
 * @param {APIRequest~RequestObject} requestObj Any request object
 * @returns {void}
 * @private
 */
function cleanSensitiveHeaders(requestObj) {
    if (requestObj.headers) {
        if (requestObj.headers.BoxApi) {
            requestObj.headers.BoxApi = REMOVED_HEADER_MESSAGE;
        }
        if (requestObj.headers.Authorization) {
            requestObj.headers.Authorization = REMOVED_HEADER_MESSAGE;
        }
    }
}
// ------------------------------------------------------------------------------
// Public
// ------------------------------------------------------------------------------
/**
 * APIRequest helps to prepare and execute requests to the Box API. It supports
 * retries, multipart uploads, and more.
 *

 * @param {Config} config Request-specific Config object
 * @param {EventEmitter} eventBus Event bus for the SDK instance
 * @constructor
 */
class APIRequest {
    constructor(config, eventBus) {
        assert(config instanceof Config, 'Config must be passed to APIRequest constructor');
        assert(eventBus instanceof EventEmitter, 'Valid event bus must be passed to APIRequest constructor');
        this.config = config;
        this.eventBus = eventBus;
        this.isRetryable = isRequestRetryable(config.request);
    }
    /**
     * Executes the request with the given options. If a callback is provided, we'll
     * handle the response via callbacks. Otherwise, the response will be streamed to
     * via the stream property. You can access this stream with the getResponseStream()
     * method.
     *
     * @param {APIRequest~Callback} [callback] Callback for handling the response
     * @returns {void}
     */
    execute(callback) {
        this._callback = callback || this._callback;
        // Initiate an async- or stream-based request, based on the presence of the callback.
        if (this._callback) {
            // Start the request timer immediately before executing the async request
            if (!asyncRequestTimer) {
                asyncRequestTimer = process.hrtime();
            }
            this.request = request(this.config.request, this._handleResponse.bind(this));
        }
        else {
            this.request = request(this.config.request);
            this.stream = this.request;
            this.stream.on('error', (err) => {
                this.eventBus.emit('response', err);
            });
            this.stream.on('response', (response) => {
                if (isClientErrorResponse(response)) {
                    this.eventBus.emit('response', createErrorForResponse(response));
                    return;
                }
                this.eventBus.emit('response', null, response);
            });
        }
    }
    /**
     * Return the response read stream for a request. This will be undefined until
     * a stream-based request has been started.
     *
     * @returns {?ReadableStream} The response stream
     */
    getResponseStream() {
        return this.stream;
    }
    /**
     * Handle the request response in the callback case.
     *
     * @param {?Error} err An error, if one occurred
     * @param {Object} [response] The full response object, returned by the request module.
     *  Contains information about the request & response, including the response body itself.
     * @returns {void}
     * @private
     */
    _handleResponse(err /* FIXME */, response /* FIXME */) {
        // Clean sensitive headers here to prevent the user from accidentily using/logging them in prod
        cleanSensitiveHeaders(this.request);
        // If the API connected successfully but responded with a temporary error (like a 5xx code,
        // a rate limited response, etc.) then this is considered an error as well.
        if (!err && isTemporaryError(response)) {
            err = createErrorForResponse(response);
        }
        if (err) {
            // Attach request & response information to the error object
            err.request = this.request;
            if (response) {
                err.response = response;
                err.statusCode = response.statusCode;
            }
            // Have the SDK emit the error response
            this.eventBus.emit('response', err);
            var isJWT = false;
            if (this.config.request.hasOwnProperty('form') &&
                this.config.request.form.hasOwnProperty('grant_type') &&
                this.config.request.form.grant_type ===
                    'urn:ietf:params:oauth:grant-type:jwt-bearer') {
                isJWT = true;
            }
            // If our APIRequest instance is retryable, attempt a retry. Otherwise, finish and propagate the error. Doesn't retry when the request is for JWT authentication, since that is handled in retryJWTGrant.
            if (this.isRetryable && !isJWT) {
                this._retry(err);
            }
            else {
                this._finish(err);
            }
            return;
        }
        // If the request was successful, emit & propagate the response!
        this.eventBus.emit('response', null, response);
        this._finish(null, response);
    }
    /**
     * Attempt a retry. If the request hasn't exceeded it's maximum number of retries,
     * re-execute the request (after the retry interval). Otherwise, propagate a new error.
     *
     * @param {?Error} err An error, if one occurred
     * @returns {void}
     * @private
     */
    _retry(err /* FIXME */) {
        this.numRetries = this.numRetries || 0;
        if (this.numRetries < this.config.numMaxRetries) {
            var retryTimeout;
            this.numRetries += 1;
            // If the retry strategy is defined, then use it to determine the time (in ms) until the next retry or to
            // propagate an error to the user.
            if (this.config.retryStrategy) {
                // Get the total elapsed time so far since the request was executed
                var totalElapsedTime = process.hrtime(asyncRequestTimer);
                var totalElapsedTimeMS = totalElapsedTime[0] * 1000 + totalElapsedTime[1] / 1000000;
                var retryOptions = {
                    error: err,
                    numRetryAttempts: this.numRetries,
                    numMaxRetries: this.config.numMaxRetries,
                    retryIntervalMS: this.config.retryIntervalMS,
                    totalElapsedTimeMS,
                };
                retryTimeout = this.config.retryStrategy(retryOptions);
                // If the retry strategy doesn't return a number/time in ms, then propagate the response error to the user.
                // However, if the retry strategy returns its own error, this will be propagated to the user instead.
                if (typeof retryTimeout !== 'number') {
                    if (retryTimeout instanceof Error) {
                        err = retryTimeout;
                    }
                    this._finish(err);
                    return;
                }
            }
            else if (err.hasOwnProperty('response') &&
                err.response.hasOwnProperty('headers') &&
                err.response.headers.hasOwnProperty('retry-after')) {
                retryTimeout = err.response.headers['retry-after'] * 1000;
            }
            else {
                retryTimeout = getRetryTimeout(this.numRetries, this.config.retryIntervalMS);
            }
            setTimeout(this.execute.bind(this), retryTimeout);
        }
        else {
            err.maxRetriesExceeded = true;
            this._finish(err);
        }
    }
    /**
     * Propagate the response to the provided callback.
     *
     * @param {?Error} err An error, if one occurred
     * @param {APIRequest~ResponseObject} response Information about the request & response
     * @returns {void}
     * @private
     */
    _finish(err, response) {
        var callback = this._callback;
        process.nextTick(() => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, response);
        });
    }
}
/**
 * @module box-node-sdk/lib/api-request
 * @see {@Link APIRequest}
 */
export default APIRequest;
//# sourceMappingURL=api-request.js.map