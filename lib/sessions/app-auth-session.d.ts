/**
 * @fileoverview App Auth Box API Session.
 */
declare type Config = any;
declare type TokenManager = any;
declare type TokenStore = any;
declare type TokenInfo = any;
declare type TokenRequestOptions = any;
/**
 * App Auth Box API Session.
 *
 * The App Auth API Session holds an accessToken for an app user or enterprise,
 * which it returns to the client so that it may make calls on behalf of
 * these entities.
 *
 * These access tokens will be refreshed in the background if a request is made within the
 * "stale buffer" (defaults to 10 minutes before the token is set to expire).
 * If the token is also expired, all incoming requests will be held until a fresh token
 * is retrieved.
 *
 * @param {string} type The type of the entity to authenticate the app auth session as, "user" or "enterprise"
 * @param {string} id The Box ID of the entity to authenticate as
 * @param {Config} config The SDK configuration options
 * @param {TokenManager} tokenManager The TokenManager
 * @param {TokenStore} [tokenStore] The token store instance to use for caching token info
 * @constructor
 */
declare class AppAuthSession {
    _type: string;
    _id: string | undefined;
    _config: Config;
    _tokenManager: TokenManager;
    _tokenStore: TokenStore | null;
    _tokenInfo: TokenInfo;
    _refreshPromise: Promise<any> | null;
    constructor(type: string, id: string | undefined, config: Config, tokenManager: TokenManager, tokenStore?: TokenStore);
    /**
     * Initiate a refresh of the app auth access tokens. New tokens should be passed
     * to the caller, and then cached for later use.
     *
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<string>} Promise resolving to the access token
     * @private
     */
    _refreshAppAuthAccessToken(options?: TokenRequestOptions): Promise<any> | null;
    /**
     * Produces a valid, app auth access token.
     * Performs a refresh before returning if the current token is expired. If the current
     * token is considered stale but still valid, return the current token but initiate a
     * new refresh in the background.
     *
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<string>} Promise resolving to the access token
     */
    getAccessToken(options?: TokenRequestOptions): any;
    /**
     * Revokes the app auth token used by this session, and clears the saved tokenInfo.
     *
     * @param {TokenRequestOptions} [options]- Sets optional behavior for the token grant
     * @returns {Promise} Promise resolving if the revoke succeeds
     */
    revokeTokens(options: TokenRequestOptions): any;
    /**
     * Exchange the client access token for one with lower scope
     * @param {string|string[]} scopes The scope(s) requested for the new token
     * @param {string} [resource] The absolute URL of an API resource to scope the new token to
     * @param {Object} [options] - Optional parameters
     * @param {TokenRequestOptions} [options.tokenRequestOptions] - Sets optional behavior for the token grant
     * @param {ActorParams} [options.actor] - Optional actor parameters for creating annotator tokens
     * @returns {Promise<TokenInfo>} Promise resolving to the new token info
     */
    exchangeToken(scopes: string | string[], resource?: string, options?: {
        tokenRequestOptions?: TokenRequestOptions;
        actor?: any;
    }): any;
    /**
     * Handle an an "Expired Tokens" Error. If our tokens are expired, we need to clear the token
     * store (if present) before continuing.
     *
     * @param {Errors~ExpiredTokensError} err An "expired tokens" error including information
     *  about the request/response.
     * @returns {Promise<Error>} Promise resolving to an error.  This will
     *  usually be the original response error, but could an error from trying to access the
     *  token store as well.
     */
    handleExpiredTokensError(err: any): any;
}
/**
 * @module box-node-sdk/lib/sessions/app-auth-session
 * @see {@Link AppAuthSession}
 */
export default AppAuthSession;
