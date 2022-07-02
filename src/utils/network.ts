import { debug } from 'electron-log';
import { copy, writeFile } from 'fs-extra';
import { basename, join } from 'path';
import { IChart } from '@mrblenny/react-flow-chart';
import detectPort from 'detect-port';
import { tmpdir } from 'os';
import { ipcChannels } from 'shared';
import {
  BitcoinNode,
  CLightningNode,
  CommonNode,
  EclairNode,
  LightningNode,
  LndNode,
  NodeImplementation,
  Status,
} from 'shared/types';
import { createIpcSender } from 'lib/ipc/ipcService';
import {
  CustomImage,
  DockerRepoImage,
  DockerRepoState,
  ManagedImage,
  Network,
} from 'types';
import { dataPath, networksPath, nodePath } from './config';
import { BasePorts, DOCKER_REPO, dockerConfigs } from './constants';
import { read, rm } from './files';
import { getName } from './names';
import { range } from './numbers';
import { isVersionCompatible } from './strings';
import { getPolarPlatform } from './system';
import { prefixTranslation } from './translate';

const { l } = prefixTranslation('utils.network');

export const getContainerName = (node: CommonNode) =>
  `polar-n${node.networkId}-${node.name}`;

const groupNodes = (network: Network) => {
  const { bitcoin, lightning } = network.nodes;
  return {
    bitcoind: bitcoin.filter(n => n.implementation === 'bitcoind') as BitcoinNode[],
    omnicored: bitcoin.filter(n => n.implementation === 'omnicored') as BitcoinNode[],
    lnd: lightning.filter(n => n.implementation === 'LND') as LndNode[],
    obd: lightning.filter(n => n.implementation === 'obd') as LndNode[],
    clightning: lightning.filter(
      n => n.implementation === 'c-lightning',
    ) as CLightningNode[],
    eclair: lightning.filter(n => n.implementation === 'eclair') as EclairNode[],
  };
};

export const getImageCommand = (
  images: ManagedImage[],
  implementation: NodeImplementation,
  version: string,
): string => {
  const image = images.find(
    i => i.implementation === implementation && i.version === version,
  );
  if (!image) {
    throw new Error(
      `Unable to set docker image command for ${implementation} v${version}`,
    );
  }
  return image.command;
};

// long path games
export const getLndFilePaths = (name: string, network: Network) => {
  // returns /volumes/lnd/lnd-1
  const lndDataPath = (name: string) => nodePath(network, 'LND', name);
  // returns /volumes/lnd/lnd-1/tls.cert
  const lndCertPath = (name: string) => join(lndDataPath(name), 'tls.cert');
  // returns /data/chain/bitcoin/regtest
  const macaroonPath = join('data', 'chain', 'bitcoin', 'regtest');
  // returns /volumes/lnd/lnd-1/data/chain/bitcoin/regtest/admin.macaroon
  const lndMacaroonPath = (name: string, macaroon: string) =>
    join(lndDataPath(name), macaroonPath, `${macaroon}.macaroon`);

  return {
    tlsCert: lndCertPath(name),
    adminMacaroon: lndMacaroonPath(name, 'admin'),
    invoiceMacaroon: lndMacaroonPath(name, 'invoice'),
    readonlyMacaroon: lndMacaroonPath(name, 'readonly'),
  };
};

export const getObdFilePaths = (name: string, network: Network) => {
  // returns /volumes/lnd/lnd-1
  const obdDataPath = (name: string) => nodePath(network, 'obd', name);
  // returns /volumes/lnd/lnd-1/tls.cert
  const obdCertPath = (name: string) => join(obdDataPath(name), 'tls.cert');
  // returns /data/chain/bitcoin/regtest
  const macaroonPath = join('data', 'chain', 'bitcoin', 'regtest');
  // returns /volumes/lnd/lnd-1/data/chain/bitcoin/regtest/admin.macaroon
  const obdMacaroonPath = (name: string, macaroon: string) =>
    join(obdDataPath(name), macaroonPath, `${macaroon}.macaroon`);

  return {
    tlsCert: obdCertPath(name),
    adminMacaroon: obdMacaroonPath(name, 'admin'),
    invoiceMacaroon: obdMacaroonPath(name, 'invoice'),
    readonlyMacaroon: obdMacaroonPath(name, 'readonly'),
  };
};

