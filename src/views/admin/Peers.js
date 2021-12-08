import React, {useContext} from "react";
import {mainContext} from 'reducer';
import PeersTable from "components/Tables/PeersTable.js";
import AddConnectionModal from "components/Modals/AddConnectionModal.js";
import themeStyle from "utils/themeStyle.js";
import Emitter from "utils/eventBus";
import {t} from "utils/text.js";

export default function Peers() {

    const {state} = useContext(mainContext);
    const {theme} = state;

    const addConnection = () => {
        Emitter.emit('openAddConnectionModal');
    };

    return (
        <>
            <div className="flex flex-wrap">
                <div className={'relative w-full mb-4 rounded ' + themeStyle.bg[theme]} style={{height:'350px'}}>
                    <img alt='map' className='m-auto p-4' src={require('../../assets/img/map.png').default} style={{height:'350px'}}/>
                    <button
                        className="absolute whitespace-nowrap ml-4 bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-3 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        style={{top:'45%',left:'45%'}}
                        onClick={addConnection}
                    >
                        <i className="fas fa-plus mr-2"></i> {t('add_connection')}
                    </button>
                </div>
                <div className="w-full">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded">
                        <PeersTable color={theme}/>
                    </div>
                </div>
            </div>
            <AddConnectionModal color={theme}/>
        </>
    );
}
