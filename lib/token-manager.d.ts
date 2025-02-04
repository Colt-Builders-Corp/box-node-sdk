/**
 * @fileoverview Token Manager
 */
import Promise from 'bluebird';
import APIRequestManager from './api-request-manager';
declare type Config = Record<string, any>;
/**
 * Token request options. Set by the consumer to add/modify the params sent to the
 * request.
 *
 * @typedef {Object} TokenRequestOptions
 * @property {string} [ip] The IP Address of the requesting user. This IP will be reflected in authentication
 *                         notification emails sent to your users on login. Defaults to the IP address of the
 *                         server requesting the tokens.
 */
declare type TokenRequestOptions = {
    ip?: string;
};
/**
 * Parameters for creating a token using a Box shared link via token exchange
 * @typedef {Object} SharedLinkParams
 * @property {string} url Shared link URL
 */
declare type SharedLinkParams = {
    url: string;
};
/**
 * Parameters for creating an actor token via token exchange
 * @typedef {Object} ActorParams
 * @property {string} id The external identifier for the actor
 * @property {string} name The display name of the actor
 */
declare type ActorParams = {
    id: string;
    name: string;
};
/**
 * An object representing all token information for a single Box user.
 *
 * @typedef {Object} TokenInfo
 * @property {string} accessToken    The API access token. Used to authenticate API requests to a certain
 *                                   user and/or application.
 * @property {int} acquiredAtMS      The time that the tokens were acquired.
 * @property {int} accessTokenTTLMS  The TTL of the access token. Can be used with acquiredAtMS to
 *                                   calculate if the current access token has expired.
 * @property {string} [refreshToken] The API refresh token is a Longer-lasting than an access token, and can
 *                                   be used to gain a new access token if the current access token becomes
 *                                   expired. Grants like the 'client credentials' grant don't return a
 *                                   refresh token, and have no refresh capabilities.
 */
declare type TokenInfo = {
    accessToken: string;
    acquiredAtMS: number;
    accessTokenTTLMS: number;
    refreshToken?: string;
};
/**
 * Manager for API access abd refresh tokens
 *
 * @param {Config} config The config object
 * @param {APIRequestManager} requestManager The API Request Manager
 * @constructor
 */
declare class TokenManager {
    config: Config;
    requestManager: APIRequestManager;
    oauthBaseURL: string;
    constructor(config: Config, requestManager: APIRequestManager);
    /**
     * Given a TokenInfo object, returns whether its access token is expired. An access token is considered
     * expired once its TTL surpasses the current time outside of the given buffer. This is a public method so
     * that other modules may check the validity of their tokens.
     *
     * @param {TokenInfo} tokenInfo the token info to be written
     * @param {int} [bufferMS] An optional buffer we'd like to test against. The greater this buffer, the more aggressively
     * we'll call a token invalid.
     * @returns {boolean} True if token is valid outside of buffer, otherwise false
     */
    isAccessTokenValid(tokenInfo: TokenInfo, bufferMS?: number): boolean;
    /**
     * Acquires OAuth2 tokens using a grant type (authorization_code, password, refresh_token)
     *
     * @param {Object} formParams - should contain all params expected by Box OAuth2 token endpoint
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant, null for default behavior
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     * @private
     */
    getTokens(formParams: Record<string, any>, options?: TokenRequestOptions | null): Promise<{
        accessToken: any;
        refreshToken: any;
        accessTokenTTLMS: number;
        acquiredAtMS: number;
    }>;
    /**
     * Acquires token info using an authorization code
     *
     * @param {string} authorizationCode - authorization code issued by Box
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getTokensAuthorizationCodeGrant(authorizationCode: string, options?: TokenRequestOptions): Promise<{
        accessToken: any;
        refreshToken: any;
        accessTokenTTLMS: number;
        acquiredAtMS: number;
    }>;
    /**
     * Acquires token info using the client credentials grant.
     *
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getTokensClientCredentialsGrant(options?: TokenRequestOptions): Promise<{
        accessToken: any;
        refreshToken: any;
        accessTokenTTLMS: number;
        acquiredAtMS: number;
    }>;
    /**
     * Refreshes the access and refresh tokens for a given refresh token.
     *
     * @param {string} refreshToken - A valid OAuth refresh token
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getTokensRefreshGrant(refreshToken: string, options?: TokenRequestOptions): Promise<{
        accessToken: any;
        refreshToken: any;
        accessTokenTTLMS: number;
        acquiredAtMS: number;
    }>;
    /**
     * Gets tokens for enterprise administration of app users
     * @param {string} type The type of token to create, "user" or "enterprise"
     * @param {string} id The ID of the enterprise to generate a token for
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getTokensJWTGrant(type: string, id: string, options?: TokenRequestOptions): Promise<any>;
    /**
     * Attempt a retry if possible and create a new JTI claim. If the request hasn't exceeded it's maximum number of retries,
     * re-execute the request (after the retry interval). Otherwise, propagate a new error.
     *
     * @param {Object} claims - JTI claims object
     * @param {Object} [jwtOptions] - JWT options for the signature
     * @param {Object} keyParams - Key JWT parameters object that contains the private key and the passphrase
     * @param {Object} params - Should contain all params expected by Box OAuth2 token endpoint
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @param {Error} error - Error from the previous JWT request
     * @param {int} numRetries - Number of retries attempted
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    retryJWTGrant(claims: any, jwtOptions: any, keyParams: any, params: any, options: TokenRequestOptions | undefined, error: any, numRetries: number): any;
    /**
     * Exchange a valid access token for one with a lower scope, or delegated to
     * an external user identifier.
     *
     * @param {string} accessToken - The valid access token to exchange
     * @param {string|string[]} scopes - The scope(s) of the new access token
     * @param {string} [resource] - The absolute URL of an API resource to restrict the new token to
     * @param {Object} [options] - Optional parameters
     * @param {TokenRequestOptions} [options.tokenRequestOptions] - Sets optional behavior for the token grant
     * @param {ActorParams} [options.actor] - Optional actor parameters for creating annotator tokens
     * @param {SharedLinkParams} [options.sharedLink] - Optional shared link parameters for creating tokens using shared links
     * @returns {Promise<TokenInfo>} Promise resolving to the new token info
     */
    exchangeToken(accessToken: string, scopes: string | string[], resource?: string, options?: {
        tokenRequestOptions?: TokenRequestOptions;
        actor?: ActorParams;
        sharedLink?: SharedLinkParams;
    }): Promise<{
        accessToken: any;
        refreshToken: any;
        accessTokenTTLMS: number;
        acquiredAtMS: number;
    }>;
    /**
     * Revokes a token pair associated with a given access or refresh token.
     *
     * @param {string} token - A valid access or refresh token to revoke
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise} Promise resolving if the revoke succeeds
     */
    revokeTokens(token: string, options?: TokenRequestOptions): Promise<unknown>;
}
/**
 * Provides interactions with Box OAuth2 tokening system.
 *
 * @module box-node-sdk/lib/token-manager
 */
export default TokenManager;
