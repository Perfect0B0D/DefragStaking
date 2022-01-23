import * as React from 'react';
import defragimg from '../../assets/images/defragimg.png'
import Slpimg from '../../assets/images/SLP.png'
import { FaQuestionCircle } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import "./Stakelp.css"

function stake() {
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
                            <span>750%</span>
                            <ReactTooltip id="APYquestiontip" place="top" effect="solid">
                                Annual Percentage Yield
                            </ReactTooltip>
                        </div>
                        <div className="element-a-a col-6">
                            <button className="main_btn">Add Liquidity</button>
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
            </div>
        </div>
    )
}

export default stake;