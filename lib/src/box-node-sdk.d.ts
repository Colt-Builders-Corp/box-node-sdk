/**
 * @fileoverview Box SDK for Node.js
 */
/// <reference types="node" />
import { EventEmitter } from 'events';
import CCGAPISession from './sessions/ccg-session.ts';
import APIRequestManager from './api-request-manager.ts';
import TokenManager from './token-manager.ts';
/**
 * Object representing interface functions for PersistentClient to interact with the consumer app's central storage layer.
 * @typedef {Object} TokenStore
 * @property {ReadTokenInfoFromStore} read - read TokenInfo from app central store.
 * @property {WriteTokenInfoToStore} write - write TokenInfo to the app's central store.
 * @property {ClearTokenInfoFromStore} clear - delete TokenInfo from the app's central store.
 */
/**
 * Acquires TokenInfo from the consumer app's central store.
 * @typedef {Function} ReadTokenInfoFromStore
 * @param {Function} callback - err if store read issue occurred, otherwise propagates a TokenInfo object
 */
/**
 * Writes TokenInfo to the consumer app's central store
 * @typedef {Function} WriteTokenInfoToStore
 * @param {TokenInfo} tokenInfo - the token info to be written
 * @param {Function} callback - err if store write issue occurred, otherwise propagates null err
 *  and null result to indicate success
 */
/**
 * Clears TokenInfo from the consumer app's central store
 * @typedef {Function} ClearTokenInfoFromStore
 * @param {Function} callback - err if store delete issue occurred, otherwise propagates null err
 *  and null result to indicate success
 */
declare type TokenStore = object;
declare type UserConfigurationOptions = object;
declare type TokenRequestOptions = object;
declare type CCGConfig = {
    boxSubjectType: "user" | "enterprise";
    boxSubjectId: string;
};
/**
 * A backend NodeJS SDK to interact with the Box V2 API.
 * This is the single entry point for all SDK consumer interactions. This is the only file that a 3rd party app
 * should require. All other components are private and reached out to via this component.
 * 1. Provides getters to spawn client instances for users to interact with the Box API.
 * 2. Provides manual capability to acquire tokens via token grant endpoints.
 *    However, it is recommended to use clients to do this for you.
 * 3. Emits notification events about relevant request/response events. Useful for logging Box API interactions.
 *    Notification events: request retries, exceeding max retries, permanent failures.
 *
 * @param {UserConfigurationOptions} params User settings used to initialize and customize the SDK
 * @constructor
 */
