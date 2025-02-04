/**
 * @fileoverview Manager for the Trash Resource
 */
import BoxClient from '../box-client';
/**
 * Simple manager for interacting with all Trash endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
declare class Trash {
    client: BoxClient;
    constructor(client: BoxClient);
    /**
     * Get items in the user's trash
     *
     * API Endpoint: '/folders/trash/items'
     * Method: GET
     *
     * @param {Object} [options] - Optional parameters, can be left null in most cases
     * @param {string} [options.fields] - Comma-delimited list of item fields to return
     * @param {Function} [callback] - Passed the list of trashed items if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the collection of trashed items
     */
    get(options?: {
        fields?: string;
    }, callback?: Function): any;
}
export default Trash;
