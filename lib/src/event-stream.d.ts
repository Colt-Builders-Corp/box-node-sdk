/**
 * @fileoverview Event stream backed by the events API
 */
/// <reference types="node" />
import { Readable } from 'stream';
import BoxClient from './box-client.ts';
declare type Options = {
    retryDelay: number;
    deduplicationFilterSize: number;
    fetchInterval: number;
};
declare type LongPollInfo = {
    max_retries: number;
    retry_timeout: number;
    url: string;
};
/**
 * Stream of Box events from a given client and point in time.
 * @param {BoxClient} client The client to use to get events
 * @param {string} streamPosition The point in time to start at
 * @param {Object} [options] Optional parameters
 * @param {int} [options.retryDelay=1000] Number of ms to wait before retrying after an error
 * @param {int} [options.deduplicationFilterSize=5000] Number of IDs to track for deduplication
 * @param {int} [options.fetchInterval=1000] Minimunm number of ms between calls for more events
 * @constructor
 * @extends Readable
 */
declare class EventStream extends Readable {
    _client: BoxClient;
    _streamPosition: string;
    _longPollInfo?: LongPollInfo;
    _longPollRetries: number;
    _dedupHash: Record<string, boolean>;
    _rateLimiter: Promise<any>;
    _options: Options;
    _retryTimer?: NodeJS.Timeout | number;
    constructor(client: BoxClient, streamPosition: string, options?: Partial<Options>);
    /**
     * Retrieve the url and params for long polling for new updates
     * @returns {Promise} Promise for testing purposes
     * @private
     */
    getLongPollInfo(): any;
    /**
     * Long poll for notification of new events.	We do this rather than
     * polling for the events directly in order to minimize the number of API
     * calls necessary.
     * @returns {Promise} Promise for testing pruposes
     * @private
     */
    doLongPoll(): any;
    /**
     * Retries long-polling after a delay.
     * Does not attempt if stream is already destroyed.
     * @returns {void}
     * @private
     */
    retryPollInfo(): void;
    /**
     * Fetch the latest group of events and push them into the stream
     * @returns {Promise} Promise for testing purposes
     * @private
     */
    fetchEvents(): Promise<any>;
    /**
     * Clean up the deduplication filter, to prevent it from growing
     * too big and eating up memory.	We look at the latest set of events
     * returned and assume that any IDs not in that set don't need to be
     * tracked for deduplication any more.
     * @param {Object[]} latestEvents The latest events from the API
     * @returns {void}
     * @private
     */
    cleanupDedupFilter(latestEvents: any): void;
    /**
     * Implementation of the stream-internal read function.	This is called
     * by the stream whenever it needs more data, and will not be called again
     * until data is pushed into the stream.
     * @returns {void}
     * @private
     */
    _read(): void;
    /**
     * Implementation of stream-internal `_destroy` function (v8.0.0 and later).
     * Called by stream consumers to effectively stop polling via the public
     * `destroy()`.
     * @returns {void}
     * @private
     */
    _destroy(): void;
}
export default EventStream;
