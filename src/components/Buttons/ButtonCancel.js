import React from "react";

const ButtonCancel = ({event, text}) => {
    return (
        <>
            <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => event(false)}
            >
                {text}
            </button>
        </>
    );
};

export default ButtonCancel