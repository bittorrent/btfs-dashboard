import React, { useEffect, useRef } from 'react';
import Emitter from 'utils/eventBus';
import CommonModal from './CommonModal';

export default function CheckDetailModal() {
    const [showModal, setShowModal] = React.useState(false);
    const CheckDetailData = useRef({ title: '', dataList: [] });

    useEffect(() => {
        const set = function (params) {
            console.log('openCheckDetailModal event has occured');
            console.log('openCheckDetailModal event has occured', params);
            openModal();
            CheckDetailData.current = params;
        };
        Emitter.on('openCheckDetailModal', set);
        return () => {
            Emitter.removeListener('openCheckDetailModal');
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

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className={'common-modal-wrapper theme-bg'}>
                <header className="common-modal-header theme-text-main">{CheckDetailData.current.title}</header>
                <main className="w-full flex flex-wrap">
                    {CheckDetailData.current.dataList.map((item, index) => {
                        return (
                            <div key={index} className="w-1/2 px-8 py-4">
                                <div className="flex items-center">
                                    <img src={require(`assets/img/${item.icon}.svg`).default} alt="" className="mr-2" />
                                    <div>
                                        <div className="font-bold theme-text-main">
                                            {item.value}&nbsp;&nbsp;{item.unit}
                                        </div>
                                        <div className="theme-text-main">≈{item.bttValue} BTT</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </main>
            </div>
        </CommonModal>
    );
}
