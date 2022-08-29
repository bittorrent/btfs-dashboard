import React, {useEffect, useState} from "react";
import HostScoreRingChart from "components/Charts/HostScoreRingChart.js";
import HostScoreProgressChart from "components/Charts/HostScoreProgressChart.js";
import HostWarning from "components/Warning/HostWarning.js";
import {getHostScore,getHostVersion} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";
import {versionStringCompare} from "utils/BTFSUtil.js";
import Emitter from "utils/eventBus";

let didCancel = false;

export default function CardHostScore({color}) {

    const [ringChartData, setRingChartData] = useState({
        score: 0,
        lastUpdated: 0,
        level: 0,
    });
    const [isNewVersion, setVersion] = useState(false);
    const [initIsNewVersion, setInitVersion] = useState(false);
    const [progressChartData, setProgressChartData] = useState({
        uptimeScore: 0,
        uptimeWeight: 0,
        ageScore: 0,
        ageWeight: 0,
        versionScore: 0,
        versionWeight: 0,
        downloadScore: 0,
        downloadWeight: 0,
        uploadScore: 0,
        uploadWeight: 0,
        uptimeLevel: 0,
        ageLevel: 0,
        versionLevel: 0,
        activeLeve: 0,
    });

    const [scoreInit, setScoreInit] = useState(true);
    const handleSwitchVersion = (versionStatus)=>{
        setVersion(versionStatus);
    }
    useEffect(() => {
        Emitter.on("handleSwitchVersion", handleSwitchVersion);
        fetchData();
        return () => {
            didCancel = true;
            Emitter.removeListener("handleSwitchVersion");
        };
    }, []);

    const fetchData = async () => {
        didCancel = false;
        const version = await getHostVersion();
        const compareVersion = versionStringCompare(version) > -1;
        let {leftData, rightData} = await getHostScore();
        if (!didCancel) {
            setVersion(compareVersion);
            setInitVersion(compareVersion);
            if(leftData.score !== undefined) {
                setRingChartData(leftData);
                setProgressChartData(rightData);
                setScoreInit(false);
            } else {
                setScoreInit(true);
            }
        }
    };

    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4 " + themeStyle.bg[color] + themeStyle.text[color]}>
                <div className='flex'>
                    <div className='w-1/2 border-r pr-2'>
                       <HostScoreRingChart data={ringChartData} isNewVersion={isNewVersion} color={color}/>
                    </div>
                    <div className='w-1/2 pl-2'>
                      {
                          !scoreInit && <HostScoreProgressChart initIsNewVersion={initIsNewVersion} isNewVersion={isNewVersion} data={progressChartData} color={color}/>
                      }
                      {
                          scoreInit && <HostWarning />
                      }
                    </div>
                </div>

            </div>
        </>
    );
}
