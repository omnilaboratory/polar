"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SweepsCase = exports.WitnessType = void 0;
var WitnessType;
(function (WitnessType) {
    WitnessType[WitnessType["UNKNOWN_WITNESS"] = 0] = "UNKNOWN_WITNESS";
    WitnessType[WitnessType["COMMITMENT_TIME_LOCK"] = 1] = "COMMITMENT_TIME_LOCK";
    WitnessType[WitnessType["COMMITMENT_NO_DELAY"] = 2] = "COMMITMENT_NO_DELAY";
    WitnessType[WitnessType["COMMITMENT_REVOKE"] = 3] = "COMMITMENT_REVOKE";
    WitnessType[WitnessType["HTLC_OFFERED_REVOKE"] = 4] = "HTLC_OFFERED_REVOKE";
    WitnessType[WitnessType["HTLC_ACCEPTED_REVOKE"] = 5] = "HTLC_ACCEPTED_REVOKE";
    WitnessType[WitnessType["HTLC_OFFERED_TIMEOUT_SECOND_LEVEL"] = 6] = "HTLC_OFFERED_TIMEOUT_SECOND_LEVEL";
    WitnessType[WitnessType["HTLC_ACCEPTED_SUCCESS_SECOND_LEVEL"] = 7] = "HTLC_ACCEPTED_SUCCESS_SECOND_LEVEL";
    WitnessType[WitnessType["HTLC_OFFERED_REMOTE_TIMEOUT"] = 8] = "HTLC_OFFERED_REMOTE_TIMEOUT";
    WitnessType[WitnessType["HTLC_ACCEPTED_REMOTE_SUCCESS"] = 9] = "HTLC_ACCEPTED_REMOTE_SUCCESS";
    WitnessType[WitnessType["HTLC_SECOND_LEVEL_REVOKE"] = 10] = "HTLC_SECOND_LEVEL_REVOKE";
    WitnessType[WitnessType["WITNESS_KEY_HASH"] = 11] = "WITNESS_KEY_HASH";
    WitnessType[WitnessType["NESTED_WITNESS_KEY_HASH"] = 12] = "NESTED_WITNESS_KEY_HASH";
    WitnessType[WitnessType["COMMITMENT_ANCHOR"] = 13] = "COMMITMENT_ANCHOR";
})(WitnessType = exports.WitnessType || (exports.WitnessType = {}));
var SweepsCase;
(function (SweepsCase) {
    SweepsCase[SweepsCase["SWEEPS_NOT_SET"] = 0] = "SWEEPS_NOT_SET";
    SweepsCase[SweepsCase["TRANSACTION_DETAILS"] = 1] = "TRANSACTION_DETAILS";
    SweepsCase[SweepsCase["TRANSACTION_IDS"] = 2] = "TRANSACTION_IDS";
})(SweepsCase = exports.SweepsCase || (exports.SweepsCase = {}));
