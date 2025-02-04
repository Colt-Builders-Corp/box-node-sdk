/**
 * @fileoverview Manager for the Box Folders Resource
 */
import BoxClient from '../box-client.ts';
declare type FolderSharedLinkAccess = 'open' | 'company' | 'collaborators' | null;
declare type FolderSharedLinkPermissions = {
    /**
     * If the shared link allows only to view folders. This can only be set when access is set to open or company.
     */
    can_view?: true;
    /**
     * If the shared link allows only to download folders. This can only be set when access is set to open or company.
     */
    can_download?: boolean;
};
declare type FolderSharedLink = {
    /**
     * The level of access for the shared link. This can be restricted to anyone with the link (open),
     * only people within the company (company) and only those who have been invited to the file (collaborators).
     *
     * If not set, this field defaults to the access level specified by the enterprise admin.
     * To create a shared link with this default setting pass the shared_link object with no access field.
     * To remove access and change its value to default one pass the shared_link object with null value access field.
     */
    access?: FolderSharedLinkAccess;
    /**
     * The password required to access the shared link. Set the password to null to remove it.
     * A password can only be set when access is set to open.
     */
    password?: string | null;
    /**
     * The timestamp at which this shared link will expire. This field can only be set by users with paid accounts.
     * The value must be greater than the current date and time.
     * Example value: '2012-12-12T10:53:43-08:00'
     */
    unshared_at?: string | null;
    /**
     * Defines a custom vanity name to use in the shared link URL, for example vanity_name: "my-shared-link" will
     * produce a shared link of "https://app.box.com/v/my-shared-link".
     *
     * Custom URLs should not be used when sharing sensitive content as vanity URLs are a lot easier to guess
     * than regular shared links.
     */
    vanity_name?: string | null;
    /**
     * Defines what actions are allowed on a shared link.
     */
    permissions?: FolderSharedLinkPermissions;
};
/**
 * Simple manager for interacting with all 'Folder' endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
declare class Folders {
    client: BoxClient;
    constructor(client: BoxClient);
    /**
     * Requests a folder object with the given ID.
     *
     * API Endpoint: '/folders/:folderID'
     * Method: GET
     *
     * @param {string} folderID - Box ID of the folder being requested
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the folder information if it was acquired successfully
     * @returns {Promise<Object>} A promise resolving to the folder object
     */
    get(folderID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Requests items contained within a given folder.
     *
     * API Endpoint: '/folders/:folderID/items'
     * Method: GET
     *
     * @param {string} folderID - Box ID of the folder being requested
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the folder information if it was acquired successfully
     * @returns {Promise<Object>} A promise resolving to the collection of the items in the folder
     */
    getItems(folderID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Requests collaborations on a given folder.
     *
     * API Endpoint: '/folders/:folderID/collaborations'
     * Method: GET
     *
     * @param {string} folderID - Box ID of the folder being requested
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the folder information if it was acquired successfully
     * @returns {Promise<Object>} A promise resolving to the collection of collaborations
     */
    getCollaborations(folderID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Creates a new Folder within a parent folder
     *
     * API Endpoint: '/folders
     * Method: POST
     *
     * @param {string} parentFolderID - Box folder id of the folder to add into
     * @param {string} name - The name for the new folder
     * @param {Function} [callback] - passed the new folder info if call was successful
     * @returns {Promise<Object>} A promise resolving to the created folder object
     */
    create(parentFolderID: string, name: string, callback?: Function): any;
    /**
     * Copy a folder into a new, different folder
     *
     * API Endpoint: '/folders/:folderID/copy
     * Method: POST
     *
     * @param {string} folderID - The Box ID of the folder being requested
     * @param {string} newParentID - The Box ID for the new parent folder. '0' to copy to All Files.
     * @param {Object} [options] - Optional parameters for the copy operation, can be left null in most cases
     * @param {string} [options.name] - A new name to use if there is an identically-named item in the new parent folder
     * @param {Function} [callback] - passed the new folder info if call was successful
     * @returns {Promise<Object>} A promise resolving to the new folder object
     */
    copy(folderID: string, newParentID: string, options?: {
        [key: string]: any;
        name?: string;
    } | Function, callback?: Function): any;
    /**
     * Update some information about a given folder.
     *
     * API Endpoint: '/folders/:folderID'
     * Method: PUT
     *
     * @param {string} folderID - The Box ID of the folder being requested
     * @param {Object} updates - Folder fields to update
     * @param {string} [updates.etag] Only update the folder if the ETag matches
     * @param {Function} [callback] - Passed the updated folder information if it was acquired successfully
     * @returns {Promise<Object>} A promise resolving to the updated folder object
     */
    update(folderID: string, updates: {
        [key: string]: any;
        etag?: string;
        shared_link?: FolderSharedLink;
    }, callback?: Function): any;
    /**
     * Add a folder to a given collection
     *
     * API Endpoint: '/folders/:folderID'
     * Method: PUT
     *
     * @param {string} folderID - The folder to add to the collection
     * @param {string} collectionID - The collection to add the folder to
     * @param {Function} [callback] - Passed the updated folder if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the updated folder object
     */
    addToCollection(folderID: string, collectionID: string, callback?: Function): any;
    /**
     * Remove a folder from a given collection
     *
     * API Endpoint: '/folders/:folderID'
     * Method: PUT
     *
     * @param {string} folderID - The folder to remove from the collection
     * @param {string} collectionID - The collection to remove the folder from
     * @param {Function} [callback] - Passed the updated folder if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the updated folder object
     */
    removeFromCollection(folderID: string, collectionID: string, callback?: Function): any;
    /**
     * Move a folder into a new parent folder.
     *
     * API Endpoint: '/folders/:folderID'
     * Method: PUT
     *
     * @param {string} folderID - The Box ID of the folder being requested
     * @param {string} newParentID - The Box ID for the new parent folder. '0' to move to All Files.
     * @param {Function} [callback] - Passed the updated folder information if it was acquired successfully
     * @returns {Promise<Object>} A promise resolving to the updated folder object
     */
    move(folderID: string, newParentID: string, callback?: Function): any;
    /**
     * Delete a given folder.
     *
     * API Endpoint: '/folders/:folderID'
     * Method: DELETE
     *
     * @param {string} folderID - Box ID of the folder being requested
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {string} [options.etag] Only delete the folder if the ETag matches
     * @param {Function} [callback] - Empty response body passed if successful.
     * @returns {Promise<void>} A promise resolving to nothing
     */
    delete(folderID: string, options?: {
        [key: string]: any;
        etag?: string;
    }, callback?: Function): any;
    /**
     * Retrieves all metadata associated with a folder.
     *
     * API Endpoint: '/folders/:folderID/metadata'
     * Method: GET
     *
     * @param {string} folderID - the ID of the folder to get metadata for
     * @param {Function} [callback] - called with an array of metadata when successful
     * @returns {Promise<Object>} A promise resolving to the collection of metadata on the folder
     */
    getAllMetadata(folderID: string, callback?: Function): any;
    /**
     * Retrieve a single metadata template instance for a folder.
     *
     * API Endpoint: '/folders/:folderID/metadata/:scope/:template'
     * Method: GET
     *
     * @param {string} folderID - The ID of the folder to retrive the metadata of
     * @param {string} scope - The scope of the metadata template, e.g. "global"
     * @param {string} template - The metadata template to retrieve
     * @param {Function} [callback] - Passed the metadata template if successful
     * @returns {Promise<Object>} A promise resolving to the metadata template
     */
    getMetadata(folderID: string, scope: string, template: string, callback?: Function): any;
    /**
     * Adds metadata to a folder.  Metadata must either match a template schema or
     * be placed into the unstructured "properties" template in global scope.
     *
     * API Endpoint: '/folders/:folderID/metadata/:scope/:template'
     * Method: POST
     *
     * @param {string} folderID - The ID of the folder to add metadata to
     * @param {string} scope - The scope of the metadata template, e.g. "enterprise"
     * @param {string} template - The metadata template schema to add
     * @param {Object} data - Key/value pairs to add as metadata
     * @param {Function} [callback] - Called with error if unsuccessful
     * @returns {Promise<Object>} A promise resolving to the created metadata
     */
    addMetadata(folderID: string, scope: string, template: string, data: Record<string, any>, callback?: Function): any;
    /**
     * Updates a metadata template instance with JSON Patch-formatted data.
     *
     * API Endpoint: '/folders/:folderID/metadata/:scope/:template'
     * Method: PUT
     *
     * @param {string} folderID - The folder to update metadata for
     * @param {string} scope - The scope of the template to update
     * @param {string} template - The template to update
     * @param {Object} patch - The patch data
     * @param {Function} [callback] - Called with updated metadata if successful
     * @returns {Promise<Object>} A promise resolving to the updated metadata
     */
    updateMetadata(folderID: string, scope: string, template: string, patch: Record<string, any>, callback?: Function): any;
    /**
     * Sets metadata on a folder, overwriting any metadata that exists for the provided keys.
     *
     * @param {string} folderID - The folder to set metadata on
     * @param {string} scope - The scope of the metadata template
     * @param {string} template - The key of the metadata template
     * @param {Object} metadata - The metadata to set
     * @param {Function} [callback] - Called with updated metadata if successful
     * @returns {Promise<Object>} A promise resolving to the updated metadata
     */
    setMetadata(folderID: string, scope: string, template: string, metadata: Record<string, any>, callback?: Function): any;
    /**
     * Deletes a metadata template from a folder.
     *
     * API Endpoint: '/folders/:folderID/metadata/:scope/:template'
     * Method: DELETE
     *
     * @param {string} folderID - The ID of the folder to remove metadata from
     * @param {string} scope - The scope of the metadata template
     * @param {string} template - The template to remove from the folder
     * @param {Function} [callback] - Called with nothing if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to nothing
     */
    deleteMetadata(folderID: string, scope: string, template: string, callback?: Function): any;
    /**
     * Retrieves a folder that has been moved to the trash
     *
     * API Endpoint: '/folders/:folderID/trash'
     * Method: GET
     *
     * @param  {string} folderID  - The ID of the folder being requested
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param  {Function} [callback]  - Passed the folder information if it was acquired successfully
     * @returns {Promise<Object>} A promise resolving to the trashed folder object
     */
    getTrashedFolder(folderID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Restores an item that has been moved to the trash. Default behavior is to restore the item
     * to the folder it was in before it was moved to the trash. If that parent folder no longer
     * exists or if there is now an item with the same name in that parent folder, the new parent
     * older and/or new name will need to be included in the request.
     *
     * API Endpoint: '/folders/:folderID'
     * Method: POST
     *
     * @param {string} folderID - The ID of the folder to restore
     * @param {Object} [options] - Optional parameters, can be left null
     * @param {?string} [options.name] - The new name for this item
     * @param {string} [options.parent_id] - The new parent folder for this item
     * @param {Function} [callback] - Called with folder information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the restored folder object
     */
    restoreFromTrash(folderID: string, options?: {
        [key: string]: any;
        name?: string;
        parent_id?: string;
    }, callback?: Function): any;
    /**
     * Permanently deletes an folder that is in the trash. The item will no longer exist in Box. This action cannot be undone
     *
     * API Endpoint: '/folders/:folderID/trash'
     * Method: DELETE
     *
     * @param  {string} folderID Box ID of the folder being requested
     * @param {Object} [options] Optional parameters
     * @param {string} [options.etag] Only delete the folder if the ETag matches
     * @param  {Function} [callback] Called with nothing if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to nothing
     */
    deletePermanently(folderID: string, options?: {
        [key: string]: any;
        etag?: string;
    }, callback?: Function): any;
    /**
     * Used to retrieve the watermark for a corresponding Box folder.
     *
     * API Endpoint: '/folders/:folderID/watermark'
     * Method: GET
     *
     * @param {string} folderID - The Box ID of the folder to get watermark for
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the watermark information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the watermark info
     */
    getWatermark(folderID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Used to apply or update the watermark for a corresponding Box folder.
     *
     * API Endpoint: '/folders/:folderID/watermark'
     * Method: PUT
     *
     * @param {string} folderID - The Box ID of the folder to update watermark for
     * @param {Object} [options] - Optional parameters, can be left null
     * @param {Function} [callback] - Passed the watermark information if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the watermark info
     */
    applyWatermark(folderID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Used to remove the watermark for a corresponding Box folder.
     *
     * API Endpoint: '/folders/:folderID/watermark'
     * Method: DELETE
     *
     * @param {string} folderID - The Box ID of the folder to remove watermark from
     * @param {Function} [callback] - Empty response body passed if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to nothing
     */
    removeWatermark(folderID: string, callback?: Function): any;
    /**
     * Used to lock a Box folder.
     *
     * API Endpoint: '/folder_locks'
     * Method: POST
     *
     * @param {string} folderID - The Box ID of the folder to lock
     * @param {Function} [callback] - Passed the folder lock object if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to a folder lock object
     */
    lock(folderID: string, callback?: Function): any;
    /**
     * Used to get all locks on a folder.
     *
     * API Endpoint: '/folder_locks'
     * Method: GET
     *
     * @param {string} folderID - The Box ID of the folder to lock
     * @param {Function} [callback] - Passed a collection of folder lock objects if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to a collection of folder lock objects
     */
    getLocks(folderID: string, callback?: Function): any;
    /**
     * Used to delete a lock on a folder.
     *
     * API Endpoint: '/folder_locks/:folderLockID'
     * Method: DELETE
     *
     * @param {string} folderLockID - The Box ID of the folder lock
     * @param {Function} [callback] - Empty response body passed if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to nothing
     */
    deleteLock(folderLockID: string, callback?: Function): any;
}
/**
 * @module box-node-sdk/lib/managers/folders
 * @see {@Link Folders}
 */
export default Folders;
