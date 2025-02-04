/**
 * @fileoverview Manager for the Box Events Resource
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
import { Promise } from 'bluebird';
import httpStatusCodes from 'http-status';
import EnterpriseEventStream from '../enterprise-event-stream.ts';
import EventStream from '../event-stream.ts';
import errors from '../util/errors.ts';
import urlPath from '../util/url-path.ts';
// -----------------------------------------------------------------------------
// Typedefs
// -----------------------------------------------------------------------------
/**
 * Enum of enterprise event types
 *
 * @readonly
 * @enum {EventType}
 */
var EventType;
(function (EventType) {
    EventType["ADD_DEVICE_ASSOCIATION"] = "ADD_DEVICE_ASSOCIATION";
    EventType["ADD_LOGIN_ACTIVITY_DEVICE"] = "ADD_LOGIN_ACTIVITY_DEVICE";
    EventType["ADMIN_INVITE_ACCEPT"] = "MASTER_INVITE_ACCEPT";
    EventType["ADMIN_INVITE_REJECT"] = "MASTER_INVITE_REJECT";
    EventType["ADMIN_LOGIN"] = "ADMIN_LOGIN";
    EventType["APPLICATION_PUBLIC_KEY_ADDED"] = "APPLICATION_PUBLIC_KEY_ADDED";
    EventType["APPLICATION_PUBLIC_KEY_DELETED"] = "APPLICATION_PUBLIC_KEY_DELETED";
    EventType["CHANGE_ADMIN_ROLE"] = "CHANGE_ADMIN_ROLE";
    EventType["COLLABORATION_ACCEPT"] = "COLLABORATION_ACCEPT";
    EventType["COLLABORATION_EXPIRATION"] = "COLLABORATION_EXPIRATION";
    EventType["COLLABORATION_INVITE"] = "COLLABORATION_INVITE";
    EventType["COLLABORATION_REMOVE"] = "COLLABORATION_REMOVE";
    EventType["COLLABORATION_ROLE_CHANGE"] = "COLLABORATION_ROLE_CHANGE";
    EventType["COMMENT_CREATE"] = "COMMENT_CREATE";
    EventType["COMMENT_DELETE"] = "COMMENT_DELETE";
    EventType["COMMENT_EDIT"] = "COMMENT_EDIT";
    EventType["CONTENT_ACCESS"] = "CONTENT_ACCESS";
    EventType["CONTENT_WORKFLOW_AUTOMATION_ADD"] = "CONTENT_WORKFLOW_AUTOMATION_ADD";
    EventType["CONTENT_WORKFLOW_UPLOAD_POLICY_VIOLATION"] = "CONTENT_WORKFLOW_UPLOAD_POLICY_VIOLATION";
    EventType["COPY"] = "COPY";
    EventType["DELETE"] = "DELETE";
    EventType["DELETE_USER"] = "DELETE_USER";
    EventType["DOWNLOAD"] = "DOWNLOAD";
    EventType["EDIT"] = "EDIT";
    EventType["EDIT_USER"] = "EDIT_USER";
    EventType["EMAIL_ALIAS_CONFIRM"] = "EMAIL_ALIAS_CONFIRM";
    EventType["ENABLE_TWO_FACTOR_AUTH"] = "ENABLE_TWO_FACTOR_AUTH";
    EventType["ENTERPRISE_APP_AUTHORIZATION_DELETE"] = "ENTERPRISE_APP_AUTHORIZATION_DELETE";
    EventType["FAILED_LOGIN"] = "FAILED_LOGIN";
    EventType["FILE_MARKED_MALICIOUS"] = "FILE_MARKED_MALICIOUS";
    EventType["FILE_WATERMARKED_DOWNLOAD"] = "FILE_WATERMARKED_DOWNLOAD";
    EventType["GROUP_ADD_FILE"] = "GROUP_ADD_FILE";
    EventType["GROUP_ADD_FOLDER"] = "GROUP_ADD_FOLDER";
    EventType["GROUP_ADD_ITEM"] = "GROUP_ADD_ITEM";
    EventType["GROUP_ADD_USER"] = "GROUP_ADD_USER";
    EventType["GROUP_CREATION"] = "GROUP_CREATION";
    EventType["GROUP_DELETION"] = "GROUP_DELETION";
    EventType["GROUP_EDITED"] = "GROUP_EDITED";
    EventType["GROUP_REMOVE_FILE"] = "GROUP_REMOVE_FILE";
    EventType["GROUP_REMOVE_FOLDER"] = "GROUP_REMOVE_FOLDER";
    EventType["GROUP_REMOVE_USER"] = "GROUP_REMOVE_USER";
    EventType["ITEM_MODIFY"] = "ITEM_MODIFY";
    EventType["ITEM_OPEN"] = "ITEM_OPEN";
    EventType["ITEM_SHARED_UPDATE"] = "ITEM_SHARED_UPDATE";
    EventType["ITEM_SYNC"] = "ITEM_SYNC";
    EventType["ITEM_UNSYNC"] = "ITEM_UNSYNC";
    EventType["LOCK"] = "LOCK";
    EventType["LOGIN"] = "LOGIN";
    EventType["METADATA_INSTANCE_CREATE"] = "METADATA_INSTANCE_CREATE";
    EventType["METADATA_INSTANCE_DELETE"] = "METADATA_INSTANCE_DELETE";
    EventType["METADATA_INSTANCE_UPDATE"] = "METADATA_INSTANCE_UPDATE";
    EventType["METADATA_TEMPLATE_CREATE"] = "METADATA_TEMPLATE_CREATE";
    EventType["METADATA_TEMPLATE_UPDATE"] = "METADATA_TEMPLATE_UPDATE";
    EventType["MOVE"] = "MOVE";
    EventType["NEW_USER"] = "NEW_USER";
    EventType["PREVIEW"] = "PREVIEW";
    EventType["REMOVE_DEVICE_ASSOCIATION"] = "REMOVE_DEVICE_ASSOCIATION";
    EventType["REMOVE_LOGIN_ACTIVITY_DEVICE"] = "REMOVE_LOGIN_ACTIVITY_DEVICE";
    EventType["RENAME"] = "RENAME";
    EventType["SHARE"] = "SHARE";
    EventType["SHARE_EXPIRATION"] = "SHARE_EXPIRATION";
    EventType["STORAGE_EXPIRATION"] = "STORAGE_EXPIRATION";
    EventType["TASK_ASSIGNMENT_CREATE"] = "TASK_ASSIGNMENT_CREATE";
    EventType["TASK_ASSIGNMENT_UPDATE"] = "TASK_ASSIGNMENT_UPDATE";
    EventType["TASK_CREATE"] = "TASK_CREATE";
    EventType["TERMS_OF_SERVICE_AGREE"] = "TERMS_OF_SERVICE_AGREE";
    EventType["TERMS_OF_SERVICE_REJECT"] = "TERMS_OF_SERVICE_REJECT";
    EventType["UNDELETE"] = "UNDELETE";
    EventType["UNLOCK"] = "UNLOCK";
    EventType["UNSHARE"] = "UNSHARE";
    EventType["UPDATE_COLLABORATION_EXPIRATION"] = "UPDATE_COLLABORATION_EXPIRATION";
    EventType["UPDATE_SHARE_EXPIRATION"] = "UPDATE_SHARE_EXPIRATION";
    EventType["UPLOAD"] = "UPLOAD";
    EventType["WATERMARK_LABEL_CREATE"] = "WATERMARK_LABEL_CREATE";
    EventType["WATERMARK_LABEL_DELETE"] = "WATERMARK_LABEL_DELETE";
})(EventType || (EventType = {}));
// ------------------------------------------------------------------------------
// Private
// ------------------------------------------------------------------------------
// Base path for all files endpoints
const BASE_PATH = '/events';
/** @const {string} */
const CURRENT_STREAM_POSITION = 'now';
// ------------------------------------------------------------------------------
// Public
// ------------------------------------------------------------------------------
/**
 * Simple manager for interacting with all 'Events' endpoints and actions.
 *
 * @param {BoxClient} client The Box API Client that is responsible for making calls to the API
 * @constructor
 */
