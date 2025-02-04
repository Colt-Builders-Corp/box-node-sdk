/**
 * @fileoverview An Anonymous Box API Session.
 */
declare type Config = any;
declare type TokenManager = any;
declare type TokenInfo = any;
declare type TokenRequestOptions = any;
/**
 * The Client Credentials Grant Box API Session.
 *
 * The Client Credentials Grant API Session holds a Client Credentials accessToken, which it
 * returns to the client so that it may make calls on behalf of service account or specified users.
 *
 * Tokens will be refreshed in the background if a request is made within the
 * "stale buffer" (defaults to 10 minutes before the token is set to expire).
 * If the token is also expired, all incoming requests will be held until a fresh token
 * is retrieved.
 *
 * @param {Config} config The SDK configuration options
 * @param {TokenManager} tokenManager The TokenManager
 * @constructor
 */
declare class CCGSession {
    _config: Config;
    _tokenManager: TokenManager;
    _tokenInfo: TokenInfo;
    _refreshPromise: Promise<any> | null;
    constructor(config: Config, tokenManager: TokenManager);
    /**
     * Initiate a refresh of the access tokens. New tokens should be passed to the
     * caller, and then cached for later use.
     *
     * @param {?TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<string>} Promise resolving to the access token
     * @private
     */
    _refreshAccessToken(options?: TokenRequestOptions): Promise<any>;
    /**
     * Produces a valid, anonymous access token.
     * Performs a refresh before returning if the current token is expired. If the current
     * token is considered stale but still valid, return the current token but initiate a
     * new refresh in the background.
     *
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<string>} Promise resolving to the access token
     */
    getAccessToken(options?: TokenRequestOptions): Promise<any>;
    /**
     * Revokes the anonymous token used by this anonymous session, and clears the saved tokenInfo.
     *
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise} Promise resolving if the revoke succeeds
     */
    revokeTokens(options?: TokenRequestOptions): any;
    /**
     * Exchange the client access token for one with lower scope
     *
     * @param {string|string[]} scopes The scope(s) requested for the new token
     * @param {string} [resource] The absolute URL of an API resource to scope the new token to
     * @param {Object} [options] - Optional parameters
     * @param {TokenRequestOptions} [options.tokenRequestOptions] - Sets optional behavior for the token grant
     * @returns {void}
     */
    exchangeToken(scopes: string | string[], resource?: string, options?: {
        tokenRequestOptions?: TokenRequestOptions;
    }): Promise<any>;
}
/**
 * @module box-node-sdk/lib/sessions/ccg-session
 * @see {@Link CCGSession}
 */
export default CCGSession;
