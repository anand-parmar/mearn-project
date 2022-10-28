import React, {Fragment, useEffect} from 'react';
import {CgMouse} from "react-icons/cg/index";
import './Home.css'
import ProductCart from "./ProductCart.js"
import MetaData from "../layout/MetaData";
import {useDispatch, useSelector} from "react-redux";
import {clearErrors, getProduct} from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import {useAlert} from "react-alert";

const Home = () => {
    const alert=useAlert()
    const dispatch=useDispatch();
    const { loading,error,products } = useSelector((state)=>state.products)

    useEffect(()=>{
        if( error ){
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch( getProduct() )
    },[dispatch])

    return (
        <Fragment>
            {loading ? <Loader/> : (
                <Fragment>
                    <MetaData title="Home page is working" />
                    <div className="banner">
                        <p>Welcome to Ecommerce</p>
                        <h1>FIND AMAZING PRODUCT BELOW</h1>

                        <a href="#container">
                            <button>
                                Scroll <CgMouse/>
                            </button>
                        </a>
                    </div>

                    <h2 className="homeHeading">Featured Products</h2>
                    <div className="container" id="container">
                        {products && products.map((product)=> <ProductCart product={product} /> ) }
                    </div>

                </Fragment>
            ) }
        </Fragment>
    );
};

export default Home;