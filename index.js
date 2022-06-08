const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bearerToken = require('express-bearer-token');
// const studentSchema = require('./schema/studentSchema')
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const studentSchema = require('./schema/studentSchema');
const allFunction = require('./commongfunctions');
const cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
    // const { allFunction } = require('./commongfunctions');
var CryptoJS = require("crypto-js");

const app = express()

app.use(express.json())
app.use(bearerToken());
app.use(cors())
app.use(cookieParser())
    // app.use(bodyParser())
app.use(bodyParser.json())
mongoose.connect('mongodb+srv://ravikant:Ravi2022@cluster0.b7vti6d.mongodb.net/?retryWrites=true&w=majority').then((res) => console.log("database Connected")).catch((err) => "databaseError")

let username = "admin"
let password = "admin@123"
let loginKey = "poornima"

function isLogin(token) {
    if (jwt.verify(token, loginKey)) {
        return true
    } else {
        return false
    }

}
let credential = {
    "username": "admin",
    "password": "admin@123"
}

let sampldata = {
    "name": "ravikant",
    "class": "12th",
    "rollno": "203",
    "marks": "96"
}
const PORT = process.env.PORT || 4000;

app.post('/Login', (req, res) => {
    // console.log(req.body)
    let bytes = CryptoJS.AES.decrypt(req.body.data, 'my-secret-key@123');

    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // console.log(decryptedData, "decryptedData")

    if (username === decryptedData.username && password === decryptedData.password) {

        var token = jwt.sign(req.body, loginKey)
        res.cookie("jwtTocken", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true
        })
        res.json({
            token: token
        })


    } else {
        res.status(401).json({ message: "Either username or password is invalid" })
    }

})

app.get("/getAll", async(req, res) => {

    if (isLogin(req.token)) {
        let allStudent = await studentSchema.find({})

        res.send({ data: allStudent })
    } else {
        res.status(401).json({ message: "Invalid user, Please Login Again" })
    }
})


let count = 10
app.get('/sample', (req, res) => {
    res.cookie("jwtTocken", "ravi", {
        expires: new Date(Date.now() + 60000),
        httpOnly: true
    })

    if (count > 0) {
        count = count - 1
    }


    res.send({ message: "success", count: count })
})
app.post('/studentSave', (req, res) => {

    if (isLogin(req.token)) {
        allFunction.searchStudentByNameAndRollNo(req.body.rollno).then((response) => {

            if (response.status) {
                res.send({ success: false, message: `Rollno ${req.body.rollno} is Already present with name ${response.data.name }` })
            } else {
                let commonId = uuidv4()
                let studentNew = new studentSchema({
                    name: req.body.name,
                    class: req.body.class,
                    rollno: req.body.rollno,
                    marks: req.body.marks,
                    id: commonId
                })
                studentNew.save()
                res.send({ success: true, message: "Student Saved" })
            }
        })

    } else {
        res.status(401).json({ message: "Invalid user, Please Login Again" })
    }
})

app.get("/rollno", (req, res) => {


    if (isLogin(req.token)) {
        allFunction.searchStudentByNameAndRollNo(req.query.id).then((response) => {

            if (response.status) {
                res.send({ data: response.data })
            } else {
                res.send({ data: "Student is not awailable" })
            }
        })

    } else {
        res.status(401).json({ message: "Invalid user, Please Login Again" })
    }

})


app.post('/updateStudent', (req, res) => {

    if (isLogin(req.token)) {
        allFunction.searchStudentByNameAndRollNo(req.body.rollno).then((response) => {

            if (response.status) {

                allFunction.serchStudentAndUpdate(req.body).then((res2) => {
                    res.send({ message: "Student Updated" })

                }).catch((err) => {
                    res.send({ message: "oops try again later" })
                })

            } else {
                res.send({ message: "Student is not awailable" })
            }
        })

    } else {
        res.status(401).json({ message: "Invalid user, Please Login Again" })
    }
})

app.post('/deleteStudent', (req, res) => {

    if (isLogin(req.token)) {
        allFunction.searchStudentByNameAndRollNo(req.body.id).then((response) => {

            if (response.status) {
                allFunction.deleteStudent(req.body.id).then((res2) => {

                    res.send({ message: "Student Deleted" })


                })

            } else {
                res.send({ message: "Student is not awailable" })
            }
        })

    } else {
        res.status(401).json({ message: "Invalid user, Please Login Again" })
    }
})



app.listen(PORT, (req, res) => {
    console.log(`server is running at ${PORT}`)
})