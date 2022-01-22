import * as React from 'react';
import "./StakeDefrag.css"

function stake(){
        return (
            <div className="stake-a">
                <div className="container_contents">
                    <div className="element-a">
                        <div className="content">
                            <div className="title_container">
                                <span>Stake your DEFRAG Tokens and earn:</span>
                            </div>
                            <div className="ammount_container">
                                <span>250%</span>
                                <span>APY</span>
                            </div>
                        </div>
                        <div className="cta-container">
                            <button>BUY more</button>
                        </div>
                    </div>
                    <div className="element-a">
                        <div className="content">
                            <div className="title_container">
                                <span>Currently staked:</span>
                            </div>
                            <div className="ammount_container">
                                <span className="black">0.0 DEFRAG</span>
                                <span className="blue-2">.0.1% of Staked</span>
                            </div>
                        </div>
                        <div className="cta-container">
                            <button>Stake more</button>
                        </div>
                    </div>
                    <div className="element-a">
                        <div className="content">
                            <input type="text" placeholder="0.0" />
                            <button className="input-max">Max</button>
                        </div>
                        <div className="cta-container">
                            <button disabled>Unstake</button>
                        </div>
                    </div>
                </div>
                <div className="container_ctas">
                        <div className="cta-container">
                            <button>BUY more</button>
                        </div>
                        <div className="cta-container">
                            <button>Stake more</button>
                        </div>
                        <div className="cta-container">
                            <button disabled>Unstake</button>
                        </div>
                </div>
            </div>
        )
    }

export default stake;