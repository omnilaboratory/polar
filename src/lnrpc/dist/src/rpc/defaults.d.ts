import * as grpc from '@grpc/grpc-js';
import * as grpcLoader from '@grpc/proto-loader';
export declare const defaults: {
    grpc: typeof grpc;
    grpcLoader: typeof grpcLoader;
    server: string;
    macaroonPath: string;
    certEncoding: string;
    tls: string;
};
