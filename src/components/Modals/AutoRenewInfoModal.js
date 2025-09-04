import React, { useEffect, useRef, useState } from 'react';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { Spin } from 'antd';
import CommonModal from './CommonModal';
import { getRenewInfo } from 'services/filesService.js';
import { renderNestedJson } from 'utils/text.js';

export default function AutoRenewInfoModal() {
    const [showModal, setShowModal] = useState(false);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [curHash, setCurHash] = useState(null);
    const CheckDetailData = useRef({ title: '', dataList: [] });

    useEffect(() => {
        const set = function (params) {
            console.log('openAutoRenewInfoModal event has occured', params);
            openModal();
            CheckDetailData.current = params;
        };
        Emitter.on('openAutoRenewInfoModal', set);
        return () => {
            Emitter.removeListener('openAutoRenewInfoModal');
            window.body.style.overflow = '';
        };
    }, []);

    const openModal = () => {
        setShowModal(true);
        getInfo();
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        window.body.style.overflow = '';
    };

    const getInfo = async () => {
        // Emitter.emit('handleResetConfig', {});
        // let res = await getRenewInfo();
        let res = {
            cid: 'string',
            shards_info: [
                {
                    shard_id: 'string',
                    ShardSize: 0,
                    sp_id: 'string',
                },
            ],
            renewal_duration: 0,
            token: 'string',
            price: 0,
            enabled: true,
            total_pay: 0,
            created_at: 'string',
            next_renewal_at: 'string',
        };
        console.log(res, '----ress');
        setInfo(res);
    };





    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className={'common-modal-wrapper theme-bg'}>
                <header className="common-modal-header theme-text-main mb-2">{t('renew_file_info')}</header>
                <main className="mb-4 text-xs font-medium mb-4 theme-text-sub-info">{t('renew_file_info_desc')}</main>

                {
                    //     CheckDetailData.current.dataList.map((item, index) => {
                    //     return (
                    //         <div key={index} className="w-1/2 px-8 py-4">
                    //             <div className="flex items-center">
                    //                 <img src={require(`assets/img/${item.icon}.svg`).default} alt="" className="mr-2" />
                    //                 <div>
                    //                     <div className="font-bold theme-text-main">
                    //                         {item.value}&nbsp;&nbsp;{item.unit}
                    //                     </div>
                    //                     <div className="theme-text-main">≈{item.bttValue} BTT</div>
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     );
                    // })
                }
                <Spin spinning={loading}>
                    <main className="w-full flex flex-wrap ">
                        {info && (
                            <div className="theme-fill-gray w-full p-2 common-card theme-text-main info-modal">

                                {
                                    renderNestedJson(info)
                                    //  <div className="flex items-center theme-text-main">
                                    //     <div className="font-bold theme-text-main">{t('renew_file_info')}: </div>
                                    //     <div className="theme-text-main">{info.cid}</div>
                                    // </div>
                                }
                            </div>
                        )}
                    </main>
                </Spin>
            </div>
        </CommonModal>
    );
}
