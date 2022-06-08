const mongoose = require('mongoose')

const studentTable = mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    class: {
        type: String,
            require: true
    },
    rollno: {
        type: Number,
        require: true
    },
    marks: {
        type: Number
    },
    id: {
        type: String,
        require: true
    }
})

const studentSchema = mongoose.model("studentRecord", studentTable)
module.exports = studentSchema