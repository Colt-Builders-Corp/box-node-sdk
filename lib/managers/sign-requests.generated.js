var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import urlPath from '../util/url-path';
/**
 * Simple manager for interacting with all Sign Requests endpoints and actions.
 */
class SignRequestsManager {
    /**
     * @param {BoxClient} client The Box API Client that is responsible for making calls to the API
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Get sign request by ID
     *
     * Gets a sign request by ID.
     * @param {object} options Options for the request
     * @param {string} options.sign_request_id The ID of the sign request
     * @param {Function} [callback] Passed the result if successful, error otherwise
     * @returns {Promise<schemas.SignRequest>} A promise resolving to the result or rejecting with an error
     */
    getById(options, callback) {
        const { sign_request_id: signRequestId } = options, queryParams = __rest(options, ["sign_request_id"]), apiPath = urlPath('sign_requests', signRequestId), params = {
            qs: queryParams,
        };
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
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
    getAll(options, callback) {
        const queryParams = __rest(options, []), apiPath = urlPath('sign_requests'), params = {
            qs: queryParams,
        };
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
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
    create(body, options, callback) {
        const queryParams = __rest(options, []), apiPath = urlPath('sign_requests'), params = {
            qs: queryParams,
            body: body,
        };
        return this.client.wrapWithDefaultHandler(this.client.post)(apiPath, params, callback);
    }
    /**
     * Cancel sign request
     *
     * Cancels a sign request.
     * @param {object} options Options for the request
     * @param {string} options.sign_request_id The ID of the sign request
     * @param {Function} [callback] Passed the result if successful, error otherwise
     * @returns {Promise<schemas.SignRequest>} A promise resolving to the result or rejecting with an error
     */
    cancelById(options, callback) {
        const { sign_request_id: signRequestId } = options, queryParams = __rest(options, ["sign_request_id"]), apiPath = urlPath('sign_requests', signRequestId, 'cancel'), params = {
            qs: queryParams,
        };
        return this.client.wrapWithDefaultHandler(this.client.post)(apiPath, params, callback);
    }
    /**
     * Resend sign request
     *
     * Resends a sign request email to all outstanding signers.
     * @param {object} options Options for the request
     * @param {string} options.sign_request_id The ID of the sign request
     * @param {Function} [callback] Passed the result if successful, error otherwise
     * @returns {Promise<object>} A promise resolving to the result or rejecting with an error
     */
    resendById(options, callback) {
        const { sign_request_id: signRequestId } = options, queryParams = __rest(options, ["sign_request_id"]), apiPath = urlPath('sign_requests', signRequestId, 'resend'), params = {
            qs: queryParams,
        };
        return this.client.wrapWithDefaultHandler(this.client.post)(apiPath, params, callback);
    }
}
export default SignRequestsManager;
//# sourceMappingURL=sign-requests.generated.js.map