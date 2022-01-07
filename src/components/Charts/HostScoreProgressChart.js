import React from "react";
import {Progress} from 'antd';
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let strokeColor = {
    '0%': '#108ee9',
    '100%': '#87d068',
};

export default function HostScoreProgressChart({color, data}) {

    return (

        <>
            <div className='h-full'>

                <div className='title'>
                    <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                        <div className="flex flex-wrap items-center">
                            <div className="relative w-full max-w-full flex-grow flex-1">
                                <h6 className={"uppercase mb-1 text-xs font-semibold " + themeStyle.title[color]}>
                                    {t('host_score_factor')} ({t('weight')})
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pl-4 flex-auto">

                    <div className="flex flex-col justify-between px-2 h-300-px">


                        <div className='whitespace-nowrap'>{t('online_duration')} ({data.uptimeWeight * 100} %)</div>
                        <Progress className={color} strokeColor={strokeColor} percent={data.uptimeScore * 10}
                                  format={() => (data.uptimeScore)}/>


                        <div className='whitespace-nowrap'>{t('host_age')} ({data.ageWeight * 100} %)</div>
                        <Progress className={color} strokeColor={strokeColor} percent={data.ageScore * 10}
                                  format={() => (data.ageScore)}/>


                        <div className='whitespace-nowrap'>{t('version')} ({data.versionWeight * 100} %)</div>
                        <Progress className={color} strokeColor={strokeColor} percent={data.versionScore * 10}
                                  format={() => (data.versionScore)}/>


                        <div className='whitespace-nowrap'>{t('download')} ({data.downloadWeight * 100} %)</div>
                        <Progress className={color} strokeColor={strokeColor} percent={data.downloadScore * 10}
                                  format={() => (data.downloadScore)}/>

                        <div className='whitespace-nowrap'>{t('upload')} ({data.uploadWeight * 100} %)</div>
                        <Progress className={color} strokeColor={strokeColor} percent={data.uploadScore * 10}
                                  format={() => (data.uploadScore)}/>

                    </div>
                </div>
            </div>
        </>
    );
}
