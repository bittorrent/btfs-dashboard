/*eslint-disable*/
import React, {useEffect, useState, useCallback, useRef} from "react";
import { Pagination} from 'antd';
import PropTypes from "prop-types";
import {getRootFiles, getHashByPath, getFolerSize, getFiles, searchFiles} from "services/filesService.js";
import {switchStorageUnit2} from "utils/BTFSUtil.js";
import {t} from "utils/text.js";
import themeStyle from "utils/themeStyle.js";
import Emitter from "utils/eventBus";

let didCancel = false;
let filesAll = [];

export default function ReceivedFilesTable({color}) {

    const [files, setFiles] = useState(null);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);

    const sliceDate = (page) => {
        setFiles(filesAll.slice((page - 1) * 10, (page - 1) * 10 + 10));
    };

    const pageChange = useCallback((value) => {
        setCurrent(value);
        sliceDate(value)
    }, []);


    const viewContract = () => {
        Emitter.emit('openUploadContractModal');
    };

    const updateFiles = async () => {

    };


    useEffect(() => {
        const set = async function () {
            setTimeout(() => {
                updateFiles();
            }, 1000);
        };
        Emitter.on("updateFiles", set);
        return () => {
            Emitter.removeListener('updateFiles');
        }
    }, []);

    useEffect(() => {
        updateFiles();
        return () => {
            didCancel = true;
        };
    }, []);


    return (
        <>

            <div
                className={"relative flex flex-col min-w-0 break-words w-full shadow-lg rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative mr-4 flex-1 overflow-overlay">
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                        <tr className='text-xs uppercase whitespace-nowrap'>
                            <th className={"px-6 border border-solid border-l-0 border-r-0 py-3 text-left font-semibold " + (color === "light"
                                ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                            }
                                style={{width: '70%'}}
                            >
                                {t('file_name')}
                            </th>

                            <th className={"px-6 border border-l-0 border-r-0 border-solid py-3 text-center font-semibold " + (color === "light"
                                ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                            }>
                                {t('status')}
                            </th>

                            <th className={"px-6 border border-solid border-l-0 border-r-0 py-3 text-left font-semibold " + (color === "light"
                                ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                            }>
                                {t('size')}
                            </th>

                        </tr>
                        </thead>
                        <tbody>
                        {
                            files && files.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="px-6 text-xs break-all p-4 text-left"
                                            style={{minWidth: '350px'}}>
                                            <div className='flex'>
                                                <a className="flex items-center" onClick={() => {
                                                    addPath(item['Hash'], item['Name'], item['Type'], item['Size'])
                                                }}>

                                                    {item['Type'] === 1 && <img
                                                        src={require("assets/img/folder.png").default}
                                                        className="h-12 w-12 bg-white rounded-full border"
                                                        alt="..."
                                                    ></img>
                                                    }
                                                    {item['Type'] === 2 && <img
                                                        src={require("assets/img/file.png").default}
                                                        className="h-12 w-12 bg-white rounded-full border"
                                                        alt="..."
                                                    ></img>
                                                    }
                                                    <div className='flex flex-col justify-center'>
                                                        <span className="ml-3 font-bold">
                                                            {item['Name']}
                                                            </span>
                                                        <span className="ml-3 font-bold">
                                                            {item['Hash']}
                                                            </span>
                                                    </div>
                                                </a>
                                            </div>
                                        </td>

                                        <td className="">
                                            <img className='m-auto cursor-pointer'
                                                 src={require('../../assets/img/btfs_logo.png').default}
                                                 style={{width: '35px', height: '35px'}}
                                                 onClick={viewContract}
                                            />
                                        </td>

                                        <td className="px-6 text-xs whitespace-nowrap p-4">
                                            {switchStorageUnit2(item['Size'])}
                                        </td>

                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                    {
                        !files && <div className='w-full flex justify-center pt-4'>
                            <img alt='loading' src={require('../../assets/img/loading.svg').default}
                                 style={{width: '50px', height: '50px'}}/>
                        </div>
                    }
                    {
                        (files && total === 0) && <div className='w-full flex justify-center p-4'>
                            {t('no_data')}
                        </div>
                    }
                </div>
                <div className='flex justify-between items-center'>
                    <div className='p-4'>Total: {total}</div>
                    <Pagination className='float-right p-4' simple current={current} total={total}
                                hideOnSinglePage={true}
                                onChange={pageChange}/>
                </div>
            </div>
        </>
    );
}

ReceivedFilesTable.defaultProps = {
    color: "light",
};

ReceivedFilesTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
