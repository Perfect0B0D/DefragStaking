import { useState, useEffect } from 'react';
import defragimg from '../../assets/images/defragimg.png'
import metamaskimg from '../../assets/images/metamask.png'
import viewcontractimg from '../../assets/images/view-contract.png'
import pancakeimg from '../../assets/images/pancake.png'
import { FaCreditCard } from "react-icons/fa";
import "./reward_a.css"
import { getDefragContract, getMasterChefContrat } from '../../api'
import { ethers } from 'ethers'

function Reward_a(props: any) {

    const { connected, account, myWeb3 } = props;
    // const Collapse = window.Collapse;
    // const cx = window.classNames;
    // const [isOpen, setIsOpen] = useState(false);
    // const onToggle = () => setIsOpen(s => !s);
    const[pendingdefrag, setpendingdefrag] = useState(0.0);
    const [rewardssubmenuflag, setsubflag] = useState(false);
    const [Defragbalence, SetTokenBalence] = useState(0);
    const [Defragprice, SetDefragprice] = useState(0);
    const [totalusdprice, SetTotalusdprice] = useState(0);
    const onToggle = () => setsubflag(s => !s);

    function buyDefrag() {
        window.open('https://pancakeswap.finance/swap?inputCurrency=&outputCurrency=0xfd5840cd36d94d7229439859c0112a4185bc0255', '_blank');
    }

    function viewDefrag() {
        
        window.open('https://testnet.bscscan.com/address/0x19E639dc82f859F2a20a9F558eAefeE0b75e31DC', '_blank');

    }
    async function addtokentowallet() {

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: "0x981f0Ed8bFA27B96B11BE6ced34d876464AEe6f5", // The address that the token is at.
                        symbol: "Defrag", // A ticker symbol or shorthand, up to 5 chars.
                        decimals: 18, // The number of decimals in the token
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function getDefragbalence(myWeb3, account) {
        try {
            const contractInstance = getDefragContract(myWeb3);
            console.log(contractInstance);
            console.log("account====>", account);
            let res = ethers.utils.formatEther(await contractInstance.methods.balanceOf(account).call());
            res = Math.round(res * 100) / 100;
            console.log(res);
            SetTokenBalence(res);
        } catch (error) {
            console.log(error);
        }
    }

    async function getpendingdefrag(myWeb3, account){
        try{
            const contractInstance = getMasterChefContrat(myWeb3);
            console.log(contractInstance);
            console.log("account====>", account);
            let res = ethers.utils.formatEther(await contractInstance.methods.totalPendingRewards(account).call());
            res = Math.round(res * 1000) / 1000;
            setpendingdefrag(res);
            SetTotalusdprice(res*Defragprice);
        } catch (error){
            console.log(error);
        }
    }

    async function getDefragprice() {
        fetch("https://api.pancakeswap.info/api/v2/tokens/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82")
          .then(res => res.json())
          .then(
            (result) => {
              console.log(result.data.price)
              const price = Math.round(result.data.price * 1000000)/1000000;
              SetDefragprice(price);
            },
            (error) => {
              console.log(error);
            }
          )
      }

    useEffect(() => {
        (async () => {
            getDefragprice();
            console.log("connected===>", connected);
        })()
    }, [connected])

    useEffect(() => {
        if (connected) {
            (async () => {
                getDefragbalence(myWeb3, account);
                getpendingdefrag(myWeb3, account);
            })()
        }
    })

    return (
        <>
            {connected ?
                <div className="rewards row">
                    <div className="rewards-a col-lg-6 col-sm-10">
                        <div className="title-container"><b className="title_element">Unclaimed Defrag to Vest</b></div>
                        <div className="particular">
                            <div className="ammount">{pendingdefrag} DEFRAG</div>
                            <small className="subtitle">Total</small>
                        </div>
                        <div className="particular">
                            <div className="ammount">{totalusdprice}</div>
                            <small className="subtitle">USD Total</small>
                        </div>

                        <div className="particular">
                            <div className="ammount">{Defragprice}</div>
                            <small className="subtitle">DEFRAG Current price</small>
                        </div>

                    </div>
                    <div className="col-lg-4 col-sm-10 rewards-X-I">
                        <div className="rewards-X">
                            <img src={defragimg} style={{ height: '4rem', fontSize: 'xxx-large' }}></img>
                            <span>{Defragprice}</span>
                            <span className="icon" style={{ float: 'left' }} onClick={onToggle}>
                                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M455,113a15,15 0 01 19,0l29,29a15,15 0 01 0,19l-235,236a16,16 0 01-24,0l-235-236a15,15 0 01 0-19l29-29a15,15 0 01 19,0l199,199z" />
                                </svg>
                            </span>
                        </div>
                        {rewardssubmenuflag ?
                            <div className="rewards-X-sub" style={{ borderRadius: "20px" }}>
                                <div className="rewards-defrag-value">
                                    <FaCreditCard style={{ height: '4rem', fontSize: 'xxx-large' }} />
                                    <div className="defragvalue">
                                        <span>Your wallet</span>
                                        <span>{Defragbalence} Defrag</span>
                                    </div>
                                </div>
                                <div className="rewards-pancake r-com" onClick={buyDefrag}>
                                    <img src={pancakeimg} style={{ height: '4rem', fontSize: 'xxx-large' }}></img>
                                    <div className="cen-com">
                                        <span>Buy on pancakeswap</span>
                                    </div>
                                </div>
                                <div className="rewards-metamask r-com" onClick={addtokentowallet}>
                                    <img src={metamaskimg} style={{ height: '4rem', fontSize: 'xxx-large' }}></img>
                                    <div className="cen-com">
                                        <span>Add Defrag to metamask</span>
                                    </div>
                                </div>
                                <div className="rewards-viewcontract r-com" onClick={viewDefrag}>
                                    <img src={viewcontractimg} style={{ height: '4rem', fontSize: 'xxx-large' }}></img>
                                    <div className="cen-com">
                                        <span>View contract</span>
                                    </div>
                                </div>
                            </div> : <div></div>
                        }
                    </div>

                </div>
                : <div className="rewards-a walletnotconnect">
                    <span style={{ fontSize: '30px', fontWeight: '300' }}>Wallet Not connect</span>
                </div>}
        </>
    )
}

export default Reward_a;