/**
 * @fileoverview Errors Helper
 */
declare const _default: {
    /**
     * Build a response error with the given message, and attaching meta data from the
     * response data.
     *
     * @param {?APIRequest~ResponseObject} response - The response returned by an APIRequestManager request
     * @param {string} message - the response error message
     * @returns {Errors~ResponseError} an error describing the response error
     */
    buildResponseError(response: any, message?: string | undefined): any;
    /**
     * Build an authentication error. {@see Errors~AuthError}
     *
     * @param {?APIRequest~ResponseObject} response - The response returned by an APIRequestManager request
     * @param {string} [message] - Optional message for the error
     * @returns {Errors~AuthError} A properly formatted authentication error
     */
    buildAuthError(response: any, message?: string | undefined): any;
    /**
     * Build the error for an "Unexpected Response" from the API. This is a shortcut for
     * responseError built specifically for the 401 UNEXPECTED response case. It
     * should be called and the error should be propogated to the consumer
     * whenever an unexpected response was recieved from the API.
     *
     * @param {?APIRequest~ResponseObject} response - The response returned by an APIRequestManager request
     * @returns {Errors~ResponseError} an error describing the response error
     */
    buildUnexpectedResponseError(response: any): any;
    /**
     * Unwrap a Bluebird error and throw it, or just re-throw if the error
     * is not a Bluebird error.  This is necessary to preserve errors when
     * a function is promisified.
     * @param {Error} error The error to unwrap
     * @returns {void}
     * @throws {Error} The unwrapped error
     */
    unwrapAndThrow(error: any): never;
};
/**
 * A Helper for building errors across the SDK. Makes sure that easily-forgotten
 * fields aren't missed, and that everything is formatted properly to return to the
 * consumer.
 *
 * @name Errors
 * @module box-node-sdk/lib/util/errors
 */
export default _default;
