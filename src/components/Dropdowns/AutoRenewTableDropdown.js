/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import { createPopper } from '@popperjs/core';
// import { removeFiles } from 'services/filesService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

const AutoRenewTableDropdown = ({ color, size, cid, autorenewOn }) => {
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

    const disableAutoRenew = async () => {
        Emitter.emit('openDisableAutoRenewModal', { cid: cid,size: size, });
    };

    const enableAutoRenew = async () => {
        Emitter.emit('openEnableAutoRenewModal', { cid: cid,size: size });
    };

    const trigger = e => {
        e.preventDefault();
        setTimeout(() => {
            dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }, 50);
    };

    return (
        <>
            <a
                className="text-blueGray-500 py-1 px-3 hover-change  table-cell-actions "
                ref={btnDropdownRef}
                onClick={e => {
                    trigger(e);
                }}>
                {
                    // <i className="fas fa-ellipsis-v"></i>/
                }
                <img
                    alt=""
                    className={'hover-hidden mx-2 ' + (dropdownPopoverShow ? 'hidden' : 'show')}
                    src={require('../../assets/img/file-operate.svg').default}
                    style={{ width: '24px', height: '24px' }}
                />
                <img
                    alt=""
                    className={'hover-show mx-2 ' + (dropdownPopoverShow ? 'show' : 'hidden')}
                    src={require('../../assets/img/file-operate-active.svg').default}
                    style={{ width: '24px', height: '24px' }}
                />
            </a>
            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? 'block ' : 'hidden ') +
                    '_box-shadow text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-36 text-center theme-bg'
                }>
                {autorenewOn ? (
                    <a
                        className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
                        onClick={() => {
                            disableAutoRenew();
                        }}>
                        {t('disable_auto_renew')}
                    </a>
                ) : (
                    <a
                        className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
                        onClick={e => {
                            enableAutoRenew();
                        }}>
                        {t('enable_auto_renew')}
                    </a>
                )}
            </div>
        </>
    );
};

export default AutoRenewTableDropdown;
