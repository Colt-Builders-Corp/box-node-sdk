/**
 * @fileoverview Manager for the Shared Items
 */
import BoxClient from '../box-client.ts';
/**
 * Simple manager for interacting with all 'Shared Item' endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
declare class SharedItems {
    client: BoxClient;
    constructor(client: BoxClient);
    /**
     * Requests a Box item associated with a shared link.
     *
     * API Endpoint: '/shared_items'
     * Method: GET
     *
     * @param {string} url - Shared Link URL
     * @param {string} [password] - Shared Link Password (null if no password)
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - passed the shared item if it was successfully acquired
     * @returns {Promise<Object>} A promise resolving to the shared item object
     */
    get(url: string, password: string, options?: Record<string, any>, callback?: Function): any;
}
/**
 * @module box-node-sdk/lib/managers/shared-items
 * @see {@Link SharedItems}
 */
export default SharedItems;
