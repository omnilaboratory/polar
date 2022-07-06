"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrpcObject = void 0;
/**
 * Create RPC from proto and return the GRPC package object
 * @param config The configuration necessary to create the grpc object
 */
function createGrpcObject(config) {
    try {
        var protoFilePath = config.protoFilePath, includeDirs = config.includeDirs, grpcLoader = config.grpcLoader, grpc = config.grpc, includeDefaults = config.includeDefaults;
        var packageDefinition = grpcLoader.loadSync(protoFilePath, {
            longs: String,
            defaults: includeDefaults !== null && includeDefaults !== void 0 ? includeDefaults : false,
            includeDirs: includeDirs,
        });
        return grpc.loadPackageDefinition(packageDefinition);
    }
    catch (e) {
        if (!e.code)
            e.code = 'GRPC_LOAD_ERR';
        throw e;
    }
}
exports.createGrpcObject = createGrpcObject;
