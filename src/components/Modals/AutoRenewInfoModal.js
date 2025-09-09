import React, { useEffect, useRef, useState } from 'react';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { Spin } from 'antd';
import CommonModal from './CommonModal';
import { getRenewInfo } from 'services/filesService.js';
import { renderNestedJson } from 'utils/text.js';
import { toThousands ,switchBalanceUnit} from 'utils/BTFSUtil';
import moment from 'moment';

export default function AutoRenewInfoModal() {
    const [showModal, setShowModal] = useState(false);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [curHash, setCurHash] = useState(null);
    const CheckDetailData = useRef(null);

    useEffect(() => {
        const set = function (params) {
            // console.log('openAutoRenewInfoModal event has occured', params);
            CheckDetailData.current = params.file_hash;
            openModal();
        };
        Emitter.on('openAutoRenewInfoModal', set);
        return () => {
            Emitter.removeListener('openAutoRenewInfoModal');
            window.body.style.overflow = '';
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     if (CheckDetailData.current) {
    //         getInfo();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [CheckDetailData.current]);

    const openModal = () => {
        if (CheckDetailData.current) {
            getInfo();
        }
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setLoading(false);
        setShowModal(false);
        window.body.style.overflow = '';
    };


    const getInfo = async () => {
        setLoading(true);
        let res = await getRenewInfo(CheckDetailData.current);
        if (res?.Type === 'error') {
            closeModal();
            Emitter.emit('showMessageAlert', {
                message: res?.Message, //|| 'set_renew_on_fail'
                status: 'error',
            });
            return;
        }
        if(res?.cid){
            let info = {};
            for (const key in res) {
                switch (key) {
                    case 'price':
                        info['price'] = toThousands(res[key]) + ' BTT';
                        break;
                    case 'enabled':
                        info['auto_renewal'] = res[key];
                        break;
                    case 'total_pay':
                        info['total_pay'] = switchBalanceUnit(res[key]);
                        break;
                    case 'created_at':
                        info['created_at'] = moment(res[key]).utcOffset(480).format('YYYY-MM-DD HH:mm:ss');
                        break;
                    case 'next_renewal_at':
                        res.enabled && (info.next_renewal_at = moment(res[key]).utcOffset(480).format('YYYY-MM-DD HH:mm:ss'));
                        break;
                    default:
                        info[key] = res[key];
                }
            }


            setInfo(info);
        }
        setLoading(false);
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal} width={600}>
            <div className={'common-modal-wrapper theme-bg'}>
                <header className="common-modal-header theme-text-main mb-2">{t('renew_file_info')}</header>
                <main className="mb-4 text-xs font-medium mb-4 theme-text-sub-info">
                    {t('renew_file_info_desc')}
                </main>

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
