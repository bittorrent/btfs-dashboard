/*eslint-disable*/
import React, {useContext} from "react";
import QRModal from "components/Modals/QRModal.js";
import HeartBeatsStats from "components/Stats/HeartBeatsStats.js"
import HeartBeatsTable from "components/Tables/HeartBeatsTable.js"

import {mainContext} from "reducer";

export default function HeartBeats() {

    const {state} = useContext(mainContext);
    const {theme} = state;

    

    return (
        <>
            <HeartBeatsStats color={theme}/>
            <HeartBeatsTable color={theme}/>
            <QRModal color={theme}/>
        </>
    );
}
