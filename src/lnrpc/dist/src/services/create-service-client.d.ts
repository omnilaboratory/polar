import { GrpcServiceConfig } from '../types';
/**
 * Create a GRPC service client proxy
 * The Proxy serves two purposes:
 * - Wrap non-subscription methods in promises
 * - Immediately return subscription methods and properties
 * @param config The GRPC service configuration
 */
export declare function createServiceClient(config: GrpcServiceConfig): object;
