"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWatchtower = void 0;
var create_service_client_1 = require("./create-service-client");
/**
 * Create a Watchtower GRPC service client proxy
 * @param config The grpc service configuration
 */
function createWatchtower(config) {
    try {
        var grpcPkgObj = config.grpcPkgObj, server = config.server, credentials = config.credentials;
        var watchtower = new grpcPkgObj.watchtowerrpc.Watchtower(server, credentials);
        return create_service_client_1.createServiceClient(__assign(__assign({}, config), { service: watchtower }));
    }
    catch (e) {
        if (!e.code)
            e.code = 'GRPC_WATCHTOWER_SERVICE_ERR';
        throw e;
    }
}
exports.createWatchtower = createWatchtower;