declare class BoxSDKNode extends EventEmitter {
    accessLevels: any;
    collaborationRoles: any;
    CURRENT_USER_ID: any;
    config: any;
    _eventBus: EventEmitter;
    requestManager: APIRequestManager;
    tokenManager: TokenManager;
    ccgSession: CCGAPISession;
    /**
     * Expose the BoxClient property enumerations to the SDK as a whole. This allows
     * the consumer to access and use these values from anywhere in their application
     * (like a helper) by requiring the SDK, instead of needing to pass the client.
     */
    static accessLevels: any;
    static collaborationRoles: any;
    static CURRENT_USER_ID: any;
    /**
     * Expose Webhooks.validateMessage() to the SDK as a whole. This allows
     * the consumer to call BoxSDK.validateWebhookMessage() by just requiring the SDK,
     * instead of needing to create a client (which is not needed to validate messages).
     */
    static validateWebhookMessage: any;
    constructor(params: UserConfigurationOptions);
    /**
     * Setup the SDK instance by instantiating necessary objects with current
     * configuration values.
     *
     * @returns {void}
     * @private
     */
    _setup(): void;
    /**
     * Gets the BoxSDKNode instance by passing boxAppSettings json downloaded from the developer console.
     *
     * @param {Object} appConfig boxAppSettings object retrieved from Dev Console.
     * @returns {BoxSDKNode} an instance that has been preconfigured with the values from the Dev Console
     */
    static getPreconfiguredInstance(appConfig: any): BoxSDKNode;
    /**
     * Updates the SDK configuration with new parameters.
     *
     * @param {UserConfigurationOptions} params User settings
     * @returns {void}
     */
    configure(params: UserConfigurationOptions): void;
    /**
     * Returns a Box Client with a Basic API Session. The client is able to make requests on behalf of a user.
     * A basic session has no access to a user's refresh token. Because of this, once the session's tokens
     * expire the client cannot recover and a new session will need to be generated.
     *
     * @param {string} accessToken A user's Box API access token
     * @returns {BoxClient} Returns a new Box Client paired to a new BasicAPISession
     */
    getBasicClient(accessToken: string): any;
    /**
     * Returns a Box Client with a Basic API Session. The client is able to make requests on behalf of a user.
     * A basic session has no access to a user's refresh token. Because of this, once the session's tokens
     * expire the client cannot recover and a new session will need to be generated.
     *
     * @param {string} accessToken A user's Box API access token
     * @returns {BoxClient} Returns a new Box Client paired to a new BasicAPISession
     */
    static getBasicClient(accessToken: string): any;
    /**
     * Returns a Box Client with a persistent API session. A persistent API session helps manage the user's tokens,
     * and can refresh them automatically if the access token expires. If a central data-store is given, the session
     * can read & write tokens to it.
     *
     * NOTE: If tokenInfo or tokenStore are formatted incorrectly, this method will throw an error. If you
     * haven't explicitly created either of these objects or are otherwise not completly confident in their validity,
     * you should wrap your call to getPersistentClient in a try-catch to handle any potential errors.
     *
     * @param {TokenInfo} tokenInfo A tokenInfo object to use for authentication
     * @param {TokenStore} [tokenStore] An optional token store for reading/writing tokens to session
     * @returns {BoxClient} Returns a new Box Client paired to a new PersistentAPISession
     */
    getPersistentClient(tokenInfo: any, tokenStore?: TokenStore): any;
    /**
     * Returns a Box Client configured to use Client Credentials Grant for a service account. Requires enterprise ID
     * to be set when configuring SDK instance.
     *
     * @returns {BoxClient} Returns a new Box Client paired to a AnonymousAPISession. All Anonymous API Sessions share the
     * same tokens, which allows them to refresh them efficiently and reduce load on both the application and
     * the API.
     */
    getAnonymousClient(): any;
    /**
     * Returns a Box Client configured to use Client Credentials Grant for a specified user.
     *
     * @param userId the user ID to use when getting the access token
     * @returns {BoxClient} Returns a new Box Client paired to a AnonymousAPISession. All Anonymous API Sessions share the
     * same tokens, which allows them to refresh them efficiently and reduce load on both the application and
     * the API.
     */
    getCCGClientForUser(userId: string): any;
    _getCCGClient(config: CCGConfig): any;
    /**
     * Create a new client using App Auth for the given entity. This allows either
     * managing App Users (as the enterprise) or performing operations as the App
     * Users or Managed Users themselves (as a user).
     *
     * @param {string} type The type of entity to operate as, "enterprise" or "user"
     * @param {string} [id] (Optional) The Box ID of the entity to operate as
     * @param {TokenStore} [tokenStore] (Optional) the token store to use for caching tokens
     * @returns {BoxClient} A new client authorized as the app user or enterprise
     */
    getAppAuthClient(type: string, id?: string, tokenStore?: TokenStore): any;
    /**
     * Generate the URL for the authorize page to send users to for the first leg of
     * the OAuth2 flow.
     *
     * @param {Object} params The OAuth2 parameters
     * @returns {string} The authorize page URL
     */
    getAuthorizeURL(params: {
        client_id?: string;
    }): string;
    /**
     * Acquires token info using an authorization code
     *
     * @param {string} authorizationCode - authorization code issued by Box
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant, null for default behavior
     * @param {Function} [callback] - passed a TokenInfo object if tokens were granted successfully
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getTokensAuthorizationCodeGrant(authorizationCode: string, options: TokenRequestOptions | null, callback: Function): any;
    /**
     * Refreshes the access and refresh tokens for a given refresh token.
     *
     * @param {string} refreshToken - A valid OAuth refresh token
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant, null for default behavior
     * @param {Function} [callback] - passed a TokenInfo object if tokens were granted successfully
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getTokensRefreshGrant(refreshToken: string, options: TokenRequestOptions | Function | null, callback: Function): any;
    /**
     * Gets tokens for enterprise administration of app users
     * @param {string} enterpriseID The ID of the enterprise to generate a token for
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant, null for default behavior
     * @param {Function} [callback] Passed the tokens if successful
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getEnterpriseAppAuthTokens(enterpriseID: string, options: TokenRequestOptions | Function | null, callback: Function): any;
    /**
     * Gets tokens for App Users via a JWT grant
     * @param {string} userID The ID of the App User to generate a token for
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant, null for default behavior
     * @param {Function} [callback] Passed the tokens if successful
     * @returns {Promise<TokentInfo>} Promise resolving to the token info
     */
    getAppUserTokens(userID: string, options: TokenRequestOptions | Function | null, callback: Function): any;
    /**
     * Revokes a token pair associated with a given access or refresh token.
     *
     * @param {string} token - A valid access or refresh token to revoke
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant, null for default behavior
     * @param {Function} [callback] - If err, revoke failed. Otherwise, revoke succeeded.
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    revokeTokens(token: string, options: TokenRequestOptions | Function | null, callback: Function): any;
}
/** @module box-node-sdk/lib/box-node-sdk */
export default BoxSDKNode;
