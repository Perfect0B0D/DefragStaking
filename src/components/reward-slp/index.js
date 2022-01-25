import * as React from 'react';
import { useState, useEffect } from 'react'
import { FaQuestionCircle } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import { getMasterChefContrat } from '../../api'
import {BigNumber, ethers } from 'ethers'
import "./reward_slp.css"


function Reward_slp(props: any) {
    const { connected, account, myWeb3,votingpower } = props;

    const[pendingdefrag, setpendingdefrag] = useState(0.0);

    async function getpendingdefrag(myWeb3, account){
        try{
            const contractInstance = getMasterChefContrat(myWeb3);
            // console.log(contractInstance);
            // console.log("account====>", account);
            let res = ethers.utils.formatEther(await contractInstance.methods.pendingdefrag(1,account).call());
            res = Math.round(res * 1000) / 1000;
            setpendingdefrag(res);
        } catch (error){
            console.log(error);
        }
    }
    
    async function setvest(){
        try {
            const contractInstance = getMasterChefContrat(myWeb3);
            var result = contractInstance.withdraw(1, 1).send({from:account});
            if(result.status){
                window.location.reload();
            }
            else{
                alert("vest error");
            }
        } catch (error) {
            console.log(error);
        }
    }

      
    
    function goproposal(){
        window.open("https://vote.defrag.com/#/", '_blank');
    }

    useEffect(() => {
        if (connected) {
            (async () => {
                getpendingdefrag(myWeb3, account);
            })()
        }
    })

    return (
        <div className="rewards-b">
            <div className="title-container"><b className="title_element">Vesting Rewards</b></div>
            <div className="rewards_container">
                <div className="particular">
                    <div className="title_container">
                        <span>Unclaimed Rewards</span>
                    </div>
                    <div className="body_container">
                        <div className="ammount">{pendingdefrag} DEFRAG</div>
                        <div className="subtitle">
                            <button className="main_btn" onClick={setvest}>vest rewards</button>
                            <span>Vests on 6-month waterfall <FaQuestionCircle style={{ height: '1rem', fontSize: 'xxx-small' }} data-tip data-for="vestquestiontip" /></span>
                            <ReactTooltip id="vestquestiontip" place="top" effect="solid">
                            Defrag rewards are vested on a 6-month waterfall. This means your rewards will be available to claim 6-months after they're vested.
                            </ReactTooltip>
                        </div>
                    </div>
                </div>
                <div className="particular">
                    <div className="title_container">
                        <span>Voting Power</span>
                    </div>
                    <div className="body_container">
                        <div className="ammount">{votingpower}</div>
                        <div className="subtitle">
                            <button className="main_btn" onClick={goproposal}>Go to active proposals</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reward_slp;