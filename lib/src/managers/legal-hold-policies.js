/**
 * @fileoverview Manager for the Legal Hold Policies Resource
 */
import urlPath from '../util/url-path.ts';
// -----------------------------------------------------------------------------
// Typedefs
// -----------------------------------------------------------------------------
/**
 * Enum of valid policy assignment types, which specify what object the policy applies to
 * @readonly
 * @enum {LegalHoldPolicyAssignmentType}
 */
var LegalHoldPolicyAssignmentType;
(function (LegalHoldPolicyAssignmentType) {
    LegalHoldPolicyAssignmentType["FOLDER"] = "folder";
    LegalHoldPolicyAssignmentType["USER"] = "user";
    LegalHoldPolicyAssignmentType["FILE"] = "file";
    LegalHoldPolicyAssignmentType["FILE_VERSION"] = "file_version";
})(LegalHoldPolicyAssignmentType || (LegalHoldPolicyAssignmentType = {}));
// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
const BASE_PATH = '/legal_hold_policies', ASSIGNMENTS_PATH = '/legal_hold_policy_assignments', FILE_VERSION_LEGAL_HOLDS_PATH = '/file_version_legal_holds';
// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
/**
 * Simple manager for interacting with all Legal Holds endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
class LegalHoldPolicies {
    constructor(client) {
        this.client = client;
    }
    /**
     * Used to create a single legal hold policy for an enterprise
     *
     * API Endpoint: '/legal_hold_policies'
     * Method: POST
     *
     * @param {string} name - The name of the legal hold policy to be created
     * @param {Object} [options] - Additional parameters
     * @param {string} [options.description] - Description of the legal hold policy
     * @param {string} [options.filter_started_at] - Date filter, any Custodian assignments will apply only to file versions created or uploaded inside of the date range
     * @param {string} [options.filter_ended_at] - Date filter, any Custodian assignments will apply only to file versions created or uploaded inside of the date range
     * @param {boolean} [options.is_ongoing] - After initialization, Assignments under this Policy will continue applying to files based on events, indefinitely
     * @param {Function} [callback] - Passed the new policy information if it was acquired successfully, error otherwise
     * @returns {Promise<Object>} A promise resolving to the created policy
     */
    create(name, options, callback) {
        var apiPath = urlPath(BASE_PATH), params = {
            body: options || {},
        };
        params.body.policy_name = name;
        return this.client.wrapWithDefaultHandler(this.client.post)(apiPath, params, callback);
    }
    /**
     * Fetches details about a specific legal hold policy
     *
     * API Endpoint: '/legal_hold_policies/:policyID'
     * Method: GET
     *
     * @param {string} policyID - The Box ID of the legal hold policy being requested
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the policy information if it was acquired successfully, error otherwise
     * @returns {Promise<Object>} A promise resolving to the policy object
     */
    get(policyID, options, callback) {
        var apiPath = urlPath(BASE_PATH, policyID), params = {
            qs: options,
        };
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
    /**
     * Update or modify a legal hold policy.
     *
     * API Endpoint: '/legal_hold_policies/:policyID'
     * Method: PUT
     *
     * @param {string} policyID - The Box ID of the legal hold policy to update
     * @param {Object} updates - The information to be updated
     * @param {string} [updates.policy_name] - Name of Legal Hold Policy
     * @param {string} [updates.description] - Description of Legal Hold Policy
     * @param {string} [updates.release_notes] - Notes around why the policy was released
     * @param {Function} [callback] - Passed the updated policy information if it was acquired successfully, error otherwise
     * @returns {Promise<Object>} A promise resolving to the updated policy
     */
    update(policyID, updates, callback) {
        var apiPath = urlPath(BASE_PATH, policyID), params = {
            body: updates,
        };
        return this.client.wrapWithDefaultHandler(this.client.put)(apiPath, params, callback);
    }
    /**
     * Fetches a list of legal hold policies for the enterprise
     *
     * API Endpoint: '/legal_hold_policies'
     * Method: GET
     *
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {string} [options.policy_name] - A full or partial name to filter the legal hold policies by
     * @param {int} [options.limit] - Limit result size to this number
     * @param {string} [options.marker] - Paging marker, leave blank to start at the first page
     * @param {Function} [callback] - Passed the policy objects if they were acquired successfully, error otherwise
     * @returns {Promise<Object>} A promise resolving to the collection of policies
     */
    getAll(options, callback) {
        var apiPath = urlPath(BASE_PATH), params = {
            qs: options,
        };
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
    /**
     * Sends request to delete an existing legal hold policy. Note that this is an
     * asynchronous process - the policy will not be fully deleted yet when the
     * response comes back.
     *
     * API Endpoint: '/legal_hold_policies/:policyID'
     * Method: DELETE
     *
     * @param {string} policyID - The legal hold policy to delete
     * @param {Function} [callback] - Passed nothing if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to nothing
     */
    delete(policyID, callback) {
        var apiPath = urlPath(BASE_PATH, policyID);
        return this.client.wrapWithDefaultHandler(this.client.del)(apiPath, null, callback);
    }
    /**
     * Fetch a list of assignments for a given legal hold policy
     *
     * API Endpoint: '/legal_hold_policies/:policyID/assignments'
     * Method: GET
     *
     * @param {string} policyID - The Box ID of the legal hold policy to get assignments for
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {LegalHoldPolicyAssignmentType} [options.assign_to_type] - Filter assignments of this type only
     * @param {string} [options.assign_to_id] - Filter assignments to this ID only. Note that this will only show assignments applied directly to this entity.
     * @param {Function} [callback] - Passed the assignment objects if they were acquired successfully, error otherwise
     * @returns {Promise<Object>} A promise resolving to the collection of policy assignments
     */
    getAssignments(policyID, options, callback) {
        var apiPath = urlPath(ASSIGNMENTS_PATH), params = {
            qs: Object.assign({ policy_id: policyID }, options),
        };
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
    /**
     * Assign a lehal hold policy to an object
     *
     * API Endpoint: '/legal_hold_policy_assignments
     * Method: POST
     *
     * @param {string} policyID - The ID of the policy to assign
     * @param {LegalHoldPolicyAssignmentType} assignType - The type of object the policy will be assigned to
     * @param {string} assignID - The Box ID of the object to assign the legal hold policy to
     * @param {Function} [callback] - Passed the new assignment object if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the created assignment object
     */
    assign(policyID, assignType, assignID, callback) {
        var apiPath = urlPath(ASSIGNMENTS_PATH), params = {
            body: {
                policy_id: policyID,
                assign_to: {
                    type: assignType,
                    id: assignID,
                },
            },
        };
        return this.client.wrapWithDefaultHandler(this.client.post)(apiPath, params, callback);
    }
    /**
     * Fetch a specific policy assignment
     *
     * API Endpoint: '/legal_hold_policy_assignments/:assignmentID'
     * Method: GET
     *
     * @param {string} assignmentID - The Box ID of the policy assignment object to fetch
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the assignment object if it was acquired successfully, error otherwise
     * @returns {Promise<Object>} A promise resolving to the assignment object
     */
    getAssignment(assignmentID, options, callback) {
        var apiPath = urlPath(ASSIGNMENTS_PATH, assignmentID), params = {
            qs: options,
        };
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
    /**
     * Sends request to delete an existing legal hold policy. Note that this is an
     * asynchronous process - the policy will not be fully deleted yet when the
     * response comes back.
     *
     * API Endpoint: '/legal_hold_policy_assignments/:assignmentID'
     * Method: DELETE
     *
     * @param {string} assignmentID - The legal hold policy assignment to delete
     * @param {Function} [callback] - Passed nothing if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to nothing
     */
    deleteAssignment(assignmentID, callback) {
        var apiPath = urlPath(ASSIGNMENTS_PATH, assignmentID);
        return this.client.wrapWithDefaultHandler(this.client.del)(apiPath, null, callback);
    }
    /**
     * Get the specific legal hold record for a held file version.
     *
     * API Endpoint: '/file_version_legal_holds/:legalHoldID'
     * Method: GET
     *
     * @param {string} legalHoldID - The ID for the file legal hold record to retrieve
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Pass the file version legal hold record if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the legal hold record
     */
    getFileVersionLegalHold(legalHoldID, options, callback) {
        var apiPath = urlPath(FILE_VERSION_LEGAL_HOLDS_PATH, legalHoldID), params = {
            qs: options,
        };
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
    /**
     * Get a list of legal hold records for held file versions in an enterprise.
     *
     * API Endpoint: '/file_version_legal_holds'
     * Method: GET
     *
     * @param {string} policyID - ID of Legal Hold Policy to get File Version Legal Holds for
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Pass the file version legal holds records if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the collection of all file version legal holds
     */
    getAllFileVersionLegalHolds(policyID, options, callback) {
        var apiPath = urlPath(FILE_VERSION_LEGAL_HOLDS_PATH), params = {
            qs: Object.assign({ policy_id: policyID }, options),
        };
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
}
/**
 * Enum of valid policy assignment types, which specify what object the policy applies to
 * @readonly
 * @enum {LegalHoldPolicyAssignmentType}
 */
LegalHoldPolicies.prototype.assignmentTypes = LegalHoldPolicyAssignmentType;
export default LegalHoldPolicies;
//# sourceMappingURL=legal-hold-policies.js.map