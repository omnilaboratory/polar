"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceClient = void 0;
var util_1 = require("util");
var default_empty_arg_1 = require("../default-empty-arg");
/**
 * Create a GRPC service client proxy
 * The Proxy serves two purposes:
 * - Wrap non-subscription methods in promises
 * - Immediately return subscription methods and properties
 * @param config The GRPC service configuration
 */
function createServiceClient(config) {
    // create a list of function names on the service class to prevent
    // promisifying internal functions on the base class grpc.Client
    var ownProps = Object.getOwnPropertyNames(Object.getPrototypeOf(config.service));
    return new Proxy(config.service, {
        /**
         * Promisify any requested (non-subscription) lightning RPC method
         * @param target
         * @param key
         */
        get: function (target, key) {
            var method = target[key];
            if (typeof method !== 'function' || !ownProps.includes(key)) {
                // forward non-function properties and base class functions
                return target[key];
            }
            else if (config.subscriptionMethods) {
                if (config.subscriptionMethods.includes(key)) {
                    return default_empty_arg_1.defaultEmptyArg(method, false);
                }
            }
            return util_1.promisify(default_empty_arg_1.defaultEmptyArg(method));
        },
    });
}
exports.createServiceClient = createServiceClient;
