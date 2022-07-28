/*eslint-disable*/
import React, {useContext} from "react";
import QRModal from "components/Modals/QRModal.js";
import OnlineProofStats from "components/Stats/OnlineProofStats.js"
import OnlineProofTable from "components/Tables/OnlineProofTable.js"

import {mainContext} from "reducer";

export default function HeartBeats() {

    const {state} = useContext(mainContext);
    const {theme} = state;

    

    return (
        <>
            <OnlineProofStats color={theme}/>
            <OnlineProofTable color={theme}/>
            <QRModal color={theme}/>
        </>
    );
}