export const getCLightningFilePaths = (name: string, network: Network) => {
  const path = nodePath(network, 'c-lightning', name);
  return {
    macaroon: join(path, 'rest-api', 'access.macaroon'),
  };
};

export const filterCompatibleBackends = (
  implementation: LightningNode['implementation'],
  version: string,
  compatibility: DockerRepoImage['compatibility'],
  backends: BitcoinNode[],
): BitcoinNode[] => {
  // if compatibility is not defined, then allow all backend versions
  if (!compatibility || !compatibility[version]) return backends;
  const requiredVersion = compatibility[version];
  const compatibleBackends = backends.filter(n =>
    isVersionCompatible(n.version, requiredVersion),
  );
  if (compatibleBackends.length === 0) {
    throw new Error(
      l('backendCompatError', { requiredVersion, implementation, version }),
    );
  }
  return compatibleBackends;
};

export const createLndNetworkNode = (
  network: Network,
  version: string,
  compatibility: DockerRepoImage['compatibility'],
  docker: CommonNode['docker'],
  status = Status.Stopped,
): LndNode => {
  const { bitcoin, lightning } = network.nodes;
  const implementation: LndNode['implementation'] = 'LND';
  const backends = filterCompatibleBackends(
    implementation,
    version,
    compatibility,
    bitcoin,
  );
  const id = lightning.length ? Math.max(...lightning.map(n => n.id)) + 1 : 0;
  const name = getName(id);
  return {
    id,
    networkId: network.id,
    name: name,
    type: 'lightning',
    implementation,
    version,
    status,
    // alternate between backend nodes
    backendName: backends[id % backends.length].name,
    paths: getLndFilePaths(name, network),
    ports: {
      rest: BasePorts.LND.rest + id,
      grpc: BasePorts.LND.grpc + id,
      p2p: BasePorts.LND.p2p + id,
    },
    docker,
  };
};

export const createObdNetworkNode = (
  network: Network,
  version: string,
  compatibility: DockerRepoImage['compatibility'],
  docker: CommonNode['docker'],
  status = Status.Stopped,
): LndNode => {
  const { bitcoin, lightning } = network.nodes;
  const implementation: LndNode['implementation'] = 'obd';
  const backends = filterCompatibleBackends(
    implementation,
    version,
    compatibility,
    bitcoin,
  );
  const id = lightning.length ? Math.max(...lightning.map(n => n.id)) + 1 : 0;
  const name = getName(id);
  return {
    id,
    networkId: network.id,
    name: name,
    type: 'lightning',
    implementation,
    version,
    status,
    // alternate between backend nodes
    backendName: backends[id % backends.length].name,
    paths: getObdFilePaths(name, network),
    ports: {
      rest: BasePorts.obd.rest + id,
      grpc: BasePorts.obd.grpc + id,
      p2p: BasePorts.obd.p2p + id,
    },
    docker,
  };
};

export const createCLightningNetworkNode = (
  network: Network,
  version: string,
  compatibility: DockerRepoImage['compatibility'],
  docker: CommonNode['docker'],
  status = Status.Stopped,
): CLightningNode => {
  const { bitcoin, lightning } = network.nodes;
  const implementation: LndNode['implementation'] = 'c-lightning';
  const backends = filterCompatibleBackends(
    implementation,
    version,
    compatibility,
    bitcoin,
  );
  const id = lightning.length ? Math.max(...lightning.map(n => n.id)) + 1 : 0;
  const name = getName(id);
  return {
    id,
    networkId: network.id,
    name,
    type: 'lightning',
    implementation: 'c-lightning',
    version,
    status,
    // alternate between backend nodes
    backendName: backends[id % backends.length].name,
    paths: getCLightningFilePaths(name, network),
    ports: {
      rest: BasePorts['c-lightning'].rest + id,
      p2p: BasePorts['c-lightning'].p2p + id,
    },
    docker,
  };
};

