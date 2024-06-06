import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Route, Switch } from 'react-router-dom';
import { chainhex, chainId } from './config/site.config';
import { web3_modal } from './api';
import Header from './components/Header';
import Bottom from './components/Bottom';
import Stake from './components/Stake';
import VestingReward from './components/VestingReward';
import './App.css';

const App = () => {
  const [myWeb3, setMyWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [connected, setConnected] = useState(false);

  const detectEthereumNetwork = async (callback) => {
    const cId = await window.ethereum.request({ method: 'eth_chainId' });
    if (parseInt(cId) !== chainId) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainhex }],
      });
    }
    callback();
  };

  const connect = async () => {
    if (account !== '') {
      setAccount('');
      setMyWeb3(null);
      setConnected(false);
      web3_modal.clearCachedProvider();
      setTimeout(() => window.location.reload(), 1);
    } else {
      detectEthereumNetwork(async () => {
        let provider;
        try {
          provider = await web3_modal.connect();
        } catch (error) {
          console.error(error);
          window.location.reload();
          return;
        }

        if (!provider.on) return;

        provider.on('accountsChanged', () => setTimeout(() => window.location.reload(), 1));
        provider.on('chainChanged', async (cid) => {
          if (parseInt(cid) !== chainId) {
            await web3_modal.off();
            setTimeout(() => window.location.reload(), 1);
          }
        });
        provider.on('network', (_newNetwork, oldNetwork) => {
          if (!oldNetwork) return;
          window.location.reload();
        });

        const web3 = new Web3(provider);
        if (web3) {
          setMyWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        }
      });
    }
  };

  useEffect(() => {
    if (myWeb3) {
      setConnected(true);
    } else {
      console.log('not connected');
    }
  }, [account, myWeb3]);

  return (
    <div className="main">
      <Header account={account} connect={connect} />
      <Switch>
        <Route exact path='/'>
          <Stake connected={connected} account={account} myWeb3={myWeb3} />
        </Route>
        <Route path='/vest'>
          <VestingReward connected={connected} account={account} myWeb3={myWeb3} />
        </Route>
      </Switch>
      <Bottom />
    </div>
  );
};

export default App;
