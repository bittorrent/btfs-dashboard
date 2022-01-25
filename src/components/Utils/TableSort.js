/*eslint-disable*/
import React, {useState} from "react";

export default function TableSort() {

    const [order, setOrder] = useState('default');

    const sorting = (order) => {
        setOrder(order === 'ascending' ? 'descending' : 'ascending');
    };

    return (
        <>
            <div className='flex flex-col ml-4'
                 onClick={() => {
                     sorting()
                 }}
            >
                <i className={"fas fa-sort-up line-height-7px " + ((order === 'ascending') ? 'text-blue' : '')}></i>
                <i className={"fas fa-sort-down line-height-7px " + ((order === 'descending') ? 'text-blue' : '')}></i>
            </div>
        </>
    )
}

