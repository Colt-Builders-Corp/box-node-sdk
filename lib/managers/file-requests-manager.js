import urlPath from "../util/url-path";
class FileRequestsManager {
    constructor(client) {
        // Attach the client, for making API calls
        this.client = client;
    }
    /**
     * Gets File Request by ID.
     * @param {string} fileRequestId File Request ID
     * @param {Function} [callback] passed the user info if it was acquired successfully
     * @returns {Promise<FileRequest>} a promise with FileRequest details
     */
    getById(fileRequestId, callback) {
        const apiPath = urlPath('file_requests', fileRequestId);
        return this.client.wrapWithDefaultHandler(this.client.get)(apiPath, callback);
    }
    /**
     * Delete File Request.
     * @param {string} fileRequestId File Request ID
     * @param {Function} [callback] passed the user info if it was acquired successfully
     * @returns {Promise<void>} Returns a promise resolving to nothing
     */
    delete(fileRequestId, callback) {
        const apiPath = urlPath('file_requests', fileRequestId);
        return this.client.wrapWithDefaultHandler(this.client.del)(apiPath, callback);
    }
    /**
     * Copies existing FileRequest to new folder
     * @param {string} fileRequestIdToCopy ID of file request to copy
     * @param copyRequest copy request details
     * @param {string} copyRequest.folder.id ID of folder to which file request will be copied
     * @param {string} copyRequest.folder.type type of folder. Value is always 'folder'
     * @param {string} [copyRequest.title] new title of file request
     * @param {string} [copyRequest.description] new description of file request
     * @param {string} [copyRequest.expires_at] new date when file request expires
     * @param {boolean} [copyRequest.is_description_required] is file request submitter required to provide a description
     *   of the files they are submitting
     * @param {boolean} [copyRequest.is_email_required] is file request submitter required to provide their email address
     * @param {string} [copyRequest.status] new status of file request
     * @param {Function} [callback] passed the user info if it was acquired successfully
     * @returns {Promise<FileRequest>} Returns a promise with FileRequest details
     */
    copy(fileRequestIdToCopy, copyRequest, callback) {
        const apiPath = urlPath('file_requests', fileRequestIdToCopy, 'copy');
        return this.client.wrapWithDefaultHandler(this.client.post)(apiPath, { body: copyRequest }, callback);
    }
    /**
     * Update existing file request
     * @param {string} fileRequestId ID of file request
     * @param {string} fileRequestChange change of file request
     * @param {string} [fileRequestChange.description] new description of file request
     * @param {string} [fileRequestChange.expires_at] new date when file request expires
     * @param {boolean} [fileRequestChange.is_description_required] is file request submitter required to provide a
     *   description of the files they are submitting
     * @param {boolean} [fileRequestChange.is_email_required] is file request submitter required to provide their
     *   email address
     * @param {string} [fileRequestChange.status] new status of file request
     * @param {string} [fileRequestChange.title] new title of file request
     * @param {string} [originalRequestEtag] pass in the item's last observed etag value into this header and
     *   the endpoint will fail with a 412 Precondition Failed if it has changed since.
     * @param {Function} callback passed the user info if it was acquired successfully
     * @returns {Promise<FileRequest>} Returns a promise with FileRequest details
     */
    update(fileRequestId, fileRequestChange, originalRequestEtag, callback) {
        const apiPath = urlPath('file_requests', fileRequestId);
        let params = { body: fileRequestChange };
        if (originalRequestEtag) {
            params = Object.assign(Object.assign({}, params), { headers: { "if-match": originalRequestEtag } });
        }
        return this.client.wrapWithDefaultHandler(this.client.put)(apiPath, params, callback);
    }
}
export default FileRequestsManager;
//# sourceMappingURL=file-requests-manager.js.map