import React, {memo, useEffect} from "react";
import {Chart} from "chart.js";
import {getChequeEarningHistory} from "services/chequeService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

function ChequeEarningLineChart({color}) {

    useEffect(() => {

        var config = {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Received',
                        borderColor: 'red',
                        backgroundColor: 'rgb(255, 99, 132, 0.3)',
                        data: [],
                        fill: false,
                        tension: 0,
                    },
                    {
                        label: 'Received Amount',
                        fill: false,
                        borderColor: 'blue',
                        backgroundColor: 'rgb(54, 162, 235, 0.3)',
                        data: [],
                        tension: 0,
                    },
                ]
            },

            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                var label = context.dataset.label || '';
                                if (context.datasetIndex === 1) {
                                    if (label) {
                                        label += ' : ' + context.parsed.y + ' WBTT ';
                                    }
                                }
                                if (context.datasetIndex === 0) {
                                    if (label) {
                                        label += ' : ' + context.parsed.y + ' ';
                                    }
                                }
                                return label;
                            }
                        }

                    },
                },
                responsive: false,
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
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
                    }
                }
            },
        };

        var content = document.getElementById('cheque-earning-line-chart-content');
        content.innerHTML = '&nbsp;';
        content.innerHTML = "<canvas id='cheque-earning-line-chart' style='height: 300px; width: 100%'></canvas>";

        var ctx = document.getElementById("cheque-earning-line-chart").getContext("2d");
        window.ChequeEarningLineChart = new Chart(ctx, config);

        update();

        return () => {
            if (window.ChequeEarningLineChart) {
                window.ChequeEarningLineChart.destroy();
                window.ChequeEarningLineChart = null;
            }
        }

    }, [color]);

    const update = async () => {
        let data = await getChequeEarningHistory();
        if (window.ChequeEarningLineChart) {
            window.ChequeEarningLineChart.data.labels = data.labels;
            console.log(data.labels, data.data[0]);
            window.ChequeEarningLineChart.data.datasets[0].data = data.data[1];
            window.ChequeEarningLineChart.data.datasets[1].data = data.data[0];
            window.ChequeEarningLineChart.update();
        }
    };

    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4" + themeStyle.bg[color]}>
                <div className="rounded-t mb-0 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                {t('cheque_earnings_history')}
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div id="cheque-earning-line-chart-content" className="relative h-300-px">
                        <canvas id="cheque-earning-line-chart" style={{height: '300px', width: '100%'}}></canvas>
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(ChequeEarningLineChart)