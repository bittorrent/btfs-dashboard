import React from 'react';
import { t } from 'utils/text.js';
import HostWarning from 'components/Warning/HostWarning.js';

const ProgressItem = ({ item, list }) => {
  return (
    <div key={item.id} className="w-full">
      <div className="flex justify-between fs-14 theme-text-main">
        <span>{t(item.text)}</span>
        <span>{item.level}/3</span>
      </div>
      <div className="h-full flex justify-between flex-1 py-1">
        {list.map((child, index) => {
          return (
            <div
              key={index}
              className="flex justify-between flex-1 py-1"
              style={{ width: 'calc((100% - 8px) / 3)' }}>
              <div
                className={
                  'w-full rounded-full' +
                  (item.level > index ? ' theme-fill-base' : ' theme-fill-shallow') +
                  (index < 2 ? ' mr-1' : '')
                }
                style={{ height: 6 }}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function HostScoreProgressChart({ color, data, scoreInit }) {
  const list = new Array(3).fill('');
  const progressData = [
    {
      id: 1,
      text: 'online_duration',
      level: data.uptimeLevel,
    },
    {
      id: 2,
      text: 'host_age',
      level: data.ageLevel,
    },
    {
      id: 3,
      text: 'version',
      level: data.versionLevel,
    },
    {
      id: 4,
      text: 'online_active',
      level: data.activeLevel,
    },
  ];

  return (
    <div className="py-8 px-6 h-full flex flex-col">
      <h5 className="text-base font-semibold theme-text-main mb-6">
        {t('host_score_factor')} ({t('weight')})
      </h5>
      <div className="flex-grow">
        {scoreInit ? (
          <HostWarning />
        ) : (
          <div className="w-full h-full flex flex-col justify-between">
            {progressData.map(item => {
              return <ProgressItem key={item.id} item={item} list={list} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
