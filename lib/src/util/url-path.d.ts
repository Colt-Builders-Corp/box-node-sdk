/**
 * @fileoverview URL Path Builder
 */
/**
 * URLPath will create a full URL path from the given array of segments.
 *
 * It also provides the following features:
 * - convert all segments to strings
 * - add/remove slashes between segments, where appropriate
 * - encode each path segment to prevent path manipulation
 *
 * @name URLPath
 * @returns {string} Return a valid URL path comprised of the given path segments
 */
export default function urlPath(...args: any[]): string;
