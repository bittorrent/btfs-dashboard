import React, {memo, useEffect} from "react";
import {Chart} from "chart.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

function ChequeIncomeLineChart({color}) {

    useEffect(() => {

        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: 'blue',
                    fill: false,
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
                            suggestedMin: -100,
                            suggestedMax: 100
                        }
                    }
                },
            };

        var content = document.getElementById('cheque-income-line-chart-content');
        content.innerHTML = '&nbsp;';
        content.innerHTML =  "<canvas id='cheque-income-line-chart' style='height: 300px; width: 100%'></canvas>";

        var ctx = document.getElementById("cheque-income-line-chart").getContext("2d");
        window.chequeIncomeLineChart = new Chart(ctx, config);

        return () => {
            if (window.chequeIncomeLineChart) {
                window.chequeIncomeLineChart.destroy();
                window.chequeIncomeLineChart = null;
            }
        }

    }, [color]);

    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4" + themeStyle.bg[color]}>
                <div className="rounded-t mb-0 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h5 className={" uppercase font-bold "  + themeStyle.title[color]}>
                                {t('cheque_earnings_history')}
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div id="cheque-income-line-chart-content" className="relative h-300-px">
                        <canvas id="cheque-income-line-chart" style={{height: '300px', width: '100%'}}></canvas>
                    </div>
                </div>
            </div>
        </>
    );
}


export default memo(ChequeIncomeLineChart)