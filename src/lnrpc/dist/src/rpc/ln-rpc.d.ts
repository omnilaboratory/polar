import { LnRpc, LnRpcClientConfig, WalletUnlockerRpc } from '../types';
/**
 * Factory for a lnrpc instance & proxy responsible for:
 *  - Generating a GRPC Descriptor from user's config
 *  - Instantiating/exposing all GRPC Services
 *  - Resolving a proxy that:
 *    1.  Invokes all top-level method calls to the lightning
 *        proxy for user convience
 *    2.  Allow basic user property requests to all GRPC Services
 *
 * @param userConfig The user provided configuration details
 * @return Returns proxy to lnrpc instance
 */
export declare function createLnRpc<T extends unknown>(userConfig: LnRpcClientConfig): Promise<T & LnRpc & WalletUnlockerRpc>;
