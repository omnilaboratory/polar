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
exports.createLightning = void 0;
var create_service_client_1 = require("./create-service-client");
/**
 * Create a Lightning GRPC service client proxy
 * @param config The grpc service configuration
 */
function createLightning(config) {
    try {
        var grpcPkgObj = config.grpcPkgObj, server = config.server, credentials = config.credentials;
        var lightning = new grpcPkgObj.lnrpc.Lightning(server, credentials, {
            // Increase max receive message size for describegraph
            'grpc.max_receive_message_length': 50 * 1024 * 1024,
        });
        var subscriptionMethods = [
            'subscribeInvoices',
            'subscribeTransactions',
            'subscribeChannelGraph',
            'subscribePeerEvents',
            'subscribeChannelEvents',
            'subscribeChannelBackups',
            'sendToRoute',
            'sendPayment',
            'openChannel',
            'closeChannel',
        ];
        return create_service_client_1.createServiceClient(__assign(__assign({}, config), { subscriptionMethods: subscriptionMethods, service: lightning }));
    }
    catch (e) {
        if (!e.code)
            e.code = 'GRPC_LIGHTNING_SERVICE_ERR';
        throw e;
    }
}
exports.createLightning = createLightning;
