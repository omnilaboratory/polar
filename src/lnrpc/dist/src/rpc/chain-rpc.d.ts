import { ChainRpc, ChainRpcClientConfig } from '../types';
/**
 * Factory for a chainrpc instance & proxy responsible for:
 *  - Generating a GRPC Descriptor from user's config
 *  - Instantiating/exposing all GRPC Services
 *  - Resolving a proxy that:
 *    1.  Invokes all top-level method calls to the lightning
 *        proxy for user convience
 *    2.  Allow basic user property requests to all GRPC Services
 *
 * @param userConfig The user provided configuration details
 * @return Returns proxy to chainrpc instance
 */
export declare function createChainRpc<T = unknown>(userConfig: ChainRpcClientConfig): Promise<T & ChainRpc>;
