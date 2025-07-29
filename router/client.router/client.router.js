const express = require("express");
const router = express.Router();
const Client = require("../../Schema/client.schema/client.model.js");
const Payments = require("../../Schema/recivedPayments.Schema/payment.model.js");
const Site = require("../../Schema/site.Schema/site.model.js");
const Progress = require("../../Schema/progressReport.schema/progressReport.model.js");



// router for payment send to the company
router.post("/received/payment", async (req, res)=>{
    const {clientEmail,siteId,amount, mode,transationDate }= req.body;
    console.log(clientEmail,siteId,amount,mode,transationDate)
    if(!clientEmail || !siteId || !amount || !transationDate || !mode  ){
        return res.status(400).send({
            success: false,
            message: "All fields are required"
        });
    }
    try{
        const client = await Client.findOne({email:clientEmail})
        console.log(client)
        if(!client){
            return res.status(404).send({
                success: false,
                message: "Client not found"
            });
        }
        const site = await Site.findById(siteId);
        if(!site){
            return res.send({
                sucess:false,
                message:"Site not found"
            })
        }
        
        const payment = new Payments({
            clientId :client._id,
            siteId:site._id,
            amount : amount,
            mode : mode,
            transationDate : transationDate,
            status : "pending",

        })
        await payment.save();
        res.status(200).send({
            sucess:true,
            message:"payment detail saved sucessfully we will notify you once the payment is processed",
            data: payment
        })
    }
    catch(err){
        res.status(500).send({
            success:false,
            message:"internal error :-"+err.message
        })
    }
})


// router for progress report
router.get("/progress/report",async (req,res)=>{
    const{siteID,supervisorID} = req.body;
    try{
        const progressReport = await Progress.findOne({site:siteID,supervisor:supervisorID})
        console.log(progressReport)
        if(!progressReport){
            return res.send({
                success:false,
                message:"no progress report found"
            })
        }
        return res.status(200).send({
            success:true,
            message:"progress report found",
            data:progressReport
        })
    }
    catch(err){
        res.status(501).send({
            success:false,
            message:`error found:-${err.message}`
        })
    }
})

// router for 

module.exports = router