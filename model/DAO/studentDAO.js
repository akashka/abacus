var db = require('../../config/mongodb').init(),
    fs = require('fs'),
    path = require('path'),
    conversion = require("phantom-html-to-pdf")(),
    QRCode = require('qrcode');
    mongoose = require('mongoose');
var sgMail = require('@sendgrid/mail');

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
function generateHallTicket(username, callbacks) {
    console.log(username);
    StudentModel.find({ phone: username.username }, function (err, student) {
        if (!err) {
            student = student[0];
                    // var text = "Student Name: " + student.name + "\n \n";
                    // text += "Roll No: " + student.programmes[p].admissioncardno + "\n \n";
                    // text += "Reporting Time: " + student.programmes[p].entrytime + "\n \n";
                    // text += "Center: " + student.centername;
                    // QRCode.toDataURL(text, function (err, body) {
                    //     var qrImage = "";
                    //     if (!err) qrImage = body;
                        var stringTemplate = fs.readFileSync(path.join(__dirname, '../../helpers') + '/hallticket.html', "utf8");

                        // stringTemplate = stringTemplate.replace('{{headingName}}', ((program.programmename.indexOf("State") != -1) ? "15th State Level Competition 2018" : "15th National Level Competition 2018"));
                        // stringTemplate = stringTemplate.replace('{{StudentRollNumber}}', (program.admissioncardno != undefined) ? program.admissioncardno : "");
                        stringTemplate = stringTemplate.replace('{{StudentName}}', (student.name));
                        stringTemplate = stringTemplate.replace('{{StateName}}', student.sstatename);
                        stringTemplate = stringTemplate.replace('{{CenterName}}', student.centername);
                        stringTemplate = stringTemplate.replace('{{CenterCode}}', student.centercode);
                        // stringTemplate = stringTemplate.replace('{{ReportingTime}}', (program.entrytime != undefined) ? program.entrytime : "");
                        stringTemplate = stringTemplate.replace('{{StudentImage}}', (student.photo != undefined) ? ("https://s3.ap-south-1.amazonaws.com/alohanlc/" + student.photo) : "https://consumercomplaintscourt.com/wp-content/uploads/2015/12/no_uploaded.png");
                        // stringTemplate = stringTemplate.replace('{{StudentQRCode}}', (qrImage != undefined) ? qrImage : "https://consumercomplaintscourt.com/wp-content/uploads/2015/12/no_uploaded.png");

                        conversion({ html: stringTemplate }, function (err, pdf) {
                            callbacks.success(pdf);
                        });
                }
         else {
            sendInfoMail('Student hall ticket generation failed: ' + username, err);
            callbacks.error(err);
        }
    });
}

function formatDate(date) {
    var d = new Date(date);
    d.setDate(d.getDate());
    var month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate() + 1),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
}

