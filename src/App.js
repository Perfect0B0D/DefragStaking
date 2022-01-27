import React, { useEffect, useState } from "react";
import Bottom from './components/bottom'
import { chainhex, chainId } from "./config/site.config";
import Web3 from "web3"
import { web3_modal } from "./api";
import Stake from './components/stake';
import "./App.css";
import { Route, Switch, Router, Link } from 'react-router-dom';



function App() {



  const [myWeb3, setMyWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [connected, setconnect] = useState(false);

  const detectEthereumNetwork = (callback) => {
    window.ethereum.request({ method: 'eth_chainId' }).then(async (cId) => {
      if (parseInt(cId) != chainId) { // bsc testnet
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainhex }], // chainId must be in hexadecimal numbers
        }).then(() => {
          return callback();
        })
      } else {
        return callback();
      }
    });
  }


  const connect = async () => {
    if (account !== '') {
      setAccount('');
      setMyWeb3(null);
      setconnect(false);
      web3_modal.clearCachedProvider();
      setTimeout(() => {
        window.location.reload();
      }, 1);

    }
    else {
      detectEthereumNetwork(async () => {
        let provider = null;
        try {
          provider = await web3_modal.connect();
        } catch (error) {
          console.log(error);
          window.location.reload();
          return;
        }
        if (!provider.on) {
          return;
        }

        provider.on('accountsChanged', async () => {
          // console.log("accountchange");
          setTimeout(() => window.location.reload(), 1)
        });

        provider.on('chainChanged', async (cid) => {
          if (parseInt(cid) !== chainId) {
            await web3_modal.off();
            setTimeout(() => window.location.reload(), 1);
            return null;
          }
        })

        provider.on('network', (_newNetwork, oldNetwork) => {
          if (!oldNetwork) return;
          window.location.reload();
        });


        await web3_modal.toggleModal();
        // provider.
        // regular web3 provider methods
        // console.log("1");
        const web3 = new Web3(provider);
        // console.log("2");
        if (web3) {
          // console.log("3");
          setMyWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          // console.log(accounts);
          setAccount(accounts[0]);
        }
      });
    }
  }



  useEffect(() => {
    (async () => {
      if (myWeb3) {
        setconnect(true);
      } else {
        console.log("not connect");
      }
    })()
  }, [account, myWeb3])
  return (
    <div className="main">
      <div className="header">
        {/* <nav>
          <Link to="/">Stakeing</Link>
          <Link to="/vest">vesting</Link>
        </nav> */}
        <button className="my-btn connect-btn" onClick={() => connect()}>
          <div className="connect-btn-text">
            {account === "" ? "Connect to metamask" : account}
          </div>
        </button>
      </div>


      {/* <Switch>
        <Route exact path='/'> */}
          <Stake connected={connected} account={account} myWeb3={myWeb3} />
        {/* </Route> */}
        {/* <Route  path='/vest'> */}
          {/* <Vestingreward connected={connected} account={account} myWeb3={myWeb3} /> */}
        {/* </Route>
      </Switch> */}

      <Bottom />
    </div>
  );
}

export default App;
