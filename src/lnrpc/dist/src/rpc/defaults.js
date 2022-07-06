"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
var grpc = __importStar(require("@grpc/grpc-js"));
var grpcLoader = __importStar(require("@grpc/proto-loader"));
var os_1 = __importDefault(require("os"));
var homeDir = os_1.default.homedir();
// RPC client shared default values
exports.defaults = {
    grpc: grpc,
    grpcLoader: grpcLoader,
    server: 'localhost:10001',
    macaroonPath: '',
    certEncoding: 'utf8',
    tls: /^darwin/.test(process.platform) // is macOS?
        ? homeDir + "/Library/Application Support/Lnd/tls.cert"
        : homeDir + "/.lnd/tls.cert",
};