function downloadCopy(username, callbacks) {
    StudentModel.find({ phone: username.username }, function (err, student) {
        if (!err) {
            console.log("success1");
            student = student[0];
            var programName;
            switch(student.group){
                case "TT":
                    programName = "Tiny Tots";
                    break;
                case "TTS":
                    programName = "Tiny Tots School";
                    break;
                case "MA":
                    programName = "Mental Airthmetic";
                    break;
                case "MAS":
                    programName = "Mental Airthmetic School";
                    break;
            }
            var stringTemplate = fs.readFileSync(path.join(__dirname, '../../helpers') + '/copy.html', "utf8");
            // stringTemplate = stringTemplate.replace('{{sstateName}}', (student.sstatename) ? student.sstatename : "");
            if(student.programmename == "Center Programme"){
                stringTemplate = stringTemplate.replace('{{centerName}}', (student.centername) ? student.centername : "");
            }
            else if(student.programmename == "School Programme"){
                stringTemplate = stringTemplate.replace('{{centerName}}', (student.schoolname) ? student.schoolname : "");
            }
            stringTemplate = stringTemplate.replace('{{programmes}}', student.programmename);
            stringTemplate = stringTemplate.replace('{{phoneNo}}', (student.phone) ? student.phone : "");
            stringTemplate = stringTemplate.replace('{{emailId}}', (student.email) ? student.email : "");
            stringTemplate = stringTemplate.replace('{{studentName}}', (student.name) ? student.name : "");
            stringTemplate = stringTemplate.replace('{{gender}}', (student.gender) ? student.gender : "");
            stringTemplate = stringTemplate.replace('{{parentName}}', (student.parentname) ? student.parentname : "");
            stringTemplate = stringTemplate.replace('{{address}}', (student.address) ? student.address : "");
            stringTemplate = stringTemplate.replace('{{dateOfBirth}}', (student.dateofbirth) ? formatDate(student.dateofbirth) : "");
            stringTemplate = stringTemplate.replace('{{tShirtSize}}', (student.tshirtsize) ? student.tshirtsize : "N/A");
            stringTemplate = stringTemplate.replace('{{photo}}', (student.photo != undefined && student.photo != '') ? ('https://s3.ap-south-1.amazonaws.com/alohakarnataka/' + student.photo) : 'https://consumercomplaintscourt.com/wp-content/uploads/2015/12/no_uploaded.png');
            stringTemplate = stringTemplate.replace('{{birthCertificate}}', (student.birthcertificate != undefined && student.birthcertificate != '') ? ('https://s3.ap-south-1.amazonaws.com/alohakarnataka/' + student.birthcertificate) : 'https://consumercomplaintscourt.com/wp-content/uploads/2015/12/no_uploaded.png');
            console.log(stringTemplate);
            conversion({ html: stringTemplate }, function (err, pdf) {
                console.log("successs2");
                console.log(pdf);
                callbacks.success(pdf);
            });
        } else {
            sendInfoMail('Student form copy download failed: ' + username, err);
            console.log("success3");
            callbacks.error(err);
        }
    });
}

function downloadReceipt(username, callbacks) {
    StudentModel.find({ phone: username.username }, function (err, student) {
        if (!err) {
            student = student[0];
            var programName,amount;
            switch(student.group){
                case "TT":
                    programName = "Tiny Tots";
                    break;
                case "TTS":
                    programName = "Tiny Tots School";
                    break;
                case "MA":
                    programName = "Mental Airthmetic";
                    break;
                case "MAS":
                    programName = "Mental Airthmetic School";
                    break;
            }
            if (student.tshirtrequired == true) {
                amount = 550+250;
            }
            else{
                amount = 550;
            }
            var stringTemplate = fs.readFileSync(path.join(__dirname, '../../helpers') + '/receipt.html', "utf8");
            // stringTemplate = stringTemplate.replace('{{stateName}}', ((student.sstatename != undefined) ? student.sstatename : ""));
            if(student.programmename == "Center Programme"){
                stringTemplate = stringTemplate.replace('{{centerName}}', (student.centername) ? student.centername : "");
            }
            else if(student.programmename == "School Programme"){
                stringTemplate = stringTemplate.replace('{{centerName}}', (student.schoolname) ? student.schoolname : "");
            }
            // stringTemplate = stringTemplate.replace('{{centerName}}', ((student.centername != undefined) ? student.centername : ""));
            stringTemplate = stringTemplate.replace('{{parentName}}', ((student.parentname != undefined) ? student.parentname : ""));
            stringTemplate = stringTemplate.replace('{{amount}}', amount);
            stringTemplate = stringTemplate.replace('{{studentName}}', ((student.name != undefined) ? student.name : ""));
            stringTemplate = stringTemplate.replace('{{coursesName}}', programName);

            conversion({ html: stringTemplate }, function (err, pdf) {
                callbacks.success(pdf);
            });

        } else {
            sendInfoMail('Student receipt download failed: ' + username, err);
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
module.exports.downloadCopy = downloadCopy;
module.exports.downloadReceipt = downloadReceipt;
