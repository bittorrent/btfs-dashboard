import React, {memo, useEffect, useState} from "react";
import {useIntl} from "react-intl";
import {Chart} from "chart.js";
import {getChequeExpenseAllHistory} from "services/chequeService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";
import {INIT_CHART_LINE_DATASETS} from "utils/constants.js";

function ChequeExpenseLineChart({color}) {

    const intl = useIntl();
    const [current, setCurrent] = useState('chequesNumber');
    const [expenseCurrencyAllHistoryData, setExpenseCurrencyAllHistoryData] = useState([]);

    useEffect(() => {
        const datasetsList = JSON.parse(JSON.stringify(INIT_CHART_LINE_DATASETS))
        const axisYConfig =
            current === 'chequesNumber'
                ? {
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: intl.formatMessage({ id: 'cheques_number' }),
                        color: color === 'light' ? 'black' : 'white',
                    },
                    ticks: {
                        color: color === 'light' ? 'black' : 'white',
                    },
                    min: 0,
                }
                : {
                    display: true,
                    position: 'left',
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: intl.formatMessage({ id: 'cheques_amount' }),
                        color: color === 'light' ? 'black' : 'white',
                    },
                    ticks: {
                        color: color === 'light' ? 'black' : 'white',
                    },
                    min: 0,
                }
        var config = {
            type: 'line',
            data: {
                labels: [],
                datasets: datasetsList,
            },

            options: {
                plugins: {
                    legend: {
                        // display: false
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                var label = context.dataset.label || '';
                                if (label) {
                                    if(current === 'chequesNumber'){
                                        label += ' : ' + context.parsed.y + ' ';
                                    }else{
                                        label += ' : ' + context.parsed.y + ' ' + label;
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
                    y: axisYConfig
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color, intl, current]);
    const getKeyData = (key,list ) =>{
        const data = list.find(item=>item.key === key);
        return data || {
            labels: [],
            data: []
        }
    }
    const update = async () => {
        let data = [];
        if(!expenseCurrencyAllHistoryData.length){
            data = await getChequeExpenseAllHistory();
            setExpenseCurrencyAllHistoryData(()=>data);
        }else{
            data = expenseCurrencyAllHistoryData;
        }
        let dataIndex = 1;
        if(current !== 'chequesNumber'){
            dataIndex = 0;
        }

        if (window.chequeExpenseLineChart) {
            window.chequeExpenseLineChart.data.labels = data?.[0]?.labels || [];
            INIT_CHART_LINE_DATASETS.forEach((item,index) => {
                window.chequeExpenseLineChart.data.datasets[index].data = getKeyData(item.label,data).data[dataIndex];
            });
            window.chequeExpenseLineChart.update();
        }
    };

    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4" + themeStyle.bg[color]}>
                <div className="rounded-t mb-0 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1 flex items-center">
                            <h6 className={"uppercase  mb-1 text-xs font-semibold " + themeStyle.title[color]}>
                                {t('cheque_expense_history')}
                            </h6>
                            <div className={"ml-2 " + themeStyle.bg[color]}>
                                <div
                                    onClick={() => setCurrent("chequesNumber")} 
                                    className={'inline-block h-6 pl-2 pr-2 rounded cursor-pointer ' + (current === 'chequesNumber' ? 'bg-black text-white ' : themeStyle.title[color])}
                                    style={{border: '1px solid #000', borderRadius: '0.5rem 0 0 0.5rem'}}
                                >
                                    {t('cheques_number')}
                                </div>
                                <div 
                                    onClick={() => setCurrent("chequesAmount")} 
                                    className={'inline-block h-6 pl-2 pr-2 rounded-r cursor-pointer ' + (current === 'chequesAmount' ? 'bg-black text-white ' : themeStyle.title[color])}
                                    style={{border: '1px solid #000', borderLeft: 'none', borderRadius: '0 0.5rem 0.5rem 0'}}
                                >
                                    {t('cheques_amount')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    {
                        current === 'chequesNumber' && 
                        <div id="cheque-expense-line-chart-content" className="relative h-300-px">
                            <canvas id="cheque-expense-line-chart" style={{height: '300px', width: '100%'}}></canvas>
                        </div>
                    }
                    {
                        current === 'chequesAmount' && 
                        <div id="cheque-expense-line-chart-content" className="relative h-300-px">
                            <canvas id="cheque-expense-line-chart" style={{height: '300px', width: '100%'}}></canvas>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}


export default memo(ChequeExpenseLineChart)