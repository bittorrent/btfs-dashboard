import React, { useEffect, useRef, useState } from 'react';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { Spin } from 'antd';
import CommonModal from './CommonModal';
import { switchBalanceUnit, switchStorageUnit2 ,toThousands} from 'utils/BTFSUtil.js'; //toThousands
// import { getRenewInfo } from 'services/filesService.js';
import { renderNestedJson } from 'utils/text.js';
import moment from 'moment';

export default function ProxyUploadModal({ color }) {
    const [showModal, setShowModal] = useState(false);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const Info = useRef(null);

    useEffect(() => {
        const set = function (params) {
            // console.log('openProxyUploadModal event has ocscured', params);
            openModal();
            Info.current = params;
        };
        Emitter.on('openProxyUploadModal', set);
        return () => {
            Emitter.removeListener('openProxyUploadModal');
            window.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        formatInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Info.current]);

    const openModal = () => {
        setShowModal(true);
        // getInfo();
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setInfo(null);
        setShowModal(false);
        window.body.style.overflow = '';
    };

    const formatInfo = async () => {
        let formatInfos = {};
        if (!Info.current) return;
        // setInfo(Info.current);
        // setLoading(false)
        let infos = Info.current;
        setLoading(true);
        for (const key in infos) {
            switch (key) {
                case 'price':
                    // formatInfos['price'] = toThousands(res[key]) + ' BTT';
                    formatInfos['price'] = toThousands(infos[key]) + ' BTT';
                    break;
                case 'file_size':
                    // formatInfos['price'] = toThousands(res[key]) + ' BTT';
                    formatInfos['file_size'] = switchStorageUnit2(infos[key]);
                    break;
                case 'total_pay':
                    formatInfos['total_pay'] = switchBalanceUnit(infos[key]);
                    break;
                case 'created_at':
                    formatInfos['created_at'] = moment
                        .unix(infos[key])
                        .utcOffset(480)
                        .format('YYYY-MM-DD HH:mm:ss');
                    break;
                default:
                    formatInfos[key] = infos[key];
            }
        }
        setInfo(formatInfos);
        setLoading(false);
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className={'common-modal-wrapper theme-bg'}>
                <header className="common-modal-header theme-text-main mb-2">{t('proxy_file_info')}</header>
                <main className="mb-4 text-xs font-medium mb-4 theme-text-sub-info">
                    {t('proxy_file_info_desc')}
                </main>

                <Spin spinning={loading}>
                    <main className="w-full flex flex-wrap ">
                        {info && (
                            <div className="theme-fill-gray w-full p-2 common-card theme-text-main info-modal">
                                {renderNestedJson(info)}
                            </div>
                        )}
                    </main>
                </Spin>
            </div>
        </CommonModal>
    );
}
