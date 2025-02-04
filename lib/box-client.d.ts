/**
 * @fileoverview Box API Client
 */
import Events from './managers/events';
import Files from './managers/files';
import Folders from './managers/folders';
import SignRequests from './managers/sign-requests.generated';
import FileRequestsManager from "./managers/file-requests-manager";
/**
 * A collaboration role constant
 * @typedef {string} CollaborationRole
 */
declare type CollaborationRole = string;
/**
 * A Box file or folder type constant
 * @typedef {string} ItemType
 */
declare type ItemType = 'file' | 'folder';
/**
 * An access level constant. Used for setting and updating shared links, folder upload, etc.
 * @typedef {?Object} AccessLevel
 */
declare type AccessLevel = object | null;
declare type APISession = any;
declare type APIRequestManager = any;
declare class BoxClient {
    _session: APISession;
    _requestManager: APIRequestManager;
    _customHeaders: any;
    _baseURL: any;
    _uploadBaseURL: any;
    _uploadRequestTimeoutMS: any;
    _useIterators: any;
    _analyticsClient: any;
    _tokenOptions: any;
    users: any;
    files: Files;
    fileRequests: FileRequestsManager;
    folders: Folders;
    comments: any;
    collaborations: any;
    groups: any;
    sharedItems: any;
    metadata: any;
    collections: any;
    events: Events;
    search: any;
    tasks: any;
    trash: any;
    enterprise: any;
    legalHoldPolicies: any;
    weblinks: any;
    retentionPolicies: any;
    devicePins: any;
    webhooks: any;
    recentItems: any;
    collaborationAllowlist: any;
    termsOfService: any;
    storagePolicies: any;
    signRequests: SignRequests;
    _batch: any;
    collaborationRoles: Record<string, CollaborationRole>;
    itemTypes: Record<string, ItemType>;
    accessLevels: Record<string, AccessLevel>;
    CURRENT_USER_ID: string;
    /** @deprecated */
    collaborationWhitelist: any;
    /**
     * The BoxClient can make API calls on behalf of a valid API Session. It is responsible
     * for formatting the requests and handling the response. Its goal is to deliver
     * sensible results to the user.
     *
     * @param {APISession} apiSession An initialized API Session, used to get/revoke tokens and handle
     * unauthorized responses from the API.
     * @param {Config} config The SDK configuration options
     * @param {APIRequestManager} requestManager The API Request Manager
     * @constructor
     */
    constructor(apiSession: APISession, config: any, requestManager: APIRequestManager);
    /**
     * Returns an object containing the given headers as well as other headers (like the authorization header and
     * custom headers) that should be included in a request.
     * @param {?Object} callerHeaders - headers that the caller wishes to include in the request. This method will not
     * override these headers with its own. Thus, if all the headers that this method was planning to add are already
     * specified here, this method will return an object with exactly the same headers.
     * @param {string} accessToken - the access token that will be used to make the request
     * @returns {Object} - a new object with the headers needed for the request
     * @private
     */
    _createHeadersForRequest(callerHeaders: object | null, accessToken: string): Record<string, string>;
    /**
     * Makes an API request to the Box API on behalf of the client. Before executing
     * the request, it first ensures the user has usable tokens. Will be called again
     * if the request returns a temporary error. Will propogate error if request returns
     * a permanent error, or if usable tokens are not available.
     *
     * @param {Object} params - Request lib params to configure the request
     * @param {Function} [callback] - passed response data
     * @returns {Promise} Promise resolving to the response
     * @private
     */
    _makeRequest(params: any, callback?: Function): any;
    /**
     * Set a custom header. A custom header is applied to every request for the life of the client. To
     * remove a header, set it's value to null.
     *
     * @param {string} header The name of the custom header to set.
     * @param {*} value The value of the custom header. Set to null to remove the given header.
     * @returns {void}
     */
    setCustomHeader(header: string, value: any): void;
    /**
     * Sets the list of requesting IP addresses for the X-Forwarded-For header. Used to give the API
     * better information for uploads, rate-limiting, etc.
     *
     * @param {string[]} ips - Array of IP Addresses
     * @returns {void}
     */
    setIPs(ips: string[]): void;
    /**
     * Sets the shared item context on the API Session. Overwrites any current context.
     *
     * @param {string} url The shared link url
     * @param {?string} password The shared link password, null if no password exists.
     * @returns {void}
     */
    setSharedContext(url: string, password: string | null): void;
    /**
     * Removes any current shared item context from API Session.
     *
     * @returns {void}
     */
    revokeSharedContext(): void;
    /**
     * Set up the As-User context, which is used by enterprise admins to
     * impersonate their managed users and perform actions on their behalf.
     *
     * @param {string} userID - The ID of the user to impersonate
     * @returns {void}
     */
    asUser(userID: string): void;
    /**
     * Revoke the As-User context and return to making calls on behalf of the user
     * who owns the client's access token.
     *
     * @returns {void}
     */
    asSelf(): void;
    /**
     * Revokes the client's access tokens. The client will no longer be tied to a user
     * and will be unable to make calls to the API, rendering it effectively useless.
     *
     * @param {Function} [callback] Called after revoking, with an error if one existed
     * @returns {Promise} A promise resolving when the client's access token is revoked
     */
    revokeTokens(callback: Function): any;
    /**
     * Exchange the client access token for one with lower scope
     * @param {string|string[]} scopes The scope(s) requested for the new token
     * @param {string} [resource] The absolute URL of an API resource to scope the new token to
     * @param {Object} [options] - Optional parameters
     * @param {ActorParams} [options.actor] - Optional actor parameters for creating annotator tokens with Token Auth client
     * @param {SharedLinkParams} [options.sharedLink] - Optional shared link parameters for creating tokens using shared links
     * @param {Function} [callback] Called with the new token
     * @returns {Promise<TokenInfo>} A promise resolving to the exchanged token info
     */
    exchangeToken(scopes: string | string[], resource?: string, options?: Function | object, callback?: Function): any;
    /**
     * Makes GET request to Box API V2 endpoint
     *
     * @param {string} path - path to a certain API endpoint (ex: /file)
     * @param {?Object} params - object containing parameters for the request, such as query strings and headers
     * @param {Function} [callback] - passed final API response or err if request failed
     * @returns {void}
     */
    get(path: string, params?: object | null, callback?: Function): any;
    /**
     * Makes POST request to Box API V2 endpoint
     *
     * @param {string} path - path to a certain API endpoint (ex: /file)
     * @param {?Object} params - object containing parameters for the request, such as query strings and headers
     * @param {Function} [callback] - passed final API response or err if request failed
     * @returns {void}
     */
    post(path: string, params: object | null, callback?: Function): any;
    /**
     * Makes PUT request to Box API V2 endpoint
     *
     * @param {string} path - path to a certain API endpoint (ex: /file)
     * @param {?Object} params - object containing parameters for the request, such as query strings and headers
     * @param {Function} callback - passed final API response or err if request failed
     * @returns {void}
     */
    put(path: string, params?: object | null, callback?: Function): any;
    /**
     * Makes DELETE request to Box API V2 endpoint
     *
     * @param {string} path - path to a certain API endpoint (ex: /file)
     * @param {?Object} params - object containing parameters for the request, such as query strings and headers
     * @param {Function} callback - passed final API response or err if request failed
     * @returns {void}
     */
    del(path: string, params: object | null, callback?: Function): any;
    /**
     * Makes an OPTIONS call to a Box API V2 endpoint
     *
     * @param {string} path - Path to an API endpoint (e.g. /files/content)
     * @param {?Object} params - An optional object containing request parameters
     * @param {Function} callback - Called with API call results, or err if call failed
     * @returns {void}
     */
    options(path: string, params: object | null, callback?: Function): any;
    /**
     * Makes a POST call to a Box API V2 upload endpoint
     * @param {string} path - path to an upload API endpoint
     * @param {?Object} params - an optional object containing request parameters
     * @param {?Object} formData - multipart form data to include in the upload request {@see https://github.com/mikeal/request#multipartform-data-multipart-form-uploads}
     * @param {Function} callback - called with API call results, or an error if the call failed
     * @returns {void}
     */
    upload(path: string, params: object | null, formData: object | null, callback: Function): any;
    /**
     * Puts the client into batch mode, which will queue calls instead of
     * immediately making the API request.
     *
     * DEPRECATED: Batch API is not supported and should not be used; make calls in parallel instead.
     *
     * @returns {BoxClient} Current client object
     */
    batch: (this: BoxClient) => BoxClient;
    /**
     * Executes a batch of requests.
     *
     * DEPRECATED: Batch API is not supported and should not be used; make calls in parallel instead.
     *
     * @returns {Promise<Object>} Promise resolving to the collection of batch responses
     */
    batchExec: (this: BoxClient, callback: Function) => any;
    /**
     * Build the 'BoxApi' Header used for authenticating access to a shared item
     *
     * @param {string} url The shared link url
     * @param {string} [password] The shared link password
     * @returns {string} A properly formatted 'BoxApi' header
     */
    buildSharedItemAuthHeader(url: string, password: string | null): string;
    /**
     * Return a callback that properly handles a successful response code by passing the response
     * body to the original callback. Any request error or unsuccessful response codes are propagated
     * back to the callback as errors. This is the standard behavior of most endpoints.
     *
     * @param {Function} callback The original callback given by the consumer
     * @returns {?Function} A new callback that processes the response before passing it to the callback.
     */
    defaultResponseHandler(callback: Function): ((err: any, response: any) => void) | null;
    /**
     * Wrap a client method with the default handler for both callback and promise styles
     * @param {Function} method The client method (e.g. client.get)
     * @returns {Function}  The wrapped method
     */
    wrapWithDefaultHandler(method: Function): Function;
    /**
     * Add a SDK plugin. Warning: This will modify the box-client interface and can override existing properties.
     * @param {string} name Plugin name. Will be accessible via client.<plugin-name>
     * @param {Function} plugin The SDK plugin to add
     * @param {Object} [options] Plugin-specific options
     * @returns {void}
     * @throws Will throw an error if plugin name matches an existing method on box-client
     */
    plug(name: string, plugin: Function, options: object): void;
}
/**
 * @module box-node-sdk/lib/box-client
 * @see {@Link BoxClient}
 */
export default BoxClient;
