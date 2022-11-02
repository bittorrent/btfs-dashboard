import React from "react";
import {Progress} from 'antd';
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";
import HostWarning from "components/Warning/HostWarning.js";



export default function HostScoreProgressChart({color, data,scoreInit}) {
    const list = new Array(3).fill("");
    const progressData = [
        {
          id: 1,
          text: "online_duration",
          level: data.uptimeLevel,
        },
        {
            id: 2,
            text: "host_age",
            level: data.ageLevel,
          },
          {
            id: 3,
            text: "version",
            level: data.versionLevel,
          },
          {
            id: 4,
            text: "online_active",
            level: data.activeLevel,
          },
      ];
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
                {scoreInit && <HostWarning/>}
                {
                    !scoreInit && <div className="pl-4 flex-auto">
                    <div className="flex flex-col justify-between px-2 h-300-px">
                        {progressData.map((item) => {
                            return (
                            <div key={item.id} className="w-full">
                                <div className="flex justify-between fs-14 base-main-color">
                                <span>{t(item.text)}</span>
                                <span>{item.level}/3</span>
                                </div>
                                <div className="flex justify-between flex-1 py-1">
                                {list.map((child, index) => {
                                    return (
                                    <>
                                        <Progress
                                        key={index}
                                        percent={item.level > index ? 100 : 0}
                                        showInfo={false}
                                        trailColor="#ECF2FF"
                                        strokeColor="#3257f6"
                                        />
                                        {index < 2 ? (
                                        <div style={{ width: "20px" }}></div>
                                        ) : (
                                        ""
                                        )}
                                    </>
                                    );
                                })}
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
                }
            </div>
        </>
    );
}
