/*eslint-disable*/
import React from 'react';
import { removeFiles } from "services/filesService.js";
import themeStyle from "utils/themeStyle.js";
import Emitter from "utils/eventBus";
import { t } from "utils/text.js";
import * as AWS from "@aws-sdk/client-s3";
import { downloadFile } from 'services/s3Service';

const { DeleteObjectsCommand, GetObjectCommand, CopyObjectCommand, ListObjectsCommand } = AWS;
const s3FileType = 's3File';

let isDelete = false;

export default function FileControl({ itemSelected, unSelect, color, data, type, bucketName, globalS3, prefix }) {

    const hideDownload = type === s3FileType && data.filter(item => item.Type === 1).length > 0;

    const listFilesInBucket = async (item) => {
        const command = new ListObjectsCommand({ Bucket: bucketName, Prefix: item.Key });
        const res = await globalS3.send(command);
        const { Contents = [] } = res;
        const keys = Contents.map((c) => c.Key);
        return keys;
    };

    const handleS3Remove = async () => {
        if(isDelete) return;
        isDelete = true;
        let keys = [];
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (item.Type === 2) {
                    keys.push(item.Key);
                } else {
                    const keysList = await listFilesInBucket(item);
                    keys.push(...keysList);
                }
            }
            const result = await s3Remove(keys);

            Emitter.emit('updateS3Files');

            if (result) {
                Emitter.emit('showMessageAlert', { message: 'delete_success', status: 'success', type: 'frontEnd' });
            } else {
                Emitter.emit('showMessageAlert', { message: 'delete_fail', status: 'error', type: 'frontEnd' });
            }
            unSelect();
        }
        isDelete = false;
    }

    const s3Remove = async (keys) => {
        try {
            const deleteObjectsCommand = new DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: { Objects: keys.map((key) => ({ Key: key })) },
            });
            const result = await globalS3.send(deleteObjectsCommand);
            return result;
        } catch (e) {
            console.log("err", e);
        }
    };

    const execDownload = async () => {
        const item = data[0];
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: item.Key,
        });
        const response = await globalS3.send(command);
        const arrayBuffer = await response.Body.transformToByteArray();
        await downloadFile(arrayBuffer, item.Name);
        unSelect();
    }

    const handleS3Download = () => {
        if (data.length) {
            const item = data[0];
            Emitter.emit('openS3DownloadModal', { name: item.Name, execDownload: execDownload });
        }
    }


    const download = async () => {
        if (type === s3FileType) {
            handleS3Download();
            return;
        }

        if (data.length === 1) {
            Emitter.emit('openDownloadModal', {
                hash: data[0].hash,
                name: data[0].name,
                size: data[0].size,
                type: data[0].type
            });
            unSelect();
        }
    };


    const remove = async () => {
        if (type === s3FileType) {
            await handleS3Remove();
            return;
        }
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                let result = await removeFiles(data[i].hash, data[i].name, data[i].path, data[i].type);
                if (result) {
                    Emitter.emit('showMessageAlert', { message: 'delete_success', status: 'success', type: 'frontEnd' });
                } else {
                    Emitter.emit('showMessageAlert', { message: 'delete_fail', status: 'error', type: 'frontEnd' });
                }
            }
            Emitter.emit('updateFiles');
            unSelect();
        }
    };




    return (
        <>
            <footer id="fileControl"
                className={"fixed md:left-64 bottom-0 z-50 bg-white shadow border-t " + themeStyle.text[color] + themeStyle.th[color]}>
                <div className="container mx-auto px-6">

                    <div className="flex flex-wrap items-center md:justify-between justify-center h-20">
                        <div className="text-sm font-semibold py-1 text-center md:text-left">
                            {t('items_selected')} : {itemSelected}
                        </div>
                        <div className="flex flex-wrap list-none md:justify-end  justify-center px-5">
                            <div>
                                <a className="text-center text-sm font-semibold block py-1 px-3"
                                    onClick={download}
                                    disabled={hideDownload ? true : (itemSelected === 1) ? false : true}
                                >
                                    <i className="text-lg fas fa-download"></i>
                                    <p>{t('download')}</p>
                                </a>
                            </div>
                            <div>
                                <a className="text-center text-sm font-semibold block py-1 px-3"
                                    onClick={remove}
                                    disabled={(itemSelected === 0) ? true : false}
                                >
                                    <i className="text-lg fas fa-trash-alt"></i>
                                    <p>{t('delete')}</p>
                                </a>
                            </div>
                        </div>
                        <div className="font-semibold py-1 text-center md:text-left">
                            <a onClick={unSelect}
                                disabled={(itemSelected === 0) ? true : false}
                            >
                                {t('unselect_all')}
                                <i className="fas fa-times pl-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
