import React from "react";
import {Progress} from 'antd';
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function HostScoreRingChart({color, data}) {

    return (
        <>
            <div className='h-full'>
                <div className="rounded-t mb-0 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className={"uppercase mb-1 text-xs font-semibold " + themeStyle.title[color]}>
                                {t('host_score')}
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="py-4 flex-auto">

                    <div className="relative flex flex-col justify-between items-center h-300-px">
                        <div className='mt-4'>
                            <Progress className={color} strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }} type="circle" percent={data.score*10} format={percent => `${percent/10}`}/>
                        </div>

                        {/* Divider */}
                        <hr className="my-4 md:min-w-full"/>

                        <div className='w-full text-left'>
                            <div>
                                {t('last_updated')}
                            </div>
                            <div>
                                { data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : '--' }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
