import { GrpcObjectConfig, NestedGrpcObject } from '../types';
/**
 * Create RPC from proto and return the GRPC package object
 * @param config The configuration necessary to create the grpc object
 */
export declare function createGrpcObject(config: GrpcObjectConfig): NestedGrpcObject;
