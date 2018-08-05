var express = require('express'),
    router = express.Router(),
    domain = require('domain'),
    studentDAO = require('./../../../model/DAO/studentDAO');

//CREATE a new student
router.post('/', function (req, res){
    var d = domain.create();

    d.on('error', function(error){
        console.log(error.stacktrace);
        res.status(500).send({'error': error.message});
    });

    d.run(function(){
        studentDAO.createStudent({
                phone: req.body.phone,
                email: req.body.email,
                name: req.body.name,
                dateofbirth: req.body.dateofbirth,
                gender: req.body.gender,
                parentname: req.body.parentname,
                address: req.body.address,
                tshirtsize: req.body.tshirtsize,
                group: req.body.group,
                category: req.body.category,
                level: req.body.level,
                photo: req.body.photo,
                centername: req.body.centername,
                centercode: req.body.centercode,
                schoolname: req.body.schoolname,
                registrationdate: req.body.registrationdate,
                studentcode: req.body.studentcode,
                levelcompleted: req.body.levelcompleted,
                presentlevel: req.body.presentlevel,
                presentweek: req.body.presentweek,
                status: req.body.status,
                examdate: req.body.examdate,
                entrytime: req.body.entrytime,
                competitiontime: req.body.competitiontime,
                venue: req.body.venue
            }, {
            success: function(f){
                res.status(201).send({msg: 'Student created succesfully: '+req.body.name, data: f});
            },
            error: function(err){
                res.status(500).send(err);
            }
        });
    });
});

//READ all students
router.get('/', function(req, res, next) {
    var d = domain.create();
    var skip = req.query.skip;
    var count = req.query.count;

    d.on('error', function(error){
        console.log(error.stacktrace);
        res.status(500).send({'error': error.message});
    });

    d.run(function(){
        studentDAO.readStudents(skip, count, {
            success: function(students){
                res.status(200).send(JSON.stringify(students));
            },
            error: function(err){
                res.status(500).send(err);
            }
        });
    });
});

//READ student by id
router.get('/:id', function (req, res){
    var d = domain.create();
    d.on('error', function(error){
        console.log(error.stacktrace);
        res.status(500).send({'error': error.message});

    });

    d.run(function(){
        studentDAO.readStudentById(req.params.id ,{
            success: function(student){
                res.status(200).send(JSON.stringify(student));
            },
            error: function(err){
                res.status(404).send(err);
            }
        });
    });
});

//UPDATE student
router.put('/:id', function (req, res){
    var d = domain.create();
    d.on('error', function(error){
        console.log(error.stacktrace);
        res.status(500).send({'error': error.message});
    });

    d.run(function(){
        studentDAO.updateStudent(req.params.id, {
                phone: req.body.phone,
                email: req.body.email,
                name: req.body.name,
                dateofbirth: req.body.dateofbirth,
                gender: req.body.gender,
                parentname: req.body.parentname,
                address: req.body.address,
                tshirtsize: req.body.tshirtsize,
                group: req.body.group,
                category: req.body.category,
                level: req.body.level,
                photo: req.body.photo,
                centername: req.body.centername,
                centercode: req.body.centercode,
                schoolname: req.body.schoolname,
                registrationdate: req.body.registrationdate,
                studentcode: req.body.studentcode,
                levelcompleted: req.body.levelcompleted,
                presentlevel: req.body.presentlevel,
                presentweek: req.body.presentweek,
                status: req.body.status,
                examdate: req.body.examdate,
                entrytime: req.body.entrytime,
                competitiontime: req.body.competitiontime,
                venue: req.body.venue
        }, {
            success: function(f){
                res.status(200).send({msg: 'Student updated succesfully: '+JSON.stringify(f), data: f});
            },
            error: function(err){
                res.status(500).send(err);
            }
        });
    });
});

//DELETE student
router.delete('/:id', function (req, res){
    var d = domain.create();
    d.on('error', function(error){
        console.log(error.stacktrace);
        res.status(500).send({'error': error.message});
    });

    d.run(function(){
        studentDAO.deleteStudent(req.params.id ,{
            success: function(f){
                res.status(200).send({msg: 'Student deleted succesfully: ' + req.params.id, data: f});
            },
            error: function(err){
                res.status(500).send(err);
            }
        });
    });
});

module.exports = router;
