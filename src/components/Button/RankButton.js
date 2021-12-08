import React, {memo, useEffect, useRef} from "react";


const RankButton = (props) => {

    const memory = useRef(1);
    const change = (e) => {
        let val = e.target.innerText;
        let previous = e.target.parentNode.parentNode.getElementsByClassName("_checked")[0];
        let classVal = previous.getAttribute('class');
        classVal = classVal.replace("_checked", "");
        previous.setAttribute("class", classVal);
        e.target.className += ' _checked';
        let flag = 1;
        if (val === 'Total Ranking') flag = 1;
        if (val === 'Yesterday') flag = 2;
        if (memory.current !== flag) {
            memory.current = flag;
            props.callback(flag, 1);
        }

    }

    return (
        <>

            <div className=" flex m-2" onClick={change}>
                <div>
                    <a className="_checked p-2 border-1 border-gray-400 cursor-pointer hover:border-blue-500 focus:border-blue-700 test">
                        Total Ranking
                    </a>
                </div>
                <div>
                    <a className="p-2 border-1 border-gray-400 cursor-pointer hover:border-blue-500 focus:border-blue-700">
                        Yesterday
                    </a>
                </div>
            </div>
        </>
    );
};

export default memo(RankButton)