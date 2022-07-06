/// <reference types="node" />
import { Writable, WritableOptions } from 'stream';
import { Readable, ReadableOptions } from './readable';
export declare class Duplex<REQ = any, RES = any> extends Readable<RES> implements Writable {
    writable: boolean;
    readonly writableHighWaterMark: number;
    readonly writableLength: number;
    constructor(opts?: DuplexOptions<REQ, RES>);
    _write(chunk: REQ, encoding: string, callback: (error?: Error | null) => void): void;
    _writev?(chunks: Array<{
        chunk: REQ;
        encoding: string;
    }>, callback: (error?: Error | null) => void): void;
    _destroy(error: Error | null, callback: (error: Error | null) => void): void;
    _final(callback: (error?: Error | null) => void): void;
    write(chunk: REQ, cb?: (error: Error | null | undefined) => void): boolean;
    write(chunk: REQ, encoding?: string, cb?: (error: Error | null | undefined) => void): boolean;
    setDefaultEncoding(encoding: string): this;
    end(cb?: () => void): void;
    end(chunk: REQ, cb?: () => void): void;
    end(chunk: REQ, encoding?: string, cb?: () => void): void;
    cork(): void;
    uncork(): void;
}
export interface DuplexOptions<REQ, RES> extends ReadableOptions<RES>, WritableOptions {
    allowHalfOpen?: boolean;
    readableObjectMode?: boolean;
    writableObjectMode?: boolean;
    read?(this: Duplex<REQ, RES>, size: number): void;
    write?(this: Duplex<REQ, RES>, chunk: REQ, encoding: string, callback: (error?: Error | null) => void): void;
    writev?(this: Duplex<REQ, RES>, chunks: Array<{
        chunk: REQ;
        encoding: string;
    }>, callback: (error?: Error | null) => void): void;
    final?(this: Duplex<REQ, RES>, callback: (error?: Error | null) => void): void;
    destroy?(this: Duplex<REQ, RES>, error: Error | null, callback: (error: Error | null) => void): void;
}
