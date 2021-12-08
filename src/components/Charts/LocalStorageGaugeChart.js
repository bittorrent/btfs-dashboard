/*eslint-disable*/
import React, {memo, useEffect} from "react";
import Chart from "chartjs-gauge";
import themeStyle from "utils/themeStyle.js";

function LocalStorageGaugeChart({color, data}) {
    useEffect(async () => {
        var config = {
            type: 'gauge',
            data: {
                datasets: [{
                    value: data,
                    data: [data, 100],
                    backgroundColor: ['green', 'gray'],
                }]
            },
            options: {
                events: ['click'],
                responsive: false,
                cutoutPercentage: 90,
                layout: {
                    padding: {
                        bottom: 10
                    }
                },
                needle: {
                    radiusPercentage: 2,
                    widthPercentage: 3,
                    lengthPercentage: 80,
                    color: 'rgba(0, 0, 0, 1)'
                },
                valueLabel: {
                    fontSize: 30,
                    formatter: function () {
                        return data + '%';
                    },
                }
            }
        };

        var ctx = document.getElementById("local-storage-gauge-chart").getContext("2d");
        window.localStorageGaugeChart = new Chart(ctx, config);

        return () => {
            if (window.localStorageGaugeChart) {
                window.localStorageGaugeChart.destroy();
                window.localStorageGaugeChart = null;
            }
        }

    }, [data]);


    return (
        <>
            <div className={"relative flex justify-center" + themeStyle.bg[color]}>
                {/* Chart */}
                <div className="relative">
                    <canvas id="local-storage-gauge-chart" style={{height: '90px', width: '100%'}}></canvas>
                </div>

            </div>
        </>
    );
}


export default memo(LocalStorageGaugeChart)