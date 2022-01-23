import * as React from 'react';
import defragimg from '../../assets/images/defragimg.png'
import { FaQuestionCircle } from "react-icons/fa";
import RewardDefrag from '../reward-defrag'
import ReactTooltip from "react-tooltip";
import "./StakeDefrag.css"

function stake() {
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
                            <span>APY  <FaQuestionCircle style={{ height: '1rem', fontSize: 'xxx-small' }} data-tip data-for="APYquestiontip" /><div class="tooltip">Anual percentage yield</div></span>
                            <span>250%</span>
                            <ReactTooltip id="APYquestiontip" place="top" effect="solid">
                                Annual Percentage Yield
                            </ReactTooltip>
                        </div>
                        <div className="element-a-a col-6">
                            <button className="main_btn">Buy Defrag</button>
                        </div>
                    </div>
                </div>
                <div className="element-a row">
                    <div className="element-a-a col-lg-4 col-sm-12">
                        <span>Current balance:</span>
                        <span>0.0 SLP</span>
                    </div>
                    <div className="element-a-b col-lg-8 col-sm-12 row">
                        <div className="element-a-a col-6">
                            <input type="text" placeholder="0.0" />
                            <button className="input-max">Max</button>
                        </div>
                        <div className="element-a-a col-6">
                            <button className="main_btn">Stake more</button>
                        </div>
                    </div>
                </div>
                <div className="element-a row">
                    <div className="element-a-a col-lg-4 col-sm-12">
                        <span>Current staked:</span>
                        <span>0.0 SLP</span>
                    </div>
                    <div className="element-a-b col-lg-8 col-sm-12 row">
                        <div className="element-a-a col-6">
                            <input type="text" placeholder="0.0" />
                            <button className="input-max">Max</button>
                        </div>
                        <div className="element-a-a col-6">
                            <button className="main_btn">Unstake</button>
                        </div>
                    </div>
                </div>
                <RewardDefrag />
            </div>
         
        </div>
    )
}

export default stake;