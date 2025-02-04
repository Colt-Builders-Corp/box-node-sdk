/**
 * @fileoverview A library for making requests to the Box API.
 */
/// <reference types="node" />
/// <reference types="bluebird" />
/// <reference types="request" />
import { EventEmitter } from 'events';
declare type Config = any;
/**
 * A library for communicating with the Box API.
 *
 * @param {Config} config SDK configuration object instance.
 * @param {EventEmitter} eventBus The event bus for SDK events
 * @constructor
 */
declare class APIRequestManager {
    config: Config;
    eventBus: EventEmitter;
    constructor(config: Config, eventBus: EventEmitter);
    /**
     * Make a request to the API, and get the response via callback.
     *
     * @param {Object} options The request options
     * @returns {Promise<Response>} A promise resolving to the response object
     */
    makeRequest(options: any): import("bluebird")<unknown>;
    /**
     * Make a request to the API, and return a read stream for the response.
     *
     * @param {Object} options The request options
     * @returns {Stream.Readable} The response stream
     */
    makeStreamingRequest(options: any): import("request").Request | undefined;
}
/**
 * @module box-node-sdk/lib/api-request-manager
 * @see {@Link APIRequestManager}
 */
export default APIRequestManager;