export const createEclairNetworkNode = (
  network: Network,
  version: string,
  compatibility: DockerRepoImage['compatibility'],
  docker: CommonNode['docker'],
  status = Status.Stopped,
): EclairNode => {
  const { bitcoin, lightning } = network.nodes;
  const implementation: EclairNode['implementation'] = 'eclair';
  const backends = filterCompatibleBackends(
    implementation,
    version,
    compatibility,
    bitcoin,
  );
  const id = lightning.length ? Math.max(...lightning.map(n => n.id)) + 1 : 0;
  const name = getName(id);
  return {
    id,
    networkId: network.id,
    name: name,
    type: 'lightning',
    implementation,
    version,
    status,
    // alternate between backend nodes
    backendName: backends[id % backends.length].name,
    ports: {
      rest: BasePorts.eclair.rest + id,
      p2p: BasePorts.eclair.p2p + id,
    },
    docker,
  };
};

export const createBitcoindNetworkNode = (
  network: Network,
  version: string,
  docker: CommonNode['docker'],
  status = Status.Stopped,
): BitcoinNode => {
  const { bitcoin } = network.nodes;
  const id = bitcoin.length ? Math.max(...bitcoin.map(n => n.id)) + 1 : 0;

  const name = `backend${id + 1}`;
  const node: BitcoinNode = {
    id,
    networkId: network.id,
    name: name,
    type: 'bitcoin',
    implementation: 'bitcoind',
    version,
    peers: [],
    status,
    ports: {
      rpc: BasePorts.bitcoind.rest + id,
      p2p: BasePorts.bitcoind.p2p + id,
      zmqBlock: BasePorts.bitcoind.zmqBlock + id,
      zmqTx: BasePorts.bitcoind.zmqTx + id,
    },
    docker,
  };

  // peer up with the previous node on both sides
  if (bitcoin.length > 0) {
    const prev = bitcoin[bitcoin.length - 1];
    node.peers.push(prev.name);
    prev.peers.push(node.name);
  }

  return node;
};

export const createOmnicoredNetworkNode = (
  network: Network,
  version: string,
  docker: CommonNode['docker'],
  status = Status.Stopped,
): BitcoinNode => {
  const { bitcoin } = network.nodes;
  const id = bitcoin.length ? Math.max(...bitcoin.map(n => n.id)) + 1 : 0;

  const name = `omnicored${id + 1}`;
  const node: BitcoinNode = {
    id,
    networkId: network.id,
    name: name,
    type: 'bitcoin',
    implementation: 'omnicored',
    version,
    peers: [],
    status,
    ports: {
      rpc: BasePorts.omnicored.rest + id,
      p2p: BasePorts.omnicored.p2p + id,
      zmqBlock: BasePorts.omnicored.zmqBlock + id,
      zmqTx: BasePorts.omnicored.zmqTx + id,
    },
    docker,
  };

  // peer up with the previous node on both sides
  if (bitcoin.length > 0) {
    const prev = bitcoin[bitcoin.length - 1];
    node.peers.push(prev.name);
    prev.peers.push(node.name);
  }

  return node;
};

