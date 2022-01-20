import React, {memo, useEffect} from "react";
import {useIntl} from "react-intl";
import {Chart} from "chart.js";
import {getChequeExpenseHistory} from "services/chequeService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

function ChequeExpenseLineChart({color}) {

    const intl = useIntl();

    useEffect(() => {

        var config = {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Sent',
                        borderColor: 'red',
                        backgroundColor: 'rgb(255, 99, 132, 0.3)',
                        data: [],
                        fill: false,
                        tension: 0,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Sent Amount',
                        fill: false,
                        borderColor: 'blue',
                        backgroundColor: 'rgb(54, 162, 235, 0.3)',
                        data: [],
                        tension: 0,
                        yAxisID: 'y1',
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
                            display: true
                        },
                        ticks: {
                            color: color === 'light' ? 'black' : 'white'
                        },
                    },
                    y: {
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: intl.formatMessage({id: 'cheques_number'}),
                            color: color === 'light' ? 'black' : 'white'
                        },
                        ticks: {
                            color: color === 'light' ? 'black' : 'white'
                        },
                        min: 0,
                    },
                    y1: {
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                        title: {
                            display: true,
                            text: 'WBTT',
                            color: color === 'light' ? 'black' : 'white'
                        },
                        ticks: {
                            color: color === 'light' ? 'black' : 'white'
                        },
                        min: 0,
                    }
                }
            },
        };

        var content = document.getElementById('cheque-expense-line-chart-content');
        content.innerHTML = '&nbsp;';
        content.innerHTML = "<canvas id='cheque-expense-line-chart' style='height: 300px; width: 100%'></canvas>";

        var ctx = document.getElementById("cheque-expense-line-chart").getContext("2d");
        window.chequeExpenseLineChart = new Chart(ctx, config);

        update();

        return () => {
            if (window.chequeExpenseLineChart) {
                window.chequeExpenseLineChart.destroy();
                window.chequeExpenseLineChart = null;
            }
        }

    }, [color, intl]);

    const update = async () => {
        let data = await getChequeExpenseHistory();
        if (window.chequeExpenseLineChart) {
            window.chequeExpenseLineChart.data.labels = data.labels;
            console.log(data.labels, data.data[0]);
            window.chequeExpenseLineChart.data.datasets[0].data = data.data[1];
            window.chequeExpenseLineChart.data.datasets[1].data = data.data[0];
            window.chequeExpenseLineChart.update();
        }
    };

    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4" + themeStyle.bg[color]}>
                <div className="rounded-t mb-0 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className={"uppercase  mb-1 text-xs font-semibold " + themeStyle.title[color]}>
                                {t('cheque_expense_history')}
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div id="cheque-expense-line-chart-content" className="relative h-300-px">
                        <canvas id="cheque-expense-line-chart" style={{height: '300px', width: '100%'}}></canvas>
                    </div>
                </div>
            </div>
        </>
    );
}


export default memo(ChequeExpenseLineChart)