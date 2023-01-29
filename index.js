require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const  { userRouter }  = require("./routers/userRouter");
const  { sessionRouter }  = require("./routers/sessionRouter");
const { pageRouter } = require("./routers/pageRouter");
const { reportRouter } = require("./routers/reportRouter");
const { connect } = require("./data/DBconnection");


// Configurations //
const PORT = process.env.PORT || 8000;
connect();

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 }));

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/includes", express.static(__dirname + "public/includes"));

// cookie parser middleware
app.use(cookieParser());
// creating 24 hours from milliseconds
const Day = 1000 * 60 * 60 * 24;
// session middleware
app.use(sessions({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: Day }
}));



app.use("/session", sessionRouter);
app.use("/users", userRouter);
app.use("/reports", reportRouter);
app.use("/", pageRouter);

app.use((req, res) => {
    res.status(400).send("Something is broken!");
});

// Connection //
app.listen(PORT, () => console.log("Server running on port " + PORT));