export const createNetwork = (config: {
  id: number;
  name: string;
  lndNodes: number;
  obdNodes: number;
  clightningNodes: number;
  eclairNodes: number;
  bitcoindNodes: number;
  omnicoredNodes: number;
  repoState: DockerRepoState;
  managedImages: ManagedImage[];
  customImages: { image: CustomImage; count: number }[];
  status?: Status;
}): Network => {
  const {
    id,
    name,
    lndNodes,
    obdNodes,
    clightningNodes,
    eclairNodes,
    bitcoindNodes,
    omnicoredNodes,
    repoState,
    managedImages,
    customImages,
  } = config;
  // need explicit undefined check because Status.Starting is 0
  const status = config.status !== undefined ? config.status : Status.Stopped;

  const network: Network = {
    id: id,
    name,
    status,
    path: join(networksPath, id.toString()),
    nodes: {
      bitcoin: [],
      lightning: [],
    },
  };

  const { bitcoin, lightning } = network.nodes;
  const dockerWrap = (command: string) => ({ image: '', command });

  // add custom bitcoin nodes
  customImages
    .filter(i => i.image.implementation === 'bitcoind')
    .forEach(i => {
      const version = repoState.images.bitcoind.latest;
      const docker = { image: i.image.dockerImage, command: i.image.command };
      range(i.count).forEach(() => {
        bitcoin.push(createBitcoindNetworkNode(network, version, docker, status));
      });
    });

  // add managed bitcoin nodes
  range(bitcoindNodes).forEach(() => {
    let version = repoState.images.bitcoind.latest;
    if (lndNodes > 0) {
      const compat = repoState.images.LND.compatibility as Record<string, string>;
      version = compat[repoState.images.LND.latest];
    }
    const cmd = getImageCommand(managedImages, 'bitcoind', version);
    bitcoin.push(createBitcoindNetworkNode(network, version, dockerWrap(cmd), status));
  });

  // add custom omnicored nodes
  customImages
    .filter(i => i.image.implementation === 'omnicored')
    .forEach(i => {
      const version = repoState.images.omnicored.latest;
      const docker = { image: i.image.dockerImage, command: i.image.command };
      range(i.count).forEach(() => {
        bitcoin.push(createOmnicoredNetworkNode(network, version, docker, status));
      });
    });

  // add managed omnicored nodes
  range(omnicoredNodes).forEach(() => {
    let version = repoState.images.omnicored.latest;
    if (obdNodes > 0) {
      const compat = repoState.images.obd.compatibility as Record<string, string>;
      version = compat[repoState.images.obd.latest];
    }
    const cmd = getImageCommand(managedImages, 'omnicored', version);
    bitcoin.push(createOmnicoredNetworkNode(network, version, dockerWrap(cmd), status));
  });

  // add custom lightning nodes
  customImages
    .filter(i => ['LND', 'c-lightning', 'eclair', 'obd'].includes(i.image.implementation))
    .forEach(({ image, count }) => {
      const { latest, compatibility } = repoState.images.LND;
      const docker = { image: image.dockerImage, command: image.command };
      const createFunc =
        image.implementation === 'LND'
          ? createLndNetworkNode
          : image.implementation === 'obd'
          ? createObdNetworkNode
          : image.implementation === 'c-lightning'
          ? createCLightningNetworkNode
          : createEclairNetworkNode;
      range(count).forEach(() => {
        lightning.push(createFunc(network, latest, compatibility, docker, status));
      });
    });

  // add lightning nodes in an alternating pattern
  range(Math.max(lndNodes, obdNodes, clightningNodes, eclairNodes)).forEach(i => {
    if (i < lndNodes) {
      const { latest, compatibility } = repoState.images.LND;
      const cmd = getImageCommand(managedImages, 'LND', latest);
      lightning.push(
        createLndNetworkNode(network, latest, compatibility, dockerWrap(cmd), status),
      );
    }
    if (i < obdNodes) {
      const { latest, compatibility } = repoState.images.obd;
      const cmd = getImageCommand(managedImages, 'obd', latest);
      lightning.push(
        createObdNetworkNode(network, latest, compatibility, dockerWrap(cmd), status),
      );
    }
    if (i < clightningNodes) {
      const { latest, compatibility } = repoState.images['c-lightning'];
      const cmd = getImageCommand(managedImages, 'c-lightning', latest);
      lightning.push(
        createCLightningNetworkNode(
          network,
          latest,
          compatibility,
          dockerWrap(cmd),
          status,
        ),
      );
    }
    if (i < eclairNodes) {
      const { latest, compatibility } = repoState.images.eclair;
      const cmd = getImageCommand(managedImages, 'eclair', latest);
      lightning.push(
        createEclairNetworkNode(network, latest, compatibility, dockerWrap(cmd), status),
      );
    }
  });

  return network;
};

/**
 * Returns the images needed to start a network that are not included in the list
 * of images already pulled
 * @param network the network to check
 * @param pulled the list of images already pulled
 */
export const getMissingImages = (network: Network, pulled: string[]): string[] => {
  const { bitcoin, lightning } = network.nodes;
  const neededImages = [...bitcoin, ...lightning].map(n => {
    // use the custom image name if specified
    if (n.docker.image) return n.docker.image;
    // convert implementation to image name: LND -> lnd, c-lightning -> clightning
    const impl = n.implementation.toLocaleLowerCase().replace(/-/g, '');
    return `${DOCKER_REPO}/${impl}:${n.version}`;
  });
  // exclude images already pulled
  const missing = neededImages.filter(i => !pulled.includes(i));
  // filter out duplicates
  const unique = missing.filter((image, index) => missing.indexOf(image) === index);
  if (unique.length)
    debug(`The network '${network.name}' is missing docker images`, unique);
  return unique;
};

/**
 * Checks a range of port numbers to see if they are open on the current operating system.
 * Returns a new array of port numbers that are confirmed available
 * @param requestedPorts the ports to check for availability. ** must be in ascending order
 *
 * @example if port 10002 is in use
 * getOpenPortRange([10001, 10002, 10003]) -> [10001, 10004, 10005]
 */
