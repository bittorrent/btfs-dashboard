import React from "react";

const ButtonConfirm = ({event, valid, text}) => {
    return (
        <>
            <button
                className={"text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 " + (valid ? " bg-emerald-500" : " bg-gray-500 cursor-not-allowed")}
                type="button"
                disabled={!valid}
                onClick={event}
            >
                {text}
            </button>
        </>
    );
};

export default ButtonConfirm