import React, {useEffect, useState} from "react";
import HostScoreRingChart from "components/Charts/HostScoreRingChart.js";
import HostScoreProgressChart from "components/Charts/HostScoreProgressChart.js";
import {getHostScore} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";

let didCancel = false;

export default function CardHostScore({color}) {

    const [ringChartData, setRingChartData] = useState({
        score: 0,
        lastUpdated: 0
    });

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
        uploadWeight: 0
    });

    useEffect(() => {
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    const fetchData = async () => {
        didCancel = false;
        let {leftData, rightData} = await getHostScore();
        if (!didCancel) {
            setRingChartData(leftData);
            setProgressChartData(rightData);
        }
    };

    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4" + themeStyle.bg[color]}>
                <div className='flex'>
                    <div className='w-1/2 border-r pr-2'>
                        <HostScoreRingChart data={ringChartData} color={color}/>
                    </div>
                    <div className='w-1/2 pl-2'>
                        <HostScoreProgressChart data={progressChartData} color={color}/>
                    </div>
                </div>

            </div>
        </>
    );
}
