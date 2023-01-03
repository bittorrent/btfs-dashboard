import React, { memo, useEffect } from 'react';
import Chart from 'chartjs-gauge';

function LocalStorageGaugeChart({ data }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    var config = {
      type: 'gauge',
      data: {
        datasets: [
          {
            value: data,
            data: [data, 100],
            backgroundColor: ['green', 'gray'],
          },
        ],
      },
      options: {
        events: ['click'],
        maintainAspectRatio: false,
        cutoutPercentage: 90,
        layout: {
          padding: {
            bottom: 10,
          },
        },
        needle: {
          radiusPercentage: 2,
          widthPercentage: 3,
          lengthPercentage: 80,
          color: 'rgba(0, 0, 0, 1)',
        },
        valueLabel: {
          fontSize: 30,
          formatter: function () {
            return data + '%';
          },
        },
      },
    };

    var ctx = document.getElementById('local-storage-gauge-chart').getContext('2d');
    window.localStorageGaugeChart = new Chart(ctx, config);

    return () => {
      if (window.localStorageGaugeChart) {
        window.localStorageGaugeChart.destroy();
        window.localStorageGaugeChart = null;
      }
    };
  }, [data]);

  return (
    <div className={'relative flex justify-center theme-bg'}>
      {/* Chart */}
      <div className="relative">
        <canvas id="local-storage-gauge-chart" style={{ height: 90, width: 110 }}></canvas>
      </div>
    </div>
  );
}

export default memo(LocalStorageGaugeChart);
