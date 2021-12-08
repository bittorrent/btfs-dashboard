import React, {useEffect, useState} from "react";
import NetworkDoughnutChart from "components/Charts/NetworkDoughnutChart.js";
import themeStyle from "utils/themeStyle.js";
import {getNetworkFlow} from "services/dashboardService.js";
import {t} from "utils/text.js";

let didCancel = false;

export default function CardNetworkFlow({color}) {

    const [receive, setReceive] = useState(0);
    const [send, setSend] = useState(0);

    useEffect(() => {
        fetchData();
        let interval = setInterval(() => {
            fetchData();
        }, 6000);
        return () => {
            didCancel = true;
            clearInterval(interval);
        }

    }, [])

    const fetchData = async () => {
        didCancel = false;
        let data = await getNetworkFlow();
        if (!didCancel) {
            setReceive(data['receive']);
            setSend(data['send']);
        }
    }

    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4" + themeStyle.bg[color]}>
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className={"uppercase mb-1 text-xs font-semibold " + themeStyle.title[color]}>
                                {t('network_traffic')}
                            </h6>
                        </div>
                    </div>
                </div>

                <div className='p-4 flex-auto'>
                    <div className='flex flex-col relative h-300-px'>
                        <div className='w-full'>
                            <NetworkDoughnutChart data={receive} id={'network-flow-doughnut-chart-upper'}
                                                  color={color} text={'receive'}/>
                        </div>
                        <div className='w-full mt-2'>
                            <NetworkDoughnutChart data={send} id={'network-flow-doughnut-chart-lower'}
                                                  color={color} text={'send'}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
