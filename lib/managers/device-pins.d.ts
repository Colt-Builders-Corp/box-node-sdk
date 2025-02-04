/**
 * @fileoverview Manager for the Device Pins resource
 * @author mwiller
 */
import BoxClient from '../box-client';
/**
 * Simple manager for interacting with all Device Pin endpoints and actions.
 *
 * @constructor
 * @param {BoxClient} client - The Box API Client that is responsible for making calls to the API
 * @returns {void}
 */
declare class DevicePins {
    client: BoxClient;
    constructor(client: BoxClient);
    /**
     * Get a specific device pinning record
     *
     * API Endpoint: '/device_pinners/:pinID'
     * Method: GET
     *
     * @param {string} pinID - The ID of the pin to retrieve
     * @param {Object} [options] - Optional paramters, can be left null in many cases
     * @param {Function} [callback] - Passed the device pin if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the device pin object
     */
    get(pinID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Delete a specific device pinning record
     *
     * API Endpoint: '/device_pinners/:pinID'
     * Method: DELETE
     *
     * @param {string} pinID - The ID of the pin to delete
     * @param {Object} [options] - Optional paramters, can be left null in many cases
     * @param {Function} [callback] - Passed nothing if successful, error otherwise
     * @returns {Promise<void>} A promise resolving to nothing
     */
    delete(pinID: string, options?: Record<string, any>, callback?: Function): any;
    /**
     * Get all device pin records for the current enterprise
     *
     * API Endpoint: '/enterprises/:enterpriseID/device_pinners'
     * Method: GET
     *
     * @param {Object} [options] - Optional paramters, can be left null in many cases
     * @param {Function} [callback] - Passed a list of device pins if successful, error otherwise
     * @returns {Promise<Object>} A promise resolving to the collection of device pins
     */
    getAll(options?: Record<string, any>, callback?: Function): any;
}
export default DevicePins;
