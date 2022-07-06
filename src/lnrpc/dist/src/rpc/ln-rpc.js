'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createLnRpc = void 0;
var path_1 = require('path');
var pkg_dir_1 = __importDefault(require('pkg-dir'));
var package_json_1 = __importDefault(require('../../package.json'));
var services_1 = require('../services');
var create_credentials_1 = require('./create-credentials');
var create_grpc_object_1 = require('./create-grpc-object');
var defaults_1 = require('./defaults');
/**
 * Factory for a lnrpc instance & proxy responsible for:
 *  - Generating a GRPC Descriptor from user's config
 *  - Instantiating/exposing all GRPC Services
 *  - Resolving a proxy that:
 *    1.  Invokes all top-level method calls to the lightning
 *        proxy for user convience
 *    2.  Allow basic user property requests to all GRPC Services
 *
 * @param userConfig The user provided configuration details
 * @return Returns proxy to lnrpc instance
 */
function createLnRpc(userConfig) {
  return __awaiter(this, void 0, void 0, function () {
    var rootPath,
      lightningProtoFilePath,
      walletUnlockerProtoFilePath,
      config,
      lightning,
      walletUnlocker,
      server,
      grpcLoader,
      grpc,
      includeDefaults,
      credentials,
      lightningGrpcPkgObj,
      walletUnlockerGrpcPkgObj,
      lnrpc;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, pkg_dir_1.default(__dirname)];
        case 1:
          rootPath = _a.sent();
          lightningProtoFilePath = path_1.join(
            rootPath,
            'lnd/' +
              package_json_1.default.config['lnd-release-tag'] +
              '/lightning.proto',
          );
          walletUnlockerProtoFilePath = path_1.join(
            rootPath,
            'lnd/' +
              package_json_1.default.config['lnd-release-tag'] +
              '/walletunlocker.proto',
          );
          config = __assign(__assign({}, defaults_1.defaults), userConfig);
          (lightning = config.lightning),
            (walletUnlocker = config.walletUnlocker),
            (server = config.server),
            (grpcLoader = config.grpcLoader),
            (grpc = config.grpc),
            (includeDefaults = config.includeDefaults);
          return [4 /*yield*/, create_credentials_1.createCredentials(config)];
        case 2:
          credentials = _a.sent();
          lightningGrpcPkgObj = create_grpc_object_1.createGrpcObject({
            includeDefaults: includeDefaults,
            grpcLoader: grpcLoader,
            grpc: grpc,
            protoFilePath: lightningProtoFilePath,
          });
          walletUnlockerGrpcPkgObj = create_grpc_object_1.createGrpcObject({
            includeDefaults: includeDefaults,
            grpcLoader: grpcLoader,
            grpc: grpc,
            protoFilePath: walletUnlockerProtoFilePath,
          });
          lnrpc = Object.create(null, {
            description: { value: walletUnlockerGrpcPkgObj },
            lightning: {
              value:
                lightning ||
                services_1.createLightning({
                  server: server,
                  credentials: credentials,
                  grpcPkgObj: lightningGrpcPkgObj,
                }),
            },
            walletUnlocker: {
              value:
                walletUnlocker ||
                services_1.createWalletUnlocker({
                  server: server,
                  credentials: credentials,
                  grpcPkgObj: walletUnlockerGrpcPkgObj,
                }),
            },
          });
          return [
            2 /*return*/,
            new Proxy(lnrpc, {
              /**
               * Provide lop-level access to any lightning/walletUnlocker
               * methods, otherwise provide user with fallback value
               * @param  {lnrpc.Lightning} target
               * @param  {String}          key
               * @return {Any}
               */
              get: function (target, key) {
                if (typeof target.lightning[key] === 'function') {
                  return target.lightning[key].bind(target.lightning);
                } else if (typeof target.walletUnlocker[key] === 'function') {
                  return target.walletUnlocker[key].bind(target.walletUnlocker);
                } else {
                  return target[key]; // forward
                }
              },
            }),
          ];
      }
    });
  });
}
exports.createLnRpc = createLnRpc;
