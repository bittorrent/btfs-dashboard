import React from "react";
import ChequeExpenseStats from "components/Stats/ChequeExpenseStats.js";
import ChequeExpenseLineChart from "components/Charts/ChequeExpenseLineChart.js";
import CardChequeExpenseList from "components/Cards/CardChequeExpenseList.js";

export default function CheckExpense({color}) {
    return (
        <>
            <ChequeExpenseStats color={color}/>
            <ChequeExpenseLineChart color={color}/>
            <CardChequeExpenseList color={color}/>
        </>
    );
}
