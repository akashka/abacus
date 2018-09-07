var db = require('../../config/mongodb').init(),
    mongoose = require('mongoose');

var isInTest = typeof global.it === 'function';

var Schema = mongoose.Schema;
var StudentSchema = new Schema({
    phone:              { type: String, required: true, unique: true },
    email:              { type: String, required: true },
    name:               { type: String, required: true },
    dateofbirth:        { type: String, required: true },
    gender:             { type: String, required: true },
    parentname:         { type: String, required: true },
    address:            { type: String, required: true },
    programmename:      { type: String },
    tshirtrequired:     { type: Boolean },
    tshirtsize:         { type: String },
    photo:              { type: String },
    birthcertificate:   { type: String },
    centername:         { type: String },
    centercode:         { type: String, required: true },
    schoolname:         { type: String },
    status:             { type: String, required: true },
    dateCreated:        { type: Date, required: true },
    dateModified:       { type: Date },
    group:              { type: String },
    category:           { type: String },
    level:              { type: String },
    registrationdate:   { type: String },
    studentcode:        { type: String },
    presentlevel:       { type: String },
    presentweek:        { type: String },
    section:            { type: String }, 
    class:              { type: String }, 
    lastyearlevel:      { type: String },
    paymentdate:        { type: String },
    transactionno:      { type: String },
    paymentmode:        { type: String },
    bankname:           { type: String },
    examdate:           { type: String },
    entrytime:          { type: String },
    competitiontime:    { type: String },
    venue:              { type: String },
    admissioncardno:    { type: String },
    paymentapproved:    { type: Boolean, default: false }
});

StudentSchema.pre('save', function(next){
    now = new Date();
    this.dateModified = now;
    if ( !this.dateCreated ) {
        this.dateCreated = now;
    }
    next();
});
var StudentModel = db.model('Student', StudentSchema);

//CREATE new student
function createStudent(student, callbacks){
    var f = new StudentModel({
        phone:              student.phone,
        email:              student.email,
        name:               student.name,
        dateofbirth:        student.dateofbirth,
        gender:             student.gender,
        parentname:         student.parentname,
        address:            student.address,
        tshirtrequired:     student.tshirtrequired,
        tshirtsize:         student.tshirtsize,
        photo:              student.photo,
        birthcertificate:   student.birthcertificate,
        programmename:      student.programmename,
        centername:         student.centername,
        centercode:         student.centercode,
        schoolname:         student.schoolname,
        status:             'open',
        dateCreated:        new Date()
    });
    f.save(function (err) {
        if (!err) {
            if(!isInTest) console.log("Student created with id: " + f._id);
            callbacks.success(f);
        } else {
            if(!isInTest) console.log(err);
            callbacks.error(err);
        }
    });
}

//READ all Students
function readStudents(skip, count, callbacks){
    return StudentModel.find()
    .sort('-dateCreated').skip(skip).limit(count).exec('find', function (err, students) {
        if (!err) {
            if(!isInTest) console.log('[GET]   Get students: ' + students.length);
            callbacks.success(students);
        } else {
            if(!isInTest) console.log(err);
            callbacks.error(err);
        }
    });
}

//READ student by id
function readStudentById(id, callbacks){
    return StudentModel.findById(id, function (err, student) {
        if (!err) {
            if(!isInTest) console.log('[GET]   Get student: ' + student._id);
            callbacks.success(student);
        } else {
            if(!isInTest) console.log(err);
            callbacks.error(err);
        }
    });
}

//UPDATE student
function updateStudent(id, student, callbacks){
    return StudentModel.findById(id, function (err, f) {
        if (!err) {
            f.phone = student.phone;
            f.email = student.email;
            f.name = student.name;
            f.dateofbirth = student.dateofbirth;
            f.gender = student.gender;
            f.parentname = student.parentname;
            f.address = student.address;
            f.tshirtrequired = student.tshirtrequired;
            f.tshirtsize = student.tshirtsize;
            f.photo = student.photo;
            f.birthcertificate = f.birthcertificate;
            // f.programmename = (student.centername != undefined && student.centername != "" ? "Center Programme" : "School Programme");
            f.centername = student.centername;
            f.centercode = student.centercode;
            f.schoolname = student.schoolname;
            f.status = student.status;
            f.dateModified = new Date();
            f.group = student.group;
            f.category = student.category;
            f.level = student.level;
            f.registrationdate = student.registrationdate;
            f.studentcode = student.studentcode;
            f.presentlevel = student.presentlevel;
            f.presentweek = student.presentweek;
            f.class = student.class;
            f.section = student.section;
            f.lastyearlevel = student.lastyearlevel;
            f.paymentdate = student.paymentdate;
            f.transactionno = student.transactionno;
            f.paymentmode = student.paymentmode;
            f.bankname = student.bankname;
            f.examdate = student.examdate;
            f.entrytime = student.entrytime;
            f.competitiontime = student.competitiontime;
            f.venue = student.venue;
            f.admissioncardno = student.admissioncardno;
            f.paymentapproved = student.paymentapproved;

            return f.save(function (err) {
                if (!err) {
                    if(!isInTest) console.log("[UDP]   Updated student: " + f._id);
                    callbacks.success(f);
                } else {
                    if(!isInTest) console.log(err);
                    callbacks.error(err);
                }
            });
        } else {
            if(!isInTest) console.log(err);
            callbacks.error(err);
        }
    });
}

//DELETE student
function deleteStudent(id, callbacks){
    return StudentModel.findById(id, function (err, f) {
        if (!err) {
            return f.remove(function (err) {
                if (!err) {
                    if(!isInTest) console.log("[DEL]    Deleted student: " + f._id);
                    callbacks.success(f);
                } else {
                    if(!isInTest) console.log(err);
                    callbacks.error(err);
                }
            });
        } else {
            if(!isInTest) console.log(err);
            callbacks.error(err);
        }
    });
}

// GENERATING QR Code
function generateQRCode(text) {
    console.log("Generating QR Code");
    var formData = "frame_name=no-frame&qr_code_text="+text+"&frame_text=Scan+me&frame_icon_name=mobile&frame_color=%23000000&foreground_color=%23000000";
    curl.request(formData, function optionalCallback(err, body) {
      if (err) {
        return console.error('Generating QR failed: ', err);
      }
      console.log('Successfully Generated QR Code');
      return body;
    });
}

// GENERATING Hall ticket
function generateHallTicket(id, callbacks) {
    return StudentModel.findById(id, function (err, f) {
        if (!err) {
            var qrcode = generateQRCode(f.studentcode);
        } else {
            if(!isInTest) console.log(err);
            callbacks.error(err);
        }
    });
}

module.exports.createStudent = createStudent;
module.exports.readStudents = readStudents;
module.exports.readStudentById = readStudentById;
module.exports.updateStudent = updateStudent;
module.exports.deleteStudent = deleteStudent;
module.exports.generateHallTicket = generateHallTicket;
