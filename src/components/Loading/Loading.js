import React from "react";

const Loading = () => {
    return (
        <>
            <div className="flex items-center justify-center absolute z-50 w-full h-full">
                <img src={require("assets/img/loading.svg").default} className='pb-12' width='50px' height='50px' alt=""/>
            </div>
        </>
    );
};

export default Loading