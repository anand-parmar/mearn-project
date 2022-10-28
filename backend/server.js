const app=require("./app");
const dotend=require("dotenv");
const cloudinary=require("cloudinary")
const connectDatabase=require('./config/database')

process.on("uncaughtException",(err)=>{
    console.log( `error : ${err.message}` )
    console.log( "shutting down server" )
    server.close(()=>{
        process.exit(1)
    })
})

dotend.config({path:"backend/config/config.env"})

connectDatabase()

cloudinary.config({
    cloud_name: 'dhqoz92zv',
    api_key: '814859198231743',
    api_secret: '24tyYbPiPq9kYfDgBlF5Q3aEAio'
});

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is working on https://localhost:${process.env.PORT} `)
})

process.on("unhandledRejection",(err)=>{
    console.log( `error : ${err.message}` )
    console.log( "shutting down server" )
    server.close(()=>{
        process.exit(1)
    })
})