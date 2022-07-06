import { ChannelCredentials } from '@grpc/grpc-js';
import { RpcClientConfig } from '../types';
/**
 * Generate grpc SSL credentials and combine with the macaroon
 * credentials if necessary.
 * @param config The rpc client configuration
 */
export declare function createCredentials(config: RpcClientConfig): Promise<ChannelCredentials>;
