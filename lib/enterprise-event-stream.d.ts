/**
 * @fileoverview Enterprise event stream backed by the enterprise events API
 */
/// <reference types="node" />
import { Readable } from 'stream';
import BoxClient from './box-client';
declare type Options = {
    streamPosition?: string;
    startDate?: string;
    endDate?: string;
    eventTypeFilter?: EventType[];
    pollingInterval?: number;
    chunkSize?: number;
    streamType?: 'admin_logs' | 'admin_logs_streaming';
};
declare type EventType = string;
/**
 * Stream of Box enterprise events.
 *
 * By default, the stream starts from the current time.
 * Pass 'startDate' to start from a specific time.
 * Pass 'streamPosition' to start from a previous stream position, or '0' for all available past events (~1 year).
 * Once the stream catches up to the current time, it will begin polling every 'pollingInterval' seconds.
 * If 'pollingInterval' = 0, then the stream will end when it catches up to the current time (no polling).
 *
 * @param {BoxClient} client - The client to use to get events
 * @param {Object} [options] - Options
 * @param {string} [options.streamPosition] - The stream position to start from (pass '0' for all past events)
 * @param {string} [options.startDate] - The date to start from
 * @param {string} [options.endDate] - The date to end at
 * @param {EventType[]} [options.eventTypeFilter] - Array of event types to return
 * @param {int} [options.pollingInterval=60] - Polling interval (in seconds).  Pass 0 for no polling.
 * @param {int} [options.chunkSize=500] - Number of events to fetch per call (max = 500)
 * @constructor
 * @extends Readable
 */
declare class EnterpriseEventStream extends Readable {
    _client: BoxClient;
    _options: Options & Required<Pick<Options, 'pollingInterval' | 'chunkSize'>>;
    _streamPosition?: string;
    constructor(client: BoxClient, options?: Options);
    /**
     * @returns {?number} - Returns null if no events have been fetched from Box yet.
     */
    getStreamPosition(): string | undefined;
    /**
     * Get the stream state.
     *
     * @returns {Object} - The stream state
     */
    getStreamState(): {
        streamPosition: string | undefined;
        startDate: string | undefined;
        endDate: string | undefined;
        eventTypeFilter: string[] | undefined;
    };
    /**
     * Set the stream state.
     *
     * @param {Object} state - The stream state
     * @returns {void}
     */
    setStreamState(state: Pick<Options, 'streamPosition' | 'startDate' | 'endDate' | 'eventTypeFilter'>): void;
    /**
     * Fetch the next chunk of events
     *
     * If there are no events, poll until events are available.
     * If an error occurs, emit the error but continuing polling as usual.
     * @param {Function} callback - Passed the array of events
     * @returns {void}
     * @private
     */
    fetchEvents(callback: Function): void;
    /**
     * Implementation of the stream-internal read function.	This is called
     * by the stream whenever it needs more data, and will not be called again
     * until data is pushed into the stream.
     * @returns {void}
     * @private
     */
    _read(): void;
}
export default EnterpriseEventStream;
