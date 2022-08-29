import React, {useContext} from "react";
import {mainContext} from 'reducer';
import CardSettings from "components/Cards/CardSettings.js";
import CardConfigFileDetail from "components/Cards/CardConfigFileDetail.js";

export default function Settings(props) {

    const {state} = useContext(mainContext);
    const query = new URLSearchParams(props.location.search);
    const fileDetail = Number(query.get('fileDetail'));
    const {theme} = state;

    return (
        <>
            <div className="">
                {fileDetail ?<CardConfigFileDetail color={theme}/> : <CardSettings color={theme}/>}
            </div>
        </>
    );
}
