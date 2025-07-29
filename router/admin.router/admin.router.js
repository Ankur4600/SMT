const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
require("dotenv").config();
const secretCode = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const verification = require("../../middleware/verification.js");

const User = require("../../Schema/users.schema/users.model.js");
const Client = require("../../Schema/client.schema/client.model.js");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model.js");
const Site = require("../../Schema/site.Schema/site.model.js");
const Expense = require("../../Schema/expenses.schema/expense.model.js");
const Payments = require("../../Schema/recivedPayments.Schema/payment.model.js");
// admin login
// router.post("/admin/login", async (req, res) => {
//   const { email, password } = req.body;
//   if(!email||!password){
//     res.send({
//         success:false,
//         message:"all fields are required"
//     })
//   }
//   try {
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       return res.send({
//         success: false,
//         message: "user not found",
//       });
//     }
//     if (user.role === "admin") {
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.send({
//           success: false,
//           message: "wrong password",
//         });
//       }
//       const data = {
//         id: user._id,
//       };

//       const token = await jwt.sign(data, secretCode);
//       console.log(token + ". token");
//       user.password = "";
//       return res.send({
//         success: true,
//         message: "user logged in successfully",
//         token: token,
//         data: user,
//       });
//     }
//     return res.send({
//         success:false,
//         message:"user is not an admin"
//     })
//   } catch (err) {
//     return res.status(501).send({
//       success: false,
//       message: `error:- ${err.message}`,
//     });
//   }
// });

//router to create user
router.post("/create/user", async (req, res) => {
  const { name, email, mobile, role, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    res.send({
      success: false,
      message: "email already exist",
    });
  }

  let salt = await bcrypt.genSalt(10);
  console.log(salt);
  let hashPassword = await bcrypt.hash(password, salt);
  console.log(hashPassword);

  user = await User.create({
    name: name,
    role: role.toString().toLowerCase(), // manu
    email: email,
    password: hashPassword,
    mobile: mobile,
  });
  user.password = "";
  res.send({
    success: true,
    message: "user created sucessfully",
    data: user,
  });
});

// router for getting user list
router.get("/get/users", async (req, res) => {
  const { role } = req.body;
  try {
    const users = await User.find({ role: role });
    if (!users) {
      return res.send({
        success: false,
        message: `there are no user with this role ${role}`,
      });
    }

    users.forEach((user) => {
      user.password = "";
    });

    res.status(200).send({
      success: true,
      message: "data fetch sucess",
      number_of_user: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal server error" + err.message,
    });
  }
});

// router to get clients detail
router.get("/client/detail", async (req, res) => {
  try {
    const clientdata = await User.find({ role: "client" });
    if (!clientdata || clientdata.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No supervisors found",
      });
    }
    await Client.insertMany(
      clientdata.map((client) => ({
        name: client.name,
        email: client.email,
        mobile: client.mobile,
      }))
    );
    res.status(200).send({
      success: true,
      message: "Supervisors fetched successfully",
      number_of_supervisors: clientdata.length,
      data: clientdata,
    });
  } catch (err) {
    res.status(500).send({
      sucess: false,
      message: err.message,
    });
  }
});

//  router to get supervisors detail
router.get("/supervisor/details", async (req, res) => {
  try {
    const supervisors = await User.find({ role: "supervisor" });
    if (!supervisors || supervisors.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No supervisors found",
      });
    }
    await Supervisor.insertMany(
      supervisors.map((supervisor) => ({
        name: supervisor.name,
        email: supervisor.email,
        mobile: supervisor.mobile,
      }))
    );

    res.status(200).send({
      success: true,
      message: "Supervisors fetched successfully",
      number_of_supervisors: supervisors.length,
      data: supervisors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

// router for site details
router.post("/add/site", async (req, res) => {
  try {
    const { siteName, address, clientEmail, supervisorEmail } = req.body;
    const client = await Client.findOne({
      email: clientEmail,
    });
    if (!client) {
      return res.status(404).send({
        success: false,
        message: "Client not found",
      });
    }
    const supervisor = await Supervisor.findOne({
      email: supervisorEmail,
    });
    if (!supervisor) {
      return res.status(404).send({
        success: false,
        message: "Supervisor not found",
      });
    }

    const siteDetail = new Site({
      siteName,
      address,
      clientId: client._id,
      supervisorId: supervisor._id,
      status: "active",
    });
    const updatedData = await siteDetail.save();

    // updateing site name in client and supervisor collection

    supervisor.site_name = siteName;
    supervisor.allorted_client = client._id;
    await supervisor.save();

    client.sitename = siteName;
    client.supervisor_name = supervisor.name;
    await client.save();

    res.status(200).send({
      sucess: true,
      message: "site detail saved sucessfull",
      data: siteDetail,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error" + err.message,
    });
  }
});

// router for getting pending expenses detail from expenses collection
router.get("/getExpense/detail", async (req, res) => {
  try {
    const expenseDetails = await Expense.find();
    if (!expenseDetails) {
      return req.send({
        success: false,
        message: "on expense detai found",
      });
    }
    const pendingexpense = expenseDetails.filter(
      (expense) => expense.status === "pending"
    );
    return res.status(200).send({
      success: true,
      message: "data fetched....",
      length: pendingexpense.length,
      data: pendingexpense,
    });
  } catch (err) {
    return res.status(501).send({
      success: false,
      message: "internal server error " + err.message,
    });
  }
});

//router for expense approval
router.post("/expenses/approve", async (req, res) => {
  const { supervisorEmail, status, expenseId } = req.body;
  try {
    const supervisor = await Supervisor.findOne({ email: supervisorEmail });
    if (!supervisor) {
      return res.send({
        success: false,
        message: "supervisor not found!!!",
      });
    }
    const expense = await Expense.findById({ _id: expenseId });
    if (!expense) {
      return res.send({
        success: false,
        message: "expense data not found!!!",
      });
    }
    expense.status = status;
    await expense.save();

    if (status === "approved") {
      supervisor.total_expense = expense.amount;
      supervisor.balance_amount =
        supervisor.total_payment - supervisor.total_expense;
      await supervisor.save();

      const clientData = await Client.findOne({
        _id: supervisor.allorted_client,
      });

      clientData.total_expense = expense.amount;
      clientData.balance_amount =
        clientData.total_payment - clientData.total_expense;
      await clientData.save();

      // need to remove expense request from expense collection if needed

      return res.status(200).send({
        success: true,
        message: "approval success....",
      });
    }
    if (status === "rejected") {
      return res.status(200).send({
        success: true,
        message: " expense rejected !!!",
      });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "internal server error" + err.message,
    });
  }
});

//router for getting payment details which is from clients
router.get("/getPayment/detail", async (req, res) => {
  try {
    const details = await Payments.find();
    if (!details) {
      return res.send({
        success: false,
        message: "no payment found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "data found....",
      data: details,
    });
  } catch (err) {
    return res.status(501).send({
      status: false,
      message: "internal server error " + err.message,
    });
  }
});

// router for assigining role to users
router.post("/payment/approval", async (req, res) => {
  const { paymentId, status } = req.body;
  try {
    const paymentdetail = await Payments.findById({ _id: paymentId });
    if (!paymentdetail) {
      return res.send({
        success: false,
        message: "payment not found",
      });
    }
    // if(paymentdetail.status === "completed"){
    //     return res.send({
    //         success:false,
    //         message:"payment already completed..."
    //     })
    // }

    const client = await Client.findById({ _id: paymentdetail.clientId });
    if (!client) {
      return res.send({
        success: true,
        message: "client not found",
      });
    }
    paymentdetail.status = status;
    await paymentdetail.save();
    if (status === "completed") {
      client.total_payment = client.total_payment + paymentdetail.amount;
      client.balance_amount = client.total_payment - client.total_expense;
      await client.save();
    }
    return res.status(200).send({
      success: true,
      message: "payment status updated",
      data: paymentdetail,
    });
  } catch (error) {
    return res.status(501).send({
      success: true,
      message: "error found" + error.message,
    });
  }
});

// router for fund allocation to supervisor
router.post("/disbursement", async (req, res) => {
  const { email, amount } = req.body;
  try {
    let user = await Supervisor.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    user.total_payment = user.total_payment + amount;
    user.balance_amount = user.total_payment - user.total_expense;
    await user.save();

    console.log(user);
    res.status(200).send({
      success: true,
      message: "Disbursement successful",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

module.exports = router;
