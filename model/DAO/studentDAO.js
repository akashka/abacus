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
    tshirtsize:         { type: String, required: true },
    group:              { type: String, required: true },
    category:           { type: String, required: true },
    level:              { type: String, required: true },
    photo:              { type: String },
    centername:         { type: String },
    centercode:         { type: String },
    schoolname:         { type: String },
    registrationdate:   { type: String },
    studentcode:        { type: String, required: true, unique: true },
    levelcompleted:     { type: String },
    presentlevel:       { type: String },
    presentweek:        { type: String },
    status:             { type: String, required: true },
    examdate:           { type: String },
    entrytime:          { type: String },
    competitiontime:    { type: String },
    venue:              { type: String },
    dateCreated:        { type: Date},
    dateModified:       { type: Date}
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
        tshirtsize:         student.tshirtsize,
        group:              student.group,
        category:           student.category,
        level:              student.level,
        photo:              student.photo,
        centername:         student.centername,
        centercode:         student.centercode,
        schoolname:         student.schoolname,
        registrationdate:   student.registrationdate,
        studentcode:        student.studentcode,
        levelcompleted:     student.levelcompleted,
        presentlevel:       student.presentlevel,
        presentweek:        student.presentweek,
        status:             student.status,
        examdate:           student.examdate,
        entrytime:          student.entrytime,
        competitiontime:    student.competitiontime,
        venue:              student.venue,
        dateCreated:        new Date(),
        dateModified:       new Date()
    });

    f.save(function (err) {
        if (!err) {
            if(!isInTest) console.log("[ADD]   tudent created with id: " + f._id);
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
            if (student.name) f.name = student.name;
            if (student.email) f.email = student.email;
            if (student.dateofbirth) f.dateofbirth = student.dateofbirth;
            if (student.gender) f.gender = student.gender;
            if (student.parentname) f.parentname = student.parentname;
            if (student.address) f.address = student.address;
            if (student.tshirtsize) f.tshirtsize = student.tshirtsize;
            if (student.group) f.group = student.group;
            if (student.category) f.category = student.category;
            if (student.level) f.level = student.level;
            if (student.photo) f.photo = student.photo;
            if (student.centername) f.centername = student.centername;
            if (student.centercode) f.centercode = student.centercode;
            if (student.schoolname) f.schoolname = student.schoolname;
            if (student.registrationdate) f.registrationdate = student.registrationdate;
            if (student.levelcompleted) f.levelcompleted = student.levelcompleted;
            if (student.presentlevel) f.presentlevel = student.presentlevel;
            if (student.presentweek) f.presentweek = student.presentweek;
            if (student.status) f.status = student.status;
            if (student.examdate) f.examdate = student.examdate;
            if (student.entrytime) f.entrytime = student.entrytime;
            if (student.competitiontime) f.competitiontime = student.competitiontime;
            if (student.venue) f.venue = student.venue;
            f.dateModified = new Date();

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
