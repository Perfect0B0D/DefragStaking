import { useState, useEffect } from 'react';
import defragimg from '../../assets/images/defragimg.png'
import metamaskimg from '../../assets/images/metamask.png'
import viewcontractimg from '../../assets/images/view-contract.png'
import pancakeimg from '../../assets/images/pancake.png'
import { FaCreditCard } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa"
import { FaUnlockAlt } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "./reward_a.css"
import { getDefragContract, getMasterChefContrat } from '../../api'
import { ethers } from 'ethers'

function Reward_a(props) {

    const { connected, account, myWeb3 } = props;
    console.log(account);

    const [Modalopen, setOpen] = useState(false);
    const [pendingamount, setPendingAmount] = useState(0);
    const [pendingdefrag, setpendingdefrag] = useState(0.0);
    const [rewardssubmenuflag, setsubflag] = useState(false);
    const [Defragbalence, SetTokenBalence] = useState(0);
    const [Defragprice, SetDefragprice] = useState(0);
    const [totalusdprice, SetTotalusdprice] = useState(0);
    const [userallocation, SetUserallocation] = useState([]);
    const [useraloclength, SetUserAlloclength] = useState(0);
    const [useralocid, SetuserAllocIds] = useState([]);
    const [useralocclaimableid, SetuserClaimableAllocIds] = useState([]);
    const [userclaimablelength, SetUserCbLength] = useState([0]);


    const onToggle = () => setsubflag(s => !s);
    const allocmodalopen = () => setOpen(true);
    const allocmodalclose = () => setOpen(false);

    function buyDefrag() {
        window.open('https://pancakeswap.finance/swap?inputCurrency=&outputCurrency=0xfd5840cd36d94d7229439859c0112a4185bc0255', '_blank');
    }

    function viewDefrag() {

        window.open('https://testnet.bscscan.com/address/0x19E639dc82f859F2a20a9F558eAefeE0b75e31DC', '_blank');

    }
    async function addtokentowallet() {

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: "0x19E639dc82f859F2a20a9F558eAefeE0b75e31DC", // The address that the token is at.
                        symbol: "Defrag", // A ticker symbol or shorthand, up to 5 chars.
                        decimals: 18, // The number of decimals in the token
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function allclaim() {
        try {
            console.log("useralocclaimableid",useralocclaimableid);
            const contractInstance = getMasterChefContrat(myWeb3);
            console.log("contractInstance",contractInstance);
            var result = await contractInstance.methods.releaseMultiple(account, useralocclaimableid).send({ from: account });
            if (result.status) {
                window.location.reload();
            }
            else {
                alert("claim error");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function claim(alloc_id) {
        try {
            const contractInstance = getMasterChefContrat(myWeb3);
            var result = await contractInstance.methods.release(account, alloc_id).send({ from: account });
            if (result.status) {
                window.location.reload();
            }
            else {
                alert("claim error");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getuserAllocation(myWeb3, account) {
        try {
            const contractInstance = getMasterChefContrat(myWeb3)
            let useraloc = [];
            let userclaimalbleid = [];
            let useraloc_id = [];
            let userclaimablelength = 0;
            let duration = await contractInstance.methods.vestduration().call();
            console.log("duration", duration);
            console.log("aloclength==>", useraloclength);
            for (var i = 0; i < useraloclength; i++) {
                let tmpuseraloc = await contractInstance.methods.userAllocations(account, i).call();
                if (!tmpuseraloc.claimed) {
                    useraloc_id.push(i);
                }
                const date = new Date(parseInt(tmpuseraloc.start) * 1000)
                // console.log("tmpuseraloc.start==>", tmpuseraloc.start)
                // console.log("Date: " + date.getDate() +
                //     "/" + (date.getMonth() + 1) +
                //     "/" + date.getFullYear() +
                //     " " + date.getHours() +
                //     ":" + date.getMinutes() +
                //     ":" + date.getSeconds());
                var today = new Date();
                console.log("today", today);
                var different_month = (today.getFullYear() - date.getFullYear()) * 12 + (today.getMonth() - date.getMonth());
                var claimable;
                var current_timestamp = Math.round(new Date().getTime() / 1000)
                console.log("current_timestamp,tmpuseraloc.start", current_timestamp, tmpuseraloc.start);
                if ((current_timestamp - parseInt(tmpuseraloc.start)) > parseInt(duration)) { claimable = true; } else { claimable = false }

                var end_time = new Date((parseInt(tmpuseraloc.start) + parseInt(duration)) * 1000);
                console.log("end_time", (parseInt(tmpuseraloc.start) + parseInt(duration)))
                var rest_time = (parseInt(tmpuseraloc.start) + parseInt(duration)) - current_timestamp;
                var day_flag = true;
                rest_time /= (3600 * 24);
                if (rest_time < 1) { day_flag = false; rest_time = Math.round((rest_time) * 24) } else {
                    rest_time = Math.round(rest_time);
                }
                if (claimable) {
                    if (!tmpuseraloc.claimed) {
                        userclaimalbleid.push(i);
                        userclaimablelength++;
                    }
                }
                var new_data = { aloc_id: i, claimable: claimable, day_flag: day_flag, rest_time: rest_time, end_time: end_time, start: date, amount: tmpuseraloc.amount, claimed: tmpuseraloc.claimed, different_month: different_month }
                useraloc.push(new_data);
            }
            await SetUserallocation(useraloc);
            await SetuserClaimableAllocIds(userclaimalbleid);
            await SetuserAllocIds(useraloc_id);
            await SetUserCbLength(userclaimablelength);
            console.log("useralloc==>", userallocation);

        } catch (error) {
            console.log(error);
            return;
        }
    }



    async function getDefragbalence(myWeb3, account) {
        try {
            const contractInstance = getDefragContract(myWeb3);
            // console.log(contractInstance);
            // console.log("account====>", account);
            let res = ethers.utils.formatEther(await contractInstance.methods.balanceOf(account).call());
            res = Math.round(res * 100) / 100;
            // console.log(res);
            SetTokenBalence(res);
        } catch (error) {
            console.log(error);
        }
    }

    async function getpendingdefrag(myWeb3, account) {
        try {
            const contractInstance = getMasterChefContrat(myWeb3);
            let res = ethers.utils.formatEther(await contractInstance.methods.totalPendingRewards(account).call());
            let pendingamouttoclaim =  ethers.utils.formatEther(await contractInstance.methods.pendingAmount(account).call());
            let useralocl = await contractInstance.methods.userallocationlength(account).call();
            console.log("total pending defrag to vest===>", res);
            console.log("leg===>", useralocl);
            res = Math.round(res * 1000) / 1000;
            let totalusdpendingprice = Math.round(res * Defragprice * 100) / 100;
            setpendingdefrag(res);
            setPendingAmount(pendingamouttoclaim);
            SetTotalusdprice(totalusdpendingprice);
            await SetUserAlloclength(useralocl);
        } catch (error) {
            console.log(error);
        }
    }

    async function getDefragprice() {
        fetch("https://api.pancakeswap.info/api/v2/tokens/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82")
            .then(res => res.json())
            .then(
                (result) => {
                    //   console.log(result.data.price)
                    const price = Math.round(result.data.price * 1000000) / 1000000;
                    SetDefragprice(price);
                },
                (error) => {
                    console.log(error);
                }
            )
    }


    useEffect(async () => {
        if (connected && account) {

            await getDefragbalence(myWeb3, account);
            await getpendingdefrag(myWeb3, account);
            await getuserAllocation(myWeb3, account);
        }
        await getDefragprice();
        console.log("connected===>", connected);

    }, [connected, account, useraloclength])

    // useEffect(() => {

    // })

    return (
        <>
            {connected ?
                <div className="rewards row">
                    <div className="rewards-a col-lg-7 col-sm-10">
                        <div className="reward-a-1" style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                            <div>
                                <img src={defragimg} style={{ height: '4rem', fontSize: 'xxx-large' }}></img>
                            </div>
                            <div>
                                <span className="unclaimtxt">Unclaimed DEFRAG to vest</span>
                                <div>{console.log("here ==>", userallocation, useralocid)}
                                    <span style={{ fontSize: '25px' }}>{pendingdefrag}</span>
                                    <span style={{ fontSize: '15px' }}>Defrag ~ ${totalusdprice}</span>
                                </div>
                            </div>
                        </div>
                        <div className="reward-a-2" style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                            <div>
                                <FaUnlockAlt className="Lockicon" />
                            </div>
                            <div style={{ width: '70%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="unclaimtxt">Vesting Defrag</span>
                                    {useraloclength > 0 && <button className="seeschedule" style={{ fontSize: 'xx-small', fontWeight: '700', fontFamily: 'system-ui', backgroundColor: '#23b2ef' }} onClick={allocmodalopen}>see schedule</button>}
                                </div>
                                <div>
                                    <span style={{ fontSize: '25px' }}>{Math.round(pendingamount)}</span>
                                    <span style={{ fontSize: '15px' }}>Defrag ~ $100</span>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="col-lg-3 col-sm-10 rewards-X-I">
                        <div className="rewards-X">
                            <img src={defragimg} style={{ height: '4rem', backgroundColor: '#23b2ef', fontSize: 'xxx-large' }}></img>
                            <span>${Defragprice}</span>
                            <span className="icon" style={{ float: 'left' }} onClick={onToggle}>
                                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M455,113a15,15 0 01 19,0l29,29a15,15 0 01 0,19l-235,236a16,16 0 01-24,0l-235-236a15,15 0 01 0-19l29-29a15,15 0 01 19,0l199,199z" />
                                </svg>
                            </span>
                        </div>
                        {rewardssubmenuflag ?
                            <div className="rewards-X-sub" style={{ borderRadius: "20px" }}>
                                <div className="rewards-defrag-value">
                                    <FaCreditCard style={{ height: '4rem', fontSize: 'xxx-large' }} />
                                    <div className="defragvalue">
                                        <span>Your wallet</span>
                                        <span>{Defragbalence} Defrag</span>
                                    </div>
                                </div>
                                <div className="rewards-pancake r-com" onClick={buyDefrag}>
                                    <img src={pancakeimg} style={{ height: '4rem', fontSize: 'xxx-large' }}></img>
                                    <div className="cen-com">
                                        <span>Buy on pancakeswap</span>
                                    </div>
                                </div>
                                <div className="rewards-metamask r-com" onClick={addtokentowallet}>
                                    <img src={metamaskimg} style={{ height: '4rem', fontSize: 'xxx-large' }}></img>
                                    <div className="cen-com">
                                        <span>Add Defrag to metamask</span>
                                    </div>
                                </div>
                                <div className="rewards-viewcontract r-com" onClick={viewDefrag}>
                                    <img src={viewcontractimg} style={{ height: '4rem', fontSize: 'xxx-large' }}></img>
                                    <div className="cen-com">
                                        <span>View contract</span>
                                    </div>
                                </div>
                            </div> : <div></div>
                        }
                    </div>

                </div>
                : <div className="rewards-a walletnotconnect">
                    <span style={{ fontSize: '30px', fontWeight: '300' }}>Wallet Not connect</span>
                </div>
            }
            <Modal show={Modalopen} onHide={allocmodalclose}>
                <Modal.Header>
                    <div style={{ display: 'flex', alignItems: 'center', width: '80%' }}>
                        <div>
                            <FaUnlockAlt className="Lockicon" />
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="unclaimtxt">Total Vesting</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '25px' }}>{pendingamount}</span>
                                <span style={{ fontSize: '15px' }}>Defrag ~ $100</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingBottom: '50px' }}>
                        <FaWindowClose onClick={allocmodalclose} />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <span style={{ fontWeight: '200' }}>Defrag rewards are vested on a 6-month waterfall. This means your rewards will be available to claim 6-months after they're vested.</span>
                    {userclaimablelength > 0 && <button className="claimainbtn" onClick={allclaim}>Claim All  {userclaimablelength} &nbsp; Now</button>}
                    <div className="modalmainbody row">
                        <div className="modalsub1 col-4">
                            <span>vesting Amount</span>
                        </div>
                        <div className="modalsub2 col-4">
                            <span>started vestomg</span>
                        </div>
                        <div className="modalsub3 col-4">
                            <span>Claimable all</span>
                        </div>
                    </div>
                    {
                        useralocid.map((obj, key) => (
                            <div className="row" style={key % 2 === 0 ? { alignItems: 'center', backgroundColor: '#dbdcdd' } : { alignItems: 'center' }}>
                                <div className="col-4">
                                    <span style={{ fontWeight: '500' }}>{Math.round(userallocation[obj].amount / 10 ** 16) * 100}</span><span style={{ fontSize: '10px', fontWeight: '300', paddingLeft: '5px' }}>Defrag</span>
                                </div>
                                <div className="col-4" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: '500', alignSelf: 'start' }}>{userallocation[obj].start.getMonth() + 1}/{userallocation[obj].start.getDate()}/{userallocation[obj].start.getFullYear()}</span>
                                    <span style={{ fontSize: '10px', fontWeight: '300', alignSelf: 'start' }}>{userallocation[obj].different_month} months ago</span>
                                </div>
                                <div className="col-4" style={userallocation[obj].claimable ? { paddingLeft: '10px' } : {}}>
                                    {userallocation[obj].claimable ? <button style={{ backgroundColor: '#3182ce', fontSize: '10px' }} onClick={() => claim(userallocation[obj].aloc_id)}>Claim now</button> :
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '500', alignSelf: 'start' }}>{userallocation[obj].end_time.getMonth() + 1}/{userallocation[obj].end_time.getDate()}/{userallocation[obj].end_time.getFullYear()}</span>
                                            {userallocation[obj].day_flag ? <span style={{ fontSize: '10px', fontWeight: '300', alignSelf: 'start' }}>in &nbsp; {userallocation[obj].rest_time} days </span> :
                                                <span style={{ fontSize: '10px', fontWeight: '300', alignSelf: 'start' }}>in &nbsp; {userallocation[obj].rest_time} hours </span>}
                                        </div>}
                                </div>
                            </div>
                        ))}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" style={{ backgroundColor: '#3182ce' }} onClick={allocmodalclose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Reward_a;