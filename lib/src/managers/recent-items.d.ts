/**
 * @fileoverview Manager for the Box RecentItem Resource
 */
import BoxClient from '../box-client.ts';
/**
 * Simple manager for interacting with all 'RecentItem' endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
declare class RecentItems {
    client: BoxClient;
    constructor(client: BoxClient);
    /**
     * Requests all items that have been accessed by a user in the last 90 days or the last 1000 items accessed.
     *
     * API Endpoint: '/recent_items'
     * Method: GET
     *
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {int} [options.limit] Maximum number of items to return
     * @param {string} [options.marker] The position marker for marker-based paging
     * @param {string} [options.fields] Comma-separated list of fields to include in the response
     * @param {Function} [callback] - Passed the items information if they were acquired successfully
     * @returns {Promise<Object>} A promise resolving to the collection of items in the collection
     */
    get(options?: {
        limit?: number;
        marker?: string;
        fields?: string;
    }, callback?: Function): any;
}
/**
 * @module box-node-sdk/lib/managers/recent-items
 * @see {@Link RecentItems}
 */
export default RecentItems;
