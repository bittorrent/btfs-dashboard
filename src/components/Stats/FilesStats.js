import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';
import { getFilesStorage } from 'services/filesService.js';
import { t } from 'utils/text.js';

export default function FilesStats({ color }) {
  const [capacity, setCapacity] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [filesCount, setFilesCount] = useState(0);

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      let { capacity, storageUsed, percentage, filesCount } = await getFilesStorage();
      if (!didCancel) {
        setCapacity(capacity);
        setStorageUsed(storageUsed);
        setPercentage(percentage);
        setFilesCount(filesCount);
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full">
      <div className="flex flex-wrap">
        <div className="mb-4 w-full xl:w-6/12 xl:pr-2">
          <div className="common-card theme-bg theme-text-main">
            <div className="flex flex-col h-125-px">
              <h5 className={'mb-8 font-base theme-text-main'}>{t('storage')}</h5>
              <div className="mb-4 flex justify-between items-end">
                <div>
                  <span className="font-bold text-3xl leading-none"> {storageUsed} </span> / {capacity}
                </div>
                <div>
                  <i className="dot dot_blue mr-2"></i> {percentage}% {t('occupied')}
                </div>
              </div>
              <div>
                <Progress
                  percent={percentage}
                  showInfo={false}
                  strokeWidth={30}
                  trailColor={color === 'light' ? '#f5f5f5' : '#21242c'}
                  strokeColor="#3257F6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 w-full xl:w-6/12 xl:pl-2">
          <div className={'common-card theme-bg theme-text-main'}>
            <div className="flex flex-col justify-between h-125-px">
              <h5 className={'font-base theme-text-main'}>{t('chunks')}</h5>
              <div className="font-bold text-3xl leading-none">{filesCount}</div>
              <div className="text-2xl leading-none">
                <i className="fa-solid fa-cube"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
