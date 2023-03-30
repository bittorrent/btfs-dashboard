/*eslint-disable*/
import React, {memo, useEffect} from "react";
import {Chart} from "chart.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

function NetworkDoughnutChart({color, id, text, data}) {
    useEffect(() => {

        var config =
            {
                type: "doughnut",
                plugins: [{
                    id: id,
                    beforeDraw: (chart) => {
                        var width = chart.width;
                        var height = chart.height;
                        var ctx = chart.canvas.getContext('2d');
                        ctx.restore();
                        var fontSize = (height / 114).toFixed(2);
                        ctx.font = fontSize + "em sans-serif";
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = color === 'light' ? 'black' : 'white';
                        var text = chart.config.options.elements.center.text;
                        var textX = Math.round((width - ctx.measureText(text).width) / 2);
                        var textY = height / 2;
                        ctx.fillText(text, textX, textY + 10);
                        ctx.save();
                    }
                }],
                data: {
                    datasets: [
                        {
                            data: [2, 10],
                            backgroundColor: ['green', 'gray'],
                        }
                    ]
                },

                options: {
                    maintainAspectRatio: false,
                    cutoutPercentage: 90,
                    circumference: 300,
                    cutout: '80%',
                    rotation: -150,
                    elements: {
                        center: {
                            text: 0
                        }
                    },
                    plugins: {
                        tooltip: {
                            enabled: false
                        }
                    }
                }
            };

        var content = document.getElementById(id + '-content');
        content.innerHTML = '&nbsp;';
        content.innerHTML = "<canvas id='" + id + "' style='height: 125px; width: 100%'></canvas>";

        var ctx = document.getElementById(id).getContext("2d");

        window[id] = new Chart(ctx, config);

        return () => {
            if (window[id]) {
                window[id].destroy();
                window[id] = null;
            }
        }

    }, [color]);

    useEffect(() => {
        if (window[id]) {
            window[id].options.elements.center.text = data + ' M/s';
            window[id].data.datasets[0].data[0] = data;
            window[id].update();
        }
    }, [data, color]);

    return (
        <>
            <div className={"relative flex justify-center" + themeStyle.bg[color]}>
                {/* Chart */}
                <div className="relative">
                    <div id={id + '-content'}>
                        <canvas id={id} style={{height: '125px', width: '100%'}}></canvas>
                    </div>
                    <div className='text-center'>
                        <h6 className={"uppercase mt-2 text-xs font-semibold " + themeStyle.text[color]}>
                            {t(text)}
                        </h6>
                    </div>
                </div>
            </div>
        </>
    );
}


export default memo(NetworkDoughnutChart)
