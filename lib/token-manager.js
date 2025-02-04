/**
 * @fileoverview Token Manager
 */
// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
import Promise from 'bluebird';
import httpStatusCodes from 'http-status';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import errors from './util/errors';
import getRetryTimeout from './util/exponential-backoff';
/**
 *	Determines whether a JWT auth error can be retried
 * @param {Error} err The JWT auth error
 * @returns {boolean} True if the error is retryable
 */
function isJWTAuthErrorRetryable(err /* FIXME */) {
    if (err.authExpired &&
        err.response.headers.date &&
        (err.response.body.error_description.indexOf('exp') > -1 ||
            err.response.body.error_description.indexOf('jti') > -1)) {
        return true;
    }
    else if (err.statusCode === 429 || err.statusCode >= 500) {
        return true;
    }
    return false;
}
// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------
/**
 * Collection of grant types that can be used to acquire tokens via OAuth2
 *
 * @readonly
 * @enum {string}
 */
var grantTypes = {
    AUTHORIZATION_CODE: 'authorization_code',
    REFRESH_TOKEN: 'refresh_token',
    CLIENT_CREDENTIALS: 'client_credentials',
    JWT: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    TOKEN_EXCHANGE: 'urn:ietf:params:oauth:grant-type:token-exchange',
};
/**
 * Collection of paths to interact with Box OAuth2 tokening system
 *
 * @readonly
 * @enum {string}
 */
var tokenPaths;
(function (tokenPaths) {
    tokenPaths["ROOT"] = "/oauth2";
    tokenPaths["GET"] = "/token";
    tokenPaths["REVOKE"] = "/revoke";
})(tokenPaths || (tokenPaths = {}));
// Timer used to track elapsed time starting with executing an async request and ending with emitting the response.
var asyncRequestTimer /* FIXME */;
// The XFF header label - Used to give the API better information for uploads, rate-limiting, etc.
const HEADER_XFF = 'X-Forwarded-For';
const ACCESS_TOKEN_TYPE = 'urn:ietf:params:oauth:token-type:access_token';
const ACTOR_TOKEN_TYPE = 'urn:ietf:params:oauth:token-type:id_token';
const BOX_JWT_AUDIENCE = 'https://api.box.com/oauth2/token';
// ------------------------------------------------------------------------------
// Private
// ------------------------------------------------------------------------------
/**
 * Parse the response body to create a new TokenInfo object.
 *
 * @param {Object} grantResponseBody - (Request lib) response body containing granted token info from API
 * @returns {TokenInfo} A TokenInfo object.
 * @private
 */
function getTokensFromGrantResponse(grantResponseBody /* FIXME */) {
    return {
        // Set the access token & refresh token (if passed)
        accessToken: grantResponseBody.access_token,
        refreshToken: grantResponseBody.refresh_token,
        // Box API sends back expires_in in seconds, we convert to ms for consistency of keeping all time in ms
        accessTokenTTLMS: parseInt(grantResponseBody.expires_in, 10) * 1000,
        acquiredAtMS: Date.now(),
    };
}
/**
 * Determines if a given string could represent an authorization code or token.
 *
 * @param {string} codeOrToken The code or token to check.
 * @returns {boolean} True if codeOrToken is valid, false if not.
 * @private
 */
function isValidCodeOrToken(codeOrToken) {
    return typeof codeOrToken === 'string' && codeOrToken.length > 0;
}
/**
 * Determines if a token grant response is valid
 *
 * @param {string} grantType the type of token grant
 * @param {Object} responseBody the body of the response to check
 * @returns {boolean} True if response body has expected fields, false if not.
 * @private
 */
function isValidTokenResponse(grantType, responseBody /* FIXME */) {
    if (!isValidCodeOrToken(responseBody.access_token)) {
        return false;
    }
    if (typeof responseBody.expires_in !== 'number') {
        return false;
    }
    // Check the refresh_token for certain types of grants
    if (grantType === 'authorization_code' || grantType === 'refresh_token') {
        if (!isValidCodeOrToken(responseBody.refresh_token)) {
            return false;
        }
    }
    return true;
}
// ------------------------------------------------------------------------------
// Public
// ------------------------------------------------------------------------------
/**
 * Manager for API access abd refresh tokens
 *
 * @param {Config} config The config object
 * @param {APIRequestManager} requestManager The API Request Manager
 * @constructor
 */
