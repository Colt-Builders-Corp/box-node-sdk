/**
 * @fileoverview Iterator for paged responses
 */
/**
 * Asynchronous iterator for paged collections
 */
declare class PagingIterator {
    /**
     * Determine if a response is iterable
     * @param {Object} response - The API response
     * @returns {boolean} Whether the response is iterable
     */
    static isIterable(response: any): boolean;
    nextField: any;
    nextValue: any;
    limit: any;
    done: boolean;
    options: Record<string, any>;
    fetch: any;
    buffer: any;
    queue: any;
    /**
     * @constructor
     * @param {Object} response - The original API response
     * @param {BoxClient} client - An API client to make further requests
     * @returns {void}
     * @throws {Error} Will throw when collection cannot be paged
     */
    constructor(response: any, client: any);
    /**
     * Update the paging parameters for the iterator
     * @private
     * @param {Object} response - The latest API response
     * @returns {void}
     */
    _updatePaging(response: any): void;
    /**
     * Fetch the next page of results
     * @returns {Promise} Promise resolving to iterator state
     */
    _getData(): any;
    /**
     * Fetch the next page of the collection
     * @returns {Promise} Promise resolving to iterator state
     */
    next(): any;
    /**
     * Fetch the next marker
     * @returns {string|int} String that is the next marker or int that is the next offset
     */
    getNextMarker(): any;
}
export default PagingIterator;
