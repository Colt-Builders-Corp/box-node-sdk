/**
 * @fileoverview Upload manager for large file uploads
 */
/// <reference types="node" />
/**
 * Chunk uploaded event
 * @event Chunk#uploaded
 * @param {UploadPart} data The data of the uploaded chunk
 * @private
 */
/**
 * Chunk error event
 * @event Chunk#error
 * @param {Error} err The error that occurred
 * @private
 */
/**
 * Event for when the upload is successfully aborted
 * @event ChunkedUploader#aborted
 */
/**
 * Event for when the abort fails because the upload session is not destroyed.
 * In general, the abort can be retried, and no new chunks will be uploaded.
 * @event ChunkedUploader#abortFailed
 * @param {Error} err The error that occurred
 */
/**
 * Event for when a chunk fails to upload.  Note that the chunk will automatically
 * retry until it is successfully uploaded.
 * @event ChunkedUploader#chunkError
 * @param {Error} err The error that occurred during chunk upload
 */
/**
 * Event for when a chunk is successfully uploaded
 * @event ChunkedUploader#chunkUploaded
 * @param {UploadPart} data The data for the uploaded chunk
 */
/**
 * Event for when the entire upload is complete
 * @event ChunkedUploader#uploadComplete
 * @param {Object} file The file object for the newly-uploaded file
 */
/**
 * Event for when an upload fails
 * @event ChunkedUploader#error
 * @param {Error} err The error that occurred
 */
declare type ChunkedUploaderOptions = {
    retryInterval?: number;
    parallelism?: number;
    fileAttributes?: Record<string, any>;
};
declare type UploadSessionInfo = {
    id: string;
    part_size: number;
};
import { EventEmitter } from 'events';
import { Readable as ReadableStream } from 'stream';
import crypto from 'crypto';
import BoxClient from './box-client';
/** Manager for uploading a file in chunks */
declare class ChunkedUploader extends EventEmitter {
    _client: BoxClient;
    _sessionID: string;
    _partSize: number;
    _uploadSessionInfo: UploadSessionInfo;
    _stream: ReadableStream | null;
    _streamBuffer: Array<any>;
    _file: Buffer | string | null;
    _size: number;
    _options: Required<ChunkedUploaderOptions>;
    _isStarted: boolean;
    _numChunksInFlight: number;
    _chunks: Array<any>;
    _position: number;
    _fileHash: crypto.Hash;
    _promise?: Promise<any>;
    _resolve?: Function;
    _reject?: Function;
    /**
     * Create an upload manager
     * @param {BoxClient} client The client to use to upload the file
     * @param {Object} uploadSessionInfo The upload session info to use for chunked upload
     * @param {ReadableStream|Buffer|string} file The file to upload
     * @param {int} size The size of the file to be uploaded
     * @param {Object} [options] Optional parameters
     * @param {int} [options.retryInterval=1000] The number of ms to wait before retrying operations
     * @param {int} [options.parallelism=4] The number of concurrent chunks to upload
     * @param {Object} [options.fileAttributes] Attributes to set on the file during commit
     */
    constructor(client: BoxClient, uploadSessionInfo: UploadSessionInfo, file: ReadableStream | Buffer | string, size: number, options?: ChunkedUploaderOptions);
    /**
     * Start an upload
     * @returns {Promise<Object>} A promise resolving to the uploaded file
     */
    start(): Promise<any> | undefined;
    /**
     * Abort a running upload, which cancels all currently uploading chunks,
     * attempts to free up held memory, and aborts the upload session.  This
     * cannot be undone or resumed.
     * @returns {Promise} A promise resolving when the upload is aborted
     * @emits ChunkedUploader#aborted
     * @emits ChunkedUploader#abortFailed
     */
    abort(): any;
    /**
     * Get the next chunk of the file to be uploaded
     * @param {Function} callback Called with the next chunk of the file to be uploaded
     * @returns {void}
     * @private
     */
    _getNextChunk(callback: Function): void;
    /**
     * Upload a chunk
     * @param {Chunk} chunk The chunk to upload
     * @returns {void}
     * @emits ChunkedUploader#chunkError
     * @emits ChunkedUploader#chunkUploaded
     */
    _uploadChunk(chunk: any): void;
    /**
     * Commit the upload, finalizing it
     * @returns {void}
     * @emits ChunkedUploader#uploadComplete
     * @emits ChunkedUploader#error
     */
    _commit(): void;
}
export default ChunkedUploader;
