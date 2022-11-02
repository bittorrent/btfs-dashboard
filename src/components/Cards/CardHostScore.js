import React, {useEffect, useState} from "react";
import HostScoreRingChart from "components/Charts/HostScoreRingChart.js";
import HostScoreProgressChart from "components/Charts/HostScoreProgressChart.js";
import {getHostAllScore} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";

let didCancel = false;
export default function CardHostScore({color}) {

    const [newRingChartData, setNewRingChartData] = useState({
        lastUpdated: 0,
        level: 0,
    });
    const [newProgressChartData, setNewProgressChartData] = useState({
        uptimeLevel: 0,
        ageLevel: 0,
        versionLevel: 0,
        activeLevel: 0,
    });

    const [newScoreInit, setNewScoreInit] = useState(true);

    useEffect(() => {
       
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    const fetchData = async () => {
        didCancel = false;
        const [data2] = await getHostAllScore();
        const newLeftData = data2.leftData;
        const newRightData = data2.rightData;
        if (!didCancel) {
            if(newLeftData.level){
                setNewRingChartData(newLeftData);
                setNewProgressChartData(newRightData);
                setNewScoreInit(false)
            }else{
                setNewScoreInit(true)
            }
            
        }
    };


    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4 " + themeStyle.bg[color] + themeStyle.text[color]}>
                <div className='flex'>
                    <div className='w-1/2 border-r pr-2'>
                       <HostScoreRingChart   data={newRingChartData}  color={color}/>
                    </div>
                    <div className='w-1/2 pl-2'>
                    <HostScoreProgressChart scoreInit={newScoreInit}  data={newProgressChartData} color={color}/>
                    </div>
                </div>

            </div>
        </>
    );
}
