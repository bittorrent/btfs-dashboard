import React, {useContext} from "react";
import {mainContext} from 'reducer';
import CardSettings from "components/Cards/CardSettings.js";
import CardConfigFileDetail from "components/Cards/CardConfigFileDetail.js";
import S3CardConfigDetail from "components/Cards/S3CardConfigDetail.js"

import CheckPrivateKeyModal from 'components/Modals/CheckPrivateKeyModal.js';
import ChangePasswordModal from 'components/Modals/ChangePasswordModal.js';


export default function Settings(props) {

    const {state} = useContext(mainContext);
    const query = new URLSearchParams(props.location.search);
    const fileDetail = Number(query.get('fileDetail'));
    const s3Detail = Number(query.get('s3Detail'));

    const {theme} = state;

    return (
        <>
            <div className="">
                {fileDetail>0 && <CardConfigFileDetail color={theme}/>}
                {s3Detail>0 && <S3CardConfigDetail color={theme}/>}
                {fileDetail<1 && s3Detail<1 && <CardSettings color={theme}/>}
                <CheckPrivateKeyModal color={theme}/>
                <ChangePasswordModal color={theme}/>
            </div>
        </>
    );
}