export const getOpenPortRange = async (requestedPorts: number[]): Promise<number[]> => {
  const openPorts: number[] = [];

  for (let port of requestedPorts) {
    if (openPorts.length) {
      // adjust to check after the previous open port if necessary, since the last
      // open port may have increased
      const lastOpenPort = openPorts[openPorts.length - 1];
      if (port <= lastOpenPort) {
        port = lastOpenPort + 1;
      }
    }
    openPorts.push(await detectPort(port));
  }
  return openPorts;
};

export interface OpenPorts {
  [key: string]: {
    rpc?: number;
    grpc?: number;
    rest?: number;
    zmqBlock?: number;
    zmqTx?: number;
    p2p?: number;
  };
}

/**
 * Checks if the ports specified on the nodes are available on the host OS. If not,
 * return new ports that are confirmed available
 * @param network the network with nodes to verify ports of
 */
export const getOpenPorts = async (network: Network): Promise<OpenPorts | undefined> => {
  const ports: OpenPorts = {};

  // filter out nodes that are already started since their ports are in use by themselves
  const bitcoin = network.nodes.bitcoin.filter(n => n.status !== Status.Started);
  if (bitcoin.length) {
    let existingPorts = bitcoin.map(n => n.ports.rpc);
    let openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[bitcoin[index].name] = { rpc: port };
      });
    }

    existingPorts = bitcoin.map(n => n.ports.p2p);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[bitcoin[index].name] = {
          ...(ports[bitcoin[index].name] || {}),
          p2p: port,
        };
      });
    }

    existingPorts = bitcoin.map(n => n.ports.zmqBlock);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[bitcoin[index].name] = {
          ...(ports[bitcoin[index].name] || {}),
          zmqBlock: port,
        };
      });
    }

    existingPorts = bitcoin.map(n => n.ports.zmqTx);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[bitcoin[index].name] = {
          ...(ports[bitcoin[index].name] || {}),
          zmqTx: port,
        };
      });
    }
  }

  let { lnd, obd, clightning, eclair } = groupNodes(network);

  // filter out nodes that are already started since their ports are in use by themselves
  lnd = lnd.filter(n => n.status !== Status.Started);
  if (lnd.length) {
    let existingPorts = lnd.map(n => n.ports.grpc);
    let openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[lnd[index].name] = { grpc: port };
      });
    }

    existingPorts = lnd.map(n => n.ports.rest);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[lnd[index].name] = {
          ...(ports[lnd[index].name] || {}),
          rest: port,
        };
      });
    }

    existingPorts = lnd.map(n => n.ports.p2p);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[lnd[index].name] = {
          ...(ports[lnd[index].name] || {}),
          p2p: port,
        };
      });
    }
  }

  obd = obd.filter(n => n.status !== Status.Started);
  if (obd.length) {
    let existingPorts = obd.map(n => n.ports.grpc);
    let openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[lnd[index].name] = { grpc: port };
      });
    }

    existingPorts = obd.map(n => n.ports.rest);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[lnd[index].name] = {
          ...(ports[lnd[index].name] || {}),
          rest: port,
        };
      });
    }

    existingPorts = obd.map(n => n.ports.p2p);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[lnd[index].name] = {
          ...(ports[lnd[index].name] || {}),
          p2p: port,
        };
      });
    }
  }

  clightning = clightning.filter(n => n.status !== Status.Started);
  if (clightning.length) {
    let existingPorts = clightning.map(n => n.ports.rest);
    let openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[clightning[index].name] = { rest: port };
      });
    }

    existingPorts = clightning.map(n => n.ports.p2p);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[clightning[index].name] = {
          ...(ports[clightning[index].name] || {}),
          p2p: port,
        };
      });
    }
  }

  eclair = eclair.filter(n => n.status !== Status.Started);
  if (eclair.length) {
    let existingPorts = eclair.map(n => n.ports.rest);
    let openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[eclair[index].name] = { rest: port };
      });
    }

    existingPorts = eclair.map(n => n.ports.p2p);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[eclair[index].name] = {
          ...(ports[eclair[index].name] || {}),
          p2p: port,
        };
      });
    }
  }

  // return undefined if no ports where updated
  return Object.keys(ports).length > 0 ? ports : undefined;
};

