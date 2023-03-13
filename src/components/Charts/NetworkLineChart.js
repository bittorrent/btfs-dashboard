import React, { memo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Chart } from 'chart.js';
import { getNetworkFlow } from 'services/dashboardService.js';
import { t } from 'utils/text.js';

let data = {
  labels: [],
  data: [[], []],
};

let interval = null;

function NetworkLineChart({ color }) {
  const intl = useIntl();

  useEffect(() => {
    var config = {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: intl.formatMessage({ id: 'in' }),
            borderColor: '#06a561',
            backgroundColor: '#06a561',
            data: [],
            fill: false,
            tension: 0,
          },
          {
            label: intl.formatMessage({ id: 'out' }),
            fill: false,
            borderColor: '#f99600',
            backgroundColor: '#f99600',
            data: [],
            tension: 0,
          },
        ],
      },

      options: {
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: 'rectRounded',
              padding: 8,
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function (context) {
                var label = context.dataset.label || '';
                if (label) {
                  label += ' : ' + context.parsed.y + ' KB/s ';
                }
                return label;
              },
            },
          },
        },
        maintainAspectRatio: false,
        title: {
          display: false,
          text: 'Sales Charts',
        },

        interaction: {
          mode: 'index',
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
            min: 0,
            display: true,
            title: {
              display: true,
              text: 'KB / s',
              color: color === 'light' ? 'black' : 'white',
            },
            ticks: {
              color: color === 'light' ? 'black' : 'white',
            },
          },
        },
      },
    };

    var content = document.getElementById('network-line-chart-content');
    content.innerHTML = '&nbsp;';
    content.innerHTML = "<canvas id='network-line-chart' style='height: 300px; width: 100%'></canvas>";

    var ctx = document.getElementById('network-line-chart').getContext('2d');
    window.networkLineChart = new Chart(ctx, config);

    update();

    return () => {
      if (window.networkLineChart) {
        window.networkLineChart.destroy();
        window.networkLineChart = null;
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, intl]);

  const update = async () => {
    fetchData();
    interval = setInterval(async () => {
      fetchData();
    }, 60000);
  };

  const fetchData = async () => {
    let { receive, send } = await getNetworkFlow();
    let date = new Date();
    let time = date.getHours() + ':' + date.getMinutes();
    data.labels.push(time);
    data.data[0].push(receive);
    data.data[1].push(send);
    if (window.networkLineChart) {
      window.networkLineChart.data.labels = data.labels;
      window.networkLineChart.data.datasets[0].data = data.data[0];
      window.networkLineChart.data.datasets[1].data = data.data[1];
      window.networkLineChart.update();
    }
  };

  return (
    <div className="common-card pb-0 theme-bg">
      <h5 className="font-bold text-base theme-text-main">{t('bandwidth_over_time')}</h5>
      <div id="network-line-chart-content" className="relative h-300-px">
        <canvas id="network-line-chart" style={{ height: '300px', width: '100%' }}></canvas>
      </div>
    </div>
  );
}

export default memo(NetworkLineChart);
