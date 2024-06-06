import * as React from 'react';
import { useState, useEffect } from 'react';
import defragimg from '../../assets/images/defragimg.png'
import { FaQuestionCircle } from "react-icons/fa";
import RewardDefrag from '../reward-defrag'
import ReactTooltip from "react-tooltip";
import "./StakeDefrag.css"
import  BigNumber from 'bignumber.js'
import Rewarddefrag from '../reward-defrag'
import { getDefragContract, getMasterChefContrat, MasterChefAddress } from '../../api'
import {ethers } from 'ethers'


function Stakedefrag(props) {
    var blocknumbers = 2252570; // block numbers in year
    const { connected, account, myWeb3 } = props;

    const [defrag_apy, setapy] = useState(0);
    const [defragbalance, setdefragbalance] = useState(0);
    const [stakevalue, setstakevalue] = useState(0);
    const [withdrawvalue, setWithdrawvalue] = useState(0);
    const [votingpowervalue, setvotingpower] = useState(0);
    const [stakedvalue, setstakedvalue] = useState(0);

    const [power, setPower] = useState(60);

    async function getDefragbalance(myWeb3, account){
        try {
            const contractInstance = getDefragContract(myWeb3);
            // console.log(contractInstance);
            // console.log("account====>", account);
            let res = ethers.utils.formatEther(await contractInstance.methods.balanceOf(account).call());
            res = Math.round(res * 100) / 100;
            // console.log("defrag balance===>", res);
            setdefragbalance(res);
        } catch (error) {
            console.log(error);
        }

    }

      async function getstkedvalue(myWeb3, account){
          try {
            const contractInstance = getMasterChefContrat(myWeb3);
            let user = await contractInstance.methods.userInfo(0, account).call();
            var staked =ethers.utils.formatEther( user.amount );
            staked = Math.round(staked * 10000) / 10000;
            setstakedvalue(staked);
        } catch (error) {
            console.log(error);
        }
    }

    function onchange(event){
        // console.log(event.target.value);
        setstakevalue(event.target.value);
    }

    function stakemax(){
    //    console.log("lp==>", defragbalance);
       setstakevalue(defragbalance-0.0001);
    }

    function withdrawmax(){
        setWithdrawvalue(stakedvalue);
    }

    function onchangew(event){
        setWithdrawvalue(event.target.value);
    }

    
    function buymore(){
        console.log("clicked buy more btn!");
        if(connected){
        window.open('https://pancakeswap.finance/swap', '_blank');//set Defrag address
        }
        else{
            window.alert("First connect your wallet");
        }
    }
    async function getapy(myWeb3){
        try {
            const contractInstance = getMasterChefContrat(myWeb3);
            // console.log(contractInstance);
            // console.log("account====>", account);
            const pool = await contractInstance.methods.poolInfo(0).call();
            const defragperblock = await contractInstance.methods.defragPerBlock().call();
            const totalallocpoint = await contractInstance.methods.totalAllocPoint().call();
            // console.log("block====>", defragperblock, totalallocpoint, pool.total);

            // console.log("slp pool info ===>", pool.allocPoint);
            setPower(pool.power);
            var apy = 0;
            if(pool.total == 0){
                 apy = 250;
            }
            else{
                apy = Math.round(defragperblock * blocknumbers / totalallocpoint * pool.allocPoint / pool.total * 100 * 1000)/1000;
            // apy = Math.round(apy * 1000) / 1000;
            }
            // console.log(apy);
            setapy(apy);
        } catch (error) {
            console.log(error);
        }
    }

    async function Depositdefrag(){
        if(stakevalue > defragbalance){
            window.alert("you havn't got enough balance to stake.");
            return;
        }
        try {
            const contractInstance = getMasterChefContrat(myWeb3);
            const defragcontract = getDefragContract(myWeb3);
            const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
            var allownce = await defragcontract.methods.allowance(account, MasterChefAddress).call();
            console.log("allownce === >" , allownce, stakevalue);
            if (allownce == 0){
                var approveresult = await defragcontract.methods.approve(MasterChefAddress, maxUint256).send({from: account});
                if(approveresult.status){
                    console.log("success approve");
                }
                else{
                    console.log("approve error");
                    return;
                }
            }
            const stakeamount = new BigNumber(stakevalue).multipliedBy(new BigNumber(1000000000000000000));
            var result =await contractInstance.methods.deposit(0, stakeamount).send({from:account});
            if(result.status){
                window.location.reload();
            }
            else{
                alert("Stake error");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function withdrawdefrag(){
        if(stakedvalue < withdrawvalue){
            window.alert("you haven't got enough staked amount to withdraw.");
            return;
        }
        try {
            const contractInstance = getMasterChefContrat(myWeb3);
            const withdrawamount = new BigNumber(withdrawvalue).multipliedBy(new BigNumber(1000000000000000000));
            var result = await contractInstance.methods.withdraw(0, withdrawamount).send({from:account});
            if(result.status){
                window.location.reload();
            }
            else{
                alert("Stake error");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (connected && account) {
            (async () => {
               await getDefragbalance(myWeb3, account);
               await getstkedvalue(myWeb3, account);
               await setvotingpower(stakedvalue*power);       
               await getapy(myWeb3);
            })()
        }
    },[connected, account, stakedvalue])

    return (
        <div className="stake-a">
            <div className="container_contents">
                <div className="element-a row">
                    <div className="element-a-a col-lg-4 col-sm-12">
                        <img src={defragimg} style={{ height: '4rem', fontSize: 'xxx-large' }}></img>
                        <span>Defrag Staking</span>
                    </div>
                    <div className="element-a-b col-lg-8 col-sm-12 row">
                        <div className="element-a-a col-6">
                            <span>APY  <FaQuestionCircle style={{ height: '1rem', fontSize: 'xxx-small' }} data-tip data-for="APYquestiontip" /><div className="tooltip">Anual percentage yield</div></span>
                            <span>{defrag_apy}%</span>
                            <ReactTooltip id="APYquestiontip" place="top" effect="solid">
                                Annual Percentage Yield
                            </ReactTooltip>
                        </div>
                        <div className="element-a-a col-6">
                            <button className="main_btn" onClick={buymore}>Buy Defrag</button>
                        </div>
                    </div>
                </div>
                <div className="element-a row">
                    <div className="element-a-a col-lg-4 col-sm-12">
                        <span>Current balance:</span>
                        <span>{defragbalance} Defrag</span>
                    </div>
                    <div className="element-a-b col-lg-8 col-sm-12 row">
                        <div className="element-a-a col-6">
                            <input type="text" placeholder="0.0" onChange={onchange} value={stakevalue}/>
                            <button className="input-max" onClick={stakemax}>Max</button>
                        </div>
                        <div className="element-a-a col-6">
                            <button className="main_btn" onClick={Depositdefrag}>Stake more</button>
                        </div>
                    </div>
                </div>
                <div className="element-a row">
                    <div className="element-a-a col-lg-4 col-sm-12">
                        <span>Current staked:</span>
                        <span>{stakedvalue} Defrag</span>
                    </div>
                    <div className="element-a-b col-lg-8 col-sm-12 row">
                        <div className="element-a-a col-6">
                            <input type="text" placeholder="0.0" value={withdrawvalue} onChange={onchangew}/>
                            <button className="input-max" onClick={withdrawmax}>Max</button>
                        </div>
                        <div className="element-a-a col-6">
                            <button className="main_btn" onClick={withdrawdefrag}>Unstake</button>
                        </div>
                    </div>
                </div>
                <RewardDefrag connected={connected} account={account} myWeb3={myWeb3} votingpower = {votingpowervalue}/>
            </div>
         
        </div>
    )
}

export default Stakedefrag;