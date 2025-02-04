/**
 * @fileoverview Manager for the Box Collaboration Allowlist Resource
 */
import BoxClient from '../box-client';
/**
 * Collaboration Allowlist parameter constant
 * @typedef {string} CollaborationAllowlistDirection Determines the type of restriction for allowlisting for a domain
 */
declare enum CollaborationAllowlistDirection {
    INBOUND = "inbound",
    OUTBOUND = "outbound",
    BOTH = "both"
}
/**
 * Simple manager for interacting with all 'Collaboration Allowlist' endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
declare class CollaborationAllowlist {
    client: BoxClient;
    directions: Record<string, string>;
    /** @deprecated */
    getWhitelistedDomain: any;
    /** @deprecated */
    getAllWhitelistedDomains: any;
    constructor(client: BoxClient);
    /**
     * Add a domain to the enterprise's allowlist.
     *
     * API Endpoint: '/collaboration_whitelist_entries'
     * Method: POST
     *
     * @param {string} domain - The domain to be added to the allowlist
     * @param {CollaborationAllowlistDirection} direction - Inbound refers to collaboration actions within an enterprise. Outbound
     *                                                      refers to collaboration actions external to an enterprise. Both refers to
     *                                                      collaboration actions taken within and external to an enterprise
     * @param {Function} [callback] - Passed the collaboration allowlist information if it was created successfully
     * @returns {Promise<Object>} A promise resolve to the collaboration allowlist object
     */
    addDomain(domain: string, direction: CollaborationAllowlistDirection, callback?: Function): any;
    /**
     * Requests a collaboration allowlist entry with a given ID.
     *
     * API Endpoint: '/collaboration_whitelist_entries/:domainID'
     * Method: GET
     *
     * @param {string} domainID - Box ID of the collaboration allowlist being requested
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the collaboration allowlist information if it was acquired successfully
     * @returns {Promise<Object>} A promise resolving to the collaboration allowlist object
     */
    getAllowlistedDomain(domainID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Requests all collaboration allowlist entries within an enterprise.
     *
     * API Endpoint: '/collaboration_whitelist_entries'
     * Method: GET
     *
     * @param {Object} [options] - Additional options. Can be left null in most cases.
     * @param {int} [options.limit] - The number of collaboration allowlists to retrieve
     * @param {string} [options.marker] - Paging marker, retrieve records starting at this position in the list. Left blank to start at the beginning.
     * @param {Function} [callback] - Passed a list of collaboration allowlists if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the collection of collaboration allowlists
     */
    getAllAllowlistedDomains(options?: {
        limit?: number;
        marker?: string;
    }, callback?: Function): any;
    /**
     * Delete a given collaboration allowlist entry.
     *
     * API Endpoint: '/collaboration_whitelist_entries/:domainID'
     * Method: DELETE
     *
     * @param {string} domainID - Box ID of the collaboration allowlist being requested
     * @param {Function} [callback] - Empty response body passed if successful.
     * @returns {Promise<void>} A promise resolving to nothing
     */
    removeDomain(domainID: string, callback?: Function): any;
    /**
     * Adds a Box User to the exempt target list.
     *
     * API Endpoint: '/collaboration_whitelist_exempt_targets'
     * Method: GET
     *
     * @param {string} userID - The ID of the Box User to be added to the allowlist
     * @param {Function} [callback] - Passed a collaboration allowlist for user if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to a user collaboration allowlist
     */
    addExemption(userID: string, callback?: Function): any;
    /**
     * Retrieves information about a collaboration allowlist for user by allowlist ID.
     *
     * API Endpoint: '/collaboration_whitelist_exempt_targets/:exemptionID'
     * Method: GET
     *
     * @param {string} exemptionID - The ID of the collaboration allowlist
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the collaboration allowlist information for a user if it was acquired successfully
     * @returns {Promise<Object>} A promise resolving to the collaboration allowlist object
     */
    getExemption(exemptionID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Retrieve a list of all exemptions to an enterprise's collaboration allowlist.
     *
     * API Endpoint: '/collaboration_whitelist_exempt_targets'
     * Method: GET
     *
     * @param {Object} [options] - Additional options. Can be left null in most cases.
     * @param {int} [options.limit] - The number of user collaboration allowlists to retrieve
     * @param {string} [options.marker] - Paging marker, retrieve records starting at this position in the list. Left blank to start at the beginning.
     * @param {Function} [callback] - Passed a list of user collaboration allowlists if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the collection of user collaboration allowlists
     */
    getAllExemptions(options?: {
        limit?: number;
        marker?: string;
    }, callback?: Function): any;
    /**
     * Delete a given user collaboration allowlist.
     *
     * API Endpoint: '/collaboration_whitelist_exempt_targets/:exemptionID'
     * Method: DELETE
     *
     * @param {string} exemptionID - Box ID of the user collaboration allowlist being requested
     * @param {Function} [callback] - Empty response body passed if successful.
     * @returns {Promise<void>} A promise resolving to nothing
     */
    removeExemption(exemptionID: string, callback?: Function): any;
}
/**
 * @module box-node-sdk/lib/managers/collaboration-allowlists
 * @see {@Link CollaborationAllowlist}
 */
export default CollaborationAllowlist;
