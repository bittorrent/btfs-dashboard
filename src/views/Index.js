/*eslint-disable*/
import React from "react";
import ClipboardCopy from "components/Utils/ClipboardCopy";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import {t} from "utils/text.js";
import Emitter from "utils/eventBus";

export default function Index() {

    const showQR = (e, type) => {
        e.preventDefault();
        if (type === 'Cheque') {
            Emitter.emit('openQRModal', {address: chequeAddress});
        }
        if (type === 'BTTC') {
            Emitter.emit('openQRModal', {address: BTTCAddress});
        }
    };

    return (
        <>
            <IndexNavbar fixed/>

            <section>
                <div className="container mx-auto items-center flex flex-wrap" style={{height: '30vh'}}>
                    <div className="w-full text-xl">
                        <p>
                            BTFS(BitTorrent File System) 2.0 is the next-generation decentralized file storage system
                            built for web 3.0 Applications.
                            Now BTFS 2.0 is running on BTTC (Bittorrent Chain) and we use smart contracts to build our
                            infrastructure.
                        </p>
                        <p>
                            BTFS 2.1.2 - BTTC
                        </p>
                        <p>
                            HostID: 16Uiu2HAmCZPKQfnswhepBYeGdZFgFNyQe8ceVfaZi1pMd5wCuP6Y
                        </p>
                        <p>
                            BTTC Address: 0x379bb51db728d92e23cb23230639160aa9100ff0
                        </p>

                        <div className='flex justify-between items-center'>
                            <p>
                                BTTC Address: 0x379bb51db728d92e23cb23230639160aa9100ff0
                            </p>
                            <button
                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                            >
                                Reveal Private Key
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            <section>
                <div className="container mx-auto items-center flex flex-wrap" style={{height: '30vh'}}>
                    <div className="w-full text-xl">

                        <p>
                            At this point, Node’s BTTC address has been set up, before you become a BTFSer and start to
                            earn BTT, here is what you need to do:
                        </p>

                        <p className='font-semibold'>
                            Deposit at least 100 BTT to your node’s BTTC address.
                        </p>

                        <p>
                            * A node has to create its Vault smart contract on BTTC to associate with the BTFS network.
                            The creation of the Vault smart contract is an on-chain activity and it needs a gas fee
                            (which is paid by BTT) to proceed.
                            The 100 BTT is an estimated amount based on the average cost of the BTTC. BTFS team does not
                            receive any BTT.
                        </p>


                    </div>
                </div>
            </section>


            <section>
                <div className="container mx-auto items-center flex flex-wrap" style={{height: '30vh'}}>
                    <div className="w-full text-xl">
                        <div className='flex justify-between'>
                            <p>
                                If you are a newcomer of the BTFS and BTTC, please read articles below. You can also
                                contact us in BTFS community
                            </p>
                            <div className="">
                                <button
                                    className="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                                    type="button"
                                >
                                    <i className="fab fa-twitter"></i>
                                </button>
                                <button
                                    className="bg-white text-lightBlue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                                    type="button"
                                >
                                    <i className="fab fa-facebook-square"></i>
                                </button>
                                <button
                                    className="bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                                    type="button"
                                >
                                    <i className="fab fa-dribbble"></i>
                                </button>
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-4/12'>How to use Matemask to manage BTTC address ？</div>
                            <div className='w-4/12'>How do I get BTT/WBTT on the BTTC ？</div>
                            <div className='w-4/12'>What is BTFS 2.0 ？</div>
                        </div>

                    </div>
                </div>
            </section>


            <Footer/>
        </>
    );
}
