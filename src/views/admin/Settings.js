import React, {useContext} from "react";
import {mainContext} from 'reducer';
import CardSettings from "components/Cards/CardSettings.js";

export default function Settings() {

    const {state} = useContext(mainContext);
    const {theme} = state;

    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <CardSettings color={theme}/>
                </div>
            </div>
        </>
    );
}
