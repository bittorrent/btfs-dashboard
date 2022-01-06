import React from "react";
import ChequeIncomeStats from "components/Stats/ChequeIncomeStats.js";
import ChequeIncomeLineChart from "components/Charts/ChequeIncomeLineChart.js";
import CardChequeEarningList from "components/Cards/CardChequeEarningList.js";

export default function ChequeIncome({color}) {
    return (
        <>
            <ChequeIncomeStats color={color}/>
            <ChequeIncomeLineChart color={color}/>
            <CardChequeEarningList color={color}/>
        </>
    );
}
