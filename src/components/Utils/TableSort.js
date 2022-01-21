/*eslint-disable*/
import React, {useState} from "react";

export function TableSort() {

    const [order, setOrder] = useState('default');

    const sorting = (tag, order) => {
        setOrder(order);
    };

    return (
        <>
            <div className='flex flex-col ml-4'
                 onClick={() => {
                     sorting('uncashed', order === 'ascending' ? 'descending' : 'ascending')
                 }}
            >
                <i className={"fas fa-sort-up line-height-7px " + ((order === 'ascending') ? 'text-blue' : '')}></i>
                <i className={"fas fa-sort-down line-height-7px " + ((order === 'descending') ? 'text-blue' : '')}></i>
            </div>
        </>
    )
}

