/**
 * @fileoverview A Persistent Box API Session.
 */
declare type TokenInfo = any;
declare type TokenStore = any;
declare type Config = any;
declare type TokenManager = any;
declare type TokenRequestOptions = Record<string, any>;
/**
 * A Persistent API Session has the ability to refresh its access token once it becomes expired.
 * It takes in a full tokenInfo object for authentication. It can detect when its tokens have
 * expired and will request new, valid tokens if needed. It can also interface with a token
 * data-store if one is provided.
 *
 * Persistent API Session a good choice for long-running applications or web servers that
 * must remember users across sessions.
 *
 * @param {TokenInfo} tokenInfo A valid TokenInfo object. Will throw if improperly formatted.
 * @param {TokenStore} [tokenStore] A valid TokenStore object. Will throw if improperly formatted.
 * @param {Config} config The SDK configuration options
 * @param {TokenManager} tokenManager The token manager
 * @constructor
 */
declare class PersistentSession {
    _config: Config;
    _refreshPromise: Promise<any> | null;
    _tokenManager: TokenManager;
    _tokenStore: TokenStore;
    _tokenInfo: TokenInfo;
    constructor(tokenInfo: TokenInfo, tokenStore: TokenStore, config: Config, tokenManager: TokenManager);
    /**
     * Sets all relevant token info for this client.
     *
     * @param {TokenInfo} tokenInfo A valid TokenInfo object.
     * @returns {void}
     * @private
     */
    _setTokenInfo(tokenInfo: TokenStore): void;
    /**
     * Attempts to refresh tokens for the client.
     * Will use the Box refresh token grant to complete the refresh. On refresh failure, we'll
     * check the token store for more recently updated tokens and load them if found. Otherwise
     * an error will be propagated.
     *
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<string>} Promise resolving to the access token
     * @private
     */
    _refreshTokens(options?: TokenRequestOptions): Promise<any>;
    /**
     * Returns the clients access token.
     *
     * If tokens don't yet exist, first attempt to retrieve them.
     * If tokens are expired, first attempt to refresh them.
     *
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<string>} Promise resolving to the access token
     */
    getAccessToken(options?: TokenRequestOptions): Promise<any>;
    /**
     * Revokes the session's tokens. If the session has a refresh token we'll use that,
     * since it is more likely to be up to date. Otherwise, we'll revoke the accessToken.
     * Revoking either one will disable the other as well.
     *
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise} Promise that resolves when the revoke succeeds
     */
    revokeTokens(options?: TokenRequestOptions): any;
    /**
     * Exchange the client access token for one with lower scope
     * @param {string|string[]} scopes The scope(s) requested for the new token
     * @param {string} [resource] The absolute URL of an API resource to scope the new token to
     * @param {Object} [options] - Optional parameters
     * @param {TokenRequestOptions} [options.tokenRequestOptions] - Sets optional behavior for the token grant
     * @returns {void}
     */
    exchangeToken(scopes: string | string[], resource?: string, options?: {
        tokenRequestOptions?: TokenRequestOptions;
    }): Promise<any>;
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
 * @module box-node-sdk/lib/sessions/persistent-session
 * @see {@Link PersistentSession}
 */
export default PersistentSession;
