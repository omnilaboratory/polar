/// <reference types="node" />
import grpc, { ChannelCredentials, Client } from '@grpc/grpc-js';
import * as grpcLoader from '@grpc/proto-loader';
export declare type GrpcLoader = typeof grpcLoader;
export declare type Grpc = typeof grpc;
export interface NestedGrpcObject {
    [index: string]: {
        [index: string]: typeof Client;
    };
}
export interface ConnectionConfig {
    grpcPkgObj: NestedGrpcObject;
    server: string;
    credentials: ChannelCredentials;
}
export interface GrpcServiceConfig extends ConnectionConfig {
    service: any;
    subscriptionMethods?: string[];
}
export interface GrpcObjectConfig {
    protoFilePath: string;
    includeDirs?: string[];
    grpcLoader: GrpcLoader;
    grpc: Grpc;
    includeDefaults?: boolean;
}
export interface RpcClientConfig {
    server?: string;
    tls?: string | false;
    cert?: Buffer | string;
    macaroonPath?: string;
    macaroon?: Buffer | string;
    certEncoding?: string;
    grpcLoader?: GrpcLoader;
    grpc?: Grpc;
    includeDefaults?: boolean;
}
export interface AutopilotRpcClientConfig extends RpcClientConfig {
    autopilot?: any;
}
export interface ChainRpcClientConfig extends RpcClientConfig {
    chainNotifier?: any;
}
export interface InvoicesRpcClientConfig extends RpcClientConfig {
    invoices?: any;
}
export interface RouterRpcClientConfig extends RpcClientConfig {
    router?: any;
}
export interface SignRpcClientConfig extends RpcClientConfig {
    signer?: any;
}
export interface WalletRpcClientConfig extends RpcClientConfig {
    walletKit?: any;
}
export interface WatchtowerRpcClientConfig extends RpcClientConfig {
    watchtower?: any;
}
export interface WtClientRpcClientConfig extends RpcClientConfig {
    watchtowerClient?: any;
}
export interface LnRpcClientConfig extends RpcClientConfig {
    lightning?: any;
    walletUnlocker?: any;
}
