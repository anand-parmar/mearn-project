import React, {Fragment, useEffect, useState} from 'react';
import Loader from "../layout/Loader/Loader";
import {useDispatch, useSelector} from "react-redux";
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import './ForgotPassword.css'
import {useAlert} from "react-alert";
import {clearErrors, forgotPassword} from "../../actions/userAction";

const ForgotPassword = () => {
    const alert=useAlert()
    const dispatch=useDispatch()

    const { loading,error,message } = useSelector( (state)=>state.forgotPassword )
    const [email,setEmail]=useState("")

    const forgotPasswordSubmit=(e)=>{
        e.preventDefault()
        const myform=new FormData()
        myform.set("email",email)
        dispatch( forgotPassword(myform) )
    }

    useEffect( ()=>{
        if( error ){
            alert.error( error )
            dispatch( clearErrors )
        }
        if( message ){
            console.log( message )
            alert.success( message )
        }
    },[error,alert,message,dispatch] )

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Forgot Password" />
                    <div className="forgotPasswordContainer">
                        <div className="forgotPasswordBox">
                            <h2 className="forgotPasswordHeading">Forgot Password</h2>

                            <form
                                className="forgotPasswordForm"
                                onSubmit={forgotPasswordSubmit}
                            >
                                <div className="forgotPasswordEmail">
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    value="Send"
                                    className="forgotPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
};

export default ForgotPassword;