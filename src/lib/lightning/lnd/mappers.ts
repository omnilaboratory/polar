import { Channel, PendingChannel } from 'lnrpc/dist/src';
import { LightningNodeChannel } from 'lib/lightning/types';

const txid = (channelPoint: string) => channelPoint.split(':')[0];

export const mapOpenChannel = (chan: Channel): LightningNodeChannel => ({
  pending: false,
  uniqueId: txid(chan.channelPoint).slice(-12),
  channelPoint: chan.channelPoint,
  pubkey: chan.remotePubkey,
  capacity: chan.assetCapacity,
  localBalance: chan.localAssetBalance,
  remoteBalance: chan.remoteAssetBalance,
  status: 'Open',
  isPrivate: chan.private,
});

export const mapPendingChannel =
  (status: LightningNodeChannel['status']) =>
  (chan: PendingChannel): LightningNodeChannel => ({
    pending: true,
    uniqueId: txid(chan.channelPoint).slice(-12),
    channelPoint: chan.channelPoint,
    pubkey: chan.remoteNodePub,
    capacity: chan.assetCapacity,
    localBalance: chan.localBalance,
    remoteBalance: chan.remoteBalance,
    status,
    isPrivate: false,
  });
