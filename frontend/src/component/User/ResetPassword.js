import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import {clearErrors, resetPassword} from "../../actions/userAction";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import {useAlert} from "react-alert";
import {useNavigate, useParams} from "react-router-dom"
import "./ResetPassword.css"

const ResetPassword = () => {
    const { token } =useParams()
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const alert=useAlert()
    const { loading,error,success } = useSelector( (store)=>store.forgotPassword )

    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")

    const resetPasswordSubmit=(e)=>{
        e.preventDefault()

        const myForm=new FormData()
        myForm.set("password",password)
        myForm.set("confirmPassword",confirmPassword)

        dispatch( resetPassword(token,myForm) )
    }

    useEffect(()=>{
        if( error ){
            alert.error(error)
            dispatch( clearErrors() )
        }

        if( success ){
            alert.success("Profile Updated Successfully")
            navigate("/login")
        }

    },[dispatch,error,alert,navigate,success])

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Change Password" />
                    <div className="resetPasswordContainer">
                        <div className="resetPasswordBox">
                            <h2 className="resetPasswordHeading">Update Profile</h2>

                            <form
                                className="resetPasswordForm"
                                onSubmit={resetPasswordSubmit}
                            >
                                <div>
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">
                                    <LockIcon />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Update"
                                    className="resetPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
};

export default ResetPassword;