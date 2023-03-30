import React from "react";
import ChequeEarningStats from "components/Stats/ChequeEarningStats.js";
import ChequeEarningLineChart from "components/Charts/ChequeEarningLineChart.js";
import CardChequeEarningList from "components/Cards/CardChequeEarningList.js";

export default function ChequeEarning({ color }) {
    return (
        <>
            <ChequeEarningStats color={color} />
            <ChequeEarningLineChart color={color} />
            <CardChequeEarningList color={color} />
        </>
    );
}
