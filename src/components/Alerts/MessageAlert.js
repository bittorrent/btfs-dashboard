import React, {useEffect, useState, useContext} from "react";
import {mainContext} from "reducer";
import Emitter from "utils/eventBus";
import {t} from "utils/text.js";

let timeout = null;

const MessageAlert = () => {
    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showAlert, setShowAlert] = useState(false);
    const [info, setInfo] = useState({message: null, type: null});
    const [color, setColor] = useState('');

    useEffect(() => {
        Emitter.on("showMessageAlert", function (params) {
            clearTimeout(timeout);
            setShowAlert(true);
            setInfo({message: params.message, type: params.type});

            if (params.status === 'success') {
                setColor('bg-emerald-500')
            }
            if (params.status === 'warning') {
                setColor('bg-orange-500')
            }
            if (params.status === 'error') {
                setColor('bg-red-500')
            }
            timeout = setTimeout(() => {
                setShowAlert(false);
            }, 5000)
        });
        return () => {
            Emitter.removeListener('showMessageAlert');
            clearTimeout(timeout);
        }
    }, []);

    return (
        <>
            {showAlert ? (
                <div className={"relative flex justify-center " + (sidebarShow ? "md:ml-64" : "")}>
                    <div
                        className={"z-50 w-1/2 bottom-0 text-white px-6 py-4 border-0 rounded fixed mb-4 flex justify-between " + color}>
                        <span className="text-xl inline-block mr-4 align-middle">
                            <i className="fas fa-bell"/>
                        </span>
                        <span className="inline-block align-middle ml-2">
                            {info.type === 'frontEnd' &&
                            <b className="capitalize">{info.message && t(info.message)}</b>}
                            {info.type !== 'frontEnd' && <b className="capitalize">{info.message}</b>}
                        </span>
                        <span className="text-xl inline-block ml-4 align-middle cursor-pointer"
                              onClick={() => setShowAlert(false)}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default MessageAlert