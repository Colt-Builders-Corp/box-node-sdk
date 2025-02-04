/**
 * @fileoverview Manager for the Trash Resource
 */
import urlPath from '../util/url-path.ts';
// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
// Trash is technically a folder, so it uses the folders endpoint
const BASE_PATH = '/folders', TRASH_ID = 'trash', ITEMS_SUBRESOURCE = 'items';
// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
/**
 * Simple manager for interacting with all Trash endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
class Trash {
    constructor(client) {
        this.client = client;
    }
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
    get(options, callback) {
        var apiPath = urlPath(BASE_PATH, TRASH_ID, ITEMS_SUBRESOURCE), params = {
            qs: options,
        };
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
}
export default Trash;
//# sourceMappingURL=trash.js.map