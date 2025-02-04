/**
 * @fileoverview Manager for the Box Comments Resource
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import BoxClient from '../box-client.ts';
import urlPath from '../util/url-path.ts';

// -----------------------------------------------------------------------------
// Typedefs
// -----------------------------------------------------------------------------

// ------------------------------------------------------------------------------
// Private
// ------------------------------------------------------------------------------

const BASE_PATH = '/comments';

// ------------------------------------------------------------------------------
// Public
// ------------------------------------------------------------------------------

/**
 * Simple manager for interacting with all 'Comment' endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
class Comments {
	client: BoxClient;

	constructor(client: BoxClient) {
		this.client = client;
	}

	/**
	 * Requests a comment object with the given ID.
	 *
	 * API Endpoint: '/comments/:commentID'
	 * Method: GET
	 *
	 * @param {string} commentID - Box ID of the comment being requested
	 * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
	 * @param {Function} [callback] - Passed the comment information if it was acquired successfully
	 * @returns {Promise<Object>} A promise resolving to the comment object
	 */
	get(commentID: string, options?: Record<string, any>, callback?: Function) {
		var params = {
			qs: options,
		};
		var apiPath = urlPath(BASE_PATH, commentID);
		return this.client.wrapWithDefaultHandler(this.client.get)(
			apiPath,
			params,
			callback
		);
	}

	/**
	 * Posts a new comment on a file.
	 *
	 * API Endpoint: '/comments
	 * Method: POST
	 *
	 * @param {string} fileID - Box file id of the file to comment on
	 * @param {string} commentBody - text of the comment
	 * @param {Function} [callback] - passed the new comment data if it was posted successfully
	 * @returns {Promise<Object>} A promise resolving to the new comment object
	 */
	create(fileID: string, commentBody: string, callback?: Function) {
		// @TODO(bemerick) 2013-10-29: Don't hardcode this 'item'. Abstract to all commentable types...
		var params = {
			body: {
				item: {
					type: 'file',
					id: fileID,
				},
				message: commentBody,
			},
		};
		return this.client.wrapWithDefaultHandler(this.client.post)(
			BASE_PATH,
			params,
			callback
		);
	}

	/**
	 * Posts a new tagged comment on a file.
	 *
	 * API Endpoint: '/comments
	 * Method: POST
	 *
	 * @param {string} fileID - Box file id of the file to comment on
	 * @param {string} commentBody - text of the tagged comment
	 * @param {Function} [callback] - passed the new tagged comment data if it was posted successfully
	 * @returns {Promise<Object>} A promise resolving to the new comment object
	 */
	createTaggedComment(
		fileID: string,
		commentBody: string,
		callback?: Function
	) {
		var params = {
			body: {
				item: {
					type: 'file',
					id: fileID,
				},
				tagged_message: commentBody,
			},
		};
		return this.client.wrapWithDefaultHandler(this.client.post)(
			BASE_PATH,
			params,
			callback
		);
	}

	/**
	 * Posts a new comment as a reply to another comment.
	 *
	 * API Endpoint: '/comments
	 * Method: POST
	 *
	 * @param {string} commentID - Comment ID of the comment to reply to
	 * @param {string} commentBody - text of the comment
	 * @param {Function} [callback] - passed the new comment data if it was posted successfully
	 * @returns {Promise<Object>} A promise resolving to the new comment object
	 */
	reply(commentID: string, commentBody: string, callback?: Function) {
		var params = {
			body: {
				item: {
					type: 'comment',
					id: commentID,
				},
				message: commentBody,
			},
		};
		return this.client.wrapWithDefaultHandler(this.client.post)(
			BASE_PATH,
			params,
			callback
		);
	}

	/**
	 * Posts a new tagged comment as a reply to another comment.
	 *
	 * API Endpoint: '/comments
	 * Method: POST
	 *
	 * @param {string} commentID - Comment ID of the comment to reply to
	 * @param {string} commentBody - text of the tagged comment
	 * @param {Function} [callback] - passed the new tagged comment data if it was posted successfully
	 * @returns {Promise<Object>} A promise resolving to the new comment object
	 */
	createTaggedReply(
		commentID: string,
		commentBody: string,
		callback?: Function
	) {
		var params = {
			body: {
				item: {
					type: 'comment',
					id: commentID,
				},
				tagged_message: commentBody,
			},
		};
		return this.client.wrapWithDefaultHandler(this.client.post)(
			BASE_PATH,
			params,
			callback
		);
	}

	/**
	 * Update some information about a given comment.
	 *
	 * API Endpoint: '/comments/:commentID'
	 * Method: PUT
	 *
	 * @param {string} commentID - Box ID of the comment being requested
	 * @param {Object} updates - Fields to update on the comment
	 * @param {Function} [callback] - Passed the updated comment information if it was acquired successfully
	 * @returns {Promise<Object>} A promise resolving to the updated comment object
	 */
	update(commentID: string, updates: Record<string, any>, callback?: Function) {
		var params = {
			body: updates,
		};

		var apiPath = urlPath(BASE_PATH, commentID);
		return this.client.wrapWithDefaultHandler(this.client.put)(
			apiPath,
			params,
			callback
		);
	}

	/**
	 * Delete a given comment.
	 *
	 * API Endpoint: '/comments/:commentID'
	 * Method: DELETE
	 *
	 * @param {string} commentID - Box ID of the comment being requested
	 * @param {Function} [callback] - Empty response body passed if successful.
	 * @returns {Promise<void>} A promise resolving to nothing
	 */
	delete(commentID: string, callback?: Function) {
		var apiPath = urlPath(BASE_PATH, commentID);
		return this.client.wrapWithDefaultHandler(this.client.del)(
			apiPath,
			null,
			callback
		);
	}
}

/**
 * @module box-node-sdk/lib/managers/comments
 * @see {@Link Comments}
 */
export default Comments;
