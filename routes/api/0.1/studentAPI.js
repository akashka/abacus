var express = require('express'),
    router = express.Router(),
    domain = require('domain'),
    studentDAO = require('./../../../model/DAO/studentDAO'),
    path = require('path'),
    fs = require('fs'),
    conversion = require("phantom-html-to-pdf")();

//CREATE a new student
router.post('/', function (req, res) {
    var d = domain.create();

    d.on('error', function (error) {
        console.log(error.stacktrace);
        res.status(500).send({ 'error': error.message });
    });

    d.run(function () {
        studentDAO.createStudent({
            phone: req.body.phone,
            email: req.body.email,
            name: req.body.name,
            dateofbirth: req.body.dateofbirth,
            gender: req.body.gender,
            parentname: req.body.parentname,
            address: req.body.address,
            programmename: req.body.programmename,
            tshirtrequired: req.body.tshirtrequired,
            tshirtsize: req.body.tshirtsize,
            photo: req.body.photo,
            birthcertificate: req.body.birthcertificate,
            centername: req.body.centername,
            centercode: req.body.centercode,
            schoolname: req.body.schoolname,
            status: req.body.status,
            dateCreated: req.body.dateCreated,
            dateModified: req.body.dateModified,
            group: req.body.group,
            category: req.body.category,
            level: req.body.level,
            registrationdate: req.body.registrationdate,
            studentcode: req.body.studentcode,
            presentlevel: req.body.presentlevel,
            presentweek: req.body.presentweek,
            section: req.body.section,
            class: req.body.class,
            lastyearlevel: req.body.lastyearlevel,
            paymentdate: req.body.paymentdate,
            transactionno: req.body.transactionno,
            paymentmode: req.body.paymentmode,
            bankname: req.body.bankname,
            examdate: req.body.examdate,
            entrytime: req.body.entrytime,
            competitiontime: req.body.competitiontime,
            venue: req.body.venue,
            admissioncardno: req.body.admissioncardno,
            paymentapproved: req.body.paymentapproved
        }, {
                success: function (f) {
                    res.status(201).send({ msg: 'Student created succesfully: ' + req.body.name, data: f });
                },
                error: function (err) {
                    res.status(500).send(err);
                }
            });
    });
});

//READ all students
router.get('/', function (req, res, next) {
    var d = domain.create();
    var skip = req.query.skip;
    var count = req.query.count;

    d.on('error', function (error) {
        console.log(error.stacktrace);
        res.status(500).send({ 'error': error.message });
    });

    d.run(function () {
        studentDAO.readStudents(skip, count, {
            success: function (students) {
                res.status(200).send(JSON.stringify(students));
            },
            error: function (err) {
                res.status(500).send(err);
            }
        });
    });
});

//READ student by id
router.get('/:id', function (req, res) {
    var d = domain.create();
    d.on('error', function (error) {
        console.log(error.stacktrace);
        res.status(500).send({ 'error': error.message });

    });

    d.run(function () {
        studentDAO.readStudentById(req.params.id, {
            success: function (student) {
                res.status(200).send(JSON.stringify(student));
            },
            error: function (err) {
                res.status(404).send(err);
            }
        });
    });
});

//UPDATE student
router.put('/:id', function (req, res) {
    var d = domain.create();
    d.on('error', function (error) {
        console.log(error.stacktrace);
        res.status(500).send({ 'error': error.message });
    });

    d.run(function () {
        studentDAO.updateStudent(req.params.id, {
            phone: req.body.phone,
            email: req.body.email,
            name: req.body.name,
            dateofbirth: req.body.dateofbirth,
            gender: req.body.gender,
            parentname: req.body.parentname,
            address: req.body.address,
            programmename: req.body.programmename,
            tshirtrequired: req.body.tshirtrequired,
            tshirtsize: req.body.tshirtsize,
            photo: req.body.photo,
            birthcertificate: req.body.birthcertificate,
            centername: req.body.centername,
            centercode: req.body.centercode,
            schoolname: req.body.schoolname,
            status: req.body.status,
            dateCreated: req.body.dateCreated,
            dateModified: req.body.dateModified,
            group: req.body.group,
            category: req.body.category,
            level: req.body.level,
            registrationdate: req.body.registrationdate,
            studentcode: req.body.studentcode,
            presentlevel: req.body.presentlevel,
            presentweek: req.body.presentweek,
            section: req.body.section,
            class: req.body.class,
            lastyearlevel: req.body.lastyearlevel,
            paymentdate: req.body.paymentdate,
            transactionno: req.body.transactionno,
            paymentmode: req.body.paymentmode,
            bankname: req.body.bankname,
            examdate: req.body.examdate,
            entrytime: req.body.entrytime,
            competitiontime: req.body.competitiontime,
            venue: req.body.venue,
            admissioncardno: req.body.admissioncardno,
            paymentapproved: req.body.paymentapproved
        }, {
                success: function (f) {
                    res.status(200).send({ msg: 'Student updated succesfully: ' + JSON.stringify(f), data: f });
                },
                error: function (err) {
                    res.status(500).send(err);
                }
            });
    });
});

//DELETE student
router.delete('/:id', function (req, res) {
    var d = domain.create();
    d.on('error', function (error) {
        console.log(error.stacktrace);
        res.status(500).send({ 'error': error.message });
    });

    d.run(function () {
        studentDAO.deleteStudent(req.params.id, {
            success: function (f) {
                res.status(200).send({ msg: 'Student deleted succesfully: ' + req.params.id, data: f });
            },
            error: function (err) {
                res.status(500).send(err);
            }
        });
    });
});

router.get('/download/:username', function(req, res){
    var d = domain.create();
    d.run(function(){
        studentDAO.downloadReceipt({
                username:   req.params.username,
            }, {
            success: function(pdf){
                var output = fs.createWriteStream('./output.pdf');
                pdf.stream.pipe(output);
                let filename = "invoice";
                filename = encodeURIComponent(filename) + '.pdf';
                var file = fs.readFileSync('./output.pdf');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
                pdf.stream.pipe(res);
            },
            error: function(err){
                res.status(403).send(err);
            }
        });
    });
})

router.get('/generateHallTicket/:username', function(req, res){
    var d = domain.create();
    d.run(function(){
        studentDAO.generateHallTicket({
                username:   req.params.username,
            }, {
            success: function(pdf){
                var output = fs.createWriteStream('./hallticket.pdf');
                pdf.stream.pipe(output);
                let filename = "hallticket";
                filename = encodeURIComponent(filename) + '.pdf';
                var file = fs.readFileSync('./hallticket.pdf');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
                pdf.stream.pipe(res);
            },
            error: function(err){
                res.status(403).send(err);
            }
        });
    });
})
module.exports = router;
