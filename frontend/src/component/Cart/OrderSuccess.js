import React from 'react';
import  "./OrderSuccess.css"
import {Typography} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import {Link} from "react-router-dom";

const OrderSuccess = () => {
    return (
        <div className={"orderSuccess"}>
            <CheckCircleIcon />
            <Typography>Your order success</Typography>
            <Link>View order</Link>
        </div>
    )
};

export default OrderSuccess;