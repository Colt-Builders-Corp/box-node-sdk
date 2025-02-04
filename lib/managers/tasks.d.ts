/**
 * @fileoverview Manager for the Tasks Resource
 */
import BoxClient from '../box-client';
/**
 * Enum of valid task resolution states
 * @readonly
 * @enum {TaskResolutionState}
 */
declare enum TaskResolutionState {
    COMPLETE = "completed",
    INCOMPLETE = "incomplete",
    APPROVED = "approved",
    REJECTED = "rejected"
}
/**
 * Simple manager for interacting with all 'Tasks' endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
declare class Tasks {
    client: BoxClient;
    resolutionStates: typeof TaskResolutionState;
    constructor(client: BoxClient);
    /**
     * Used to create a single task for single user on a single file.
     *
     * API Endpoint: '/tasks'
     * Method: POST
     *
     * @param {string} fileID - The ID of the item this task is for
     * @param {Object} [options] - Additional parameters
     * @param {string} [options.message] - An optional message to include with the task
     * @param {string} [options.due_at] - The day at which this task is due
     * @param {Function} [callback] - Passed the new task information if it was acquired successfully, error otherwise
     * @returns {Promise<Object>} A promise resolving to the created task object
     */
    create(fileID: string, options?: {
        message?: string;
        due_at?: string;
    }, callback?: Function): any;
    /**
     * Fetches a specific task.
     *
     * API Endpoint: '/tasks/:taskID'
     * Method: GET
     *
     * @param {string} taskID - The Box ID of the task being requested
     * @param {Object} [options] - Additional options for the request. Can be left null in most cases.
     * @param {Function} [callback] - Passed the task information if it was acquired successfully, error otherwise
     * @returns {Promise<Object>} A promise resolving to the task object
     */
    get(taskID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Updates a specific task.
     *
     * API Endpoint: '/tasks/:taskID'
     * Method: PUT
     *
     * @param {string} taskID - The Box ID of the task being updated
     * @param {Object} updates - Fields of the task object to update
     * @param {string} [updates.message] - An optional message to include with the task
     * @param {string} [updates.due_at] - The day at which this task is due
     * @param {Function} [callback] - Passed the updated task information if it was acquired successfully, error otherwise
     * @returns {Promise<Object>} A promise resolving to the updated task object
     */
    update(taskID: string, updates?: {
        message?: string;
        due_at?: string;
    }, callback?: Function): any;
    /**
     * Permanently deletes a specific task.
     *
     * API Endpoint: '/tasks/:taskID'
     * Method: DELETE
     *
     * @param {string} taskID - The Box ID of the task being deleted
     * @param {Function} [callback] - Empty body passed if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to nothing
     */
    delete(taskID: string, callback?: Function): any;
    /**
     * Get a list of assignments for a given task
     *
     * API Endpoint: '/tasks/:taskID/assignments'
     * Method: GET
     *
     * @param {string} taskID - The Box ID of the task to get assignments for
     * @param {Object} [options] - Additional parameters, can be left null in most cases
     * @param {Function} [callback] - Passed the list of assignments if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the collection of assignment objects
     */
    getAssignments(taskID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Get a specific task assignment
     *
     * API Endpoint: '/task_assignments/:assignmentID'
     * Method: GET
     *
     * @param {string} assignmentID - The Box ID of the task assignment to retrieve
     * @param {Object} [options] - Additional parameters, can be left null in most cases
     * @param {Function} [callback] - Passed the task assignment if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the assignment object
     */
    getAssignment(assignmentID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Assign a task to a specific user by ID
     *
     * API Endpoint: '/task_assignments'
     * Method: POST
     *
     * @param {string} taskID - The Box ID of the task to assign
     * @param {string} userID - The ID of the user to assign the task to
     * @param {Function} [callback] - Passed the task assignment if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the new assignment object
     */
    assignByUserID(taskID: string, userID: string, callback?: Function): any;
    /**
     * Assign a task to a specific user by email address
     *
     * API Endpoint: '/task_assignments'
     * Method: POST
     *
     * @param {string} taskID - The Box ID of the task to assign
     * @param {string} email - The email address of the user to assign the task to
     * @param {Function} [callback] - Passed the task assignment if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the new assignment object
     */
    assignByEmail(taskID: string, email: string, callback?: Function): any;
    /**
     * Update a task assignment.  This is used to resolve or complete a task.
     *
     * API Endpoint: '/task_assignments/:assignmentID'
     * Method: PUT
     *
     * @param {string} assignmentID - The Box ID of the task assignment to update
     * @param {Object} options - The fields of the assignment to update
     * @param {string} [options.message] - A message from the assignee about this task
     * @param {TaskResolutionState} [options.resolution_state] - Resolution of the task
     * @param {Function} [callback] - Passed the updated task assignment if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the updated assignment object
     */
    updateAssignment(assignmentID: string, options?: {
        message?: string;
        resolution_state?: TaskResolutionState;
    }, callback?: Function): any;
    /**
     * Delete a task assignment.  This unassigns a user from the related task.
     *
     * API Endpoint: '/task_assignments/:assignmentID'
     * Method: DELETE
     *
     * @param {string} assignmentID - The Box ID of the task assignment to delete
     * @param {Function} [callback] - Passed nothing if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to nothing
     */
    deleteAssignment(assignmentID: string, callback?: Function): any;
}
export default Tasks;
