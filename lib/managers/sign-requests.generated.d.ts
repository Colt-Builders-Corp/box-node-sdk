import BoxClient from '../box-client';
import * as schemas from '../schemas';
/**
 * Simple manager for interacting with all Sign Requests endpoints and actions.
 */
declare class SignRequestsManager {
    client: BoxClient;
    /**
     * @param {BoxClient} client The Box API Client that is responsible for making calls to the API
     */
    constructor(client: BoxClient);
    /**
     * Get sign request by ID
     *
     * Gets a sign request by ID.
     * @param {object} options Options for the request
     * @param {string} options.sign_request_id The ID of the sign request
     * @param {Function} [callback] Passed the result if successful, error otherwise
     * @returns {Promise<schemas.SignRequest>} A promise resolving to the result or rejecting with an error
     */
    getById(options: {
        /**
         * The ID of the sign request
         */
        readonly sign_request_id: string;
    }, callback?: Function): Promise<schemas.SignRequest>;
    /**
     * List sign requests
     *
     * Gets sign requests created by a user.
     * @param {object} [options] Options for the request
     * @param {string} [options.marker] Defines the position marker at which to begin returning results. This is used when paginating using marker-based pagination. This requires `usemarker` to be set to `true`.
     * @param {number} [options.limit] The maximum number of items to return per page.
     * @param {Function} [callback] Passed the result if successful, error otherwise
     * @returns {Promise<schemas.SignRequests>} A promise resolving to the result or rejecting with an error
     */
    getAll(options?: {
        /**
         * Defines the position marker at which to begin returning results. This is
         * used when paginating using marker-based pagination.
         *
         * This requires `usemarker` to be set to `true`.
         */
        readonly marker?: string;
        /**
         * The maximum number of items to return per page.
         */
        readonly limit?: number;
    }, callback?: Function): Promise<schemas.SignRequests>;
    /**
     * Create sign request
     *
     * Creates a sign request. This involves preparing a document for signing and
     * sending the sign request to signers.
     * @param {schemas.SignRequestCreateRequest} body
     * @param {object} [options] Options for the request
     * @param {Function} [callback] Passed the result if successful, error otherwise
     * @returns {Promise<schemas.SignRequest>} A promise resolving to the result or rejecting with an error
     */
    create(body: schemas.SignRequestCreateRequest, options?: {}, callback?: Function): Promise<schemas.SignRequest>;
    /**
     * Cancel sign request
     *
     * Cancels a sign request.
     * @param {object} options Options for the request
     * @param {string} options.sign_request_id The ID of the sign request
     * @param {Function} [callback] Passed the result if successful, error otherwise
     * @returns {Promise<schemas.SignRequest>} A promise resolving to the result or rejecting with an error
     */
    cancelById(options: {
        /**
         * The ID of the sign request
         */
        readonly sign_request_id: string;
    }, callback?: Function): Promise<schemas.SignRequest>;
    /**
     * Resend sign request
     *
     * Resends a sign request email to all outstanding signers.
     * @param {object} options Options for the request
     * @param {string} options.sign_request_id The ID of the sign request
     * @param {Function} [callback] Passed the result if successful, error otherwise
     * @returns {Promise<object>} A promise resolving to the result or rejecting with an error
     */
    resendById(options: {
        /**
         * The ID of the sign request
         */
        readonly sign_request_id: string;
    }, callback?: Function): Promise<object>;
}
export default SignRequestsManager;
