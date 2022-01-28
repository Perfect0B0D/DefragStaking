import * as React from 'react'
import { useState, useEffect } from 'react'
import defragimg from '../../assets/images/defragimg.png'
import Slpimg from '../../assets/images/SLP.png'
import { FaQuestionCircle, FaRProject } from "react-icons/fa"
import ReactTooltip from "react-tooltip"
import Rewardslp from '../reward-slp'
import { getSlpcontract, getMasterChefContrat, MasterChefAddress } from '../../api'
import {ethers } from 'ethers'
import  BigNumber from 'bignumber.js'
import "./Stakelp.css"


function StakeLp(props) {
    var blocknumbers = 2252570; // block numbers in year
    const { connected, account, myWeb3 } = props;

    const [Slp_apy, setapy] = useState(0);
    const [Slpbalance, setSlpbalance] = useState(0);
    const [stakevalue, setstakevalue] = useState(0);
    const [stakedvalue, setstakedvalue] = useState(0);
    const [withdrawvalue, setWithdrawvalue] = useState(0);
    const [votingpowervalue, setvotingpower] = useState(0);
    const [power, setPower] = useState(60);

    async function getSlpbalance(myWeb3, account){
        try {
            const contractInstance = getSlpcontract(myWeb3);
            // console.log(contractInstance);
            // console.log("account====>", account);
            let res = ethers.utils.formatEther(await contractInstance.methods.balanceOf(account).call());
            res = Math.round(res * 100) / 100;
            // console.log("slp balance===>", res);
            setSlpbalance(res);
        } catch (error) {
            console.log(error);
        }

    }


    function onchangeS(event){
        // console.log(event.target.value);
        setstakevalue(event.target.value);
    }

    function stakemax(){
    //    console.log("lp==>", Slpbalance);
       setstakevalue(Slpbalance - 0.001);
    }

    function withdrawmax(){
        setWithdrawvalue(stakedvalue);
    }

    function onchangew(event){
        // console.log("withdrawvalue===>", event.target.value)
        setWithdrawvalue(event.target.value);
    }

    
    function addliquidity(){
        if(connected){
        window.open('https://pancakeswap.finance/add/BNB/0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F', '_blank');//set Defrag address
        }
        else{
            window.alert("First connect your wallet");
        }
    }

    async function getstkedvalue(myWeb3, account){
          try {
              console.log("get staked balance before");
            const contractInstance = getMasterChefContrat(myWeb3);
            let user = await contractInstance.methods.userInfo(1, account).call();
            console.log(user);
            var staked =ethers.utils.formatEther( user.amount );
            console.log("staked balence===>", staked);
            staked = Math.round(staked * 10000) / 10000;
            setstakedvalue(staked);
        } catch (error) {
            console.log(error);
        }
    }

    async function getapy(myWeb3){
        try {
            const contractInstance = getMasterChefContrat(myWeb3);
            // console.log(contractInstance);
            // console.log("account====>", account);
            const pool = await contractInstance.methods.poolInfo(1).call();
            const defragperblock = await contractInstance.methods.defragPerBlock().call();
            const totalallocpoint = await contractInstance.methods.totalAllocPoint().call();
            // console.log("block====>", defragperblock, totalallocpoint, pool.total);

            // console.log("slp pool info ===>", pool.allocPoint);
            setPower(pool.power);
            var apy = 0;
            if(pool.total == 0){
                 apy = 750;
            }
            else{
                apy = Math.round(defragperblock * blocknumbers / totalallocpoint * pool.allocPoint / pool.total * 100 * 1000)/1000/60;
                apy = Math.round(apy * 1000) / 1000;
            }
            // console.log(apy);
            setapy(apy);
        } catch (error) {
            console.log(error);
        }
    }

    async function stakelp(){
        if(stakevalue > Slpbalance){
            window.alert("you havn't got enough SLP balance to stake.");
            return;
        }
        try {
            const contractInstance = getMasterChefContrat(myWeb3);
            const slpcontractInstance = getSlpcontract(myWeb3);
            const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
            var stakeamount = new BigNumber(stakevalue).multipliedBy(new BigNumber(1000000000000000000));
            var allownce = await slpcontractInstance.methods.allowance(account, MasterChefAddress).call();
            console.log("allownce === >" , allownce, stakevalue);
            if (allownce == 0){
                var approveresult = await slpcontractInstance.methods.approve(MasterChefAddress, maxUint256).send({from: account});
                if(approveresult.status){
                    console.log("success approve");
                }
                else{
                    console.log("approve error");
                    return;
                }
            }
            console.log("stake amount===>", stakeamount);
            var result = await contractInstance.methods.deposit(1, stakeamount).send({from:account});
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

    async function withdrawlp(){
        if(stakedvalue < withdrawvalue){
            window.alert("you haven't got enough staked amount to withdraw.");
            return;
        }
        try {
            const contractInstance = getMasterChefContrat(myWeb3);
            const withdrawamount = new BigNumber(withdrawvalue).multipliedBy(new BigNumber(1000000000000000000));
            var result = await contractInstance.methods.withdraw(1, withdrawamount).send({from:account});
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
               await getSlpbalance(myWeb3, account);
               console.log("await  setvotingpower(Slpbalance*power);",Slpbalance);
               await  setvotingpower(Slpbalance*power);
               await  getstkedvalue(myWeb3, account);
               await getapy(myWeb3);
            })()
        }
    },[connected, account, Slpbalance])


    return (
        <div className="stake-a">
            <div className="container_contents">
                <div className="element-a row">
                    <div className="element-a-a col-lg-4 col-sm-12">
                        <img src={Slpimg} style={{ height: '4rem', fontSize: 'xxx-large' }}></img>
                        <span>SLP Staking</span>
                    </div>
                    <div className="element-a-b col-lg-8 col-sm-12 row">
                        <div className="element-a-a col-6">
                            <span>APY  <FaQuestionCircle style={{ height: '1rem', fontSize: 'xxx-small' }} data-tip data-for="APYquestiontip" /></span>
                            <span>{Slp_apy}%</span>
                            <ReactTooltip id="APYquestiontip" place="top" effect="solid">
                                Annual Percentage Yield
                            </ReactTooltip>
                        </div>
                        <div className="element-a-a col-6">
                            <button className="main_btn" onClick={addliquidity}>Add Liquidity</button>
                        </div>
                    </div>
                </div>
                <div className="element-a row">
                    <div className="element-a-a col-lg-4 col-sm-12">
                        <span>Current balance:</span>
                        <span>{Slpbalance} SLP</span>
                    </div>
                    <div className="element-a-b col-lg-8 col-sm-12 row">
                        <div className="element-a-a col-6">
                            <input type="text" placeholder="0.0" value={stakevalue} onChange={onchangeS} />
                            <button  className="input-max" onClick={stakemax}>Max</button>
                        </div>
                        <div className="element-a-a col-6">
                            <button className="main_btn" onClick={stakelp}>Stake more</button>
                        </div>
                    </div>
                </div>
                <div className="element-a row">
                    <div className="element-a-a col-lg-4 col-sm-12">
                        <span>Current staked:</span>
                        <span>{stakedvalue} SLP</span>
                    </div>
                    <div className="element-a-b col-lg-8 col-sm-12 row">
                        <div className="element-a-a col-6">
                            <input type="text" placeholder="0.0" value={withdrawvalue} onChange={onchangew}/>
                            <button className="input-max" onClick={withdrawmax} >Max</button>
                        </div>
                        <div className="element-a-a col-6">
                            <button className="main_btn" onClick={withdrawlp}>Unstake</button>
                        </div>
                    </div>
                </div>
                <Rewardslp connected={connected} account={account} myWeb3={myWeb3} votingpower = {votingpowervalue}/>
            </div>
        </div>
    )
}

export default StakeLp;