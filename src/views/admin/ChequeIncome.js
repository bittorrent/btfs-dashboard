import React from "react";
import ChequeIncomeStats from "components/Stats/ChequeIncomeStats.js";
import ChequeIncomeLineChart from "components/Charts/ChequeIncomeLineChart.js";
import CardChequeCashingIncome from "components/Cards/CardChequeCashingIncome.js";

export default function ChequeIncome({color}) {
    return (
        <>
            <ChequeIncomeStats color={color}/>
            <ChequeIncomeLineChart color={color}/>
            <CardChequeCashingIncome color={color}/>
        </>
    );
}
