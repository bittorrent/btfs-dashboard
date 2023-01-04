import React, { useContext } from 'react';
import { mainContext } from 'reducer';
import PeersTable from 'components/Tables/PeersTable.js';
import AddConnectionModal from 'components/Modals/AddConnectionModal.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

export default function Peers() {
  const { state } = useContext(mainContext);
  const { theme } = state;

  const addConnection = () => {
    Emitter.emit('openAddConnectionModal');
  };

  return (
    <>
      <div className="flex flex-wrap">
        <div className={'mb-4 relative w-full common-card theme-bg'} style={{ height: '350px' }}>
          <img
            alt="map"
            className="m-auto p-4"
            src={require('../../assets/img/map_world.svg').default}
            style={{ height: '350px' }}
          />
          <button
            className="absolute common-btn theme-common-btn"
            type="button"
            style={{ top: '45%', left: '45%' }}
            onClick={addConnection}>
            <i className="fas fa-plus mr-2"></i> {t('add_connection')}
          </button>
        </div>
        <div className="w-full">
          <PeersTable color={theme} />
        </div>
      </div>
      <AddConnectionModal color={theme} />
    </>
  );
}
