/*eslint-disable*/
import React, {memo, useEffect, useCallback} from "react";
import {useIntl} from "react-intl";
import {Chart} from "chart.js";
import {Select} from 'antd';
import {getHostHistory} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

const {Option} = Select;

function HostScoreHistoryLineChart({color}) {

    const intl = useIntl();

    useEffect(() => {

        var config =
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            data: [],
                            borderColor: 'blue',
                            backgroundColor: 'rgb(54, 162, 235, 0.3)',
                            fill: true,
                            cubicInterpolationMode: 'monotone',
                        }
                    ]
                },

                options: {
                    bezierCurve: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: "index",
                            intersect: false,
                            callbacks:{
                                label:function(context){
                                    var label = intl.formatMessage({id: 'host_score'});
                                    if(label){
                                        label += ' : ' + context.parsed.y;
                                    }
                                    return label;
                                }
                            }

                        },
                    },
                    maintainAspectRatio: false,
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
                                text: intl.formatMessage({id: 'host_score'}),
                                color: color === 'light' ? 'black' : 'white'
                            },
                            ticks: {
                                color: color === 'light' ? 'black' : 'white'
                            },
                            suggestedMin: 0,
                            suggestedMax: 10
                        }
                    }
                },
            };

        var content = document.getElementById('host-score-history-line-chart-content');
        content.innerHTML = '&nbsp;';
        content.innerHTML =  "<canvas id='host-score-history-line-chart' style='height: 300px; width: 100%'></canvas>";

        var ctx = document.getElementById("host-score-history-line-chart").getContext("2d");
        window.hostScoreHistoryLineChart = new Chart(ctx, config);

        update('7d');

        return () => {
            if (window.hostScoreHistoryLineChart) {
                window.hostScoreHistoryLineChart.destroy();
                window.hostScoreHistoryLineChart = null;
            }
        }

    }, [color]);

    const handleChange = useCallback((value) => {
        update(value);
    }, []);

    const update = async (flag) => {
        let data = await getHostHistory(flag);
        if (window.hostScoreHistoryLineChart) {
            window.hostScoreHistoryLineChart.data.labels = data.labels;
            window.hostScoreHistoryLineChart.data.datasets[0].data = data.data;
            window.hostScoreHistoryLineChart.update();
        }
    };

    return (
        <>
            <div className={"relative flex flex-col h-400-px justify-center p-4" + themeStyle.bg[color]}>
                <div className="rounded-t mb-0 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className={"uppercase mb-1 text-xs font-semibold " + themeStyle.title[color]}>
                                {t('host_score_history')}
                            </h6>
                        </div>
                        <div>
                            <Select className={color} defaultValue="7d" style={{width: 180}} onChange={handleChange}
                                    dropdownStyle={{background: themeStyle.bg[color]}}>
                                <Option value="7d">{t('last')} 7 {t('days')}</Option>
                                <Option value="30d">{t('last')} 30 {t('days')}</Option>
                                <Option value="60d">{t('last')} 60 {t('days')}</Option>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div id='host-score-history-line-chart-content' className="relative h-300-px">
                        <canvas id="host-score-history-line-chart" style={{height: '300px', width: '100%'}}></canvas>
                    </div>
                </div>
            </div>
        </>
    );
}


export default memo(HostScoreHistoryLineChart)
