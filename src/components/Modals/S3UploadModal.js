import React, { useEffect, useState, useRef } from 'react';
import { Progress } from 'antd';
import Emitter from 'utils/eventBus';
import themeStyle from 'utils/themeStyle.js';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
// import * as AWS from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { throttle } from 'lodash';
// const { PutObjectCommand } = AWS;

let globalS3Obj = null;
let bucketName = null;
let storagePercentage = 0;
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
            storagePercentage = 0;
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

    const onUploadProgress = (size, totalSize, progress, progressStorage) => {
        let curPercentage = 0;
        if (progress && progressStorage) {
            if (!progressStorage[progress.part]) {
                progressStorage[progress.part] = {};
            }
            progressStorage[progress.part].loaded = progress.loaded;
            let loadedSizeList = [];
            for (let key in progressStorage) {
                loadedSizeList.push(progressStorage[key].loaded);
            }
            loadedSizeList.sort((a, b) => b - a);
            size += loadedSizeList[0];
            curPercentage = Math.round((size / totalSize) * 100);
            if (curPercentage > 98) {
                curPercentage = 98;
            }
        } else {
            curPercentage = Math.round((size / totalSize) * 100);
        }

        if (storagePercentage !== 100) {
            setPercentage(curPercentage);
            storagePercentage = curPercentage;
        }

    }



    const upload = async (input, path, label) => {
        reset();
        let totalSize = 0;
        totalSize = input.reduce((accumulator, item) => accumulator + item.size, 0);
        let size = 0;

        for (let file of input) {
            console.log("file", file);
            let progressStorage = {};
            const upload = new Upload({
                client: globalS3Obj,
                params: {
                    Bucket: bucketName,
                    Body: file.content,
                    Key: encodeURIComponent(path + file.path),
                    queueSize: 4, // optional concurrency configuration
                    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
                    leavePartsOnError: false,
                },
            });
            // eslint-disable-next-line no-loop-func
            upload.on("httpUploadProgress", throttle((progress) => {
                onUploadProgress(size, totalSize, progress, progressStorage)
                // console.log("PROGRESS: ", progress);
            }, 400));
            await upload.done();
            size += file.size;
            onUploadProgress(size, totalSize);
            // console.log("UPLOAD COMPLETE");
            // const response = await globalS3Obj.send(
            //     new PutObjectCommand({
            //         Bucket: bucketName,
            //         Body: file.content,
            //         Key: encodeURIComponent(path + file.path),
            //     })
            // );
            // uploadFile(file, path)
            // .then((presignedRequest) => trackUploadProgress(presignedRequest, file))
            // .then((response) => console.log("Upload successful", response))
            // .catch((error) => console.error("Upload failed", error));
            // size += file.size;
            // onUploadProgress(size, totalSize)
            // console.log("response", response);
        }


        // setPercentage(100);
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
