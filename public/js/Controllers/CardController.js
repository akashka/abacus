angular.module('StudentApp.CardController', [])
    .controller('CardController', ['$scope', 'studentFactory', '$http', '$window', function ($scope, studentFactory, $http, $window) {
        //Close card handler
        $scope.close_card = function () {
            $scope.$parent.editing = false;
            $scope.$parent.loading = false;
        };

        $scope.tshirtsizeoptions = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        $scope.programmeoptions = ['Center Programme', 'School Programme'];
        $scope.centeroptions = [
            { name: 'HEBBAL', code: '1367' }, // 9886293723
            { name: 'BEGUR', code: '1379' }, // 9886585107
            { name: 'KUMARAPARK', code: '1323' }, //9900083766
            { name: 'KOLEEGALA', code: '1321' }, // 9886017421, 7892331200
            { name: 'HOSAKOTE', code: 'KA42' }, // 9986099408, 7259336864
            { name: 'R P D CROSS', code: '1357' }, // 9845538279
            { name: 'MALMARUTHI B G M', code: '1356' }, // 9844802955, 8867219679
            { name: 'KARKALA', code: '1344' }, // 9980439868
            { name: 'KUNJEEBETTU', code: '1359' }, // 9980983815
            { name: 'JALAHALLI', code: '1364' }, // 8884012849
            { name: 'MYSORE', code: '1400' }, // 
            { name: 'PRASHANTH NAGAR', code: '1378' }, // 
            { name: 'Rajajinagar / HSR Layout', code: '1311'} // 9980994089
        ];
        $scope.schooloptions = [
            { name: 'Air Force Jalahalli', code: 'SCH1' }, // 9945179640
            { name: 'Euro School Chimney Hills', code: 'SCH2' }, // 9591478791
            { name: 'KMV Red Hills School', code: 'SCH3' }, // 8618576863, 9880632136, 8310810268, 7760262284
            { name: 'Vidya Soudha Public School Peenya', code: 'SCH4' } // 9980555084, 9483047595
        ];

        $scope.centeroption = [
            'HEBBAL', // 9886293723
            'BEGUR', // 9886585107
            'KUMARAPARK', //9900083766
            'KOLEEGALA', // 9886017421, 7892331200
            'HOSAKOTE', // 9986099408, 7259336864
            'R P D CROSS', // 9845538279
            'MALMARUTHI B G M', // 9844802955, 8867219679
            'KARKALA', // 9980439868
            'KUNJEEBETTU', // 9980983815
            'JALAHALLI', // 8884012849
            'MYSORE', // 
            'PRASHANTH NAGAR', // 
            'Rajajinagar / HSR Layout' // 9980994089
        ];

         $scope.schooloption = [
            'Air Force Jalahalli', // 9945179640
            'Euro School Chimney Hills', // 9591478791
            'KMV Red Hills School', // 8618576863, 9880632136, 8310810268, 7760262284
            'Vidya Soudha Public School Peenya' // 9980555084, 9483047595
        ];

        //admin - 9845679966
        $scope.centergroups = ['MA', 'TT'];
        $scope.schoolgroups = ['MAS', 'TTS'];
        $scope.ttlevels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        $scope.malevels = ["pre", "1", "2", "3", "4", "5", "6", "7", "8"];

        $scope.onCentChange = function(centername, key) {
            if(key == 'center') {
                for(var i=0; i<$scope.centeroptions.length; i++) {
                    if($scope.centeroptions[i].name == centername)
                        $scope.student.centercode = $scope.centeroptions[i].code;
                } 
            } else {
                for(var i=0; i<$scope.schooloptions.length; i++) {
                    if($scope.schooloptions[i].name == centername)
                        $scope.student.centercode = $scope.schooloptions[i].code;
                } 
            }
        }

        //Save student button handler
        $scope.msg = "";
        $scope.count = 0;
        $scope.save_student = function () {
            $scope.msg = "";
            if ($scope.$parent.student.address == "" || $scope.$parent.student.dateofbirth == "" || $scope.$parent.student.email == "" ||
                $scope.$parent.student.gender == "" || $scope.$parent.student.name == "" || $scope.$parent.student.parentname == "" ||
                $scope.$parent.student.phone == "" || $scope.$parent.student.group == "" || $scope.$parent.student.category == "" ||
                $scope.$parent.student.level == "" || $scope.$parent.student.address == undefined || $scope.$parent.student.dateofbirth == undefined
                || $scope.$parent.student.email == undefined || $scope.$parent.student.gender == undefined || $scope.$parent.student.name == undefined
                || $scope.$parent.student.parentname == undefined || $scope.$parent.student.phone == undefined || $scope.$parent.student.group == undefined
                || $scope.$parent.student.category == undefined || $scope.$parent.student.level == undefined) {
                $scope.msg = "Invalid or Missing Data. Please make sure you have filled all the details correctly";
            } else if ($scope.$parent.student.programmename == 'School Programme' &&
                ($scope.$parent.student.class == undefined || $scope.$parent.student.class == '' ||
                    $scope.$parent.student.section == undefined || $scope.$parent.student.section == '')) {
                $scope.msg = "Invalid or Missing Data. Please make sure you have filled all the details correctly";
            } else if ($scope.$parent.student.programmename == 'Center Programme' &&
                ($scope.$parent.student.presentlevel == undefined || $scope.$parent.student.presentlevel == '' ||
                    $scope.$parent.student.presentweek == undefined || $scope.$parent.student.presentweek == '')) {
                $scope.msg = "Invalid or Missing Data. Please make sure you have filled all the details correctly";
            } else {
                $scope.uploadFile($scope.myFile);
            }
        };

        $scope.save = function () {
            $scope.count++;
            if ($scope.count == 1) {
                $scope.$parent.loading = true;
                $scope.$parent.student.centername = $scope.$parent.student.centername;
                $scope.$parent.student.status = 'payment';
                if ($scope.$parent.student._id === undefined) {
                    //Adding Student -> POST
                    studentFactory.save($scope.$parent.student, function (response) {
                        $scope.$parent.editing = false;
                        $scope.$parent.update_students();
                    }, function (response) {
                        //error
                        console.error(response);
                    });

                } else {
                    //Editing Student -> PUT
                    studentFactory.update({ id: $scope.$parent.student._id }, $scope.$parent.student, function (response) {
                        $scope.$parent.editing = false;
                        $scope.count = 0;;
                        $scope.$parent.update_students();
                    }, function (response) {
                        //error
                        console.error(response);
                    });
                }
            }
        }

        $scope.onCenterChange = function (centername, program) {
            $scope.$parent.student.centercode = centername.code;
        }

        $scope.age = {
            years: -1,
            months: -1,
            days: -1
        };
        $scope.calculateAge = function () {
            var yearNow = 118;
            var monthNow = 8;
            var dateNow = 30;
            var dob = new Date($scope.$parent.student.dateofbirth);
            var yearDob = dob.getYear();
            var monthDob = dob.getMonth();
            var dateDob = dob.getDate();
            var age = {};
            yearAge = yearNow - yearDob;

            var monthAge = monthNow - monthDob;
            if (monthNow < monthDob) {
                yearAge--;
                monthAge += 12;
            }

            var dateAge = dateNow - dateDob;
            if (dateNow < dateDob) {
                monthAge--;
                dateAge += 31;
                if (monthAge < 0) {
                    monthAge = 11;
                    yearAge--;
                }
            }

            age = {
                years: yearAge,
                months: monthAge,
                days: dateAge
            };
            $scope.age = age;
            return age;
        }

        $scope.onGroupChange = function (group, program) {
            var age = $scope.calculateAge();
            if (program == 'Center') {
                if (group == 'TT') {
                    if (age.years >= 5 && age.years < 7) $scope.$parent.student.category = 'A';
                    else if (age.years >= 7) $scope.$parent.student.category = 'B';
                    else $scope.$parent.student.category = 'Not Eligible';
                } else {
                    if (age.years >= 7 && age.years < 9) $scope.$parent.student.category = 'A';
                    else if (age.years >= 9 && age.years < 11) $scope.$parent.student.category = 'B';
                    else if (age.years >= 11 && age.years < 13) $scope.$parent.student.category = 'C';
                    else if (age.years >= 13) $scope.$parent.student.category = 'D';
                    else $scope.$parent.student.category = 'Not Eligible';
                }
            } else {
                if (group == 'TTS') {
                    if (age.years >= 5 && age.years < 7) $scope.$parent.student.category = 'A1';
                    else if (age.years >= 7) $scope.$parent.student.category = 'B1';
                    else $scope.$parent.student.category = 'Not Eligible';
                } else {
                    if (age.years >= 8 && age.years < 10) $scope.$parent.student.category = 'A1';
                    else if (age.years >= 10) $scope.$parent.student.category = 'B1';
                    else $scope.$parent.student.category = 'Not Eligible';
                }
            }
        }

        $scope.onCodeChange = function (studentcode) {
            for (s = 0; s < $scope.$parent.student_list.length; s++) {
                if ($scope.$parent.student_list[s].studentcode == studentcode)
                    $scope.$parent.student.studentcode = '';
            }
        }

        $scope.getcentergroups = function (student) {
            if (student.centercode == 'SCH2') return ['MA0', 'TT0'];
        }

        $scope.uploadFile = function (myFile) {
            if ($scope.$parent.isPhoto) {
                $scope.uploadFile1($scope.myFile1);
            } else if (myFile == undefined || myFile.name == undefined) {
                $scope.uploadFile1($scope.myFile1);
            } else {
                var file = myFile;
                var uploadUrl = "/savedata";
                var fd = new FormData();
                $scope.student.photo = (myFile != undefined && myFile.name != undefined) ? myFile.name : "";
                fd.append('file', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function (response) {
                    // $scope.$parent.student.photo = response.filename;
                    $scope.uploadFile1($scope.myFile1);
                }).error(function (error) {
                    console.log(error);
                });
            }
        };

        $scope.uploadFile1 = function (myFile) {
            if ($scope.$parent.isBirthcertificate) {
                $scope.save();
            } else if (myFile == undefined || myFile.name == undefined) {
                $scope.save();
            } else {
                var file = myFile;
                var uploadUrl = "/savedata";
                var fd = new FormData();
                fd.append('file', file);
                $scope.student.birthcertificate = (myFile != undefined && myFile.name != undefined) ? myFile.name : "";
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function (response) {
                    // $scope.$parent.student.birthcertificate = response.filename;
                    $scope.save();
                }).error(function (error) {
                    console.log(error);
                });
            }
        };

        $scope.getFileExtension = function (fileName) {
            var ext = fileName.split('.').pop();
            if (ext == 'jpg' || ext == 'png' || ext == 'jpeg') return true;
            return false;
        }

        $scope.close_admincard = function () {
            $scope.$parent.adminediting = false;
        }

        getNumberOfStudents = function () {
            var count = 0;
            for (var s = 0; s < $scope.$parent.student_list.length; s++) {
                if ($scope.$parent.student_list[s].group == $scope.$parent.student.group &&
                    $scope.$parent.student_list[s].category == $scope.$parent.student.category &&
                    $scope.$parent.student_list[s].level == $scope.$parent.student.level)
                    count++;
            }
            count = count.toString();
            if (count < 10) count = "00" + count;
            else if (count < 100) count = "0" + count;
            return count;
        }

        $scope.save_adminstudent = function () {
            $scope.msg = "";
            if ($scope.$parent.student.entrytime == "" || $scope.$parent.student.entrytime == undefined ||
                $scope.$parent.student.competitiontime == "" || $scope.$parent.student.competitiontime == undefined) {
                $scope.msg = "Invalid or Missing Data. Please make sure you have filled all the details correctly";
            } else {
                $scope.$parent.student.examdate = "28-Oct-2018";
                $scope.$parent.student.venue = "Vidya Soudha School \n 9/1, 1st Main Road, \n Peenya 1st Stage, \n Bangalore 560058";
                $scope.$parent.student.status = "closed";
                $scope.$parent.student.admissioncardno = $scope.$parent.student.centercode + "/" + $scope.$parent.student.group + "/" +
                    $scope.$parent.student.category + "/" + ($scope.$parent.student.level == 'pre' ? "0" : $scope.$parent.student.level) + "/";
                $scope.$parent.student.admissioncardno += getNumberOfStudents();
                studentFactory.update({ id: $scope.$parent.student._id }, $scope.$parent.student, function (response) {
                    $scope.$parent.adminediting = false;
                    $scope.$parent.update_students();
                }, function (response) {
                    //error
                    console.error(response);
                });
            }
        }

        $scope.swap_image = function() {
            var temp = $scope.$parent.student.photo;
            $scope.$parent.student.photo = $scope.$parent.student.birthcertificate;
            $scope.$parent.student.birthcertificate = temp;
        }

        $scope.deleteImage = function(type) {
            if(type == "photo") {
                $scope.$parent.student.photo = "";
                $scope.$parent.isPhoto = false;
            } else {
                $scope.$parent.student.birthcertificate = "";
                $scope.$parent.isBirthcertificate = false;
            }
        }

    }]);
