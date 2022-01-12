import React, {useState, useEffect} from "react";
import {Progress} from 'antd';
import {getFilesStorage} from "services/filesService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let strokeColor = {
    '0%': '#108ee9',
    '100%': '#87d068',
};

export default function FilesStats({color}) {

    const [capacity, setCapacity] = useState(0);
    const [storageUsed, setStorageUsed] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [filesCount, setFilesCount] = useState(0);

    useEffect( () => {
        let didCancel = false;
        const fetchData = async () => {
            let {capacity, storageUsed, percentage, filesCount} = await getFilesStorage();
            if (!didCancel) {
                setCapacity(capacity);
                setStorageUsed(storageUsed);
                setPercentage(percentage);
                setFilesCount(filesCount);
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    return (
        <>
            <div className="pb-2">
                <div className="mx-auto w-full">
                        <div className="flex flex-wrap">
                            <div className="w-full xl:w-6/12 xl:pr-2">
                                    <div className={"break-words rounded mb-2 xl:mb-0  " + themeStyle.bg[color] + themeStyle.text[color]}>
                                        <div className="flex flex-col justify-between p-4 h-125-px">
                                            <div>
                                                <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                                    {t('storage')}
                                                </h5>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div>
                                                    <span className='font-semibold text-xl'> {storageUsed} </span> / {capacity}
                                                </div>
                                                <div>
                                                    <i className='dot dot_blue mr-2'></i> {percentage}% {t('occupied')}
                                                </div>
                                            </div>
                                            <div>
                                                <Progress className={color} percent={percentage} showInfo={false} strokeWidth={30} strokeColor={strokeColor}/>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="w-full xl:w-6/12 xl:pl-2">
                                    <div className={"break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                                        <div className="flex flex-col justify-between p-4 h-125-px">
                                            <div>
                                                <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                                    {t('chunks')}
                                                </h5>
                                            </div>
                                            <div className="font-semibold text-xl">
                                                {filesCount}
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                </div>
            </div>
        </>
    );
}
