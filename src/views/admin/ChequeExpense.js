import React from "react";
import ChequeExpenseStats from "components/Stats/ChequeExpenseStats.js";
import ChequeExpenseLineChart from "components/Charts/ChequeExpenseLineChart.js";
import ChequeExpenseTable from "components/Tables/ChequeExpenseTable.js";

export default function CheckExpense({color}) {
    return (
        <>
            <ChequeExpenseStats color={color}/>
            <ChequeExpenseLineChart color={color}/>
            <ChequeExpenseTable color={color}/>
        </>
    );
}
