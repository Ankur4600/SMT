const connectDB = require("./server");
connectDB();

require("dotenv").config();
const port = process.env.PORT ;
const express =  require('express');
const app = express();
const cors = require("cors")
app.use(express.json());

app.use(cors());

app.get("/",(req,res)=>[
    res.send("this is home page")
])

// app.use("/api", require("./router/Auth.router/auth.router")) // auth api----done
app.use("/api",require("./router/admin.router/admin.router"))// admin api---- done
app.use("/api",require("./router/client.router/client.router"))// received payment api---- done //client
app.use("/api",require("./router/supervisor.router/supervisor.router"))  // expense submit api---- done // supervisor

app.listen(port, ()=>{
    console.log(`Server is running on port http://localhost:${port}`);
})