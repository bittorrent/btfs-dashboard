/*eslint-disable*/
import React, {memo, useEffect} from "react";
import {useIntl} from "react-intl";
import {Chart} from "chart.js";
import {getNetworkFlow} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let data = {
    labels: [],
    data: [[], []]
};

let interval = null;

function NetworkLineChart({color}) {

    const intl = useIntl();

    useEffect(() => {
        var config = {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: intl.formatMessage({id: 'receive'}),
                        borderColor: "#4c51bf",
                        backgroundColor: "#4c51bf",
                        data: [],
                        fill: false,
                        tension: 0,
                    },
                    {
                        label: intl.formatMessage({id: 'send'}),
                        fill: false,
                        borderColor: "#ed64a6",
                        backgroundColor: "#ed64a6",
                        data: [],
                        tension: 0,
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: color === 'light' ? 'black' : 'white'
                        }
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                        callbacks:{
                            label:function(context){
                                var label = context.dataset.label ||'';
                                if(label){
                                    label += ' : ' + context.parsed.y + ' M/s ';
                                }
                                return label;
                            }
                        }

                    },
                },
                maintainAspectRatio: false,
                responsive: false,
                title: {
                    display: false,
                    text: "Sales Charts",
                },

                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true
                        },
                        ticks: {
                            color: color === 'light' ? 'black' : 'white'
                        },
                    },
                    y: {
                        min: 0,
                        display: true,
                        title: {
                            display: true,
                            text: 'M / s',
                            color: color === 'light' ? 'black' : 'white'
                        },
                        ticks: {
                            color: color === 'light' ? 'black' : 'white'
                        },
                    }
                },
            },
        };

        var content = document.getElementById('network-line-chart-content');
        content.innerHTML = '&nbsp;';
        content.innerHTML =  "<canvas id='network-line-chart' style='height: 300px; width: 100%'></canvas>";

        var ctx = document.getElementById("network-line-chart").getContext("2d");
        window.networkLineChart = new Chart(ctx, config);

        update();

        return () => {
            if (window.networkLineChart) {
                window.networkLineChart.destroy();
                window.networkLineChart = null;
            }
            if (interval) {
                clearInterval(interval);
            }

        }

    }, [color, intl]);

    const update = async () => {

        fetchData();

        interval = setInterval(async () => {
            fetchData();
        }, 60000);

    };

    const fetchData = async () => {
        let {receive, send} = await getNetworkFlow();
        let date = new Date();
        let time = date.getHours() + ':' + date.getMinutes();
        data.labels.push(time);
        data.data[0].push(receive);
        data.data[1].push(send);
        if (window.networkLineChart) {
            window.networkLineChart.data.labels = data.labels;
            window.networkLineChart.data.datasets[0].data = data.data[0];
            window.networkLineChart.data.datasets[1].data = data.data[1];
            window.networkLineChart.update();
        }
    };


    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4" + themeStyle.bg[color]}>
                <div className="rounded-t mb-0 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className={"uppercase mb-1 text-xs font-semibold " + themeStyle.title[color]}>
                                {t('bandwidth_over_time')}
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div id="network-line-chart-content" className="relative h-300-px">
                        <canvas id="network-line-chart" style={{height: '300px', width: '100%'}}></canvas>
                    </div>
                </div>
            </div>
        </>
    );
}


export default memo(NetworkLineChart)