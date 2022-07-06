"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCredentials = void 0;
var fs_1 = __importDefault(require("fs"));
var util_1 = require("util");
var readFile = util_1.promisify(fs_1.default.readFile);
/**
 * Generate grpc SSL credentials and combine with the macaroon
 * credentials if necessary.
 * @param config The rpc client configuration
 */
function createCredentials(config) {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, grpc, cert, certEncoding, tls, e_1, metadata_1, macaroon, _a, macaroonCredentials;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    grpc = config.grpc;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    cert = config.cert;
                    certEncoding = config.certEncoding, tls = config.tls;
                    if (!(!cert && tls)) return [3 /*break*/, 3];
                    return [4 /*yield*/, readFile(tls)];
                case 2:
                    cert = _b.sent();
                    _b.label = 3;
                case 3:
                    // Convert `cert` string to Buffer
                    if (cert && !Buffer.isBuffer(cert)) {
                        cert = Buffer.from(cert, certEncoding);
                    }
                    // Required for lnd SSL handshake when a cert is provided:
                    // (SSL_ERROR_SSL: error:14094410)
                    // More about GRPC environment variables here:
                    // https://grpc.io/grpc/core/md_doc_environment_variables.html
                    if (cert && !process.env.GRPC_SSL_CIPHER_SUITES) {
                        process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';
                    }
                    // NOTE: cert may be undefined at this point
                    // which is desirable for when certificate pinning
                    // is not necessary (i.e. BTCPayServer connection)
                    credentials = grpc.credentials.createSsl(cert);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    if (!e_1.code)
                        e_1.code = 'INVALID_SSL_CERT';
                    throw e_1;
                case 5:
                    if (!(config.macaroon || config.macaroonPath)) return [3 /*break*/, 8];
                    metadata_1 = new grpc.Metadata();
                    _a = config.macaroon;
                    if (_a) return [3 /*break*/, 7];
                    return [4 /*yield*/, readFile(config.macaroonPath)];
                case 6:
                    _a = (_b.sent());
                    _b.label = 7;
                case 7:
                    macaroon = _a;
                    // Add hex encoded macaroon
                    // to gRPC metadata
                    metadata_1.add('macaroon', Buffer.isBuffer(macaroon) ? macaroon.toString('hex') : macaroon);
                    macaroonCredentials = grpc.credentials.createFromMetadataGenerator(function (_, callback) {
                        callback(null, metadata_1);
                    });
                    // Update existing cert credentials by combining macaroon auth
                    // credentials such that every call is properly encrypted and
                    // authenticated
                    credentials = grpc.credentials.combineChannelCredentials(credentials, macaroonCredentials);
                    _b.label = 8;
                case 8: return [2 /*return*/, credentials];
            }
        });
    });
}
exports.createCredentials = createCredentials;