/**
 * Validates that an object is a valid network
 * @param value the object to validate
 */
const isNetwork = (value: any): value is Network => {
  return (
    typeof value === 'object' &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.status === 'number' &&
    typeof value.path === 'string' &&
    typeof value.nodes === 'object'
  );
};

/**
 * Validates that an object is a valid network chart
 * @param value the object to validate
 */
const isChart = (value: any): value is IChart =>
  typeof value === 'object' &&
  typeof value.offset === 'object' &&
  typeof value.nodes === 'object' &&
  typeof value.links === 'object' &&
  typeof value.selected === 'object' &&
  typeof value.hovered === 'object';

/**
 * Imports a network from a given zip file path
 * @param zipPath the path to the zip file
 * @param id the network id to assign to the parsed network
 */
export const importNetworkFromZip = async (
  zipPath: string,
  id: number,
): Promise<[Network, IChart]> => {
  // extract zip to a temp folder first
  const tmpDir = join(tmpdir(), 'polar', basename(zipPath, '.zip'));
  const ipc = createIpcSender('NetworkUtil', 'app');
  await ipc(ipcChannels.unzip, { filePath: zipPath, destination: tmpDir });
  debug(`Extracted '${zipPath}' to '${tmpDir}'`);

  // read and parse the export.json file
  const exportFilePath = join(tmpDir, 'export.json');
  const parsed = JSON.parse(await read(exportFilePath));
  // validate the network and chart
  if (!(parsed.network && isNetwork(parsed.network))) {
    throw new Error(`${exportFilePath} did not contain a valid network`);
  }
  if (!(parsed.chart && isChart(parsed.chart))) {
    throw new Error(`${exportFilePath} did not contain a valid chart`);
  }
  const network = parsed.network as Network;
  const chart = parsed.chart as IChart;
  const netPath = join(dataPath, 'networks', `${id}`);

  debug(`Updating the network path from '${network.path}' to '${netPath}'`);
  network.path = netPath;
  debug(`Updating network id to '${id}'`);
  network.id = id;
  network.nodes.bitcoin.forEach(bitcoin => {
    bitcoin.networkId = id;
  });
  network.nodes.lightning.forEach(ln => {
    ln.networkId = id;
    if (ln.implementation === 'LND') {
      const lnd = ln as LndNode;
      lnd.paths = getLndFilePaths(lnd.name, network);
    } else if (ln.implementation === 'obd') {
      const obd = ln as LndNode;
      obd.paths = getObdFilePaths(obd.name, network);
    } else if (ln.implementation === 'c-lightning') {
      const cln = ln as CLightningNode;
      cln.paths = getCLightningFilePaths(cln.name, network);
    } else if (ln.implementation !== 'eclair') {
      throw new Error(l('unknownImplementation', { implementation: ln.implementation }));
    }
  });

  // confirms all nodes in the network are supported on the current OS
  const platform = getPolarPlatform();
  for (const { implementation } of network.nodes.lightning) {
    const { platforms } = dockerConfigs[implementation];
    const nodeSupportsPlatform = platforms.includes(platform);
    if (!nodeSupportsPlatform) {
      throw new Error(l('incompatibleImplementation', { implementation, platform }));
    }
  }

  // remove the export file as it is no longer needed
  await rm(exportFilePath);

  debug(`Copying '${tmpDir}' to '${network.path}'`);
  await copy(tmpDir, network.path);

  return [network, chart];
};

/**
 * Archive the given network into a folder with the following content:
 *
 * ```
 * docker-compose.yml // compose file for network
 * volumes            // directory with all data files needed by nodes
 * export.json        // serialized network & chart objects
 * ```
 * @param network the network to archive
 * @param chart the associated chart
 * @param zipPath the full path to save the zip file
 * @return Path of created `.zip` file
 */
export const zipNetwork = async (
  network: Network,
  chart: IChart,
  zipPath: string,
): Promise<void> => {
  // save the network and chart to export.json in the network's folder
  const content = JSON.stringify({ network, chart });
  await writeFile(join(network.path, 'export.json'), content);
  // zip the network dir into the zip path
  const ipc = createIpcSender('NetworkUtil', 'app');
  await ipc(ipcChannels.zip, { source: network.path, destination: zipPath });
  // await zip(network.path, zipPath);
};
