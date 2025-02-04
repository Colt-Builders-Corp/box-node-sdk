/**
 * @fileoverview Manager for Enterprise resources
 */
import urlPath from '../util/url-path';
// -----------------------------------------------------------------------------
// Typedefs
// -----------------------------------------------------------------------------
/**
 * List of valid user types
 * @readonly
 * @enum {EnterpriseUserType}
 */
var EnterpriseUserType;
(function (EnterpriseUserType) {
    EnterpriseUserType["ALL"] = "all";
    EnterpriseUserType["MANAGED"] = "managed";
    EnterpriseUserType["EXTERNAL"] = "external";
})(EnterpriseUserType || (EnterpriseUserType = {}));
/**
 * List of valid user statuses
 * @readonly
 * @enum {EnterpriseUserStatus}
 */
var EnterpriseUserStatus;
(function (EnterpriseUserStatus) {
    EnterpriseUserStatus["ACTIVE"] = "active";
    EnterpriseUserStatus["INACTIVE"] = "inactive";
    EnterpriseUserStatus["CANNOT_DELETE_OR_EDIT"] = "cannot_delete_edit";
    EnterpriseUserStatus["CANNOT_DELETE_EDIT_OR_UPLOAD"] = "cannot_delete_edit_upload";
})(EnterpriseUserStatus || (EnterpriseUserStatus = {}));
/**
 * List of valid roles
 * @readonly
 * @enum {EnterpriseRole}
 */
var EnterpriseRole;
(function (EnterpriseRole) {
    EnterpriseRole["USER"] = "user";
    EnterpriseRole["COADMIN"] = "coadmin";
})(EnterpriseRole || (EnterpriseRole = {}));
// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
const USERS_PATH = '/users', INVITES_PATH = '/invites', FOLDERS_SUBRESOURCE = 'folders', ROOT_FOLDER_ID = '0';
// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
/**
 * Simple manager for interacting with all Enterprise endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
class Enterprise {
    constructor(client) {
        this.client = client;
    }
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
    getUsers(options, callback) {
        var apiPath = urlPath(USERS_PATH), params = {
            qs: options,
        };
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
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
    inviteUser(enterpriseID, email, callback) {
        var apiPath = urlPath(INVITES_PATH), params = {
            body: {
                enterprise: {
                    id: enterpriseID,
                },
                actionable_by: {
                    login: email,
                },
            },
        };
        return this.client.wrapWithDefaultHandler(this.client.post)(apiPath, params, callback);
    }
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
    addUser(login, name, options, callback) {
        var apiPath = urlPath(USERS_PATH), params = {
            body: { login, name },
        };
        Object.assign(params.body, options);
        return this.client.wrapWithDefaultHandler(this.client.post)(apiPath, params, callback);
    }
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
    addAppUser(name, options, callback) {
        var apiPath = urlPath(USERS_PATH), params = {
            body: {
                name,
                is_platform_access_only: true,
            },
        };
        Object.assign(params.body, options);
        return this.client.wrapWithDefaultHandler(this.client.post)(apiPath, params, callback);
    }
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
    transferUserContent(sourceUserID, destUserID, callback) {
        var apiPath = urlPath(USERS_PATH, sourceUserID, FOLDERS_SUBRESOURCE, ROOT_FOLDER_ID), params = {
            body: {
                owned_by: { id: destUserID },
            },
        };
        return this.client.wrapWithDefaultHandler(this.client.put)(apiPath, params, callback);
    }
}
Enterprise.prototype.userTypes = EnterpriseUserType;
Enterprise.prototype.userStatuses = EnterpriseUserStatus;
Enterprise.prototype.userRoles = EnterpriseRole;
export default Enterprise;
//# sourceMappingURL=enterprise.js.map