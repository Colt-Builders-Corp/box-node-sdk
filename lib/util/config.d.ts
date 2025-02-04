/**
 * @fileoverview Configuration Object
 */
/// <reference types="node" />
/**
 * Configuration for App Auth
 * @typedef {Object} AppAuthConfig
 * @property {string} keyID The ID of the public key used for app auth
 * @property {string|Buffer} privateKey The private key used for app auth
 * @property {string} passphrase The passphrase associated with the private key
 * @property {string} [algorithm=RS256] The signing algorithm to use, "RS256", "RS384", or "RS512"
 * @property {int} [expirationTime=30] Number of seconds the JWT should live for
 * @property {boolean} [verifyTimestamp=false] Whether the timestamp when the auth token is created should be validated
 */
declare type AppAuthConfig = {
    keyID: string;
    privateKey: string | Buffer;
    passphrase: string;
    algorithm: 'RS256' | 'RS384' | 'RS512';
    expirationTime: number;
    verifyTimestamp: boolean;
};
/**
 * Configuration settings used to initialize and customize the SDK
 *
 * @typedef {Object} UserConfigurationOptions
 * @property {string} clientID Client ID of your Box Application
 * @property {string} clientSecret Client secret of your Box Application
 * @property {string} [apiRootURL] The root URL to Box [Default: 'https://api.box.com']
 * @property {string} [uploadAPIRootURL] The root URL to Box for uploads [Default: 'https://upload.box.com/api']
 * @property {string} [authorizeRootURL] The root URL for the authorization screen [Default: 'https://account.box.com/api']
 * @property {int} [uploadRequestTimeoutMS] Timeout after which an upload request is aborted [Default: 60000]
 * @property {int} [retryIntervalMS] Time between auto-retries of the API call on a temp failure [Default: 2000]
 * @property {int} [numMaxRetries] Max # of times a temporarily-failed request should be retried before propagating a permanent failure [Default: 5]
 * @property {int} [expiredBufferMS] Time before expiration, in milliseconds, when we begin to treat tokens as expired [Default: 3 min.]
 * @property {Object} [request] Request options
 * @property {boolean} [request.strictSSL] Set to false to disable strict SSL checking, which allows using Dev APIs [Default: true]
 * @property {?AppAuthConfig} appAuth Optional configuration for App Auth
 */
declare type UserConfigurationOptions = {
    clientID: string;
    clientSecret: string;
    apiRootURL: string;
    uploadAPIRootURL: string;
    authorizeRootURL: string;
    uploadRequestTimeoutMS: number;
    retryIntervalMS: number;
    numMaxRetries: number;
    expiredBufferMS: number;
    request: {
        agentClass: any;
        agentOptions: any;
        strictSSL: boolean;
    };
    appAuth?: AppAuthConfig;
    proxy?: {
        url: string;
        username: string;
        password: string;
    };
};
/**
 * A Config Object holds the configuration options of the current setup. These are all
 * customizable by the user, and will default if no value is specified in the given params
 * object. The object is frozen on initialization, so that no values can be changed after
 * setup.
 *
 * @param {UserConfigurationOptions} params - The config options set by the user
 * @constructor
 */
declare class Config {
    _params: Required<UserConfigurationOptions>;
    [key: string]: any;
    constructor(params: any);
    /**
     * Extend the current config into a new config with new params overriding old ones
     * @param {UserConfigurationOptions} params The override options
     * @returns {Config} The extended configuration
     */
    extend(params: UserConfigurationOptions): Config;
}
/**
 * @module box-node-sdk/lib/util/config
 * @see {@Link Config}
 */
export default Config;
