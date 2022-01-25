import React, { useEffect, useState } from "react";
import RewardA from '../reward-a'
import Stakelp from '../Stakelp'
import StakeDefrag from '../StakeDefrag'
import "./stake.css";



function Stake(props: any) {

const {connected, account, myWeb3} = props;
 

  return (
    <>
      <div className='welcome-header'>
        <h4 className='welcome-1'>TOKENOMICS</h4>
        <h1 className='welcome-2'>Staking Dashboard</h1>
        <h4 className='welcome-3'>Earn rewards by staking liquidity provider shares or Defrag</h4>
      </div>
      <RewardA connected={connected} account={account} myWeb3={myWeb3}/>
      <Stakelp connected={connected} account={account} myWeb3={myWeb3}/>
      <StakeDefrag connected={connected} account={account} myWeb3={myWeb3} />
      {/* <Stake /> */}

    </>
  );
}

export default Stake;
