/*eslint-disable*/
import React, {useState, useEffect} from "react";
import ClipboardCopy from "components/Utils/ClipboardCopy";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
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
                    <div className='w-full text-xl relative'>
                        <div className='avenir-heavy' style={{fontSize: '50px', marginTop: '70px', lineHeight: '76px'}}>
                            {t('welcome_to_btfs')}
                        </div>
                        <div className='avenir-book' style={{fontSize: '14px', marginTop: '10px'}}>
                            <p style={{marginTop: '10px'}}>
                                {t('section_1_description_1')}
                            </p>
                            <p style={{marginTop: '10px'}}>
                                {t('section_1_description_2')}
                            </p>
                        </div>
                        <div style={{marginTop: '55px', fontSize: '14px'}}>
                            <p className='avenir-heavy'>
                                <i className="fas fa-code-branch" style={{marginRight: '10px'}}></i>
                                BTFS 2.1.2 - BTTC
                            </p>
                            <p className='avenir-heavy' style={{marginTop: '20px'}}>
                                <i className="fas fa-fingerprint" style={{marginRight: '10px'}}></i>
                                HostID: <span className='avenir-book'>{ID}</span>
                            </p>

                            <div className='flex items-center' style={{marginTop: '20px'}}>
                                <div>
                                    <i className="far fa-address-card" style={{marginRight: '10px'}}></i>
                                    <span className='avenir-heavy'>BTTC {t('address')}:</span>
                                    <span className='avenir-book'> {address}</span>
                                    <a onClick={showQR}>
                                        <i className='fas fa-qrcode ml-2' style={{marginLeft: '15px'}}></i>
                                    </a>
                                    <ClipboardCopy value={address}/>
                                </div>
                                <button
                                    className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                                    style={{marginLeft: '25px'}}
                                    onClick={showPrivateKey}
                                >
                                    {t('reveal_private_key')}
                                </button>
                            </div>
                        </div>
                        <img className='absolute' src={require('../assets/img/folder.png').default}
                             style={{width: '145px', height: '145px', top: '60px', right: '100px'}}/>
                    </div>
                </div>
            </section>

            <section style={{background: '#3257F6', marginTop: '60px'}}>
                <div className="container mx-auto items-center flex flex-wrap" style={{paddingTop: '90px'}}>
                    <div className="w-full text-xl">

                        <div className='avenir-black bg-white' style={{fontSize: '20px', color: '#3257F6', lineHeight: '60px', width: '700px'}}>
                            <i className="fas fa-exclamation-triangle" style={{marginLeft: '20px'}}></i>
                            <span style={{marginLeft: '10px'}}>{t('section_2_title')}</span>
                            <img className='float-right relative' src={require('../assets/img/coin.png').default}
                                 style={{width: '100px', height: '100px', bottom: '30px'}}/>
                        </div>

                        <p className='avenir-book text-white' style={{fontSize: '14px', marginTop: '20px'}}>
                            {t('section_2_description_1')} 👆
                        </p>

                        <p className='avenir-book text-white'
                           style={{fontSize: '14px', marginTop: '35px', marginBottom: '85px'}}>
                            {t('section_2_description_2')}
                        </p>

                    </div>
                </div>
            </section>


            <section>
                <div className="container mx-auto items-center flex flex-wrap"
                     style={{paddingTop: '120px', paddingBottom: '140px'}}>
                    <div className="w-full text-xl">
                        <div className='flex justify-between items-center' style={{height: '50px'}}>
                            <div className='avenir-heavy' style={{fontSize: '34px'}}>
                                {t('encounter_problem')}
                            </div>
                            <div>
                                <button
                                    className="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none "
                                    style={{marginLeft: '35px'}}
                                >
                                    <i className="fab fa-twitter"></i>
                                </button>
                                <button
                                    className="bg-white text-lightBlue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none"
                                    style={{marginLeft: '35px'}}
                                >
                                    <i className="fab fa-telegram"></i>
                                </button>
                                <button
                                    className="bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none"
                                    style={{marginLeft: '35px'}}
                                >
                                    <i className="fab fa-discord"></i>
                                </button>
                            </div>
                        </div>
                        <div className='avenir-book' style={{fontSize: '14px'}}>
                            <p style={{marginTop: '10px'}}>{t('section_3_description_1')}</p>
                            <p style={{marginTop: '10px'}}>{t('section_3_description_2')} 👉 </p>
                        </div>
                        <div className='flex font-semibold' style={{marginTop: '60px', fontSize: '20px'}}>
                            <div className='w-4/12 p-2'>
                                 <a className='flex items-center' href='https://docs.btfs.io/docs/btfs-20-airdrop-account-management' target='_blank'>
                                    <img style={{width: '110px', height: '110px'}}
                                         src={require('../assets/img/img_left.png').default}/>
                                    <p style={{marginLeft: '15px'}}>{t('section_3_slogan_1')}</p>
                                 </a>
                            </div>
                            <div className='w-4/12 p-2'>
                                <a className='flex items-center' href='https://docs.btfs.io/docs/how-to-get-bttwbtt' target='_blank'>
                                    <img style={{width: '110px', height: '110px'}}
                                         src={require('../assets/img/img_middle.png').default}/>
                                    <p style={{marginLeft: '15px'}}>{t('section_3_slogan_2')}</p>
                                </a>
                            </div>
                            <div className='w-4/12 p-2'>
                                <a className='flex items-center' href='https://docs.btfs.io/docs' target='_blank'>
                                    <img style={{width: '110px', height: '110px'}}
                                         src={require('../assets/img/img_right.png').default}/>
                                    <p style={{marginLeft: '15px'}}>{t('section_3_slogan_3')}</p>
                                </a>
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