class TokenManager {
    constructor(config, requestManager) {
        this.config = config;
        this.oauthBaseURL = config.apiRootURL + tokenPaths.ROOT;
        this.requestManager = requestManager;
    }
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
    isAccessTokenValid(tokenInfo, bufferMS) {
        if (typeof tokenInfo.acquiredAtMS === 'undefined' ||
            typeof tokenInfo.accessTokenTTLMS === 'undefined') {
            return false;
        }
        bufferMS = bufferMS || 0;
        var expireTime = tokenInfo.acquiredAtMS + tokenInfo.accessTokenTTLMS - bufferMS;
        return expireTime > Date.now();
    }
    /**
     * Acquires OAuth2 tokens using a grant type (authorization_code, password, refresh_token)
     *
     * @param {Object} formParams - should contain all params expected by Box OAuth2 token endpoint
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant, null for default behavior
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     * @private
     */
    getTokens(formParams, options) {
        var params = {
            method: 'POST',
            url: this.oauthBaseURL + tokenPaths.GET,
            headers: {},
            form: formParams,
        };
        options = options || {};
        // add in app-specific id and secret to auth with Box
        params.form.client_id = this.config.clientID;
        params.form.client_secret = this.config.clientSecret;
        if (options.ip) {
            params.headers[HEADER_XFF] = options.ip;
        }
        return this.requestManager.makeRequest(params).then((response /* FIXME */) => {
            // Response Error: The API is telling us that we attempted an invalid token grant. This
            // means that our refresh token or auth code has exipred, so propagate an "Expired Tokens"
            // error.
            if (response.body &&
                response.body.error &&
                response.body.error === 'invalid_grant') {
                var errDescription = response.body.error_description;
                var message = errDescription
                    ? `Auth Error: ${errDescription}`
                    : undefined;
                throw errors.buildAuthError(response, message);
            }
            // Unexpected Response: If the token request couldn't get a valid response, then we're
            // out of options. Build an "Unexpected Response" error and propagate it out for the
            // consumer to handle.
            if (response.statusCode !== httpStatusCodes.OK ||
                response.body instanceof Buffer) {
                throw errors.buildUnexpectedResponseError(response);
            }
            // Check to see if token response is valid in case the API returns us a 200 with a malformed token
            if (!isValidTokenResponse(formParams.grant_type, response.body)) {
                throw errors.buildResponseError(response, 'Token format from response invalid');
            }
            // Got valid token response. Parse out the TokenInfo and propagate it back.
            return getTokensFromGrantResponse(response.body);
        });
    }
    /**
     * Acquires token info using an authorization code
     *
     * @param {string} authorizationCode - authorization code issued by Box
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getTokensAuthorizationCodeGrant(authorizationCode, options) {
        if (!isValidCodeOrToken(authorizationCode)) {
            return Promise.reject(new Error('Invalid authorization code.'));
        }
        var params = {
            grant_type: grantTypes.AUTHORIZATION_CODE,
            code: authorizationCode,
        };
        return this.getTokens(params, options);
    }
    /**
     * Acquires token info using the client credentials grant.
     *
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getTokensClientCredentialsGrant(options) {
        var params = {
            grant_type: grantTypes.CLIENT_CREDENTIALS,
            box_subject_type: this.config.boxSubjectType,
            box_subject_id: this.config.boxSubjectId
        };
        return this.getTokens(params, options);
    }
    /**
     * Refreshes the access and refresh tokens for a given refresh token.
     *
     * @param {string} refreshToken - A valid OAuth refresh token
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getTokensRefreshGrant(refreshToken, options) {
        if (!isValidCodeOrToken(refreshToken)) {
            return Promise.reject(new Error('Invalid refresh token.'));
        }
        var params = {
            grant_type: grantTypes.REFRESH_TOKEN,
            refresh_token: refreshToken,
        };
        return this.getTokens(params, options);
    }
    /**
     * Gets tokens for enterprise administration of app users
     * @param {string} type The type of token to create, "user" or "enterprise"
     * @param {string} id The ID of the enterprise to generate a token for
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise<TokenInfo>} Promise resolving to the token info
     */
    getTokensJWTGrant(type, id, options) {
        if (!this.config.appAuth.keyID) {
            return Promise.reject(new Error('Must provide app auth configuration to use JWT Grant'));
        }
        var claims = {
            exp: Math.floor(Date.now() / 1000) + this.config.appAuth.expirationTime,
            box_sub_type: type,
        };
        var jwtOptions = {
            algorithm: this.config.appAuth.algorithm,
            audience: BOX_JWT_AUDIENCE,
            subject: id,
            issuer: this.config.clientID,
            jwtid: uuid.v4(),
            noTimestamp: !this.config.appAuth.verifyTimestamp,
            keyid: this.config.appAuth.keyID,
        };
        var keyParams = {
            key: this.config.appAuth.privateKey,
            passphrase: this.config.appAuth.passphrase,
        };
        var assertion;
        try {
            assertion = jwt.sign(claims, keyParams, jwtOptions);
        }
        catch (jwtErr) {
            return Promise.reject(jwtErr);
        }
        var params = {
            grant_type: grantTypes.JWT,
            assertion,
        };
        // Start the request timer immediately before executing the async request
        asyncRequestTimer = process.hrtime();
        return this.getTokens(params, options).catch((err) => this.retryJWTGrant(claims, jwtOptions, keyParams, params, options, err, 0));
    }
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
    // eslint-disable-next-line max-params
    retryJWTGrant(claims /* FIXME */, jwtOptions /* FIXME */, keyParams /* FIXME */, params /* FIXME */, options, error /* FIXME */, numRetries) {
        if (numRetries < this.config.numMaxRetries &&
            isJWTAuthErrorRetryable(error)) {
            var retryTimeoutinSeconds;
            numRetries += 1;
            // If the retry strategy is defined, then use it to determine the time (in ms) until the next retry or to
            // propagate an error to the user.
            if (this.config.retryStrategy) {
                // Get the total elapsed time so far since the request was executed
                var totalElapsedTime = process.hrtime(asyncRequestTimer);
                var totalElapsedTimeMS = totalElapsedTime[0] * 1000 + totalElapsedTime[1] / 1000000;
                var retryOptions = {
                    error,
                    numRetryAttempts: numRetries,
                    numMaxRetries: this.config.numMaxRetries,
                    retryIntervalMS: this.config.retryIntervalMS,
                    totalElapsedTimeMS,
                };
                retryTimeoutinSeconds = this.config.retryStrategy(retryOptions);
                // If the retry strategy doesn't return a number/time in ms, then propagate the response error to the user.
                // However, if the retry strategy returns its own error, this will be propagated to the user instead.
                if (typeof retryTimeoutinSeconds !== 'number') {
                    if (retryTimeoutinSeconds instanceof Error) {
                        error = retryTimeoutinSeconds;
                    }
                    throw error;
                }
            }
            else if (error.hasOwnProperty('response') &&
                error.response.hasOwnProperty('headers') &&
                error.response.headers.hasOwnProperty('retry-after')) {
                retryTimeoutinSeconds = error.response.headers['retry-after'];
            }
            else {
                retryTimeoutinSeconds = Math.ceil(getRetryTimeout(numRetries, this.config.retryIntervalMS) / 1000);
            }
            var time = Math.floor(Date.now() / 1000);
            if (error.response.headers.date) {
                time = Math.floor(Date.parse(error.response.headers.date) / 1000);
            }
            // Add length of retry timeout to current expiration time to calculate the expiration time for the JTI claim.
            claims.exp = Math.ceil(time + this.config.appAuth.expirationTime + retryTimeoutinSeconds);
            jwtOptions.jwtid = uuid.v4();
            try {
                params.assertion = jwt.sign(claims, keyParams, jwtOptions);
            }
            catch (jwtErr) {
                throw jwtErr;
            }
            return Promise.delay(retryTimeoutinSeconds).then(() => {
                // Start the request timer immediately before executing the async request
                asyncRequestTimer = process.hrtime();
                return this.getTokens(params, options).catch((err) => this.retryJWTGrant(claims, jwtOptions, keyParams, params, options, err, numRetries));
            });
        }
        else if (numRetries >= this.config.numMaxRetries) {
            error.maxRetriesExceeded = true;
        }
        throw error;
    }
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
    exchangeToken(accessToken, scopes, resource, options) {
        var params = {
            grant_type: grantTypes.TOKEN_EXCHANGE,
            subject_token_type: ACCESS_TOKEN_TYPE,
            subject_token: accessToken,
            scope: typeof scopes === 'string' ? scopes : scopes.join(' '),
        };
        if (resource) {
            params.resource = resource;
        }
        if (options && options.sharedLink) {
            params.box_shared_link = options.sharedLink.url;
        }
        if (options && options.actor) {
            var payload = {
                iss: this.config.clientID,
                sub: options.actor.id,
                aud: BOX_JWT_AUDIENCE,
                box_sub_type: 'external',
                name: options.actor.name,
            };
            var jwtOptions = {
                algorithm: 'none',
                expiresIn: '1m',
                noTimestamp: true,
                jwtid: uuid.v4(),
            };
            var token;
            try {
                token = jwt.sign(payload, 'UNUSED', jwtOptions /* FIXME */);
            }
            catch (jwtError) {
                return Promise.reject(jwtError);
            }
            params.actor_token = token;
            params.actor_token_type = ACTOR_TOKEN_TYPE;
        }
        return this.getTokens(params, options && options.tokenRequestOptions
            ? options.tokenRequestOptions
            : null);
    }
    /**
     * Revokes a token pair associated with a given access or refresh token.
     *
     * @param {string} token - A valid access or refresh token to revoke
     * @param {TokenRequestOptions} [options] - Sets optional behavior for the token grant
     * @returns {Promise} Promise resolving if the revoke succeeds
     */
    revokeTokens(token, options) {
        var params = {
            method: 'POST',
            url: this.oauthBaseURL + tokenPaths.REVOKE,
            form: {
                token,
                client_id: this.config.clientID,
                client_secret: this.config.clientSecret,
            },
        };
        if (options && options.ip) {
            params.headers = {};
            params.headers[HEADER_XFF] = options.ip;
        }
        return this.requestManager.makeRequest(params);
    }
}
/**
 * Provides interactions with Box OAuth2 tokening system.
 *
 * @module box-node-sdk/lib/token-manager
 */
export default TokenManager;
//# sourceMappingURL=token-manager.js.map