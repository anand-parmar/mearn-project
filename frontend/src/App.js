import './App.css';
import Header from './component/layout/Header/Header.js'
import Footer from './component/layout/Footer/Footer.js'
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import WebFont from 'webfontloader'
import React, {useEffect, useState} from "react";
import Home from './component/Home/Home.js'
import ProductDetails from './component/Product/ProductDetails.js'
import Products from './component/Product/Products.js'
import Search from './component/Product/Search.js'
import LoginSignUp from "./component/User/LoginSignUp";
import {loadUser} from "./actions/userAction";
import store from "./store";
import UserOptions from "./component/layout/Header/UserOptions.js"
import {useSelector} from "react-redux";
import Profile from "./component/User/Profile.js"
import UpdateProfile from "./component/User/UpdateProfile.js"
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword from "./component/User/ResetPassword.js"
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import Payment from "./component/Cart/Payment.js"
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"

import axios from "axios";
import {
    Elements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"

function App() {
    const { isAuthenticated,user,loading } =useSelector( (state)=>state.user )
    const [stripeApiKey,setStripeApiKey]=useState("")

    async function getStripeApiKey(){
        const {data}=await axios.get("/api/v1/stripeapikey")
        setStripeApiKey(data.stripeApiKey)
    }

    useEffect(()=>{

        WebFont.load({
            google:{
                families:["Roboto"]
            }
        })

        store.dispatch( loadUser() )

        getStripeApiKey()
    },[])

  return (
    <Router>
        <Header/>
        { isAuthenticated && <UserOptions user={user}/> }
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/product/:id" element={<ProductDetails/>} />
            <Route path="/products" element={<Products/>} />
            <Route path="/products/:keyword" element={<Products/>} />
            <Route path="/search" element={<Search/>} />
            <Route path="/login" element={<LoginSignUp/>} />
            <Route path="/account" element={
                 !loading && (
                     isAuthenticated === false ? <Navigate to={"/login"} /> : <Profile/>
                 )
            } />
            <Route path="/me/update" element={
                !loading && (
                    isAuthenticated === false ? <Navigate to={"/login"} /> : <UpdateProfile/>
                )
            } />
            <Route path="/password/update" element={
                !loading && (
                    isAuthenticated === false ? <Navigate to={"/login"} /> : <UpdatePassword/>
                )
            } />
            <Route path="/shipping" element={
                !loading && (
                    isAuthenticated === false ? <Navigate to={"/login"} /> : <Shipping/>
                )
            } />
            <Route path="/order/confirm" element={
                !loading && (
                    isAuthenticated === false ? <Navigate to={"/login"} /> : <ConfirmOrder/>
                )
            } />
            <Route path="/process/payment" element={
                !loading && (
                    isAuthenticated === false ?
                        <Navigate to={"/login"} /> :
                        (
                            stripeApiKey && (
                                <Elements stripe={loadStripe(stripeApiKey)} >
                                    <Payment/>
                                </Elements>
                            )
                        )
                )
            } />
            <Route path="/success" element={
                !loading && (
                    isAuthenticated === false ?
                        <Navigate to={"/login"} /> : <OrderSuccess/>
                )
            } />
            <Route path="/orders" element={
                !loading && (
                    isAuthenticated === false ?
                        <Navigate to={"/login"} /> : <MyOrders/>
                )
            } />
            <Route path="/password/forgot" element={<ForgotPassword/>} />
            <Route path="/password/reset/:token" element={<ResetPassword/>} />
            <Route path="/cart" element={<Cart/>} />
        </Routes>

      <Footer/>
    </Router>
  );
}

export default App;
