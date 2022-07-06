import { SignRpc, SignRpcClientConfig } from '../types';
/**
 * Factory for a signrpc instance & proxy responsible for:
 *  - Generating a GRPC Descriptor from user's config
 *  - Instantiating/exposing all GRPC Services
 *  - Resolving a proxy that:
 *    1.  Invokes all top-level method calls to the lightning
 *        proxy for user convience
 *    2.  Allow basic user property requests to all GRPC Services
 *
 * @param userConfig The user provided configuration details
 * @return Returns proxy to signrpc instance
 */
export declare function createSignRpc<T = unknown>(userConfig: SignRpcClientConfig): Promise<T & SignRpc>;
