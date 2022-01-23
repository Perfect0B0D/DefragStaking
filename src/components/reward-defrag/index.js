import * as React from 'react';
import { FaQuestionCircle } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import "./reward_defrag.css"


function Reward_defrag() {
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
                            <button className="main_btn">vest rewards</button>
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
                        <div className="ammount">0.0</div>
                        <div className="subtitle">
                            <button className="main_btn">Go to active proposals</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reward_defrag;