import React, {memo, useRef} from "react";


const RadioButton = (props) => {

    const memory = useRef(1);
    const change = (e) => {
        let val = e.target.innerText;
        let previous = e.target.parentNode.parentNode.getElementsByClassName("_checked")[0];
        let classVal = previous.getAttribute('class');
        classVal = classVal.replace("_checked", "");
        previous.setAttribute("class", classVal);
        e.target.className += ' _checked';
        let flag = 1;
        if (val === '7d') flag = 1;
        if (val === '1m') flag = 2;
        if (val === '3m') flag = 3;
        if (val === '1y') flag = 4;
        if (memory.current !== flag) {
            memory.current = flag;
            props.callback(flag);
        }
    }

    return (
        <>
            <div className=" flex m-2" onClick={change}>
                <div>
                    <a className="_checked p-2 border-1 border-gray-400 cursor-pointer hover:border-blue-500 focus:border-blue-700 test">
                        7d
                    </a>
                </div>
                <div>
                    <a className="p-2 border-1 border-gray-400 cursor-pointer hover:border-blue-500 focus:border-blue-700">
                        1m
                    </a>
                </div>
                <div>
                    <a className="p-2 border-1 border-gray-400 cursor-pointer hover:border-blue-500 focus:border-blue-700">
                        3m
                    </a>
                </div>
                <div>
                    <a className="p-2 border-1 border-gray-400 cursor-pointer hover:border-blue-500 focus:border-blue-700">
                        1y
                    </a>
                </div>

            </div>
        </>
    );
};

export default memo(RadioButton)