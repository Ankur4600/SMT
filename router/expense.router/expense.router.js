const express = require("express");
const router = express.Router();
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model")
const Site = require("../../Schema/site.Schema/site.model")
const Expense = require("../../Schema/expenses.schema/expense.model")

router.post("/expenses/submit", async (req,res)=>{
    const { supervisor_email, site_name, type, amount, date, description } = req.body;
    console.log(supervisor_email, site_name, type, amount, date, description)
    try {
        const supervisorDetails = await Supervisor.findOne({ email: supervisor_email })
        if (!supervisorDetails) {
            return res.send({
                success: false,
                message: "detail did not match please try with differnt email",
            })
        }
        const siteDetail = await Site.findOne({siteName:site_name,supervisorId:supervisorDetails._id})
        if (!siteDetail) {
            return res.send({
                success: false,
                message: "plz enter a valid site id"
            })
        }

        if (siteDetail.supervisorId.toString() === supervisorDetails._id.toString()) {
            const data = Expense.create({
                supervisor_id: supervisorDetails._id,
                site_name: siteDetail.siteName,
                type: type,
                amount: amount,
                date: date,
                description: description,
            })
            return res.status(200).send({
                success: true,
                message: "data send success will get back to you sooner",
                data: data,
            })
        }
        return res.send({
            success: false,
            message: "wrong site detail enter plz enter the right site id"
        })
    }
    catch (err) {
        res.status(500).send({
            success: false,
            message: "internal server error" + err
        })
    }

})

module.exports=router;