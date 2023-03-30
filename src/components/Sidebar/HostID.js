import React from 'react';
import { t, Truncate } from 'utils/text.js';
import { btfsScanLinkCheck } from 'utils/checks.js';

const HostID = ({ ID = '' }) => {
  return (
    <div
      className="flex justify-between items-center"
      style={{ marginBottom: 30, padding: 5, border: '1px solid #D7DBEC', borderRadius: 6 }}>
      <div className="mr-2 flex items-center">
        <div className="mr-1" style={{ width: 38, height: 38, background: '#A1A7C4', borderRadius: 6 }}></div>
        <div>
          <div className="text-xs" style={{ fontFamily: 'Helvetica', color: '#5A607F' }}>
            {t('host_id')}
          </div>
          <Truncate
            className="text-xs font-bold"
            style={{ fontFamily: 'Helvetica-Bold, Helvetica', color: '#131523' }}>
            {ID}
          </Truncate>
        </div>
      </div>
      <a href={btfsScanLinkCheck() + '/#/node/' + ID} target="_blank" rel="noreferrer">
        <img src={require('assets/img/right-icon.svg').default} alt="right-icon" />
      </a>
    </div>
  );
};

export default HostID;
