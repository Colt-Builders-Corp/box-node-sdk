/**
 * @fileoverview Configuration Object
 */
import assert from 'assert';
import * as https from 'https';
import * as url from 'url';
import { Readable } from 'stream';
// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
import merge from 'merge-options';
import ProxyAgent from 'proxy-agent';
import pkg from '../../package.json';
const sdkVersion = pkg.version;
// ------------------------------------------------------------------------------
// Private
// ------------------------------------------------------------------------------
const nodeVersion = process.version;
var defaults = {
    clientID: null,
    clientSecret: null,
    apiRootURL: 'https://api.box.com',
    uploadAPIRootURL: 'https://upload.box.com/api',
    authorizeRootURL: 'https://account.box.com/api',
    apiVersion: '2.0',
    uploadRequestTimeoutMS: 60000,
    retryIntervalMS: 2000,
    numMaxRetries: 5,
    retryStrategy: null,
    expiredBufferMS: 180000,
    staleBufferMS: 0,
    appAuth: undefined,
    iterators: false,
    enterpriseID: undefined,
    analyticsClient: null,
    proxy: {
        url: null,
        username: null,
        password: null,
    },
    request: {
        // By default, require API SSL cert to be valid
        strictSSL: true,
        // Use an agent with keep-alive enabled to avoid performing SSL handshake per connection
        agentClass: https.Agent,
        agentOptions: {
            keepAlive: true,
        },
        // Encode requests as JSON. Encode the response as well if JSON is returned.
        json: true,
        // Do not encode the response as a string, since the response could be a file. return Buffers instead.
        encoding: null,
        // A redirect is usually information we want to handle, so don't automatically follow
        followRedirect: false,
        // By default, we attach a version-specific user-agent string to SDK requests
        headers: {
            'User-Agent': `Box Node.js SDK v${sdkVersion} (Node ${nodeVersion})`,
        },
    },
};
var appAuthDefaults = {
    algorithm: 'RS256',
    expirationTime: 30,
    verifyTimestamp: false,
};
/**
 * Validate the basic Config values needed for the SDK to function
 * @param {UserConfigurationOptions} params The user-supplied config values
 * @returns {void}
 * @throws {AssertionError}
 * @private
 */
function validateBasicParams(params) {
    // Assert that the given params valid, and that required values are present
    assert(typeof params.clientID === 'string', '"clientID" must be set via init() before using the SDK.');
    assert(typeof params.clientSecret === 'string', '"clientSecret" must be set via init() before using the SDK.');
}
/**
 * Validate app auth-specific Config values
 * @param {Object} appAuth The user-supplied app auth values
 * @returns {void}
 * @throws {AssertionError}
 * @private
 */
function validateAppAuthParams(appAuth) {
    assert(typeof appAuth.keyID === 'string', 'Key ID must be provided in app auth params');
    assert(typeof appAuth.privateKey === 'string' ||
        appAuth.privateKey instanceof Buffer, 'Private key must be provided in app auth params');
    assert(typeof appAuth.passphrase === 'string' && appAuth.passphrase.length > 0, 'Passphrase must be provided in app auth params');
    var validAlgorithms = ['RS256', 'RS384', 'RS512'];
    if (typeof appAuth.algorithm !== 'undefined') {
        assert(validAlgorithms.indexOf(appAuth.algorithm) > -1, `Algorithm in app auth params must be one of: ${validAlgorithms.join(', ')}`);
    }
    if (typeof appAuth.expirationTime !== 'undefined') {
        assert(Number.isInteger(appAuth.expirationTime) &&
            appAuth.expirationTime > 0 &&
            appAuth.expirationTime <= 60, 'Valid token expiration time (0 - 60) must be provided in app auth params');
    }
}
/**
 * Update the agentClass based on the proxy config values passed in by the user
 * @param {UserConfigurationOptions} params The current Config values
 * @returns {void}
 * @private
 */
function updateRequestAgent(params) {
    if (params.proxy.url) {
        params.request.agentClass = ProxyAgent;
        params.request.agentOptions = Object.assign({}, params.request.agentOptions, url.parse(params.proxy.url));
        if (params.proxy.username && params.proxy.password) {
            Object.assign(params.request.agentOptions, {
                auth: `${params.proxy.username}:${params.proxy.password}`,
            });
        }
    }
}
/**
 * Deep freeze an object and all nested objects within it. It doesn't go deep on
 * Buffers and Readable streams so can be used on objects containing requests.
 * @param {Object} obj The object to freeze
 * @returns {Object} The frozen object
 */
function deepFreezeWithRequest(obj) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach(function (name) {
        const prop = obj[name];
        if (prop !== null &&
            typeof prop === 'object' &&
            obj.hasOwnProperty(name) &&
            !Object.isFrozen(prop) &&
            !(prop instanceof Buffer) &&
            !(prop instanceof Readable)) {
            deepFreezeWithRequest(obj[name]);
        }
    });
    return obj;
}
// ------------------------------------------------------------------------------
// Public
// ------------------------------------------------------------------------------
/**
 * A Config Object holds the configuration options of the current setup. These are all
 * customizable by the user, and will default if no value is specified in the given params
 * object. The object is frozen on initialization, so that no values can be changed after
 * setup.
 *
 * @param {UserConfigurationOptions} params - The config options set by the user
 * @constructor
 */
class Config {
    constructor(params) {
        validateBasicParams(params);
        if (typeof params.appAuth === 'object') {
            validateAppAuthParams(params.appAuth);
            params.appAuth = merge({}, appAuthDefaults, params.appAuth);
        }
        // Ensure that we don't accidentally assign over Config methods
        assert(!params.hasOwnProperty('extend'), 'Config params may not override Config methods');
        assert(!params.hasOwnProperty('_params'), 'Config params may not override Config methods');
        // Set the given params or default value if params property is missing
        this._params = merge(defaults, params);
        updateRequestAgent(this._params);
        Object.assign(this, this._params);
        // Freeze the object so that configuration options cannot be modified
        deepFreezeWithRequest(this);
    }
    /**
     * Extend the current config into a new config with new params overriding old ones
     * @param {UserConfigurationOptions} params The override options
     * @returns {Config} The extended configuration
     */
    extend(params) {
        var newParams = merge({}, this._params, params);
        delete newParams.extend;
        delete newParams._params;
        return new Config(newParams);
    }
}
/**
 * @module box-node-sdk/lib/util/config
 * @see {@Link Config}
 */
export default Config;
//# sourceMappingURL=config.js.map