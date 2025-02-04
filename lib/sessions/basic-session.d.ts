/**
 * @fileoverview A Basic Box API Session.
 */
/// <reference types="bluebird" />
declare type TokenManager = any;
declare type TokenRequestOptions = Record<string, any>;
/**
 * A BasicSession holds only a single accessToken. It has no idea how to authenticate,
 * refresh, or persist its token information. When that token expires, the session
 * and any clients using it will become useless.
 *
 * Basic API Session is the most simple API Session to use, which makes it a good choice
 * for simple applications, developers who are just getting started, and applications
 * that wish to manage tokens themselves.
 *
 * @param {string} accessToken The existing access token for a user
 * @param {TokenManager} tokenManager The token manager
 * @constructor
 */
declare class BasicSession {
    _accessToken: string;
    _tokenManager: TokenManager;
    constructor(accessToken: string, tokenManager: TokenManager);
    /**
     * Returns the clients access token. BasicSession never returns an error, since it doesn't
     * know the status of its own token.
     *
     * @returns {Promise<string>} Promise resolving to the access token
     */
    getAccessToken(): import("bluebird")<string>;
    /**
     * Revokes the session's access token.
     *
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise} Promise resolving if the revoke succeeds
     */
    revokeTokens(options?: TokenRequestOptions): any;
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
}
/**
 * @module box-node-sdk/lib/sessions/basic-session
 * @see {@Link BasicSession}
 */
export default BasicSession;
