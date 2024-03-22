/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import { createPopper } from '@popperjs/core';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import * as AWS from "@aws-sdk/client-s3";

const { DeleteBucketCommand } = AWS;

const S3BucketDropdown = ({ color, item, globalS3, bucketName }) => {
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

    const deleteBucket = async () => {
        try {
            const command = new DeleteBucketCommand({ Bucket: item.Name });
            const response = await globalS3.send(command);
            console.log("response", response);
            Emitter.emit('updateS3Buckets');
            Emitter.emit('showMessageAlert', { message: 's3_bucket_delete_success', status: 'success', type: 'frontEnd' });
            return true;
        } catch (e) {
            Emitter.emit('showMessageAlert', { message: 's3_bucket_delete_fail', status: 'error', type: 'frontEnd' });
            return false;
        }
    };


    const remove = async (e) => {
        Emitter.emit("openS3DeleteBucketModal", { callbackFn: deleteBucket })
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
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent theme-text-error"
                    onClick={remove}>
                    <i className="w-5 mr-3 fas fa-trash-alt"></i>
                    {t('s3_delete_bucket')}
                </a>
            </div>
        </>
    );
};

export default S3BucketDropdown;

