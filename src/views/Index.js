/*eslint-disable*/
import React, {useState, useEffect} from "react";
import ClipboardCopy from "components/Utils/ClipboardCopy";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import QRModal from "components/Modals/QRModal.js";
import MessageModal from "components/Modals/MessageModal.js";
import {t} from "utils/text.js";
import Emitter from "utils/eventBus";

export default function Index() {

    const [address, setAddress] = useState(null);
    const [ID, setID] = useState(null);
    const [version, setVersion] = useState(null);
    const [privateKey, setprivateKey] = useState(null);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            //     let {BTTCAddress} = await getChequeExpenseInfo();
            if (!didCancel) {
                setAddress('0x379bb51db728d92e23cb23230639160aa9100ff0');
                setID('16Uiu2HAmCZPKQfnswhepBYeGdZFgFNyQe8ceVfaZi1pMd5wCuP6Y');
                setVersion('2.1.1');
                setprivateKey('1234567890');
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    const showQR = (e, type) => {
        e.preventDefault();
        Emitter.emit('openQRModal', {address: address});
    };

    const showPrivateKey = (e, type) => {
        e.preventDefault();
        Emitter.emit('openMessageModal', {message: privateKey});
    };

    return (
        <>
            <IndexNavbar fixed/>

            <section>
                <div className='container mx-auto items-center flex flex-wrap'>
                    <div className='w-full text-xl'>
                        <div style={{
                            fontSize: '50px',
                            fontFamily: 'Avenir Heavy',
                            marginTop: '70px',
                            lineHeight: '76px'
                        }}>
                            Welcome to BTFS 2.0
                        </div>
                        <div style={{fontSize: '14px', marginTop: '10px', fontFamily: 'Avenir Book'}}>
                            <p style={{marginTop: '10px'}}>
                                BTFS(BitTorrent File System) 2.0 is the next-generation decentralized file storage
                                system
                                built for web 3.0 Applications.
                            </p>
                            <p style={{marginTop: '10px'}}>
                                Now BTFS 2.0 is running on BTTC (Bittorrent Chain) and we use smart contracts to build
                                our
                                infrastructure.
                            </p>
                        </div>
                        <div style={{marginTop: '55px', fontSize: '14px'}}>
                            <p style={{fontFamily: 'Avenir Heavy'}}>
                                BTFS 2.1.2 - BTTC
                            </p>
                            <p style={{fontFamily: 'Avenir Heavy', marginTop: '20px'}}>
                                HostID: <span style={{fontFamily: 'Avenir Book'}}>{ID}</span>
                            </p>

                            <div className='flex justify-between items-center'>
                                <div style={{marginTop: '20px'}}>
                                    <span style={{fontFamily: 'Avenir Heavy'}}>BTTC Address:</span>
                                    <span style={{fontFamily: 'Avenir Book'}}> {address}</span>
                                    <a onClick={showQR}><i className='fas fa-qrcode ml-2'></i></a>
                                    <ClipboardCopy value={address}/>
                                </div>
                                <button
                                    className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                                    type='button'
                                    onClick={showPrivateKey}
                                >
                                    Reveal Private Key
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{background: '#3257F6', marginTop: '60px'}}>
                <div className="container mx-auto items-center flex flex-wrap" style={{paddingTop: '90px'}}>
                    <div className="w-full text-xl">

                        <div style={{
                            background: 'white',
                            fontFamily: 'Avenir Black',
                            fontSize: '20px',
                            color: '#3257F6',
                            lineHeight: '60px',
                            width: '700px'
                        }}>
                            <i className="fas fa-exclamation-triangle" style={{marginLeft: '20px'}}></i>
                            <span
                                style={{marginLeft: '10px'}}>Deposit at least 100 BTT to your node’s BTTC address.</span>
                            <img className='float-right relative' src={require('../assets/img/coin.png').default}
                                 style={{width: '100px', height: '100px', bottom: '30px'}}/>
                        </div>

                        <p className=''
                           style={{fontFamily: 'Avenir Book', color: 'white', fontSize: '14px', marginTop: '20px'}}>
                            Before you become a BTFSer and start to earn BTT, you have to deposit a small amount of BTT
                            to continue. If the deposit is done, please wait for 30s and the procedure will go on
                            automatically.👆
                        </p>

                        <p className='' style={{
                            fontFamily: 'Avenir Book',
                            color: 'white',
                            fontSize: '14px',
                            marginTop: '35px',
                            marginBottom: '85px'
                        }}>
                            * A node has to create its Vault smart contract on BTTC to associate with the BTFS network.
                            The creation of the Vault smart contract is an on-chain activity and it needs a gas fee
                            (which is paid by BTT) to proceed. The 100 BTT is an estimated amount based on the average
                            cost of the BTTC. BTFS team does not receive any BTT.
                        </p>

                    </div>
                </div>
            </section>


            <section>
                <div className="container mx-auto items-center flex flex-wrap"
                     style={{paddingTop: '120px', paddingBottom: '140px'}}>
                    <div className="w-full text-xl">
                        <div className='flex justify-between items-center' style={{height: '50px'}}>
                            <div style={{fontFamily: 'Avenir Heavy', fontSize: '34px'}}>
                                Encounter problems？
                            </div>
                            <div>
                                <button
                                    className="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none "
                                    style={{marginLeft:'35px'}}
                                >
                                    <i className="fab fa-twitter"></i>
                                </button>
                                <button
                                    className="bg-white text-lightBlue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none"
                                    style={{marginLeft:'35px'}}
                                >
                                    <i className="fab fa-telegram"></i>
                                </button>
                                <button
                                    className="bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none"
                                    style={{marginLeft:'35px'}}
                                >
                                    <i className="fab fa-discord"></i>
                                </button>
                            </div>
                        </div>
                        <div style={{fontFamily: 'Avenir Book', fontSize: '14px'}}>
                            <p style={{marginTop:'10px'}}> If you are a newcomer of the BTFS and BTTC, please read articles below. </p>
                            <p style={{marginTop:'10px'}}> You can also contact us in BTFS community. 👉 </p>
                        </div>
                        <div className='flex font-semibold' style={{marginTop: '60px', fontSize: '20px'}}>
                            <div className='w-4/12 p-2 flex items-center'>
                                <img style={{width: '110px', height: '110px'}}
                                     src={require('../assets/img/img_left.png').default}/>
                                <p style={{marginLeft: '15px'}}>How to use Matemask to manage BTTC address ？</p>
                            </div>
                            <div className='w-4/12 p-2 flex items-center'>
                                <img style={{width: '110px', height: '110px'}}
                                     src={require('../assets/img/img_middle.png').default}/>
                                <p style={{marginLeft: '15px'}}>How do I get BTT/WBTT on the BTTC ？</p>
                            </div>
                            <div className='w-4/12 p-2 flex items-center'>
                                <img style={{width: '110px', height: '110px'}}
                                     src={require('../assets/img/img_right.png').default}/>
                                <p style={{marginLeft: '15px'}}>What is BTFS 2.0 ？</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <QRModal/>
            <MessageModal/>

        </>
    );
}
