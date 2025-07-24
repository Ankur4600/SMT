const express = require("express");
const router = express.Router();
const Client = require("../../Schema/client.schema/client.model.js");
const Payments = require("../../Schema/recivedPayments.Schema/payment.model.js");
const Site = require("../../Schema/site.Schema/site.model.js");


router.post("/received/payments", async (req, res)=>{
    const {clientEmail,siteId,amount, mode,transationDate,status }= req.body;
    console.log(clientEmail,siteId,amount,mode,transationDate,status)
    if(!clientEmail || !siteId || !amount || !transationDate || !mode  || !status){
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
            // transationDate : transationDate,
            status : status,

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

module.exports = router