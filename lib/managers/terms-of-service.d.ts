/**
 * @fileoverview Manager for the  Box Terms of Service Resource
 */
import BoxClient from '../box-client';
/**
 * Enum value of scope of the custom terms of services set to either managed by an enterprise or enternal to an enterprise
 *
 * @readonly
 * @enum {TermsOfServicesType}
 */
declare enum TermsOfServicesType {
    MANAGED = "managed",
    EXTERNAL = "external"
}
/**
 * Enum value of status of the custom terms of services, either currently enabled or currently disabled
 *
 * @readonly
 * @enum {TermsOfServicesStatus}
 */
declare enum TermsOfServicesStatus {
    ENABLED = "enabled",
    DISABLED = "disabled"
}
/**
 * Simple manager for interacting with all 'Terms of Services' and 'Terms of Service User Statuses' endpoints and actions.
 *
 * @param {BoxClient} client The Box API Client that is responsible for making calls to the API
 * @constructor
 */
declare class TermsOfService {
    client: BoxClient;
    type: typeof TermsOfServicesType;
    status: typeof TermsOfServicesStatus;
    constructor(client: BoxClient);
    /**
     * Creates a custom terms of services with user specified values
     *
     * API Endpoint: '/terms_of_services'
     * Method: POST
     *
     * @param {TermsOfServicesType} termsOfServicesType - Determine if the custom terms of service is scoped internall or externally to an enterprise
     * @param {TermsOfServicesStatus} termsOfServicesStatus - Determine if the custom terms of service is enabled or disabled
     * @param {string} termsOfServicesText - Text field for message associated with custom terms of services
     * @param {Function} [callback] - Passed the terms of services information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the terms of services object
     */
    create(termsOfServicesType: TermsOfServicesType, termsOfServicesStatus: TermsOfServicesStatus, termsOfServicesText: string, callback?: Function): any;
    /**
     * Updates a custom terms of services with new specified values
     *
     * API Endpoint: '/terms_of_services/:termsOfServicesID'
     * Method: PUT
     *
     * @param {string} termsOfServicesID - The id of the custom terms of services to update
     * @param {Object} updates - Fields ot the Terms of Service to update
     * @param {TermsOfServicesStatus} [updates.status] - Determine if the custom terms of service is scoped internall or externally to an enterprise
     * @param {string} [updates.text] - Text field for message associated with custom terms of services
     * @param {Function} [callback] - Passed the terms of services updated information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the terms of services object
     */
    update(termsOfServicesID: string, updates: {
        status?: TermsOfServicesStatus;
        text?: string;
    }, callback?: Function): any;
    /**
     * Gets a specific custom terms of services with specified ID
     *
     * API Endpoint: '/terms_of_services/:termsOfServicesID'
     * Method: GET
     *
     * @param {string} termsOfServicesID - The id of the custom terms of services to retrieve
     * @param {Object} [options] - Additional options. Can be left null in most cases.
     * @param {string} [options.fields] - Comma-separated list of fields to return on the collaboration objects
     * @param {Function} [callback] - Passed the terms of services information with specified ID if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the terms of services object
     */
    get(termsOfServicesID: string, options?: {
        fields?: string;
    }, callback?: Function): any;
    /**
     * Gets custom terms of services for the user's enterprise
     *
     * API Endpoint: '/terms_of_services'
     * Method: GET
     *
     * @param {Object} [options] - Additional options. Can be left null in most cases.
     * @param {TermsOfServiceType} [options.tos_type] - Optional, indicates whether the terms of service is set for external or managed under enterprise
     * @param {string} [options.fields] - Comma-separated list of fields to return on the collaboration objects
     * @param {Function} [callback] - Passed the terms of services information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the terms of services object
     */
    getAll(options?: {
        tos_type?: TermsOfServicesType;
        fields?: string;
    }, callback?: Function): any;
    /**
     * Accepts/rejects custom terms of services for the user
     *
     * API Endpoint: '/terms_of_service_user_statuses'
     * Method: POST
     *
     * @param {string} termsOfServicesID - Terms of services ID to retrieve user statuses on
     * @param {boolean} isAccepted - Determines wehether the terms of services has been accepted or rejected
     * @param {Object} [options] - Additional options. Can be left null in most cases.
     * @param {string} [options.user_id] - Optional, user id to retrieve terms of service status on, default is current user
     * @param {Function} [callback] - Passed the terms of service user status information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the terms of service user status
     */
    createUserStatus(termsOfServicesID: string, isAccepted: boolean, options?: {
        user_id?: string;
    }, callback?: Function): any;
    /**
     * Gets a terms os service status given the terms of services id
     *
     * API Endpoint: '/terms_of_service_user_statuses'
     * Method: GET
     *
     * @param {string} termsOfServicesID - The ID of the terms of services to retrieve status on
     * @param {Object} [options] - Additional options. Can be left null in most cases
     * @param {string} [options.user_id] - Optional, the id of the user to retrieve status of custom terms and service on
     * @param {Function} [callback] - Passed the terms of service user status information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the terms of service user status
     */
    getUserStatus(termsOfServicesID: string, options?: {
        user_id?: string;
    }, callback?: Function): any;
    /**
     * Accepts/rejects custom terms of services for the user
     *
     * API Endpoint: '/terms_of_service_user_statuses'
     * Method: PUT
     *
     * @param {string} termsOfServiceUserStatusID - Terms of service user status object ID
     * @param {boolean} isAccepted - Determines wehether the terms of services has been accepted or rejected
     * @param {Function} [callback] - Passed the terms of service user status updated information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the updated terms of service user status
     */
    updateUserStatus(termsOfServiceUserStatusID: string, isAccepted: boolean, callback?: Function): any;
    /**
     * Creates a user status for terms of service, if already exists then update existing user status for terms of service
     *
     * API Endpoint: '/terms_of_service_user_statuses'
     * Method: POST/PUT
     *
     * @param {string} termsOfServicesID - Terms of services ID to retrieve user statuses on
     * @param {boolean} isAccepted - Determines wehether the terms of services has been accepted or rejected
     * @param {Object} [options] - Additional options. Can be left null in most cases.
     * @param {string} [options.user_id] - Optional, user id to retrieve terms of service status on, default is current user
     * @param {Function} [callback] - Passed the terms of service user status information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the terms of service user status
     */
    setUserStatus(termsOfServicesID: string, isAccepted: boolean, options?: {
        user_id?: string;
    }, callback?: Function): any;
}
/**
 * @module box-node-sdk/lib/managers/terms-of-service
 * @see {@Link TermsOfService}
 */
export default TermsOfService;
