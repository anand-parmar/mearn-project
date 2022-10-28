const Product = require('../models/productModel')
const ErrorHander=require('../utils/errorHander')
const catchAsyncErrors= require('../middleware/catchAsyncErrors')
const ApiFeatures = require("../utils/apifeatures");

exports.createProduct=catchAsyncErrors(async (req,res,next)=>{
    console.log(  "working")
    req.body.user=req.user.id
    const product=await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
})

exports.getAllProducts=catchAsyncErrors(async (req,res,next)=>{

    //return next( new ErrorHander("For testing",400) )

    const resultPerPage = 5;
    const productsCount = await Product.countDocuments();

    console.log( req.query )
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter();

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
})


exports.getProductDetails = catchAsyncErrors(async (req,res,next)=>{

    let product=await Product.findById(req.params.id);
    if( !product ){
        return next( new ErrorHander("Product Not found",404) )
    }

    return res.status(200).json({
        success:true,
        product
    })

})

exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{

    let product=await Product.findById(req.params.id);
    if( !product ){
        return next( new ErrorHander("Product Not found",404) )
    }

    product =await Product.findByIdAndUpdate( req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    } )

    return res.status(200).json({
        success:true,
        product
    })

})

exports.deleteProduct = catchAsyncErrors(async (req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if( !product ){
        return next( new ErrorHander("Product Not found",404) )
    }
    await product.remove()

    return res.status(200).json({
        success:true,
        message:"Product deleted"
    })

})

exports.createProductReview= catchAsyncErrors(async (req,res,next)=>{
    const { rating,comment,productId } = req.body

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }

    const product=await Product.findById(productId)

    const isReviewed=product.reviews.find(
        (rev)=> rev.user.toString() === req.user._id.toString()
    )

    if( isReviewed ){
        product.reviews.forEach((rev)=>{
            if( rev.user.toString() === req.user._id.toString() )
                (rev.rating=rating),(rev.comment=comment)
        })
    }else {
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length
    }

    let avg=0

    product.reviews.forEach((rev)=>{
        avg+=rev.rating;
    })

    product.ratings=avg/product.reviews.length

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true
    })

})

exports.getProductReviews=catchAsyncErrors(async (req,res,next)=>{
    const product=await Product.findById(req.query.id)
    if( !product ){
        return next(new ErrorHander("Product not found",404))
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

exports.deleteReview=catchAsyncErrors(async (req,res,next)=>{
    const product=await Product.findById(req.query.productId)
    if( !product ){
        return next(new ErrorHander("Product not found",404))
    }

    const reviews=product.reviews.filter(
        (rev)=>rev._id.toString() !== req.query.id.toString()
    )

    let avg=0
    reviews.forEach((rev)=>{
        avg+=rev.rating
    })

    const ratings=reviews.length!==0 ? avg/reviews.length : 0
    const numOfReviews=reviews.length

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews
        },
        {
            new:true,
            runValidators:true,
            useFindAndModify:false
        }
    )

    res.status(200).json({
        success:true
    })

})