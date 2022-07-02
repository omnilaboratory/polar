import React from 'react';
import { useAsyncCallback } from 'react-async-hook';
import { CodeOutlined } from '@ant-design/icons';
import { Button, Form, message } from 'antd';
import { usePrefixedTranslation } from 'hooks';
import { BitcoinNode, LightningNode } from 'shared/types';
import { useStoreActions } from 'store';
import { getContainerName } from 'utils/network';
import { TERMINAL } from 'components/routing';

interface Props {
  node: LightningNode | BitcoinNode;
  type?: 'button' | 'menu';
}

const OpenTerminalButton: React.FC<Props> = ({ node, type }) => {
  const { l } = usePrefixedTranslation('cmps.terminal.OpenTerminalButton');
  const { openWindow } = useStoreActions(s => s.app);
  const openAsync = useAsyncCallback(async () => {
    if (type === 'menu') message.info(l('openMsg'));
    await openWindow(TERMINAL(node.implementation, getContainerName(node)));
  });

  // render a menu item inside of the NodeContextMenu
  if (type === 'menu') {
    return (
      <span onClick={openAsync.execute}>
        <CodeOutlined />
        <span>{l('menu')}</span>
      </span>
    );
  }

  let cmd = '';
  switch (node.implementation) {
    case 'LND':
      cmd = 'lncli';
      break;
    case 'obd':
      cmd = 'lncli';
      break;
    case 'c-lightning':
      cmd = 'lightning-cli';
      break;
    case 'bitcoind':
      cmd = 'bitcoin-cli';
      break;
    case 'omnicored':
      cmd = 'bitcoin-cli';
      break;
  }
  return (
    <Form.Item label={l('title')} help={l('info', { cmd })} colon={false}>
      <Button
        icon={<CodeOutlined />}
        block
        loading={openAsync.loading}
        onClick={openAsync.execute}
      >
        {l('btn')}
      </Button>
    </Form.Item>
  );
};

export default OpenTerminalButton;
