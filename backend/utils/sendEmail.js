const nodeMailer=require("nodemailer")

const sendEmail=async (options)=>{

    const transporter=nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service:process.env.SMTP_SERVER,
        auth:{
            user:process.env.SMTP_MAIl,
            pass:process.env.SMTP_PASSWORD
        },
    })

    const mailOption={
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOption)

}

module.exports=sendEmail