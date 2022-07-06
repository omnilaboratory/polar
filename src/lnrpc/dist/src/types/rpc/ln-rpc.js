"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailureCode = exports.PaymentFailureReason = exports.NodeMetricType = exports.AnchorState = exports.CommitmentType = exports.ResolutionOutcome = exports.ResolutionType = exports.Initiator = exports.InvoiceHTLCState = exports.HTLCStatus = exports.TriggerCase = exports.ShimCase = exports.PeerEventType = exports.FeatureBit = exports.LimitCase = exports.PaymentStatus = exports.BackupCase = exports.InvoiceState = exports.ChannelCase = exports.UpdateType = exports.SyncType = exports.ClosureType = exports.AddressType = void 0;
var AddressType;
(function (AddressType) {
    AddressType[AddressType["WITNESS_PUBKEY_HASH_DISABLED"] = 0] = "WITNESS_PUBKEY_HASH_DISABLED";
    AddressType[AddressType["NESTED_PUBKEY_HASH_DISABLED"] = 1] = "NESTED_PUBKEY_HASH_DISABLED";
    AddressType[AddressType["PUBKEY"] = 2] = "PUBKEY";
    AddressType[AddressType["UNUSED_WITNESS_PUBKEY_HASH"] = 3] = "UNUSED_WITNESS_PUBKEY_HASH";
    AddressType[AddressType["UNUSED_NESTED_PUBKEY_HASH"] = 4] = "UNUSED_NESTED_PUBKEY_HASH";
})(AddressType = exports.AddressType || (exports.AddressType = {}));
var ClosureType;
(function (ClosureType) {
    ClosureType[ClosureType["COOPERATIVE_CLOSE"] = 0] = "COOPERATIVE_CLOSE";
    ClosureType[ClosureType["LOCAL_FORCE_CLOSE"] = 1] = "LOCAL_FORCE_CLOSE";
    ClosureType[ClosureType["REMOTE_FORCE_CLOSE"] = 2] = "REMOTE_FORCE_CLOSE";
    ClosureType[ClosureType["BREACH_CLOSE"] = 3] = "BREACH_CLOSE";
    ClosureType[ClosureType["FUNDING_CANCELED"] = 4] = "FUNDING_CANCELED";
    ClosureType[ClosureType["ABANDONED"] = 5] = "ABANDONED";
})(ClosureType = exports.ClosureType || (exports.ClosureType = {}));
var SyncType;
(function (SyncType) {
    SyncType[SyncType["UNKNOWN_SYNC"] = 0] = "UNKNOWN_SYNC";
    SyncType[SyncType["ACTIVE_SYNC"] = 1] = "ACTIVE_SYNC";
    SyncType[SyncType["PASSIVE_SYNC"] = 2] = "PASSIVE_SYNC";
})(SyncType = exports.SyncType || (exports.SyncType = {}));
var UpdateType;
(function (UpdateType) {
    UpdateType[UpdateType["OPEN_CHANNEL"] = 0] = "OPEN_CHANNEL";
    UpdateType[UpdateType["CLOSED_CHANNEL"] = 1] = "CLOSED_CHANNEL";
    UpdateType[UpdateType["ACTIVE_CHANNEL"] = 2] = "ACTIVE_CHANNEL";
    UpdateType[UpdateType["INACTIVE_CHANNEL"] = 3] = "INACTIVE_CHANNEL";
    UpdateType[UpdateType["PENDING_OPEN_CHANNEL"] = 4] = "PENDING_OPEN_CHANNEL";
})(UpdateType = exports.UpdateType || (exports.UpdateType = {}));
var ChannelCase;
(function (ChannelCase) {
    ChannelCase[ChannelCase["CHANNEL_NOT_SET"] = 0] = "CHANNEL_NOT_SET";
    ChannelCase[ChannelCase["OPEN_CHANNEL"] = 1] = "OPEN_CHANNEL";
    ChannelCase[ChannelCase["CLOSED_CHANNEL"] = 2] = "CLOSED_CHANNEL";
    ChannelCase[ChannelCase["ACTIVE_CHANNEL"] = 3] = "ACTIVE_CHANNEL";
    ChannelCase[ChannelCase["INACTIVE_CHANNEL"] = 4] = "INACTIVE_CHANNEL";
    ChannelCase[ChannelCase["PENDING_OPEN_CHANNEL"] = 6] = "PENDING_OPEN_CHANNEL";
})(ChannelCase = exports.ChannelCase || (exports.ChannelCase = {}));
var InvoiceState;
(function (InvoiceState) {
    InvoiceState[InvoiceState["OPEN"] = 0] = "OPEN";
    InvoiceState[InvoiceState["SETTLED"] = 1] = "SETTLED";
    InvoiceState[InvoiceState["CANCELED"] = 2] = "CANCELED";
    InvoiceState[InvoiceState["ACCEPTED"] = 3] = "ACCEPTED";
})(InvoiceState = exports.InvoiceState || (exports.InvoiceState = {}));
var BackupCase;
(function (BackupCase) {
    BackupCase[BackupCase["BACKUP_NOT_SET"] = 0] = "BACKUP_NOT_SET";
    BackupCase[BackupCase["CHAN_BACKUPS"] = 1] = "CHAN_BACKUPS";
    BackupCase[BackupCase["MULTI_CHAN_BACKUP"] = 2] = "MULTI_CHAN_BACKUP";
})(BackupCase = exports.BackupCase || (exports.BackupCase = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus[PaymentStatus["UNKNOWN"] = 0] = "UNKNOWN";
    PaymentStatus[PaymentStatus["IN_FLIGHT"] = 1] = "IN_FLIGHT";
    PaymentStatus[PaymentStatus["SUCCEEDED"] = 2] = "SUCCEEDED";
    PaymentStatus[PaymentStatus["FAILED"] = 3] = "FAILED";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
var LimitCase;
(function (LimitCase) {
    LimitCase[LimitCase["LIMIT_NOT_SET"] = 0] = "LIMIT_NOT_SET";
    LimitCase[LimitCase["FIXED"] = 1] = "FIXED";
    LimitCase[LimitCase["FIXED_MSAT"] = 3] = "FIXED_MSAT";
    LimitCase[LimitCase["PERCENT"] = 2] = "PERCENT";
})(LimitCase = exports.LimitCase || (exports.LimitCase = {}));
var FeatureBit;
(function (FeatureBit) {
    FeatureBit[FeatureBit["DATALOSS_PROTECT_REQ"] = 0] = "DATALOSS_PROTECT_REQ";
    FeatureBit[FeatureBit["DATALOSS_PROTECT_OPT"] = 1] = "DATALOSS_PROTECT_OPT";
    FeatureBit[FeatureBit["INITIAL_ROUING_SYNC"] = 3] = "INITIAL_ROUING_SYNC";
    FeatureBit[FeatureBit["UPFRONT_SHUTDOWN_SCRIPT_REQ"] = 4] = "UPFRONT_SHUTDOWN_SCRIPT_REQ";
    FeatureBit[FeatureBit["UPFRONT_SHUTDOWN_SCRIPT_OPT"] = 5] = "UPFRONT_SHUTDOWN_SCRIPT_OPT";
    FeatureBit[FeatureBit["GOSSIP_QUERIES_REQ"] = 6] = "GOSSIP_QUERIES_REQ";
    FeatureBit[FeatureBit["GOSSIP_QUERIES_OPT"] = 7] = "GOSSIP_QUERIES_OPT";
    FeatureBit[FeatureBit["TLV_ONION_REQ"] = 8] = "TLV_ONION_REQ";
    FeatureBit[FeatureBit["TLV_ONION_OPT"] = 9] = "TLV_ONION_OPT";
    FeatureBit[FeatureBit["EXT_GOSSIP_QUERIES_REQ"] = 10] = "EXT_GOSSIP_QUERIES_REQ";
    FeatureBit[FeatureBit["EXT_GOSSIP_QUERIES_OPT"] = 11] = "EXT_GOSSIP_QUERIES_OPT";
    FeatureBit[FeatureBit["STATIC_REMOTE_KEY_REQ"] = 12] = "STATIC_REMOTE_KEY_REQ";
    FeatureBit[FeatureBit["STATIC_REMOTE_KEY_OPT"] = 13] = "STATIC_REMOTE_KEY_OPT";
    FeatureBit[FeatureBit["PAYMENT_ADDR_REQ"] = 14] = "PAYMENT_ADDR_REQ";
    FeatureBit[FeatureBit["PAYMENT_ADDR_OPT"] = 15] = "PAYMENT_ADDR_OPT";
    FeatureBit[FeatureBit["MPP_REQ"] = 16] = "MPP_REQ";
    FeatureBit[FeatureBit["MPP_OPT"] = 17] = "MPP_OPT";
})(FeatureBit = exports.FeatureBit || (exports.FeatureBit = {}));
var PeerEventType;
(function (PeerEventType) {
    PeerEventType[PeerEventType["PEER_ONLINE"] = 0] = "PEER_ONLINE";
    PeerEventType[PeerEventType["PEER_OFFLINE"] = 1] = "PEER_OFFLINE";
})(PeerEventType = exports.PeerEventType || (exports.PeerEventType = {}));
var ShimCase;
(function (ShimCase) {
    ShimCase[ShimCase["SHIM_NOT_SET"] = 0] = "SHIM_NOT_SET";
    ShimCase[ShimCase["CHAN_POINT_SHIM"] = 1] = "CHAN_POINT_SHIM";
    ShimCase[ShimCase["PSBT_SHIM"] = 2] = "PSBT_SHIM";
})(ShimCase = exports.ShimCase || (exports.ShimCase = {}));
var TriggerCase;
(function (TriggerCase) {
    TriggerCase[TriggerCase["TRIGGER_NOT_SET"] = 0] = "TRIGGER_NOT_SET";
    TriggerCase[TriggerCase["SHIM_REGISTER"] = 1] = "SHIM_REGISTER";
    TriggerCase[TriggerCase["SHIM_CANCEL"] = 2] = "SHIM_CANCEL";
    TriggerCase[TriggerCase["PSBT_VERIFY"] = 3] = "PSBT_VERIFY";
    TriggerCase[TriggerCase["PSBT_FINALIZE"] = 4] = "PSBT_FINALIZE";
})(TriggerCase = exports.TriggerCase || (exports.TriggerCase = {}));
var HTLCStatus;
(function (HTLCStatus) {
    HTLCStatus[HTLCStatus["IN_FLIGHT"] = 0] = "IN_FLIGHT";
    HTLCStatus[HTLCStatus["SUCCEEDED"] = 1] = "SUCCEEDED";
    HTLCStatus[HTLCStatus["FAILED"] = 2] = "FAILED";
})(HTLCStatus = exports.HTLCStatus || (exports.HTLCStatus = {}));
var InvoiceHTLCState;
(function (InvoiceHTLCState) {
    InvoiceHTLCState[InvoiceHTLCState["ACCEPTED"] = 0] = "ACCEPTED";
    InvoiceHTLCState[InvoiceHTLCState["SETTLED"] = 1] = "SETTLED";
    InvoiceHTLCState[InvoiceHTLCState["CANCELED"] = 2] = "CANCELED";
})(InvoiceHTLCState = exports.InvoiceHTLCState || (exports.InvoiceHTLCState = {}));
var Initiator;
(function (Initiator) {
    Initiator[Initiator["INITIATOR_UNKNOWN"] = 0] = "INITIATOR_UNKNOWN";
    Initiator[Initiator["INITIATOR_LOCAL"] = 1] = "INITIATOR_LOCAL";
    Initiator[Initiator["INITIATOR_REMOTE"] = 2] = "INITIATOR_REMOTE";
    Initiator[Initiator["INITIATOR_BOTH"] = 3] = "INITIATOR_BOTH";
})(Initiator = exports.Initiator || (exports.Initiator = {}));
var ResolutionType;
(function (ResolutionType) {
    ResolutionType[ResolutionType["TYPE_UNKNOWN"] = 0] = "TYPE_UNKNOWN";
    ResolutionType[ResolutionType["ANCHOR"] = 1] = "ANCHOR";
    ResolutionType[ResolutionType["INCOMING_HTLC"] = 2] = "INCOMING_HTLC";
    ResolutionType[ResolutionType["OUTGOING_HTLC"] = 3] = "OUTGOING_HTLC";
    ResolutionType[ResolutionType["COMMIT"] = 4] = "COMMIT";
})(ResolutionType = exports.ResolutionType || (exports.ResolutionType = {}));
var ResolutionOutcome;
(function (ResolutionOutcome) {
    ResolutionOutcome[ResolutionOutcome["OUTCOME_UNKNOWN"] = 0] = "OUTCOME_UNKNOWN";
    ResolutionOutcome[ResolutionOutcome["CLAIMED"] = 1] = "CLAIMED";
    ResolutionOutcome[ResolutionOutcome["UNCLAIMED"] = 2] = "UNCLAIMED";
    ResolutionOutcome[ResolutionOutcome["ABANDONED"] = 3] = "ABANDONED";
    ResolutionOutcome[ResolutionOutcome["FIRST_STAGE"] = 4] = "FIRST_STAGE";
    ResolutionOutcome[ResolutionOutcome["TIMEOUT"] = 5] = "TIMEOUT";
})(ResolutionOutcome = exports.ResolutionOutcome || (exports.ResolutionOutcome = {}));
var CommitmentType;
(function (CommitmentType) {
    CommitmentType[CommitmentType["UNKNOWN_COMMITMENT_TYPE"] = 0] = "UNKNOWN_COMMITMENT_TYPE";
    CommitmentType[CommitmentType["LEGACY"] = 1] = "LEGACY";
    CommitmentType[CommitmentType["STATIC_REMOTE_KEY"] = 2] = "STATIC_REMOTE_KEY";
    CommitmentType[CommitmentType["ANCHORS"] = 3] = "ANCHORS";
    CommitmentType[CommitmentType["SCRIPT_ENFORCED_LEASE"] = 4] = "SCRIPT_ENFORCED_LEASE";
})(CommitmentType = exports.CommitmentType || (exports.CommitmentType = {}));
var AnchorState;
(function (AnchorState) {
    AnchorState[AnchorState["LIMBO"] = 0] = "LIMBO";
    AnchorState[AnchorState["RECOVERED"] = 1] = "RECOVERED";
    AnchorState[AnchorState["LOST"] = 2] = "LOST";
})(AnchorState = exports.AnchorState || (exports.AnchorState = {}));
var NodeMetricType;
(function (NodeMetricType) {
    NodeMetricType[NodeMetricType["UNKNOWN"] = 0] = "UNKNOWN";
    NodeMetricType[NodeMetricType["BETWEENNESS_CENTRALITY"] = 1] = "BETWEENNESS_CENTRALITY";
})(NodeMetricType = exports.NodeMetricType || (exports.NodeMetricType = {}));
var PaymentFailureReason;
(function (PaymentFailureReason) {
    PaymentFailureReason[PaymentFailureReason["FAILURE_REASON_NONE"] = 0] = "FAILURE_REASON_NONE";
    PaymentFailureReason[PaymentFailureReason["FAILURE_REASON_TIMEOUT"] = 1] = "FAILURE_REASON_TIMEOUT";
    PaymentFailureReason[PaymentFailureReason["FAILURE_REASON_NO_ROUTE"] = 2] = "FAILURE_REASON_NO_ROUTE";
    PaymentFailureReason[PaymentFailureReason["FAILURE_REASON_ERROR"] = 3] = "FAILURE_REASON_ERROR";
    PaymentFailureReason[PaymentFailureReason["FAILURE_REASON_INCORRECT_PAYMENT_DETAILS"] = 4] = "FAILURE_REASON_INCORRECT_PAYMENT_DETAILS";
    PaymentFailureReason[PaymentFailureReason["FAILURE_REASON_INSUFFICIENT_BALANCE"] = 5] = "FAILURE_REASON_INSUFFICIENT_BALANCE";
})(PaymentFailureReason = exports.PaymentFailureReason || (exports.PaymentFailureReason = {}));
var FailureCode;
(function (FailureCode) {
    FailureCode[FailureCode["RESERVED"] = 0] = "RESERVED";
    FailureCode[FailureCode["INCORRECT_OR_UNKNOWN_PAYMENT_DETAILS"] = 1] = "INCORRECT_OR_UNKNOWN_PAYMENT_DETAILS";
    FailureCode[FailureCode["INCORRECT_PAYMENT_AMOUNT"] = 2] = "INCORRECT_PAYMENT_AMOUNT";
    FailureCode[FailureCode["FINAL_INCORRECT_CLTV_EXPIRY"] = 3] = "FINAL_INCORRECT_CLTV_EXPIRY";
    FailureCode[FailureCode["FINAL_INCORRECT_HTLC_AMOUNT"] = 4] = "FINAL_INCORRECT_HTLC_AMOUNT";
    FailureCode[FailureCode["FINAL_EXPIRY_TOO_SOON"] = 5] = "FINAL_EXPIRY_TOO_SOON";
    FailureCode[FailureCode["INVALID_REALM"] = 6] = "INVALID_REALM";
    FailureCode[FailureCode["EXPIRY_TOO_SOON"] = 7] = "EXPIRY_TOO_SOON";
    FailureCode[FailureCode["INVALID_ONION_VERSION"] = 8] = "INVALID_ONION_VERSION";
    FailureCode[FailureCode["INVALID_ONION_HMAC"] = 9] = "INVALID_ONION_HMAC";
    FailureCode[FailureCode["INVALID_ONION_KEY"] = 10] = "INVALID_ONION_KEY";
    FailureCode[FailureCode["AMOUNT_BELOW_MINIMUM"] = 11] = "AMOUNT_BELOW_MINIMUM";
    FailureCode[FailureCode["FEE_INSUFFICIENT"] = 12] = "FEE_INSUFFICIENT";
    FailureCode[FailureCode["INCORRECT_CLTV_EXPIRY"] = 13] = "INCORRECT_CLTV_EXPIRY";
    FailureCode[FailureCode["CHANNEL_DISABLED"] = 14] = "CHANNEL_DISABLED";
    FailureCode[FailureCode["TEMPORARY_CHANNEL_FAILURE"] = 15] = "TEMPORARY_CHANNEL_FAILURE";
    FailureCode[FailureCode["REQUIRED_NODE_FEATURE_MISSING"] = 16] = "REQUIRED_NODE_FEATURE_MISSING";
    FailureCode[FailureCode["REQUIRED_CHANNEL_FEATURE_MISSING"] = 17] = "REQUIRED_CHANNEL_FEATURE_MISSING";
    FailureCode[FailureCode["UNKNOWN_NEXT_PEER"] = 18] = "UNKNOWN_NEXT_PEER";
    FailureCode[FailureCode["TEMPORARY_NODE_FAILURE"] = 19] = "TEMPORARY_NODE_FAILURE";
    FailureCode[FailureCode["PERMANENT_NODE_FAILURE"] = 20] = "PERMANENT_NODE_FAILURE";
    FailureCode[FailureCode["PERMANENT_CHANNEL_FAILURE"] = 21] = "PERMANENT_CHANNEL_FAILURE";
    FailureCode[FailureCode["EXPIRY_TOO_FAR"] = 22] = "EXPIRY_TOO_FAR";
    FailureCode[FailureCode["MPP_TIMEOUT"] = 23] = "MPP_TIMEOUT";
    FailureCode[FailureCode["INTERNAL_FAILURE"] = 997] = "INTERNAL_FAILURE";
    FailureCode[FailureCode["UNKNOWN_FAILURE"] = 998] = "UNKNOWN_FAILURE";
    FailureCode[FailureCode["UNREADABLE_FAILURE"] = 999] = "UNREADABLE_FAILURE";
})(FailureCode = exports.FailureCode || (exports.FailureCode = {}));