class Events {
    constructor(client) {
        // Attach the client, for making API calls
        this.client = client;
    }
    /**
     * Get the current stream position.
     *
     * API Endpoint: '/events'
     * Method: GET
     *
     * @param {Function} [callback] Passed the current stream position if successful
     * @returns {Promise<string>} A promise resolving to the stream position
     */
    getCurrentStreamPosition(callback) {
        var params = {
            qs: {
                stream_position: CURRENT_STREAM_POSITION,
            },
        };
        var apiPath = urlPath(BASE_PATH);
        return this.client
            .get(apiPath, params)
            .then((response /* FIXME */) => {
            if (response.statusCode !== httpStatusCodes.OK) {
                throw errors.buildUnexpectedResponseError(response);
            }
            return response.body.next_stream_position;
        })
            .asCallback(callback);
    }
    /**
     * Get a chunk of events
     *
     * API Endpoint: '/events'
     * Method: GET
     *
     * To get events from admin events stream you have to pick stream_type from `admin_logs` or `admin_logs_streaming`.
     * The `admin_logs` stream emphasis is on completeness over latency,
     * which means that Box will deliver admin events in chronological order and without duplicates,
     * but with higher latency. You can specify start and end time/dates.
     *
     * To monitor recent events that have been generated within Box across the enterprise use
     * `admin_logs_streaming` as stream type. The emphasis for this feed is on low latency rather than chronological
     * accuracy, which means that Box may return events more than once and out of chronological order.
     * Events are returned via the API around 12 seconds after they are processed by Box
     * (the 12 seconds buffer ensures that new events are not written after your cursor position).
     * Only two weeks of events are available via this feed, and you cannot set start and end time/dates.
     *
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {string} [options.stream_type] - From which stream events should be selected.
     * 	Possible values are `admin_logs` and `admin_logs_streaming`
     * @param {string} [options.created_after] - The date to start from in ISO-8601 timestamp format: '2001-01-01T00:00:00-08:00'
     * @param {string} [options.created_before] - The date to end at in ISO-8601 timestamp format: '2001-01-01T00:00:00-08:00'
     * @param {string} [options.event_type] - String of event types to return coma separated: for example 'DOWNLOAD,UPLOAD'
     * @param {number} [options.limit] - Number of events to fetch per call
     * @param {string} [options.stream_position] - The stream position to start from (pass '0' for all past events)
     * @param {Function} [callback] Passed the current stream position if successful
     * @returns {Promise<Object>} A promise resolving to the collection of events
     */
    get(options, callback) {
        const params = {
            qs: options,
        };
        if (options && options.stream_type && options.stream_type === 'admin_logs_streaming') {
            const { created_after, created_before } = options, filteredOptions = __rest(options, ["created_after", "created_before"]);
            params.qs = filteredOptions;
        }
        const apiPath = urlPath(BASE_PATH);
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, params, callback);
    }
    /**
     * Get information for long-polling until new events are available
     *
     * API Endpoint: '/events'
     * Method: OPTIONS
     *
     * @param {Function} [callback] Passed the long poll info if successful
     * @returns {Promise<Object>} A promise resolving to the long poll info
     */
    getLongPollInfo(callback) {
        const apiPath = urlPath(BASE_PATH);
        return this.client
            .options(apiPath, {})
            .then((response /* FIXME */) => {
            if (response.statusCode !== httpStatusCodes.OK) {
                throw errors.buildUnexpectedResponseError(response);
            }
            let longpollInfo = response.body.entries.find((entry /* FIXME */) => entry.type === 'realtime_server');
            if (!longpollInfo) {
                throw errors.buildResponseError('No valid long poll server specified', response);
            }
            return longpollInfo;
        })
            .asCallback(callback);
    }
    /**
     * Create a stream of events, using the long-poll API to wait for new events.
     *
     * API Endpoint: '/events'
     * Method: OPTIONS
     *
     * @param {string} [streamPosition] Starting stream position
     * @param {Object} [options] Optional parameters for the event stream
     * @param {int} [options.retryDelay=1000] Number of ms to wait before retrying after an error
     * @param {int} [options.deduplicationFilterSize=5000] Number of IDs to track for deduplication
     * @param {int} [options.fetchInterval=1000] Minimunm number of ms between calls for more events
     * @param {Function} [callback] Passed the events stream if successful
     * @returns {Promise<EventStream>} A promise resolving to the event stream
     */
    getEventStream(streamPosition, options, callback) {
        const self = this;
        if (typeof streamPosition === 'string') {
            if (typeof options === 'function') {
                callback = options;
                options = {};
            }
            return Promise.resolve(new EventStream(self.client, streamPosition, options)).asCallback(callback);
        }
        // Fix up optional arguments
        callback = options /* FIXME */;
        options = streamPosition;
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        return this.getCurrentStreamPosition()
            .then((currentStreamPosition /* FIXME */) => new EventStream(self.client, currentStreamPosition, options))
            .asCallback(callback);
    }
    /**
     * Create a stream of enterprise events.
     *
     * By default, the stream starts from the current time.
     * Pass 'startDate' to start from a specific time.
     * Pass 'streamPosition' to start from a previous stream position, or '0' for all available past events (~1 year).
     * Once the stream catches up to the current time, it will begin polling every 'pollingInterval' seconds.
     * If 'pollingInterval' = 0, then the stream will end when it catches up to the current time (no polling).
     *
     * By default, stream pools `admin_logs` for events. The emphasis for this stream is on completeness over latency,
     * which means that Box will deliver admin events in chronological order and without duplicates,
     * but with higher latency. You can specify start and end time/dates.
     *
     * To monitor recent events that have been generated within Box across the enterprise use
     * `admin_logs_streaming` as stream type. The emphasis for this feed is on low latency rather than chronological
     * accuracy, which means that Box may return events more than once and out of chronological order.
     * Events are returned via the API around 12 seconds after they are processed by Box
     * (the 12 seconds buffer ensures that new events are not written after your cursor position).
     * Only two weeks of events are available via this feed, and you cannot set start and end time/dates.
     *
     * This method will only work with an API connection for an enterprise admin account
     * or service account with a manage enterprise properties.
     *
     * @param {Object} [options] - Options
     * @param {string} [options.streamPosition] - The stream position to start from (pass '0' for all past events)
     * @param {string} [options.startDate] - The date to start from
     * @param {string} [options.endDate] - The date to end at
     * @param {EventType[]} [options.eventTypeFilter] - Array of event types to return
     * @param {int} [options.pollingInterval=60] - Polling interval (in seconds).  Pass 0 for no polling.
     * @param {int} [options.chunkSize=500] - Number of events to fetch per call (max = 500)
     * @param {string} [options.streamType] - From which stream events should be selected.
     * 	Possible values are `admin_logs` and `admin_logs_streaming`
     * @param {Function} [callback] Passed the events stream if successful
     * @returns {Promise<EnterpriseEventStream>} A promise resolving to the enterprise event stream
     */
    getEnterpriseEventStream(options, callback) {
        const self = this;
        return Promise.resolve(new EnterpriseEventStream(self.client, options)).asCallback(callback);
    }
}
Events.prototype.CURRENT_STREAM_POSITION = CURRENT_STREAM_POSITION;
Events.prototype.enterpriseEventTypes = EventType;
export default Events;
//# sourceMappingURL=events.js.map