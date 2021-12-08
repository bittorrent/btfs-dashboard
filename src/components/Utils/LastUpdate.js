import React, { useEffect, useState } from 'react'


export default function LastUpdate({date}) {
    const [duration, setDuration] = useState('never');

    const refresh = () => {
        if (!date) setDuration('never');
        else setDuration(`${((Date.now() - date) / 1000).toFixed()} seconds ago`);
    };

    useEffect(() => {
        refresh();
        const i = setInterval(refresh, 1000);
        return () => clearInterval(i)
    }, [date]);

    return <span>Last Update: {duration}</span>
}
