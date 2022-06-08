// import studentSchema from "./schema/studentSchema"
const studentSchema = require("./schema/studentSchema")

const allFunction = {
    searchStudentByNameAndRollNo,
    serchStudentAndUpdate,
    deleteStudent,
}

async function subFunc(rollno) {
    let foundStudent = await studentSchema.find({ rollno: rollno })
    return foundStudent
}

function searchStudentByNameAndRollNo(rollno) {
    return subFunc(rollno).then((res) => {
        if (res.length > 0) {
            return { status: true, data: res[0] }
        } else {
            return { status: false, data: [] }
        }
    })


}
let a;

async function serchStudentAndUpdate(stuData) {
    return await studentSchema.findOneAndUpdate({ rollno: stuData.rollno }, {
        name: stuData.name,

        marks: stuData.marks,
        class: stuData.class
    })
}

async function deleteStudent(rollno) {
    return await studentSchema.findOneAndDelete({
        rollno: rollno,
    })
}
module.exports = allFunction