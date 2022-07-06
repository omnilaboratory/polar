"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWtClientRpc = exports.createWatchtowerRpc = exports.createWalletRpc = exports.createSignRpc = exports.createRouterRpc = exports.createLnRpc = exports.createInvoicesRpc = exports.createChainRpc = exports.createAutopilotRpc = void 0;
var rpc_1 = require("./rpc");
__exportStar(require("./types"), exports);
var rpc_2 = require("./rpc");
Object.defineProperty(exports, "createAutopilotRpc", { enumerable: true, get: function () { return rpc_2.createAutopilotRpc; } });
Object.defineProperty(exports, "createChainRpc", { enumerable: true, get: function () { return rpc_2.createChainRpc; } });
Object.defineProperty(exports, "createInvoicesRpc", { enumerable: true, get: function () { return rpc_2.createInvoicesRpc; } });
Object.defineProperty(exports, "createLnRpc", { enumerable: true, get: function () { return rpc_2.createLnRpc; } });
Object.defineProperty(exports, "createRouterRpc", { enumerable: true, get: function () { return rpc_2.createRouterRpc; } });
Object.defineProperty(exports, "createSignRpc", { enumerable: true, get: function () { return rpc_2.createSignRpc; } });
Object.defineProperty(exports, "createWalletRpc", { enumerable: true, get: function () { return rpc_2.createWalletRpc; } });
Object.defineProperty(exports, "createWatchtowerRpc", { enumerable: true, get: function () { return rpc_2.createWatchtowerRpc; } });
Object.defineProperty(exports, "createWtClientRpc", { enumerable: true, get: function () { return rpc_2.createWtClientRpc; } });
exports.default = rpc_1.createLnRpc;
