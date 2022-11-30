import React, { memo, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Chart } from 'chart.js'
import { getChequeEarningAllHistory } from 'services/chequeService.js'
import themeStyle from 'utils/themeStyle.js'
import { t } from 'utils/text.js'
import { INIT_CHART_LINE_DATASETS } from 'utils/constants'

function RevenueHistoryLineChart({ color }) {
    const intl = useIntl()
    useEffect(() => {
        const datasetsList = JSON.parse(
            JSON.stringify(INIT_CHART_LINE_DATASETS)
        ).map((item) => {
            return item
        })

        const data = {
            labels: [],
            datasets: datasetsList,
        }

        var config = {
            type: 'line',
            data: data,

            options: {
                plugins: {
                    legend: {
                        // display: false,
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                var label = ''
                                label += ' ' + context.parsed.y + ' BTT '
                                return label
                            },
                        },
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
                            color: color === 'light' ? 'black' : 'white',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: intl.formatMessage({ id: 'cheques_number' }),
                            color: color === 'light' ? 'black' : 'white',
                        },
                        ticks: {
                            color: color === 'light' ? 'black' : 'white',
                        },
                        min: 0,
                    },
                },
            },
        }

        var content = document.getElementById('revenue-history-line-chart-content')
        content.innerHTML = '&nbsp;'
        content.innerHTML =
            "<canvas id='revenue-history-line-chart' style='height: 300px; width: 100%'></canvas>"

        var ctx = document
            .getElementById('revenue-history-line-chart')
            .getContext('2d')
        window.revenueHistoryLineChart = new Chart(ctx, config)

        const update = async () => {
            let data = await getChequeEarningAllHistory()
            if (window.revenueHistoryLineChart) {
                //   window.revenueHistoryLineChart.data.labels = data.labels
                //   window.revenueHistoryLineChart.data.datasets[0].data = data.data[0]
                //   window.revenueHistoryLineChart.update()
    
                window.revenueHistoryLineChart.data.labels = data?.[0]?.labels || []
                INIT_CHART_LINE_DATASETS.forEach((item, index) => {
                    window.revenueHistoryLineChart.data.datasets[index].data = getKeyData(
                        item.label,
                        data
                    ).data[0]
                })
                window.revenueHistoryLineChart.update()
            }
        }
        update()

        return () => {
            if (window.revenueHistoryLineChart) {
                window.revenueHistoryLineChart.destroy()
                window.revenueHistoryLineChart = null
            }
        }
    }, [color, intl])
    const getKeyData = (key, list) => {
        const data = list.find((item) => item.key === key)
        return (
            data || {
                labels: [],
                data: [],
            }
        )
    }

    return (
        <div
            className={
                'relative flex flex-col h-400-px justify-center mb-4' +
                themeStyle.bg[color]
            }
        >
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h6
                            className={
                                'uppercase mb-1 text-xs font-semibold ' +
                                themeStyle.title[color]
                            }
                        >
                            {t('earning_history')}
                        </h6>
                    </div>
                </div>
            </div>
            <div className="p-4 flex-auto">
                {/* Chart */}
                <div
                    id="revenue-history-line-chart-content"
                    className="relative h-300-px"
                >
                    <canvas
                        id="revenue-history-line-chart"
                        style={{ height: '300px', width: '100%' }}
                    ></canvas>
                </div>
            </div>
        </div>
    )
}

export default memo(RevenueHistoryLineChart)
