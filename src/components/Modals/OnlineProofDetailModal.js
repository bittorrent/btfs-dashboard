
import React, {useState, useEffect, useContext} from "react";
import moment from 'moment';
import {mainContext} from "reducer";
import ButtonCancel from "components/Buttons/ButtonCancel.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";
import { useIntl } from 'react-intl'

export default function OnlineProofDetailModal() {
    const {state} = useContext(mainContext);
    const {sidebarShow, theme} = state;
    const [detail, setDetail] = useState();
    const [bttcAddr, setBttcAddr] = useState();
    const [showModal, setShowModal] = useState(false);
    const intl = useIntl();
    const fm = intl.formatMessage;

    useEffect(() => {
        const set = function ({item, bttcAddr} = {}) {
            openModal();
            setDetail(item);
            setBttcAddr(bttcAddr);
        };
        Emitter.on("openOnlineProofDetailModal", set);
        return () => {
            Emitter.removeListener('openOnlineProofDetailModal');
            window.body.style.overflow = '';
        }
    }, []);

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        window.body.style.overflow = '';
    };

    const cardConfig = [
        {
            label: fm({id:'online_proof_table_detail_last_signature'}),
            value: detail?.last_signature ?? '--',
        },
        {
            label: fm({id:'online_proof_table_detail_peer_id'}),
            value: detail?.last_signed_info?.peer ?? '--',
        },
        {
            label: fm({id:'online_proof_table_detail_create_time'}),
            value: moment(detail?.last_time).format('YYYY-MM-DD HH:mm:ss') ?? '--',
        },
        {
            label: fm({id:'online_proof_table_detail_version'}),
            value: detail?.last_signed_info?.version ?? '--',
        },
        {
            label: fm({id:'online_proof_table_detail_nonce'}),
            value: detail?.last_signed_info?.nonce ?? '--',
        },
        {
            label: fm({id:'online_proof_table_detail_bttc_address'}),
            value: bttcAddr ?? '--',
        },
        {
            label: fm({id:'online_proof_table_detail_signed_time'}),
            value: moment.unix(detail?.last_signed_info?.signed_time).format('YYYY-MM-DD HH:mm:ss') ?? '--',
        }
    ]


    return (
        <>
            {showModal ? (
                <>
                    <div className={"fixed flex z-50 rounded-lg md:w-1/3 modal_center md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "") + themeStyle.bg[theme]}
                        style={{height: 'max-content'}}
                        >
                        <div className="flex-1 w-full">
                            {/*content*/}
                            <div className={"w-full h-full border-0 rounded-lg shadow-lg flex flex-col justify-between p-8 pb-4" + themeStyle.bg[theme] + themeStyle.text[theme]}>
                                <main className="flex flex-col">
                                    {cardConfig.map(item => <DetailItem item={item} key={item.label}/>)}
                                </main>
                                <footer className="flex justify-center">
                                    <ButtonCancel event={closeModal} text={t('cancel')}/>
                                </footer>
                            </div>
                        </div>
                    </div>
                    <div className="bg-opacity-50 bg-black absolute top-0 left-0 w-full h-full inset-0 z-40"></div>
                </>
            ) : null}
        </>
    );
}

function DetailItem ({item}) {
    const {label, value} = item;
    const {theme} = useContext(mainContext);
    return (
        <div className={'w-full p-2 mb-2' + themeStyle.text[theme]}>
            <div className="font-bold text-lg">{label}</div>
            <div className="mt-1 break-words">{value}</div>
        </div>
    )
}