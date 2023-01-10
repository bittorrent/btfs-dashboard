import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Emitter from 'utils/eventBus';
import { useIntl } from 'react-intl';
import CommonModal from './CommonModal';

export default function OnlineProofDetailModal() {
    const [detail, setDetail] = useState();
    const [bttcAddr, setBttcAddr] = useState();
    const [showModal, setShowModal] = useState(false);
    const intl = useIntl();
    const fm = intl.formatMessage;

    useEffect(() => {
        const set = function ({ item, bttcAddr } = {}) {
            openModal();
            setDetail(item);
            setBttcAddr(bttcAddr);
        };
        Emitter.on('openOnlineProofDetailModal', set);
        return () => {
            Emitter.removeListener('openOnlineProofDetailModal');
            window.body.style.overflow = '';
        };
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
            label: fm({ id: 'online_proof_table_detail_last_signature' }),
            value: detail?.last_signature ?? '--',
        },
        {
            label: fm({ id: 'online_proof_table_detail_peer_id' }),
            value: detail?.last_signed_info?.peer ?? '--',
        },
        {
            label: fm({ id: 'online_proof_table_detail_create_time' }),
            value: moment(detail?.last_time).format('YYYY-MM-DD HH:mm:ss') ?? '--',
        },
        {
            label: fm({ id: 'online_proof_table_detail_version' }),
            value: detail?.last_signed_info?.version ?? '--',
        },
        {
            label: fm({ id: 'online_proof_table_detail_nonce' }),
            value: detail?.last_signed_info?.nonce ?? '--',
        },
        {
            label: fm({ id: 'online_proof_table_detail_bttc_address' }),
            value: bttcAddr ?? '--',
        },
        {
            label: fm({ id: 'online_proof_table_detail_signed_time' }),
            value: moment.unix(detail?.last_signed_info?.signed_time).format('YYYY-MM-DD HH:mm:ss') ?? '--',
        },
    ];

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-between theme-bg theme-text-main">
                    <div className="flex flex-col">
                        {cardConfig.map((item, index) => (
                            <DetailItem item={item} key={item.label} isLast={cardConfig.length - 1 === index} />
                        ))}
                    </div>
                </main>
            </div>
        </CommonModal>
    );
}

function DetailItem({ item, isLast }) {
    const { label, value } = item;
    return (
        <div className={'w-full ' + (isLast ? '' : 'mb-8')}>
            <div className="font-bold text-base leading-none theme-text-main">{label}</div>
            <div className="mt-4 text-xs leading-none break-words theme-text-sub-main">{value}</div>
        </div>
    );
}
