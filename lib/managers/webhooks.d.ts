/**
 * @fileoverview Manager for the Box Webhooks resource
 */
import BoxClient from '../box-client';
/**
 * A webhook trigger type constant
 * @typedef {string} WebhookTriggerType
 */
declare enum WebhookTriggerType {
    FILE_UPLOADED = "FILE.UPLOADED",
    FILE_PREVIEWED = "FILE.PREVIEWED",
    FILE_DOWNLOADED = "FILE.DOWNLOADED",
    FILE_TRASHED = "FILE.TRASHED",
    FILE_DELETED = "FILE.DELETED",
    FILE_RESTORED = "FILE.RESTORED",
    FILE_COPIED = "FILE.COPIED",
    FILE_MOVED = "FILE.MOVED",
    FILE_LOCKED = "FILE.LOCKED",
    FILE_UNLOCKED = "FILE.UNLOCKED",
    FILE_RENAMED = "FILE.RENAMED",
    COMMENT_CREATED = "COMMENT.CREATED",
    COMMENT_UPDATED = "COMMENT.UPDATED",
    COMMENT_DELETED = "COMMENT.DELETED",
    TASK_ASSIGNMENT_CREATED = "TASK_ASSIGNMENT.CREATED",
    TASK_ASSIGNMENT_UPDATED = "TASK_ASSIGNMENT.UPDATED",
    METADATA_INSTANCE_CREATED = "METADATA_INSTANCE.CREATED",
    METADATA_INSTANCE_UPDATED = "METADATA_INSTANCE.UPDATED",
    METADATA_INSTANCE_DELETED = "METADATA_INSTANCE.DELETED",
    FOLDER_CREATED = "FOLDER.CREATED",
    FOLDER_DOWNLOADED = "FOLDER.DOWNLOADED",
    FOLDER_RESTORED = "FOLDER.RESTORED",
    FOLDER_DELETED = "FOLDER.DELETED",
    FOLDER_COPIED = "FOLDER.COPIED",
    FOLDER_MOVED = "FOLDER.MOVED",
    FOLDER_TRASHED = "FOLDER.TRASHED",
    FOLDER_RENAMED = "FOLDER.RENAMED",
    WEBHOOK_DELETED = "WEBHOOK.DELETED",
    COLLABORATION_CREATED = "COLLABORATION.CREATED",
    COLLABORATION_ACCEPTED = "COLLABORATION.ACCEPTED",
    COLLABORATION_REJECTED = "COLLABORATION.REJECTED",
    COLLABORATION_REMOVED = "COLLABORATION.REMOVED",
    COLLABORATION_UPDATED = "COLLABORATION.UPDATED",
    SHARED_LINK_DELETED = "SHARED_LINK.DELETED",
    SHARED_LINK_CREATED = "SHARED_LINK.CREATED",
    SHARED_LINK_UPDATED = "SHARED_LINK.UPDATED"
}
/**
 * Simple manager for interacting with all 'Webhooks' endpoints and actions.
 *
 * @param {BoxClient} client The Box API Client that is responsible for making calls to the API
 * @constructor
 */
declare class Webhooks {
    /**
     * Primary signature key to protect webhooks against attacks.
     * @static
     * @type {?string}
     */
    static primarySignatureKey: string | null;
    /**
     * Secondary signature key to protect webhooks against attacks.
     * @static
     * @type {?string}
     */
    static secondarySignatureKey: string | null;
    /**
     * Sets primary and secondary signatures that are used to verify the Webhooks messages
     *
     * @param {string} primaryKey - The primary signature to verify the message with
     * @param {string} [secondaryKey] - The secondary signature to verify the message with
     * @returns {void}
     */
    static setSignatureKeys(primaryKey: string, secondaryKey?: string): void;
    /**
     * Validate a webhook message by verifying the signature and the delivery timestamp
     *
     * @param {string|Object} body - The request body of the webhook message
     * @param {Object} headers - The request headers of the webhook message
     * @param {string} [primaryKey] - The primary signature to verify the message with. If it is sent as a parameter,
         it overrides the static variable primarySignatureKey
    * @param {string} [secondaryKey] - The secondary signature to verify the message with. If it is sent as a parameter,
        it overrides the static variable primarySignatureKey
    * @param {int} [maxMessageAge] - The maximum message age (in seconds).  Defaults to 10 minutes
    * @returns {boolean} - True or false
    */
    static validateMessage(body: string | object, headers: Record<string, string>, primaryKey?: string, secondaryKey?: string, maxMessageAge?: number): boolean;
    client: BoxClient;
    triggerTypes: Record<'FILE' | 'COMMENT' | 'TASK_ASSIGNMENT' | 'METADATA_INSTANCE' | 'FOLDER' | 'WEBHOOK' | 'COLLABORATION' | 'SHARED_LINK', Record<string, WebhookTriggerType>>;
    validateMessage: typeof Webhooks.validateMessage;
    constructor(client: BoxClient);
    /**
     * Create a new webhook on a given Box object, specified by type and ID.
     *
     * API Endpoint: '/webhooks'
     * Method: POST
     *
     * @param {string} targetID - Box ID  of the item to create webhook on
     * @param {ItemType} targetType - Type of item the webhook will be created on
     * @param {string} notificationURL - The URL of your application where Box will notify you of events triggers
     * @param {WebhookTriggerType[]} triggerTypes - Array of event types that trigger notification for the target
     * @param {Function} [callback] - Passed the new webhook information if it was acquired successfully
     * @returns {Promise<Object>} A promise resolving to the new webhook object
     */
    create(targetID: string, targetType: string, notificationURL: string, triggerTypes: WebhookTriggerType[], callback?: Function): any;
    /**
     * Returns a webhook object with the specified Webhook ID
     *
     * API Endpoint: '/webhooks/:webhookID'
     * Method: GET
     *
     * @param {string} webhookID - ID of the webhook to retrieve
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the webhook information if it was acquired successfully
     * @returns {Promise<Object>} A promise resolving to the webhook object
     */
    get(webhookID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Get a list of webhooks that are active for the current application and user.
     *
     * API Endpoint: '/webhooks'
     * Method: GET
     *
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {int} [options.limit=100] - The number of webhooks to return
     * @param {string} [options.marker] - Pagination marker
     * @param {Function} [callback] - Passed the list of webhooks if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the collection of webhooks
     */
    getAll(options?: {
        limit?: number;
        marker?: string;
    }, callback?: Function): any;
    /**
     * Update a webhook
     *
     * API Endpoint: '/webhooks/:webhookID'
     * Method: PUT
     *
     * @param {string} webhookID - The ID of the webhook to be updated
     * @param {Object} updates - Webhook fields to update
     * @param {string} [updates.address] - The new URL used by Box to send a notification when webhook is triggered
     * @param {WebhookTriggerType[]} [updates.triggers] - The new events that triggers a notification
     * @param {Function} [callback] - Passed the updated webhook information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the updated webhook object
     */
    update(webhookID: string, updates?: {
        address?: string;
        triggers?: WebhookTriggerType[];
    }, callback?: Function): any;
    /**
     * Delete a specified webhook by ID
     *
     * API Endpoint: '/webhooks/:webhookID'
     * Method: DELETE
     *
     * @param {string} webhookID - ID of webhook to be deleted
     * @param {Function} [callback] - Empty response body passed if successful.
     * @returns {Promise<void>} A promise resolving to nothing
     */
    delete(webhookID: string, callback?: Function): any;
}
/**
 * @module box-node-sdk/lib/managers/webhooks
 * @see {@Link Webhooks}
 */
export default Webhooks;
