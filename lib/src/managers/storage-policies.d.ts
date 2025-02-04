/**
 * @fileoverview Manager for the Storage Policies resource
 */
import BoxClient from '../box-client.ts';
/**
 * Simple manager for interacting with all Retention Policies endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
declare class StoragePolicies {
    client: BoxClient;
    constructor(client: BoxClient);
    /**
     * Get information about a specific storage policy
     * @param {string} storagePolicyID The ID of the storage policy
     * @param {Object} [options] Optional parameters
     * @param {string} [options.fields] Comma-separated list of fields of the storage policy to retrieve
     * @param {Function} [callback] Passed the storage policy object if successful
     * @returns {Promise<Object>} Promise resolving to the storage policy object
     */
    get(storagePolicyID: string, options?: {
        fields?: string;
    }, callback?: Function): any;
    /**
     * Get all available storage policies for the enterprise
     * @param {Object} [options] Optional parameters
     * @param {string} [options.fields] Comma-separated list of fields of the storage policy to retrieve
     * @param {Function} [callback] Passed a collection of storage policies if successful
     * @returns {Promise<Object>} Promise resolving to the collection of storage policies
     */
    getAll(options?: {
        fields?: string;
    }, callback?: Function): any;
    /**
     * Assign a storage policy to a user
     * @param {string} storagePolicyID The ID of the storage policy to assign
     * @param {string} userID The ID of the user to assign the storage policy to
     * @param {Function} [callback] Passed the assignment object if successful
     * @returns {Promise<Object>} Promise resolving to the assignment object
     */
    assign(storagePolicyID: string, userID: string, callback?: Function): any;
    /**
     * Get information about a specific storage policy asisgnment by ID
     * @param {string} assignmentID The ID of the assignment
     * @param {Function} [callback] Passed the assignment object if successful
     * @returns {Promise<Object>} Promise resolving to the assignment object
     */
    getAssignment(assignmentID: string, callback?: Function): any;
    /**
     * Gets the storage policy assignment for a specific user
     * @param {string} targetID The ID of the target
     * @param {Object} [options] Optional parameters
     * @param {string} [options.targetType=user] The type of the assignment target to resolve for
     * @param {Function} [callback] Passed the assignment object if successful
     * @returns {Promise<Object>} Promise resolving to the assignment object
     */
    getAssignmentForTarget(targetID: string, options?: {
        targetType?: string;
    }, callback?: Function): any;
    /**
     * Create a new storage policy assignment to a user
     * @param {string} storagePolicyID The ID of the storage policy to assign
     * @param {string} userID The ID of the user to assign the storage policy to
     * @param {Function} [callback] Passed the assignment object if successful
     * @returns {Promise<Object>} Promise resolving to the assignment object
     */
    createAssignment(storagePolicyID: string, userID: string, callback?: Function): any;
    /**
     * Update a storage policy assignment
     * @param {string} assignmentID The ID of the storage policy assignment to update
     * @param {Object} updates The updates fields to apply
     * @param {Function} [callback] Passed the updated assignment object if successful
     * @returns {Promise<Object>} Promise resolving to the updated assignment object
     */
    updateAssignment(assignmentID: string, updates: Record<string, any>, callback?: Function): any;
    /**
     * Remove a storage policy assignment, returning the user to the default policy
     * @param {string} assignmentID The ID of the assignment to remove
     * @param {Function} [callback] Passed nothing if successful
     * @returns {Promise<void>} Promise resolving if the removal succeeds
     */
    removeAssignment(assignmentID: string, callback?: Function): any;
}
export default StoragePolicies;
