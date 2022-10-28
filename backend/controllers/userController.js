const ErrorHander=require('../utils/errorHander')
const catchAsyncErrors= require('../middleware/catchAsyncErrors')
const User = require('../models/userModel')
const sendToken =require('../utils/jwtToken')
const sendEmail=require('../utils/sendEmail')
const crypto = require("crypto");
const cloudinary=require("cloudinary")

exports.registerUser=catchAsyncErrors( async (req,res,next)=>{
    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
    })

    const { name,email,password }=req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url:myCloud.secure_url
        }
    })

    sendToken(user,201,res)
})

exports.loginUser=catchAsyncErrors( async(req,res,next)=>{
    const {email,password}=req.body

    console.log( {email},{password} )

    if( !email || !password ){
        return next( new ErrorHander("Please enter email & password",400) )
    }

    const user=await User.findOne({email}).select("+password");
    if( !user ){
        return next( new ErrorHander("email not found",401) )
    }

    const isPasswordMatch=await user.comparePassword(password)
    console.log( {isPasswordMatch} )
    if( !isPasswordMatch ){
        return next( new ErrorHander("Invalid password",401) )
    }

    sendToken(user,200,res)

} )

exports.logout=catchAsyncErrors( async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged out"
    })
})

exports.forgotPassword=catchAsyncErrors( async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHander("User not found",404))
    }

    const resetToken=user.getResetPasswordToken()
    await user.save({validateBeforeSave:false})

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/password/reset/${resetToken}`

    const message=`Your password reset token is :- \n\n ${resetPasswordUrl}  \n\n if not done by you ignore `

    try{
        // await sendEmail({
        //     email:user.email,
        //     subject:`Ecommerce Password Recovery`,
        //     message
        // })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully `,
            link:resetPasswordUrl
        })
    }catch (error) {
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined

        await user.save({validateBeforeSave:false})
        return next(new ErrorHander(error.message,500))
    }

})

exports.resetPassword=catchAsyncErrors( async (req,res,next)=>{
    const resetPasswordToken=crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt:Date.now() }
    })

    if( !user ){
        return next( new ErrorHander("Reset password token in invalid or expire",400) )
    }

    if( req.body.password !==req.body.confirmPassword ){
        return next( new ErrorHander("password not match",400) )
    }

    user.password=req.body.password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined

    await user.save()

    sendToken( user,200,res )

})

exports.getUserDetails=catchAsyncErrors( async(req,res,next)=>{
    const user=await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})

exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password")
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword)

    if( !isPasswordMatched ){
        return next(new ErrorHander("Old password is incorrect",400))
    }

    if( req.body.newPassword !== req.body.confirmPassword ){
        return next(new ErrorHander("Password not matched",400))
    }

    user.password=req.body.newPassword
    await user.save()

    sendToken(user,200,res)
})

exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }

    if( req.body.avatar !=="" ){
        const user=await User.findById(req.user.id)
        const imageId=user.avatar.public_id
        await cloudinary.v2.uploader.destroy(imageId)
        const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:150,
            crop:"scale"
        })
        newUserData.avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    }

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        userFindAndModify:false
    })

    res.status(200).json({
        success:true
    })

})

exports.getAllUser=catchAsyncErrors(async(req,res,next)=>{
    const users=await User.find()

    res.status(200).json({
        success:true,
        users
    })
})

exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id)

    if( !user ){
        return next(new ErrorHander(`User does not exist with id: ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
})

exports.updateUserRole=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        userFindAndModify:false
    })

    res.status(200).json({
        success:true
    })

})

exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id)

    if( !user ){
        return next(new ErrorHander(`User does not exist with id: ${req.params.id}`))
    }

    await user.remove()

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
})