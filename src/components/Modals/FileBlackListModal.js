import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getFileBlackList, addFileBlackList } from 'services/filesService.js';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Input } from 'antd';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
import isIPFS from 'is-ipfs';

const { TextArea } = Input;

export default function EncryptFileModal({ color, closeModal, showModal = false }) {
    const intl = useIntl();
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [listVal, setListVal] = useState('');
    const [initListVal, setInitListVal] = useState('');
    const [validateMsg, setValidateMsg] = useState('');

    const getFileBlackListData = async () => {
        setLoading(true);
        let listData = (await getFileBlackList()) || [];
        setLoading(false);
        let listStr = listData.join('\n') || '';
        setListVal(listStr);
        setInitListVal(listStr);
    };

    useEffect(() => {
        if (showModal) {
            setValidateMsg('');
            getFileBlackListData();
        }
        // Emitter.on('openDecryptFileModal', set);
        return () => {
            // Emitter.removeListener('openDecryptFileModal');
            window.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);

    useEffect(() => {
        setIsEdit(false);
    }, [showModal]);

    const validateCid = val => {
        let res = isIPFS.cid(val);
        if (res) {
            setValidateMsg('');
            return true;
        }
        return false;
    };

    // const validateListVal = val => {
    //     console.log(val,'11')
    //     let reg = /^[A-Za-z0-9]+$/;
    //     if (!val || reg.test(val)) {
    //         setValidateMsg('');
    //         return true;
    //     }
    //     if (!reg.test(val)) {
    //         setValidateMsg(t('validate_file_blacklist_cid1'));
    //         return false;
    //     }
    //     return true;
    // };

    const changeListVal = e => {
        setListVal(e.target.value);
    };

    const editFileList = () => {
        setIsEdit(!isEdit);
    };

    const cancelEdit = () => {
        setValidateMsg('');
        setListVal(initListVal);
        setIsEdit(false);
    };

    const saveFileList = async () => {
        // if (listVal && !validateListVal(listVal)) {
        //     return;
        // }
        // if(!listVal){
        //     setValidateMsg(t('validate_file_blacklist_cid1'))
        //     return
        // }
        let listArr = listVal.split('\n');
        let validateCids = true;
        for (var v in listArr) {
            if (listArr[v] && !validateCid(listArr[v])) {
                validateCids = false;
                break;
            }
        }
        if (!validateCids) {
            setValidateMsg(t('validate_file_blacklist_cid2'));
            return;
        }

        try {
            await addFileBlackList(listArr, true);
            setLoading(false);
            setInitListVal(listVal);
            setIsEdit(false);
            Emitter.emit('showMessageAlert', {
                message: 'add_file_blacklist_success',
                status: 'success',
                type: 'frontEnd',
            });
            closeModal()
        } catch (e) {
            Emitter.emit('showMessageAlert', { message: e.Message, status: 'error' });
        }
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-center theme-bg theme-text-main">
                    <img
                        alt=""
                        src={require(`../../assets/img/cid-blacklist.png`).default}
                        className="mb-4"
                        width={43}
                    />
                    <div className="font-semibold  text-xl  mb-2"> {t('file_blacklist_title')} </div>
                    <div className="text-xs font-medium  theme-text-sub-info">{t('file_blacklist_desc')}</div>
                    <div className="text-xs font-medium mb-4 theme-text-sub-info">
                        {t('file_blacklist_desc2')}
                    </div>

                    <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                        <TextArea
                            className="w-full h-3   theme-bg theme-border-color  rounded-lg h-400-px"
                            style={{ height: 400 }}
                            readOnly={!isEdit}
                            onChange={changeListVal}
                            value={listVal}
                            placeholder={intl.formatMessage({ id: 'file_blacklist_cid_placeholder' })}
                        />

                        <div className="flex justify-between  w-full  mb-4">
                            <span className="theme-text-error text-xs pt-1">{validateMsg}</span>
                        </div>
                        {isEdit ? (
                            <div className="mt-2 text-right">
                                <button
                                    className="ml-2 common-btn theme-fill-gray text-gray-900 mr-4"
                                    onClick={cancelEdit}>
                                    {t('file_blacklist_cancel')}
                                </button>

                                <div className="ml-2 inline-block">
                                    <button
                                        type="primary"
                                        className="common-btn theme-common-btn"
                                        onClick={saveFileList}>
                                        {t('file_blacklist_save')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 text-right">
                                <button
                                    className="ml-2 common-btn theme-fill-gray text-gray-900 mr-4"
                                    onClick={closeModal}>
                                    {t('file_blacklist_close')}
                                </button>
                                <div className="ml-2 inline-block">
                                    <Spin
                                        spinning={loading}
                                        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                                        <button
                                            type="primary"
                                            className="common-btn theme-common-btn"
                                            onClick={editFileList}>
                                            {t('file_blacklist_edit')}
                                        </button>
                                    </Spin>
                                </div>
                            </div>
                        )}
                    </Spin>
                </main>
            </div>
        </CommonModal>
    );
}
