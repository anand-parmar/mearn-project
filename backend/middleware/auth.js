const catchAsyncErrors=require("./catchAsyncErrors")
const ErrorHander = require("../utils/errorHander");
const jwt = require("jsonwebtoken");
const User=require("../models/userModel")

exports.isAuthenticatedUser=catchAsyncErrors( async (req,res,next)=>{
    const cookies=req.cookies

    console.log(cookies.token)

    if( !cookies.token ){
        return next( new ErrorHander("please login to access this",401) )
    }

    const decodedData=await jwt.verify(cookies.token,process.env.JWT_SECRET);
    req.user=await User.findById(decodedData.id)

    next()
} )

exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{

        if( !roles.includes(req.user.role) ){
            return next(new ErrorHander(`Role is not allowed to access this page `,403))
        }

        next();
    }
}
