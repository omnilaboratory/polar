import { debug } from 'electron-log';
import * as LND from '@radar/lnrpc';
import { LightningNode, LndNode, OpenChannelOptions } from 'shared/types';
import * as PLN from 'lib/lightning/types';
import { LightningService } from 'types';
import { waitFor } from 'utils/async';
import { lndProxyClient as proxy } from './';
import { mapOpenChannel, mapPendingChannel } from './mappers';

class LndService implements LightningService {
  async getInfo(node: LightningNode): Promise<PLN.LightningNodeInfo> {
    const info = await proxy.getInfo(this.cast(node));
    return {
      pubkey: info.identityPubkey,
      alias: info.alias,
      rpcUrl: (info.uris && info.uris[0]) || '',
      syncedToChain: info.syncedToChain,
      blockHeight: info.blockHeight,
      numActiveChannels: info.numActiveChannels,
      numPendingChannels: info.numPendingChannels,
      numInactiveChannels: info.numInactiveChannels,
    };
  }

  async getBalances(node: LightningNode): Promise<PLN.LightningNodeBalances> {
    const balances = await proxy.getWalletBalance(this.cast(node));
    return {
      total: balances.totalBalance,
      confirmed: balances.confirmedBalance,
      unconfirmed: balances.unconfirmedBalance,
    };
  }

  async getNewAddress(
    node: LightningNode,
    addressType: number,
  ): Promise<PLN.LightningNodeAddress> {
    const req: LND.NewAddressRequest = {
      type: addressType,
    };
    return await proxy.getNewAddress(this.cast(node), req);
  }

  async getChannels(node: LightningNode): Promise<PLN.LightningNodeChannel[]> {
    const { channels: open } = await proxy.listChannels(this.cast(node), {});
    const {
      pendingOpenChannels: opening,
      pendingClosingChannels: closing,
      pendingForceClosingChannels: forceClosing,
      waitingCloseChannels: waitingClose,
    } = await proxy.pendingChannels(this.cast(node));

    const pluckChan = (c: any) => c.channel as LND.PendingChannel;
    // merge all of the channel types into one array
    return [
      ...open.filter(c => c.initiator).map(mapOpenChannel),
      ...opening.map(pluckChan).map(mapPendingChannel('Opening')),
      ...closing.map(pluckChan).map(mapPendingChannel('Closing')),
      ...forceClosing.map(pluckChan).map(mapPendingChannel('Force Closing')),
      ...waitingClose.map(pluckChan).map(mapPendingChannel('Waiting to Close')),
    ];
  }

  async getPeers(node: LightningNode): Promise<PLN.LightningNodePeer[]> {
    const { peers } = await proxy.listPeers(this.cast(node));
    return peers.map(p => ({
      pubkey: p.pubKey,
      address: p.address,
    }));
  }

  async connectPeers(node: LightningNode, rpcUrls: string[]): Promise<void> {
    const peers = await this.getPeers(node);
    const keys = peers.map(p => p.pubkey);
    const newUrls = rpcUrls.filter(u => !keys.includes(u.split('@')[0]));
    for (const toRpcUrl of newUrls) {
      try {
        const [toPubKey, host] = toRpcUrl.split('@');
        const addr: LND.LightningAddress = { pubkey: toPubKey, host };
        await proxy.connectPeer(this.cast(node), { addr });
      } catch (error: any) {
        debug(
          `Failed to connect peer '${toRpcUrl}' to LND node ${node.name}:`,
          error.message,
        );
      }
    }
  }

  async openChannel({
    from,
    toRpcUrl,
    amount,
    isPrivate,
    assetId,
    assetAmount,
  }: OpenChannelOptions): Promise<PLN.LightningNodeChannelPoint> {
    const lndFrom = this.cast(from);

    // add peer if not connected already
    await this.connectPeers(lndFrom, [toRpcUrl]);
    // get pubkey of dest node
    const [toPubKey] = toRpcUrl.split('@');

    // open channel
    const req: LND.OpenChannelRequest = {
      nodePubkeyString: toPubKey,
      localFundingBtcAmount: amount,
      private: isPrivate,
      assetId: assetId,
      localFundingAssetAmount: assetAmount,
    };
    const res = await proxy.openChannel(lndFrom, req);
    return {
      txid: res.fundingTxidStr as string,
      index: res.outputIndex,
    };
  }

  async closeChannel(node: LightningNode, channelPoint: string): Promise<any> {
    const [txid, txindex] = channelPoint.split(':');
    const req: LND.CloseChannelRequest = {
      channelPoint: {
        fundingTxidBytes: Buffer.from(txid),
        fundingTxidStr: txid,
        outputIndex: parseInt(txindex),
      },
    };
    return await proxy.closeChannel(this.cast(node), req);
  }

  async createInvoice(
    node: LightningNode,
    amount: number,
    memo?: string,
  ): Promise<string> {
    const req: LND.Invoice = {
      value: amount.toString(),
      memo,
    };
    const res = await proxy.createInvoice(this.cast(node), req);
    return res.paymentRequest;
  }

  async payInvoice(
    node: LightningNode,
    invoice: string,
    amount?: number,
  ): Promise<PLN.LightningNodePayReceipt> {
    const req: LND.SendRequest = {
      paymentRequest: invoice,
      amt: amount ? amount.toString() : undefined,
    };
    const res = await proxy.payInvoice(this.cast(node), req);
    // handle errors manually
    if (res.paymentError) throw new Error(res.paymentError);

    const payReq = await proxy.decodeInvoice(this.cast(node), { payReq: invoice });

    return {
      amount: parseInt(payReq.numSatoshis),
      preimage: res.paymentPreimage.toString(),
      destination: payReq.destination,
    };
  }

  /**
   * Helper function to continually query the LND node until a successful
   * response is received or it times out
   */
  async waitUntilOnline(
    node: LightningNode,
    interval = 3 * 1000, // check every 3 seconds
    timeout = 120 * 1000, // timeout after 120 seconds
  ): Promise<void> {
    return waitFor(
      async () => {
        await this.getInfo(node);
      },
      interval,
      timeout,
    );
  }

  private cast(node: LightningNode): LndNode {
    // if (node.implementation !== 'LND')
    //   throw new Error(`LndService cannot be used for '${node.implementation}' nodes`);

    return node as LndNode;
  }
}

export default new LndService();
