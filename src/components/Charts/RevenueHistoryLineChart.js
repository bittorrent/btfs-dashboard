import React, {memo, useEffect} from "react";
import {Chart} from "chart.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

function RevenueHistoryLineChart({color}) {
    useEffect(() => {

        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: 'red',
                    backgroundColor: 'rgb(255, 99, 132, 0.3)',
                    fill: true,
                    cubicInterpolationMode: 'monotone',
                    tension: 0
                }
            ]
        };

        var config =
            {
                type: 'line',
                data: data,

                options: {
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    responsive: false,
                    interaction: {
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
                            display: true,
                            title: {
                                display: true,
                                text: 'Value',
                                color: color === 'light' ? 'black' : 'white'
                            },
                            ticks: {
                                color: color === 'light' ? 'black' : 'white'
                            },
                            suggestedMin: -100,
                            suggestedMax: 100
                        }
                    }
                },
            };


        var content = document.getElementById('revenue-history-line-chart-content');
        content.innerHTML = '&nbsp;';
        content.innerHTML =  "<canvas id='revenue-history-line-chart' style='height: 300px; width: 100%'></canvas>";

        var ctx = document.getElementById("revenue-history-line-chart").getContext("2d");
        window.revenueHistoryLineChart = new Chart(ctx, config);

        return () => {
            if (window.revenueHistoryLineChart) {
                window.revenueHistoryLineChart.destroy();
                window.revenueHistoryLineChart = null;
            }
        }

    }, [color]);

    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center mb-4" + themeStyle.bg[color]}>
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className={"uppercase mb-1 text-xs font-semibold " + themeStyle.title[color]}>
                                {t('earning_history')}
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div id="revenue-history-line-chart-content" className="relative h-300-px">
                        <canvas id="revenue-history-line-chart" style={{height: '300px', width: '100%'}}></canvas>
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(RevenueHistoryLineChart)