/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import { createPopper } from '@popperjs/core';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { resetS3AccessKey, deleteS3AccessKey } from 'services/s3Service';

const S3AccessKeyDropdown = ({ color, item, updateListFn }) => {
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();
    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: 'left-start',
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };

    useEffect(() => {
        const t = function () {
            closeDropdownPopover();
        };
        document.addEventListener('click', t);
        return () => {
            document.removeEventListener('click', t);
        };
    }, []);

    const reset = async () => {
        await resetS3AccessKey(item.key);
        await updateListFn();
        Emitter.emit('showMessageAlert', { message: 's3_access_key_reset_success', status: 'success', type: 'frontEnd' });

    };

    const handleReset = () => {
        Emitter.emit('openS3ResetAccessKeyModal', { callbackFn: reset })
    }


    const remove = async () => {
        await deleteS3AccessKey(item.key);
        await updateListFn();
        Emitter.emit('showMessageAlert', { message: 's3_access_key_delete_success', status: 'success', type: 'frontEnd' });
    };


    const handleRemove = () => {
        Emitter.emit('openS3DeleteAccessKeyModal', { callbackFn: remove })
    }

    const trigger = e => {
        e.preventDefault();
        setTimeout(() => {
            dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }, 50);
    };

    return (
        <>
            <a
                className="text-blueGray-500 py-1 px-3"
                ref={btnDropdownRef}
                onClick={e => {
                    trigger(e);
                }}>
                <i className="fas fa-ellipsis-v"></i>
            </a>
            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? 'block ' : 'hidden ') +
                    '_box-shadow text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 theme-bg'
                }>
                <a
                    className="text-sm py-2 px-4 font-normal w-full whitespace-nowrap bg-transparent flex items-center"
                    onClick={() => {
                        handleReset();
                    }}>
                    {/* <img className="mr-3" alt="" style={{ height: '15px' }} src={require('../../assets/img/s3/s3-reset.svg').default} /> */}
                    <i className="w-5 mr-3 fa-solid fa-rotate"></i>
                    {t('s3_btn_reset')}
                </a>
                <a
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent theme-text-error"
                    onClick={e => {
                        handleRemove();
                    }}>
                    <i className="w-5 mr-3 fas fa-trash-alt"></i>
                    {t('delete')}
                </a>
            </div>
        </>
    );
};

export default S3AccessKeyDropdown;

