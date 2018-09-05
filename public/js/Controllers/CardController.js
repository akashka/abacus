angular.module('StudentApp.CardController', [])
    .controller('CardController', ['$scope', 'studentFactory', '$http', function ($scope, studentFactory, $http) {
        //Close card handler
        $scope.close_card = function () {
            $scope.$parent.editing = false;
            $scope.$parent.loading = false;
        };

        $scope.tshirtsizeoptions = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        $scope.programmeoptions = ['Center Programme', 'School Programme'];
        $scope.centeroptions = [
            { name: 'ABC Center', code: 'abc' },
            { name: 'DEF Center', code: 'def' },
            { name: 'GHI Center', code: 'ghi' },
            { name: 'JKL Center', code: 'jkl' },
            { name: 'MNOP', code: 'mno' },
            { name: 'QRSTUVWX Y Z', code: 'xyz' }
        ];
        $scope.schooloptions = [
            { name: 'ABC School', code: 'abc' },
            { name: 'DEF School', code: 'def' },
            { name: 'GHI School', code: 'ghi' },
            { name: 'JKL School', code: 'jkl' },
            { name: 'MNOP', code: 'mno' },
            { name: 'QRSTUVWX Y Z', code: 'xyz' }
        ];
        $scope.centergroups = ['MA', 'TT'];
        $scope.schoolgroups = ['MAS', 'TTS'];
        $scope.malevels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        $scope.ttlevels = ["1", "2", "3", "4", "5", "6", "7", "8"];

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

        $scope.onCenterChange = function (centername, program) {
            $scope.$parent.student.centercode = centername.code;
        }

        $scope.calculateAge = function () {
            var now = new Date();
            // var today = new Date(now.getYear(), now.getMonth(), now.getDate());
            // To - Do: Set date to 31st sept 2018
            var yearNow = now.getYear();
            var monthNow = now.getMonth();
            var dateNow = now.getDate();
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

            return age;
        }

        $scope.onGroupChange = function (group, program) {
            var age = $scope.calculateAge();
            if(program == 'Center') {
                if(group == 'TT') {
                    if(age.years >= 5 && age.years < 7) $scope.$parent.student.category = 'A';
                    else if(age.years >= 7) $scope.$parent.student.category = 'B';
                    else $scope.$parent.student.category = '';
                } else {
                    if(age.years >= 7 && age.years < 9) $scope.$parent.student.category = 'A';
                    else if(age.years >= 9 && age.years < 11) $scope.$parent.student.category = 'B';
                    else if(age.years >= 11 && age.years < 13) $scope.$parent.student.category = 'C';
                    else if(age.years >= 13) $scope.$parent.student.category = 'D';
                    else $scope.$parent.student.category = '';
                }
            } else {
                if(group == 'TTS') {
                    if(age.years >= 5 && age.years < 7) $scope.$parent.student.category = 'A1';
                    else if(age.years >= 7) $scope.$parent.student.category = 'B1';
                    else $scope.$parent.student.category = '';
                } else {
                    if(age.years >= 8 && age.years < 10) $scope.$parent.student.category = 'A1';
                    else if(age.years >= 10) $scope.$parent.student.category = 'B1';
                    else $scope.$parent.student.category = '';
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
                var uploadUrl = "/savedata";
                var fd = new FormData();
                $scope.student.photo = myFile.name;
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
            if($scope.$parent.isBirthcertificate) {
                $scope.save();
            } else if(myFile == "" || myFile == undefined) {
                $scope.msg = "Upload Birth Certificate or Aadhaar Card";
            } else {
                var file = myFile;
                var uploadUrl = "/savedata";
                var fd = new FormData();
                fd.append('file', file);
                $scope.student.birthcertificate = myFile.name;
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

    }]);
