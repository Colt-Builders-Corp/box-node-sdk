/**
 * @fileoverview A library for making requests to the Box API.
 */
// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
import { Promise } from 'bluebird';
import errors from './util/errors.ts';
import APIRequest from './api-request.ts';
// ------------------------------------------------------------------------------
// Private
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Public
// ------------------------------------------------------------------------------
/**
 * A library for communicating with the Box API.
 *
 * @param {Config} config SDK configuration object instance.
 * @param {EventEmitter} eventBus The event bus for SDK events
 * @constructor
 */
class APIRequestManager {
    constructor(config, eventBus) {
        this.config = config;
        this.eventBus = eventBus;
    }
    /**
     * Make a request to the API, and get the response via callback.
     *
     * @param {Object} options The request options
     * @returns {Promise<Response>} A promise resolving to the response object
     */
    makeRequest(options /* FIXME */) {
        // Add default APIRequestManager options to each request
        var requestConfig = this.config.extend({
            request: options,
        });
        // Make the request
        var apiRequest = new APIRequest(requestConfig, this.eventBus);
        return Promise.fromCallback((callback) => apiRequest.execute(callback)).catch((err) => errors.unwrapAndThrow(err));
    }
    /**
     * Make a request to the API, and return a read stream for the response.
     *
     * @param {Object} options The request options
     * @returns {Stream.Readable} The response stream
     */
    makeStreamingRequest(options /* FIXME */) {
        // Add default APIRequestManager options to each request
        var requestConfig = this.config.extend({
            request: options,
        });
        // Make the request
        var apiRequest = new APIRequest(requestConfig, this.eventBus);
        apiRequest.execute();
        return apiRequest.getResponseStream();
    }
}
/**
 * @module box-node-sdk/lib/api-request-manager
 * @see {@Link APIRequestManager}
 */
export default APIRequestManager;
//# sourceMappingURL=api-request-manager.js.map