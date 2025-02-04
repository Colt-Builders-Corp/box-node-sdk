/**
 * @fileoverview Manager for Enterprise resources
 */
import BoxClient from '../box-client.ts';
/**
 * List of valid user types
 * @readonly
 * @enum {EnterpriseUserType}
 */
declare enum EnterpriseUserType {
    ALL = "all",
    MANAGED = "managed",
    EXTERNAL = "external"
}
/**
 * List of valid user statuses
 * @readonly
 * @enum {EnterpriseUserStatus}
 */
declare enum EnterpriseUserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    CANNOT_DELETE_OR_EDIT = "cannot_delete_edit",
    CANNOT_DELETE_EDIT_OR_UPLOAD = "cannot_delete_edit_upload"
}
/**
 * List of valid roles
 * @readonly
 * @enum {EnterpriseRole}
 */
declare enum EnterpriseRole {
    USER = "user",
    COADMIN = "coadmin"
}
/**
 * Simple manager for interacting with all Enterprise endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
declare class Enterprise {
    client: BoxClient;
    userTypes: typeof EnterpriseUserType;
    userStatuses: typeof EnterpriseUserStatus;
    userRoles: typeof EnterpriseRole;
    constructor(client: BoxClient);
    /**
     * Get a list of users in the current enterprise
     *
     * API Endpoint: '/users'
     * Method: GET
     *
     * @param {Object} [options] - Optional parameters, can be left null in most cases
     * @param {string} [options.filter_term] - Filter the results to only users starting with the filter_term in either the name or the login
     * @param {int} [options.limit=100] - The number of records to return
     * @param {boolean} [options.usemarker=false] - Whether or not to use marker-based pagination
     * @param {string} [options.marker=''] - The marker for the page at which to start. Default is the first page
     * @param {int} [options.offset=0] - The record at which to start
     * @param {EnterpriseUserType} [options.user_type=managed] - The type of user to search for
     * @param {Function} [callback] - Passed the list of users if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the collection of users
     */
    getUsers(options?: {
        filter_term?: string;
        limit?: number;
        usemarker?: boolean;
        marker?: string;
        offset?: number;
        user_type?: EnterpriseUserType;
    }, callback?: Function): any;
    /**
     * Invites a user to join the enterprise
     *
     * API Endpoint: '/invites'
     * Method: POST
     *
     * @param {string} enterpriseID - The ID of the enterprise to invite the user to
     * @param {string} email - The email address of the user to invite
     * @param {Function} [callback] - Passed the invite object if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the invite object
     */
    inviteUser(enterpriseID: string, email: string, callback?: Function): any;
    /**
     * Create a new user in the current enterprise
     *
     * API Endpoint: '/users'
     * Method: POST
     *
     * @param {string} login - The email address this user uses to login
     * @param {string} name - The name of this user
     * @param {Object} [options] - Optional parameters, can be left null in most cases
     * @param {EnterpriseRole} [options.role] - This user’s enterprise role
     * @param {string} [options.language] - The user's language
     * @param {boolean} [options.is_sync_enabled] - Whether or not this user can use Box Sync
     * @param {string} [options.job_title] - The user’s job title
     * @param {string} [options.phone] - The user’s phone number
     * @param {string} [options.address] - The user’s address
     * @param {int} [options.space_amount] - The user’s total available storage space in bytes
     * @param {Array} [options.tracking_codes] - An array of key/value pairs set by the user’s admin
     * @param {EnterpriseUserStatus} [options.status] - The user's status
     * @param {boolean} [options.can_see_managed_users] - Whether the user should be able to see other managed users
     * @param {string} [options.timezone] - The user's timezone
     * @param {boolean} [options.is_exempt_from_device_limits] - Whether to exempt this user from Enterprise device limits
     * @param {boolean} [options.is_exempt_from_login_verification] - Whether or not this user must use two-factor authentication
     * @param {boolean} [options.is_external_collab_restricted] - Whether the user is allowed to collaborate with users outside their enterprise
     * @param {Function} [callback] - Passed the created user if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the created user
     */
    addUser(login: string, name: string, options?: {
        role?: EnterpriseRole;
        language?: string;
        is_sync_enabled?: boolean;
        job_title?: string;
        phone?: string;
        address?: string;
        space_amount?: number;
        tracking_codes?: [string, any][];
        status?: EnterpriseUserStatus;
        can_see_managed_users?: boolean;
        timezone?: string;
        is_exempt_from_device_limits?: boolean;
        is_exempt_from_login_verification?: boolean;
        is_external_collab_restricted?: boolean;
    }, callback?: Function): any;
    /**
     * Create a new app user in the current enterprise
     *
     * API Endpoint: '/users'
     * Method: POST
     *
     * @param {string} name - The name of this user
     * @param {Object} [options] - Optional parameters, can be left null in most cases
     * @param {string} [options.language] - The user's language
     * @param {string} [options.job_title] - The user’s job title
     * @param {string} [options.phone] - The user’s phone number
     * @param {string} [options.address] - The user’s address
     * @param {int} [options.space_amount] - The user’s total available storage space in bytes
     * @param {string} [options.timezone] - The user's timezone
     * @param {Function} [callback] - Passed the created user if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the created user
     */
    addAppUser(name: string, options?: {
        language?: string;
        job_title?: string;
        phone?: string;
        address?: string;
        space_amount?: number;
        timezone?: string;
    }, callback?: Function): any;
    /**
     * Transfers all of a user's files into another user's account.
     *
     * API Endpoint: '/users/:sourceUserID/folders/0'
     * Method: PUT
     *
     * @param {string} sourceUserID - The ID of the user whose files will be transferred
     * @param {string} destUserID - The ID of the user to transfer the files to
     * @param {Function} [callback] - Passed the new folder which contains all the files if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the folder containing the transferred content
     */
    transferUserContent(sourceUserID: string, destUserID: string, callback?: Function): any;
}
export default Enterprise;
