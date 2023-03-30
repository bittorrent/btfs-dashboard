import React, { memo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Chart } from 'chart.js';
import { getChequeEarningAllHistory } from 'services/chequeService.js';
import { t } from 'utils/text.js';
import { INIT_CHART_LINE_DATASETS } from 'utils/constants';
import ButtonSwitch from 'components/Buttons/ButtonSwitch';

function RevenueHistoryLineChart({ color }) {
  const intl = useIntl();
  const [current, setCurrent] = useState('chequesNumber');
  const [earningCurrencyAllHistoryData, setEarningCurrencyAllHistoryData] = useState([]);

  useEffect(() => {
    const datasetsList = JSON.parse(JSON.stringify(INIT_CHART_LINE_DATASETS));

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
          };
    var config = {
      type: 'line',
      data: {
        labels: [],
        datasets: datasetsList,
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
                  if (current === 'chequesNumber') {
                    label += ' : ' + context.parsed.y + ' ';
                  } else {
                    label += ' : ' + context.parsed.y + ' ' + label;
                  }
                }
                return label;
              },
            },
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
              display: true,
            },
            ticks: {
              color: color === 'light' ? 'black' : 'white',
            },
          },
          y: axisYConfig,
        },
      },
    };

    var ctx = document.getElementById('revenue-history-line-chart').getContext('2d');
    window.revenueHistoryLineChart = new Chart(ctx, config);

    update();

    return () => {
      if (window.revenueHistoryLineChart) {
        window.revenueHistoryLineChart.destroy();
        window.revenueHistoryLineChart = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, intl, current]);

  const getKeyData = (key, list) => {
    const data = list.find(item => item.key === key);
    return (
      data || {
        labels: [],
        data: [],
      }
    );
  };

  const update = async () => {
    let data = [];
    if (!earningCurrencyAllHistoryData.length) {
      data = await getChequeEarningAllHistory();
      setEarningCurrencyAllHistoryData(data);
    } else {
      data = earningCurrencyAllHistoryData;
    }
    let dataIndex = 1;
    if (current !== 'chequesNumber') {
      dataIndex = 0;
    }
    if (window.revenueHistoryLineChart) {
      window.revenueHistoryLineChart.data.labels = data?.[0]?.labels || [];
      INIT_CHART_LINE_DATASETS.forEach((item, index) => {
        window.revenueHistoryLineChart.data.datasets[index].data = getKeyData(item.label, data).data[
          dataIndex
        ];
      });
      window.revenueHistoryLineChart.update();
    }
  };

  return (
    <div className="mb-4 common-card py-5 pb-0 theme-bg">
      <header className="flex justify-between items-center">
        <h5 className="text-base font-bold theme-text-main">{t('earning_history')}</h5>
        <ButtonSwitch
          current="left"
          leftButtonProps={{
            text: t('cheques_number'),
            onClick: () => setCurrent('chequesNumber'),
          }}
          rightButtonProps={{
            text: t('cheques_amount'),
            onClick: () => setCurrent('chequesAmount'),
          }}
        />
      </header>
      <main>
        <div id="revenue-history-line-chart-content" className="relative h-300-px">
          <canvas id="revenue-history-line-chart" style={{ height: 300, width: '100%' }}></canvas>
        </div>
      </main>
    </div>
  );
}

export default memo(RevenueHistoryLineChart);
