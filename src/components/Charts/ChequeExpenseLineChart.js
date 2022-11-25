import React, {memo, useEffect, useState, useCallback} from "react";
import {useIntl} from "react-intl";
import {Chart} from "chart.js";
import {Menu} from 'antd';
import {getChequeExpenseAllHistory} from "services/chequeService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";
import {INIT_CHART_LINE_DATASETS} from "utils/constants.js";

function ChequeExpenseLineChart({color}) {

    const intl = useIntl();
    const [current, setCurrent] = useState('chequesNumber');
    const [expenseCurrencyAllHistoryData, setExpenseCurrencyAllHistoryData] = useState([]);
    const handleClick = useCallback(e => {
        console.log('click ', e.key);
        setCurrent(e.key);
    }, []);

    useEffect(() => {
        const datasetsList = JSON.parse(JSON.stringify(INIT_CHART_LINE_DATASETS)).map(item=>{
            if(current === 'chequesNumber'){
                item['yAxisID'] = 'y';
            }else{
                item['yAxisID'] = 'y1';
            }
            
            return item;
        })

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
                                        label += ' : ' + context.parsed.y + ' WBTT ';
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
        let dataIndex = 0;
        if(current !== 'chequesNumber'){
            dataIndex = 1;
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
                            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"
                                    style={{'background': 'transparent',minWidth:"300px"}} >
                                <Menu.Item key="chequesNumber">
                                    <h5 className={"uppercase cheques-tab-item  " + themeStyle.title[color]}>
                                        <span style={{fontSize:'0.65rem'}}> {t('cheques_number')}</span>
                                    </h5>
                                </Menu.Item>
                                <Menu.Item key="chequesAmount">
                                    <h5 className={"uppercase cheques-tab-item " + themeStyle.title[color]}>
                                        <span style={{fontSize:'0.65rem'}}> {t('cheques_amount')}</span>
                                    </h5>
                                </Menu.Item>
                            </Menu>
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