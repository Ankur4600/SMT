const express = require("express");
const router = express.Router();
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");
const Site = require("../../Schema/site.Schema/site.model");
const Expense = require("../../Schema/expenses.schema/expense.model");
const Progress = require("../../Schema/progressReport.schema/progressReport.model")
const upload = require("../../middleware/multer")

// router to get allorted site
router.get("/allortedSite",async(req,res)=>{
    const {email}= req.body
    try{
        const user = await Supervisor.findOne({email:email});
        console.log(user)
        const siteData = await Site.findOne({clientId:user.allorted_client})
        console.log(siteData);
        
        if(siteData.length <= 0){
            return res.send({
                success:false,
                message:"no site found"
            })
        }
        return res.status(200).send({
            success:true,
            message:"data found....",
            data:siteData
        })
    }
    catch(err){
        return res.status(501).send({
            success:false,
            message:"error:- "+err
        })
    }
})

// router for expense approval
router.post("/expense/detail",async(req,res)=>{
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
            const data = await Expense.create({
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

// router for progress report
router.post("/report/progress",upload.single("file"),async(req,res)=>{
    const {siteID,supervisorID,reportDate,dailyUpdates,materialsUsed,issues,safetyChecks,} =req.body
    try{
        const siteData = await Site.findById({_id:siteID});
        const supervisorData = await Supervisor.findById({_id:supervisorID});
        if(!siteData || !supervisorData){
            return res.send({
                success:false,
                message:"data missmatched either supervisor or site not found"
            })
        }
        const reportData = new Progress({
            site:siteID,
            supervisor:supervisorID,
            reportDate:reportDate, 
            dailyUpdates: dailyUpdates, 
            materialsUsed: materialsUsed,
            issues:issues,
            safetyChecks:safetyChecks,
        });
        const updatedData = await reportData.save();
        return res.status(200).send({
            success:true,
            message:"Data submitted success",
            data:updatedData
        })


    }
    catch(err){
        return res.status(501).send({
            success:false,
            message:`error !!!!! :-${err}`
        })
    }
    
})

module.exports = router;