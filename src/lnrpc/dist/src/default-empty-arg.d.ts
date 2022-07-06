/**
 * Add an empty object as the first argument if no argument was passed
 * @param  {Function} func The function being called
 * @param  {boolean} hasCallback Whether or not the passed function has a callback
 * @return {any}
 */
export declare function defaultEmptyArg(func: (...args: any[]) => any, hasCallback?: boolean): any;
