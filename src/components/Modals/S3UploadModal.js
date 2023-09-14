import React, { useEffect, useState, useRef } from 'react';
import { Progress } from 'antd';
import Emitter from 'utils/eventBus';
import themeStyle from 'utils/themeStyle.js';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
import * as AWS from "@aws-sdk/client-s3";
const { PutObjectCommand } = AWS;

let globalS3Obj = null;
let bucketName = null;
export default function S3UploadModal({ color }) {
    const name = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [err, setErr] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const set = async function (params) {
            console.log("globalS3Obj", params.globalS3Obj);
            globalS3Obj = params.globalS3Obj;
            bucketName = params.bucketName;
            console.log('openS3UploadModal event has occured');
            openModal();
            name.current = params.data[0].path.split('/')[0];
            await upload(params.data, params.path, name.current);
            Emitter.emit('updateS3Files');
        };
        Emitter.on('openS3UploadModal', set);
        return () => {
            Emitter.removeListener('openS3UploadModal');
            window.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onUploadProgress = (progress, totalSize) => {
        let percentage = Math.round((progress / totalSize) * 100);
        setPercentage(percentage);
    }

    const upload = async (input, path, label) => {
        reset();
        let totalSize  = 0;
        totalSize = input.reduce((accumulator,item)=>accumulator+item.size, 0);
        let size = 0;
        for (let file of input) {
            console.log("file", file);
           const response =  await globalS3Obj.send(
              new PutObjectCommand({
                Bucket: bucketName,
                Body: file.content,
                Key: encodeURIComponent(path+file.path),
              })
            );
            size += file.size;
            onUploadProgress(size, totalSize)
            console.log("response", response);
        }
        setPercentage(100);
        // let result = await uploadFiles(input, path, onUploadProgress(name.current), setErr, setMessage);
        // if (result && label === name.current) {
        //     setPercentage(100);
        // }
    };

    const reset = () => {
        setErr(false);
        setMessage(null);
        setPercentage(0);
    };

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        reset();
        setShowModal(false);
        window.body.style.overflow = '';
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-center items-center theme-bg theme-text-main">
                    <div className="font-semibold mb-4"> {t('upload_status')} </div>
                    {!err && <Progress type="circle" percent={percentage} />}
                    {err && <Progress type="circle" percent={percentage} status="exception" />}
                    <div className="font-semibold mt-4 w-full overflow-auto text-center">
                        {t('uploading')} &nbsp;
                        <span className={themeStyle.title[color]}>{name.current}</span>
                    </div>
                    {message && <div className="font-semibold mt-4 w-full overflow-auto text-center"> {message} </div>}
                    <div style={{ height: '25px' }}>
                        {!err && percentage === 0 && (
                            <img
                                alt=""
                                style={{ height: '25px' }}
                                src={require('../../assets/img/bar-loading.svg').default}
                            />
                        )}
                    </div>
                </main>
            </div>
        </CommonModal>
    );
}
