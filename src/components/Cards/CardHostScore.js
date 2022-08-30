import React, {useEffect, useState} from "react";
import HostScoreRingChart from "components/Charts/HostScoreRingChart.js";
import HostScoreProgressChart from "components/Charts/HostScoreProgressChart.js";
import HostWarning from "components/Warning/HostWarning.js";
import {getHostAllScore} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";
import Emitter from "utils/eventBus";

let didCancel = false;
export default function CardHostScore({color}) {

    const [ringChartData, setRingChartData] = useState({
        score: 0,
        lastUpdated: 0,
    });
    const [isNewVersion, setVersion] = useState(true);
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
    });
    const [newRingChartData, setNewRingChartData] = useState({
        lastUpdated: 0,
        level: 0,
    });
    const [newProgressChartData, setNewProgressChartData] = useState({
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
        const [data1,data2] = await getHostAllScore();
        const {leftData, rightData} = data1;
        const newLeftData = data2.leftData;
        const newRightData = data2.rightData;
        if (!didCancel) {
            if(leftData.score !== undefined) {
                setRingChartData(leftData);
                setProgressChartData(rightData);
                setScoreInit(false);
            } else {
                setScoreInit(true);
            }
            if(newLeftData.level){
                setNewRingChartData(newLeftData);
                setNewProgressChartData(newRightData);
            }
            
        }
    };


    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4 " + themeStyle.bg[color] + themeStyle.text[color]}>
                <div className='flex'>
                    <div className='w-1/2 border-r pr-2'>
                       <HostScoreRingChart  isNewVersion={isNewVersion} data={isNewVersion?newRingChartData:ringChartData}  color={color}/>
                    </div>
                    <div className='w-1/2 pl-2'>
                      {
                          !scoreInit && <HostScoreProgressChart isNewVersion={isNewVersion} data={isNewVersion?newProgressChartData:progressChartData} color={color}/>
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
