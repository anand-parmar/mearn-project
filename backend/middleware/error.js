const ErrorHandler=require("../utils/errorHander")

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "internal error"

    if (err.name==="CastError"){
        const message=`Resource not found. Invalid: ${err.path} `;
        err=new ErrorHandler(message,400)
    }

    if( err.code===11000 ){
        const message=`Duplicate ${Object.keys(err.keyValue)} entered`
        err=new ErrorHandler(message,400)
    }

    if( err.name === "JsonWebTokenError" ){
        const message=`JSON Web token is Expired, Try again`
        err=new ErrorHandler(message,400)
    }

    res.status( err.statusCode ).json({
        success:false,
        message:err.message,
        stack:err.stack
    })

}