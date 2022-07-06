/// <reference types="node" />
import { Stream } from 'stream';
export declare class Readable<RES = any> extends Stream implements NodeJS.ReadableStream {
    readable: boolean;
    readonly readableHighWaterMark: number;
    readonly readableLength: number;
    constructor(opts?: ReadableOptions<RES>);
    _read(size: number): void;
    read(size?: number): string | Buffer;
    setEncoding(encoding: string): this;
    pause(): this;
    resume(): this;
    isPaused(): boolean;
    unpipe<T extends NodeJS.WritableStream>(destination?: T): this;
    unshift(chunk: string | Buffer): void;
    wrap(oldStream: NodeJS.ReadableStream): this;
    push(chunk: RES, encoding?: string): boolean;
    _destroy(error: Error | null, callback: (error: Error | null) => void): void;
    destroy(error?: Error): void;
    /**
     * Event emitter
     * The defined events on documents including:
     * 1. close
     * 2. data
     * 3. end
     * 4. readable
     * 5. error
     */
    addListener(event: 'close' | 'end' | 'readable', listener: () => void): this;
    addListener(event: 'data', listener: (chunk: RES) => void): this;
    addListener(event: 'error', listener: (err: Error) => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    emit(event: 'close' | 'end' | 'readable'): boolean;
    emit(event: 'data', chunk: RES): boolean;
    emit(event: 'error', err: Error): boolean;
    emit(event: string | symbol, ...args: any[]): boolean;
    on(event: 'close' | 'end' | 'readable', listener: () => void): this;
    on(event: 'data', listener: (chunk: RES) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: 'close' | 'end' | 'readable', listener: () => void): this;
    once(event: 'data', listener: (chunk: RES) => void): this;
    once(event: 'error', listener: (err: Error) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(event: 'close' | 'end' | 'readable', listener: () => void): this;
    prependListener(event: 'data', listener: (chunk: RES) => void): this;
    prependListener(event: 'error', listener: (err: Error) => void): this;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: 'close' | 'end' | 'readable', listener: () => void): this;
    prependOnceListener(event: 'data', listener: (chunk: RES) => void): this;
    prependOnceListener(event: 'error', listener: (err: Error) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: 'close' | 'end' | 'readable', listener: () => void): this;
    removeListener(event: 'data', listener: (chunk: RES) => void): this;
    removeListener(event: 'error', listener: (err: Error) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    [Symbol.asyncIterator](): AsyncIterableIterator<string | Buffer>;
}
export interface ReadableOptions<RES> {
    highWaterMark?: number;
    encoding?: string;
    objectMode?: boolean;
    read?(this: Readable<RES>, size: number): void;
    destroy?(this: Readable<RES>, error: Error | null, callback: (error: Error | null) => void): void;
}
