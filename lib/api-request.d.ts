/**
 * @fileoverview A Box API Request
 */
/// <reference types="node" />
import { EventEmitter } from 'events';
import request from 'request';
import Config from './util/config';
/**
 * The API response object includes information about the request made and its response. The information attached is a subset
 * of the information returned by the request module, which is too large and complex to be safely handled (contains circular
 * references, errors on serialization, etc.)
 *
 * @typedef {Object} APIRequest~ResponseObject
 * @property {APIRequest~RequestObject} request Information about the request that generated this response
 * @property {int} statusCode The response HTTP status code
 * @property {Object} headers A collection of response headers
 * @property {Object|Buffer|string} [body] The response body. Encoded to JSON by default, but can be a buffer
 *  (if encoding fails or if json encoding is disabled) or a string (if string encoding is enabled). Will be undefined
 *  if no response body is sent.
 */
declare type APIRequestResponseObject = {
    request: APIRequestRequestObject;
    statusCode: number;
    headers: Record<string, string>;
    body?: object | Buffer | string;
};
/**
 * The API request object includes information about the request made. The information attached is a subset of the information
 * of a request module instance, which is too large and complex to be safely handled (contains circular references, errors on
 * serialization, etc.).
 *
 * @typedef {Object} APIRequest~RequestObject
 * @property {Object} uri Information about the request, including host, path, and the full 'href' url
 * @property {string} method The request method (GET, POST, etc.)
 * @property {Object} headers A collection of headers sent with the request
 */
declare type APIRequestRequestObject = {
    uri: Record<string, any>;
    method: string;
    headers: Record<string, string>;
};
/**
 * The error returned by APIRequest callbacks, which includes any relevent, available information about the request
 * and response. Note that these properties do not exist on stream errors, only errors retuned to the callback.
 *
 * @typedef {Error} APIRequest~Error
 * @property {APIRequest~RequestObject} request Information about the request that generated this error
 * @property {APIRequest~ResponseObject} [response] Information about the response related to this error, if available
 * @property {int} [statusCode] The response HTTP status code
 * @property {boolean} [maxRetriesExceeded] True iff the max number of retries were exceeded. Otherwise, undefined.
 */
declare type APIRequestError = {
    request: APIRequestRequestObject;
    response?: APIRequestResponseObject;
    statusCode?: number;
    maxRetriesExceeded?: boolean;
};
/**
 * Callback invoked when an APIRequest request is complete and finalized. On success,
 * propagates the relevent response information. An err will indicate an unresolvable issue
 * with the request (permanent failure or temp error response from the server, retried too many times).
 *
 * @callback APIRequest~Callback
 * @param {?APIRequest~Error} err If Error object, API request did not get back the data it was supposed to. This
 *  could be either because of a temporary error, or a more serious error connecting to the API.
 * @param {APIRequest~ResponseObject} response The response returned by an APIRequestManager request
 */
declare type APIRequestCallback = (err?: APIRequestError | null, response?: APIRequestResponseObject) => void;
/**
 * APIRequest helps to prepare and execute requests to the Box API. It supports
 * retries, multipart uploads, and more.
 *

 * @param {Config} config Request-specific Config object
 * @param {EventEmitter} eventBus Event bus for the SDK instance
 * @constructor
 */
declare class APIRequest {
    config: Config;
    eventBus: EventEmitter;
    isRetryable: boolean;
    _callback?: APIRequestCallback;
    request?: request.Request;
    stream?: request.Request;
    numRetries?: number;
    constructor(config: Config, eventBus: EventEmitter);
    /**
     * Executes the request with the given options. If a callback is provided, we'll
     * handle the response via callbacks. Otherwise, the response will be streamed to
     * via the stream property. You can access this stream with the getResponseStream()
     * method.
     *
     * @param {APIRequest~Callback} [callback] Callback for handling the response
     * @returns {void}
     */
    execute(callback?: APIRequestCallback): void;
    /**
     * Return the response read stream for a request. This will be undefined until
     * a stream-based request has been started.
     *
     * @returns {?ReadableStream} The response stream
     */
    getResponseStream(): request.Request | undefined;
    /**
     * Handle the request response in the callback case.
     *
     * @param {?Error} err An error, if one occurred
     * @param {Object} [response] The full response object, returned by the request module.
     *  Contains information about the request & response, including the response body itself.
     * @returns {void}
     * @private
     */
    _handleResponse(err?: any, response?: any): void;
    /**
     * Attempt a retry. If the request hasn't exceeded it's maximum number of retries,
     * re-execute the request (after the retry interval). Otherwise, propagate a new error.
     *
     * @param {?Error} err An error, if one occurred
     * @returns {void}
     * @private
     */
    _retry(err?: any): void;
    /**
     * Propagate the response to the provided callback.
     *
     * @param {?Error} err An error, if one occurred
     * @param {APIRequest~ResponseObject} response Information about the request & response
     * @returns {void}
     * @private
     */
    _finish(err?: any, response?: APIRequestResponseObject): void;
}
/**
 * @module box-node-sdk/lib/api-request
 * @see {@Link APIRequest}
 */
export default APIRequest;
