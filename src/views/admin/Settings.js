import React, {useContext} from "react";
import {mainContext} from 'reducer';
import CardSettings from "components/Cards/CardSettings.js";

export default function Settings() {

    const {state} = useContext(mainContext);
    const {theme} = state;

    return (
        <>
            <div className="mt-18">
                <CardSettings color={theme}/>
            </div>
        </>
    );
}
