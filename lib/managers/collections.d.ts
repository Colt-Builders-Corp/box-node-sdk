/**
 * @fileoverview Manager for the Box Collection Resource
 */
import BoxClient from '../box-client';
/**
 * Simple manager for interacting with all 'Collection' endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
declare class Collections {
    client: BoxClient;
    constructor(client: BoxClient);
    /**
     * Requests all of a user's collection objects.
     *
     * API Endpoint: '/collections'
     * Method: GET
     *
     * @param {Function} [callback] - Called with a collection of collections if successful
     * @returns {Promise<Object>} A promise resolving to the collection of collections
     */
    getAll(callback?: Function): any;
    /**
     * Requests the items in the collection object with a given ID.
     *
     * API Endpoint: '/collections/:collectionID/items'
     * Method: GET
     *
     * @param {string} collectionID - Box ID of the collection with items being requested
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the items information if they were acquired successfully
     * @returns {Promise<Object>} A promise resolving to the collection of items in the collection
     */
    getItems(collectionID: string, options?: Record<string, any>, callback?: Function): any;
}
/**
 * @module box-node-sdk/lib/managers/collections
 * @see {@Link Collections}
 */
export default Collections;
