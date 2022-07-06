"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEmptyArg = void 0;
/**
 * Add an empty object as the first argument if no argument was passed
 * @param  {Function} func The function being called
 * @param  {boolean} hasCallback Whether or not the passed function has a callback
 * @return {any}
 */
function defaultEmptyArg(func, hasCallback) {
    if (hasCallback === void 0) { hasCallback = true; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length < (hasCallback ? 2 : 1)) {
            args.unshift({});
        }
        return func.apply(this, args);
    };
}
exports.defaultEmptyArg = defaultEmptyArg;
