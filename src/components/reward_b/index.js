import * as React from 'react';
import "./reward_b.css"


function Reward_b(){
        return (
            <div className="rewards-b">
                <div className="title-container"><b className="title_element">Vesting Rewards</b></div>
                <div className="rewards_container">
                            <div className="particular">
                                <div className="title_container"> 
                                    <span>Unclaimed Rewards</span>
                                </div>
                                <div className="body_container">
                                    <div className="ammount">0.0 DEFRAG</div>
                                    <div className="subtitle">
                                        <button>vest rewards</button>
                                    </div>
                                </div>
                            </div>
                            <div className="particular">
                                <div className="title_container"> 
                                    <span>Voting Power</span>
                                </div>
                                <div className="body_container">
                                    <div className="ammount">0.0 DEFRAG</div>
                                    <div className="subtitle">
                                        <button>Go to active proposals</button>
                                    </div>
                                </div>
                            </div>
                </div>
            </div>
        )
    }

export default Reward_b;