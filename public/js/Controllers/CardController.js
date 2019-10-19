angular.module('StudentApp.CardController', [])
    .controller('CardController', ['$scope', 'studentFactory', '$http', function ($scope, studentFactory, $http) {
        //Close card handler
        $scope.close_card = function () {
            $scope.$parent.editing = false;
            $scope.$parent.loading = false;
        };

        $scope.tshirtsizeoptions = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        $scope.programmeoptions = ['Center Programme', 'School Programme'];
        
        $scope.centergroups = ['MA', 'TT'];
        $scope.schoolgroups = ['MAS', 'TTS'];
        $scope.ttlevels = ["pre", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        $scope.malevels = ["pre", "1", "2", "3", "4", "5", "6", "7", "8"];

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
            // console.log("enter in the save");
            // console.log("---------------------------------");
            $scope.count++;
            if ($scope.count >= 1 && $scope.student.birthcertificate != "") {
                $scope.$parent.loading = true;
                // $scope.$parent.student.centername = $scope.$parent.student.centername;
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
                        console.log(response);
                        $scope.$parent.editing = false;
                        $scope.$parent.update_students();
                    }, function (response) {
                        //error
                        console.error(response);
                    });
                }
            }
        }

        $scope.onCenterChange = function (centername, options) {
            for(var i=0; i< options.length; i++) {
                if(options[i].name == centername) {
                    $scope.$parent.student.centercode = options[i].code;
                }
            }
        }

        $scope.onProgramChange = function() {
            $scope.$parent.student.centercode = '';
            $scope.$parent.student.centername = '';
            $scope.$parent.student.schoolcode = '';
        }

        $scope.age = {
                years: -1,
                months: -1,
                days: -1
        };
        $scope.calculateAge = function () {
            var yearNow = 119;
            var monthNow = 9;
            var dateNow = 31;
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
            if(program == 'Center') {
                if(group == 'TT') {
                    if(age.years >= 5 && age.years < 7) $scope.$parent.student.category = 'A';
                    else if(age.years >= 7) $scope.$parent.student.category = 'B';
                    else $scope.$parent.student.category = 'Not Eligible';
                } else {
                    if(age.years >= 7 && age.years < 9) $scope.$parent.student.category = 'A';
                    else if(age.years >= 9 && age.years < 11) $scope.$parent.student.category = 'B';
                    else if(age.years >= 11 && age.years < 13) $scope.$parent.student.category = 'C';
                    else if(age.years >= 13) $scope.$parent.student.category = 'D';
                    else $scope.$parent.student.category = 'Not Eligible';
                }
            } else {
                if(group == 'TTS') {
                    if(age.years >= 5 && age.years < 7) $scope.$parent.student.category = 'A1';
                    else if(age.years >= 7) $scope.$parent.student.category = 'B1';
                    else $scope.$parent.student.category = 'Not Eligible';
                } else {
                    if(age.years >= 8 && age.years < 10) $scope.$parent.student.category = 'A1';
                    else if(age.years >= 10) $scope.$parent.student.category = 'B1';
                    else $scope.$parent.student.category = 'Not Eligible';
                }
            }
        }

        $scope.onCodeChange = function (studentcode) {
            for(s=0; s<$scope.$parent.student_list.length; s++) {
                if($scope.$parent.student_list[s].studentcode == studentcode)
                    $scope.$parent.student.studentcode = '';
            }
        }

        $scope.getcentergroups = function(student) {
            if(student.centercode == 'SCH2') return ['MA0', 'TT0'];
        }

        $scope.uploadFile = function (myFile) {
            if($scope.$parent.isPhoto) {
                $scope.uploadFile1($scope.myFile1);
            } else if(myFile == "" || myFile == undefined) {
                $scope.msg = "Upload Student Image";
            } else {
                var file = myFile;
                var uploadUrl = "/savedata/" + $scope.student.phone;
                var fd = new FormData();
                // $scope.student.photo = (myFile != undefined && myFile.name != undefined) ? myFile.name : "";
                fd.append('file', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function (response) {
                    $scope.student.photo = response;
                    $scope.uploadFile1($scope.myFile1);
                }).error(function (error) {
                    console.log(error);
                });
            }
        };

        $scope.uploadFile1 = function (myFile) {
            if($scope.$parent.isBirthcertificate) {
                // console.log("enter into ");
                // console.log("----------------------------------------");
                $scope.save();
            } else if(myFile == "" || myFile == undefined) {
                $scope.msg = "Upload Birth Certificate or Aadhaar Card";
            } else {
                var file = myFile;
                var uploadUrl = "/savedata/" + $scope.student.phone;
                var fd = new FormData();
                fd.append('file', file);
                // $scope.student.birthcertificate = (myFile != undefined && myFile.name != undefined) ? myFile.name : "";
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function (response) {
                    $scope.student.birthcertificate = response;
                     // console.log(student.birthcertificate);
                    // console.log("-----------------------");  
                    $scope.save();
                }).error(function (error) {
                    console.log(error);
                });
            }
        };

        $scope.getFileExtension = function(fileName) {
            var ext = fileName.split('.').pop().toLowerCase();
            if(ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext =='svg' || ext == 'gif') return true;
            return false;
        }

        $scope.deleteImage = function (type) {
            if (type == "photo") {
                $scope.$parent.student.photo = "";
                $scope.$parent.isPhoto = false;
            } else {
                $scope.$parent.student.birthcertificate = "";
                $scope.$parent.isBirthcertificate = false;
            }
        }

        $scope.close_admincard = function () {
            $scope.$parent.adminediting = false;
        }

        // $scope.update_student = function () {
        //     $scope.msg = "";
        //     if ($scope.$parent.student.address == "" || $scope.$parent.student.dateofbirth == "" || $scope.$parent.student.email == "" ||
        //         $scope.$parent.student.gender == "" || $scope.$parent.student.name == "" || $scope.$parent.student.parentname == "" || 
        //         $scope.$parent.student.phone == "" || $scope.$parent.student.group == "" || $scope.$parent.student.category == "" || 
        //         $scope.$parent.student.level == "" || $scope.$parent.student.address == undefined || $scope.$parent.student.dateofbirth == undefined 
        //         || $scope.$parent.student.email == undefined || $scope.$parent.student.gender == undefined || $scope.$parent.student.name == undefined 
        //         || $scope.$parent.student.parentname == undefined || $scope.$parent.student.phone == undefined || $scope.$parent.student.group == undefined 
        //         || $scope.$parent.student.category == undefined || $scope.$parent.student.level == undefined) {
        //             $scope.msg = "Invalid or Missing Data. Please make sure you have filled all the details correctly";
        //     // } else if ($scope.$parent.student.programmename == 'School Programme' && 
        //     //     ($scope.$parent.student.class == undefined || $scope.$parent.student.class == '' ||
        //     //     $scope.$parent.student.section == undefined || $scope.$parent.student.section == '')) {
        //     //         $scope.msg = "Invalid or Missing Data. Please make sure you have filled all the details correctly";
        //     // } else if ($scope.$parent.student.programmename == 'Center Programme' && 
        //     //     ($scope.$parent.student.presentlevel == undefined || $scope.$parent.student.presentlevel == '' ||
        //     //     $scope.$parent.student.presentweek == undefined || $scope.$parent.student.presentweek == '')) {
        //     //         $scope.msg = "Invalid or Missing Data. Please make sure you have filled all the details correctly";
        //     } else {
        //             $scope.uploadFileAdmin($scope.myFile);
        //     }
        // };

        $scope.uploadFileAdmin = function (myFile) {
            if($scope.myFile != "" && $scope.myFile != undefined) {
                var file = $scope.myFile;
                var uploadUrl = "/savedata/" + $scope.student.phone;
                var fd = new FormData();
                // $scope.student.photo = (myFile != undefined && myFile.name != undefined) ? myFile.name : "";
                fd.append('file', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function (response) {
                    $scope.student.photo = response;
                    $scope.uploadFileAdmin1($scope.myFile1);
                }).error(function (error) {
                    console.log(error);
                });
            } else {
                $scope.uploadFileAdmin1($scope.myFile1);
            }
        };

        $scope.uploadFileAdmin1 = function (myFile) {
            if($scope.myFile1 != "" && $scope.myFile1 != undefined) {
                var file = $scope.myFile1;
                var uploadUrl = "/savedata/" + $scope.student.phone;
                var fd = new FormData();
                fd.append('file', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function (response) {
                    $scope.student.birthcertificate = response;
                    $scope.admin_save();
                }).error(function (error) {
                    console.log(error);
                });
            } else {
                $scope.admin_save();
            }
        };

        $scope.admin_save = function () {
            $scope.count++;
            if ($scope.count >= 1) {
                $scope.$parent.loading = true;
                // $scope.$parent.student.centername = $scope.$parent.student.centername;
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
                        console.log(response);
                        $scope.$parent.editing = false;
                        $scope.$parent.update_students();
                        location.reload();
                    }, function (response) {
                        //error
                        console.error(response);
                    });
                }
            }
        }

        $scope.centeroptions = [
            { name: 'HEBBAL', code: '1367', program:'center'}, // 9886293723
            { name: 'BEGUR', code: '1379', program:'center'}, // 9886585107
            { name: 'KUMARAPARK', code: '1323', program:'center'}, //9900083766
            { name: 'KOLEEGALA', code: '1321', program:'center'}, // 9886017421, 7892331200
            { name: 'HOSAKOTE', code: 'KA42', program:'center'}, // 9986099408, 7259336864
            { name: 'R P D CROSS', code: '1357', program:'center'}, // 9845538279
            { name: 'MALMARUTHI B G M', code: '1356', program:'center'}, // 9844802955, 8867219679
            { name: 'KARKALA', code: '1344', program:'center'}, // 9980439868
            { name: 'JALAHALLI', code: '1364', program:'center'}, // 8884012849
            { name: 'MYSORE', code: '1400', program:'center'}, //
        ];

        $scope.schooloptions = [
            { name: 'Air Force Jalahalli', code: 'SCH1', program:'school'}, // 9945179640
            { name: 'Euro School Chimney Hills', code: 'SCH2', program:'scholl'}, // 9591478791
            { name: 'KMV Red Hills School', code: 'SCH3', program:'school'}, // 8618576863, 9880632136, 8310810268, 7760262284
            { name: 'Vidya Soudha Public School Peenya', code: 'SCH4', program:'school'} // 9980555084, 9483047595             
        ];

    }]);
