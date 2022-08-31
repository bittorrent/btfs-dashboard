import React from "react";
import {Progress} from 'antd';
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let strokeColor = {
    '0%': '#108ee9',
    '100%': '#87d068',
};

export default function HostScoreRingChart({color,isNewVersion, data}) {
    const scoreConfig = {
        1: {
            color: "#C33730",
            text: "poor",
          },
          2: {
            color: "#F99600",
            text: "general",
          },
          3: {
            color: "#2EBBB9",
            text: "good",
          },
          4: {
            color: "#06A561",
            text: "excellent",
          },
      };
      const level = data.level || 1;
      const scoreLevelObj = scoreConfig[level] 
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
                        {isNewVersion ? (
                            data.level?
                            <Progress
                            strokeColor={scoreLevelObj.color}
                            type="circle"
                            percent={100}
                            format={() => (
                                <div className="flex flex-col items-center">
                                <div
                                    className="fs-20 font-bold"
                                    style={{ color: scoreLevelObj.color }}
                                >
                                    {t(scoreLevelObj["text"])}
                                </div>
                                </div>
                            )}
                            />:''
                        ) : (
                            <Progress
                            className={color}
                            strokeColor={strokeColor}
                            type="circle"
                            percent={data.score * 10}
                            format={(percent) => `${percent / 10}`}
                            />
                        )}
                            
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
