/// <reference types="node" />
export interface AddTowerRequest {
    pubkey: Buffer | string;
    address?: string;
}
export interface RemoveTowerRequest {
    pubkey: Buffer | string;
    address?: string;
}
export interface ListTowersRequest {
    includeSessions?: boolean;
}
export interface TowerSession {
    numBackups: number;
    numPendingBackups: number;
    maxBackups: number;
    sweepSatPerByte: number;
}
export interface Tower {
    pubkey: Buffer | string;
    addresses: string;
    activeSessionCandidate: boolean;
    numSessions: number;
    sessions: TowerSession[];
}
export interface ListTowersResponse {
    towers: Tower[];
}
export interface GetTowerInfoRequest {
    pubkey: Buffer | string;
    includeSessions?: boolean;
}
export interface StatsResponse {
    numBackups: number;
    numPendingBackups: number;
    numFailedBackups: number;
    numSessionsAcquired: number;
    numSessionsExhausted: number;
}
export interface PolicyResponse {
    maxUpdates: number;
    sweepSatPerByte: number;
}
/**
 * LND WtClient gRPC API Client
 */
export interface WtClientRpc {
    addTower(args: AddTowerRequest): Promise<{}>;
    removeTower(args: RemoveTowerRequest): Promise<{}>;
    /**
     * listTowers returns the list of watchtowers registered with the client.
     */
    listTowers(args?: ListTowersRequest): Promise<ListTowersResponse>;
    /**
     * getTowerInfo retrieves information for a registered watchtower.
     */
    getTowerInfo(args: GetTowerInfoRequest): Promise<Tower>;
    /**
     * stats returns the in-memory statistics of the client since startup.
     */
    stats(args?: {}): Promise<StatsResponse>;
    /**
     * policy returns the active watchtower client policy configuration.
     */
    policy(args?: {}): Promise<PolicyResponse>;
}
