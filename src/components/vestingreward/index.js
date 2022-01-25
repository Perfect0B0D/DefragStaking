import * as React from 'react';
import { useState, useEffect } from 'react';


import './vestingreward.css';
function Vestingreward(props: any) {
    const { connected, account, myWeb3 } = props;

    return (
        <div className="vestingmain">
            <div className='welcome-header'>
                <h4 className='welcome-1'>TOKENOMICS</h4>
                <h1 className='welcome-2'>Vesting Dashboard</h1>
                <h4 className='welcome-3'>The Defrag token grants we issue are subject to vesting schedules. If you have an unclaimed allocation, you'll find it here.</h4>
            </div>
            <div className="allocation row">
                <div className="col-6 allocation_sub_1">
                    <span className="allocation_sub_a">Your Allocation</span>
                    <span className="allocation_sub_b">{connected?{account}:"Connect a wallet to see its allocation"}</span>
                </div>
                <div className="col-6 allocation_sub_2">
                    <button className="allocation_button">Nothing to claim</button>
                </div>

            </div>

        </div>
    );
}

export default Vestingreward;
