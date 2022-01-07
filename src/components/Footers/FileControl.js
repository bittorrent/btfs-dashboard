/*eslint-disable*/
import React from "react";
import {removeFiles} from "services/filesService.js";
import themeStyle from "utils/themeStyle.js";
import Emitter from "utils/eventBus";
import {t} from "utils/text.js";

export default function FileControl({itemSelected, unSelect, color, data}) {

    const download = async () => {
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
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                let result = await removeFiles(data[i].hash, data[i].name, data[i].path, data[i].type);
                if (result) {
                    Emitter.emit('showMessageAlert', {message: 'delete_success', status: 'success', type: 'frontEnd'});
                } else {
                    Emitter.emit('showMessageAlert', {message: 'delete_fail', status: 'error', type: 'frontEnd'});
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
                                <a className={"text-center  text-sm font-semibold block py-1 px-3 "}
                                   onClick={download}
                                   disabled={(itemSelected === 1) ? false : true}
                                >
                                    <i className="text-lg fas fa-download"></i>
                                    <p>{t('download')}</p>
                                </a>
                            </div>

                            <div>
                                <a className={"text-center  text-sm font-semibold block py-1 px-3 "}
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
