angular.module('StudentApp.LoginController', [])
    .controller('LoginController', ['$scope', 'userFactory', '$rootScope', 'studentFactory', 'fileUpload', '$http', function ($scope, userFactory, $rootScope, studentFactory, fileUpload, $http) {
        //Login form listener
        var working = false;
        $scope.otpSent = false;
        $scope.msg = '';

        $scope.send = function (username, password) {
            $("#login img").hide();
            if (working) return;
            working = true;
            var $this = $('#login'),
                $state = $this.find('button > .state');
            $this.addClass('loading');
            $state.html('Authenticating');

            userFactory.login({
                username: username,
                password: password
            }, function (response) {
                console.log(response);
                setTimeout(function () {
                    $this.addClass('ok');
                    $state.html('Welcome!');
                    $(".fa.fa-sign-out").show();
                    setCookie("username", username, 1);
                    setCookie("password", password, 1);
                    setCookie("role", response.role, 1);
                    setCookie("center", response.center, 1);
                    $scope.$parent.isStudent = (response.role == 'student') ? true : false;
                    $scope.$parent.isCenter = (response.role == 'center') ? true : false;
                    $scope.$parent.isAdmin = (response.role == 'admin') ? true : false;
                    if ($scope.$parent.isCenter) {
                        $scope.$parent.center = response.center;
                        for (var s = 0; s < $scope.$parent.student_list.length; s++) {
                            if ($scope.$parent.student_list[s].centercode != $scope.$parent.center) {
                                $scope.$parent.student_list.splice(s,1);
                                s--;
                            }
                        }
                    }
                    setTimeout(function () {
                        $state.html('Log in');
                        $this.removeClass('ok loading');
                        working = false;
                        $scope.$parent.loggedIn = true;
                        $scope.showOTPForm = false;
                        $rootScope.$broadcast('loggedin');
                        $scope.$apply();
                        //load everything
                    }, 1000);
                }, 1500);

            }, function (response) {
                //error
                console.error(response);
                $scope.$parent.loggedIn = false;
                $this.addClass('ko');
                $state.html('Invalid OTP!');
                var i = setTimeout(function () {
                    $state.html('Log in');
                    $("#login img").show();
                    $this.removeClass('ko loading');
                    $this.removeClass('ok loading');
                    working = false;
                    clearInterval(i);
                }, 1500);
            });
        };

        $scope.generateOTP = function (username) {
            $scope.msg = "";
            var isPhoneExist = false;
            var isCenterAdmin = false;

            for (var s = 0; s < $scope.$parent.student_list.length; s++) {
                if ($scope.$parent.student_list[s].phone == username)
                    isPhoneExist = true;
            }

            for(var u=0; u<$scope.$parent.user_list.length; u++) {
                if($scope.$parent.user_list[u].username == username && $scope.$parent.user_list[u].role != 'student')
                    isCenterAdmin = true;
            }

            if (isPhoneExist || isCenterAdmin) {
                userFactory.generateOTP({
                    username: username
                }, function (response) {
                    console.log(response);
                    $scope.otpSent = true;
                    $scope.match = {
                        password: response.password,
                        username: response.username
                    };
                    $("#password").focus();
                }, function (response) {
                    $scope.otpSent = false;
                    $scope.msg = response.data.msg;
                });
            } else {
                $scope.msg = "Phone Number is not registered!";
            }
        }

        $scope.getStudentStatus = function(){
            var username = getCookie('username');
            if(username != undefined && $scope.$parent.student_list != undefined) {
                for (var s = 0; s < $scope.$parent.student_list.length; s++) {
                    if ($scope.$parent.student_list[s].phone == username) {
                        $scope.studentStatus = $scope.$parent.student_list[s];
                        $scope.showStudentStatus = true;
                        $scope.loading = false;
                    }        
                };
            }
        }

        $scope.tryDifferentNumber = function () {
            $scope.otpSent = false;
        }

        $scope.registrationForm = false;
        $scope.register = function () {
            $scope.registrationForm = true;
        }

        $scope.showOTPForm = false;
        $scope.checkStatus = function () {
            $scope.showOTPForm = true;
        }

        $scope.dataSaved = false;

        $scope.tshirtsizeoptions = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        $scope.programmeoptions = ['Center Programme', 'School Programme'];
        $scope.centeroptions = [
            { name: 'HEBBAL', code: '1367' },
            { name: 'BEGUR', code: '1379' },
            { name: 'KUMARAPARK', code: '1323' },
            { name: 'KOLEEGALA', code: '1321' },
            { name: 'HOSAKOTE', code: 'KA42' },
            { name: 'R P D CROSS', code: '1357' },
            { name: 'MALMARUTHI B G M', code: '1356' },
            { name: 'KARKALA', code: '1344' },
            { name: 'KUNJEEBETTU', code: '1359' },
            { name: 'JALAHALLI', code: '1364' },
            { name: 'MYSORE', code: '1400' },
            { name: 'PRASHANTH NAGAR', code: '1378' }
        ];
        $scope.schooloptions = [
            { name: 'Air Force Jalahalli', code: 'SCH1' },
            { name: 'Euro School Chimney Hills', code: 'SCH2' },
            { name: 'KMV Red Hills School', code: 'SCH3' },
            { name: 'Vidya Soudha Public School Peenya', code: 'SCH4' }
        ];
        $scope.centergroups = ['MA', 'TT'];
        $scope.schoolgroups = ['MAS', 'TTS'];
        $scope.malevels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        $scope.ttlevels = ["1", "2", "3", "4", "5", "6", "7", "8"];

        $scope.termsAccepted = false;
        $scope.onTCChange = function() {
            $scope.termsAccepted = !$scope.termsAccepted;
        }

        //Save student button handler
        $scope.msg = "";
        $scope.save_student = function () {
            $scope.count++;
            if($scope.count == 1) {
                $scope.msg = "";
                if($scope.student.address == "" || $scope.student.dateofbirth == "" || $scope.student.email == "" ||
                    $scope.student.gender == "" || $scope.student.name == "" || $scope.student.parentname == "" || $scope.student.phone == "") {
                        $scope.msg = "Invalid or Missing Data. Please make sure you have filled all the details correctly";
                } else if(!$scope.termsAccepted) {
                        $scope.msg = "Please refer to our terms and conditions document and agree to it!";
                } else {
                    $scope.uploadFile($scope.myFile);
                    $scope.uploadFile1($scope.myFile1);
                    $scope.$parent.loading = true;
                    if ($scope.student.centername != undefined && $scope.student.centername != "")
                        $scope.student.centername = $scope.student.centername.name;
                    if ($scope.student.schoolname != undefined && $scope.student.schoolname != "")
                        $scope.student.schoolname = $scope.student.schoolname.name;
                    $scope.student.status = 'center';
                    if ($scope.student.dateCreated == undefined) $scope.student.dateCreated = new Date();
                    if ($scope.student._id === undefined) {
                        //Adding Student -> POST
                        studentFactory.save($scope.student, function (response) {
                            console.log(response);
                            $scope.editing = false;
                            $scope.dataSaved = true;
                            $scope.savingSuccess = true;
                            $scope.update_students();
                        }, function (response) {
                            //error
                            console.log(response);
                            $scope.$parent.editing = false;
                            $scope.dataSaved = true;
                            $scope.savingSuccess = true;
                            $scope.$parent.update_students();
                        });

                    } else {
                        //Editing Student -> PUT
                        studentFactory.update({ id: $scope.$parent.student._id }, $scope.$parent.student, function (response) {
                            console.log(response);
                            $scope.$parent.editing = false;
                            $scope.$parent.update_students();
                        }, function (response) {
                            //error
                            console.log(response);
                            $scope.$parent.editing = false;
                            $scope.$parent.update_students();
                        });
                    }
                }
            }
        };

        $scope.onCenterChange = function (centername, program) {
            $scope.student.centercode = centername.code;
        }

        $scope.calculateAge = function () {
            var now = new Date();
            var today = new Date(now.getYear(), now.getMonth(), now.getDate());
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
            if (program == 'Center') {
                if (group == 'TT') {
                    if (age.years >= 5 && age.years < 7) $scope.$parent.student.category = 'A';
                    else if (age.years >= 7) $scope.$parent.student.category = 'B';
                    else $scope.$parent.student.category = '';
                } else {
                    if (age.years >= 7 && age.years < 9) $scope.$parent.student.category = 'A';
                    else if (age.years >= 9 && age.years < 11) $scope.$parent.student.category = 'B';
                    else if (age.years >= 11 && age.years < 13) $scope.$parent.student.category = 'C';
                    else if (age.years >= 13) $scope.$parent.student.category = 'D';
                    else $scope.$parent.student.category = '';
                }
            } else {
                if (group == 'TTS') {
                    if (age.years >= 5 && age.years < 7) $scope.$parent.student.category = 'A1';
                    else if (age.years >= 7) $scope.$parent.student.category = 'B1';
                    else $scope.$parent.student.category = '';
                } else {
                    if (age.years >= 8 && age.years < 10) $scope.$parent.student.category = 'A1';
                    else if (age.years >= 10) $scope.$parent.student.category = 'B1';
                    else $scope.$parent.student.category = '';
                }
            }
        }

        $scope.onCodeChange = function (studentcode) {
            for (s = 0; s < $scope.$parent.student_list.length; s++) {
                if ($scope.$parent.student_list[s].studentcode == studentcode)
                    $scope.$parent.student.studentcode = '';
            }
        }

        $scope.student = {
            phone: '',
            email: '',
            name: '',
            dateofbirth: '',
            gender: '',
            parentname: '',
            address: '',
            tshirtsize: '',
            group: '',
            category: '',
            level: '',
            photo: '',
            birthcertificate: '',
            centername: '',
            centercode: '',
            schoolname: '',
            registrationdate: '',
            studentcode: '',
            levelcompleted: '',
            presentlevel: '',
            presentweek: '',
            status: 'open',
            examdate: '',
            entrytime: '',
            competitiontime: '',
            venue: '',
            amountreceived: '',
            amountreceivedfrom: '',
            amountreceiveddate: '',
            tshirtrequired: true
        }

        $scope.isPhoneDuplicate = false;
        $scope.count = 0;
        $scope.onPhoneChange = function (phone) {
            $scope.isPhoneDuplicate = false;
            for (var s = 0; s < $scope.$parent.student_list.length; s++) {
                if ($scope.$parent.student_list[s].phone == $scope.student.phone)
                    $scope.isPhoneDuplicate = true;
            }
            if (!$scope.isPhoneDuplicate) {
                if (phone != undefined && phone.toString().length >= 10) {
                    userFactory.generateOTP({
                        username: phone
                    }, function (response) {
                        $scope.otpSent = true;
                        $scope.match = {
                            password: response.password,
                            username: response.username
                        };
                        $("#password").focus();
                    }, function (response) {
                        $scope.otpSent = false;
                        $scope.msg = response.data.msg;
                    });
                }
            }
        }

        $scope.isOTPVerified = false;
        $scope.onPwdChange = function (otp) {
            console.log($scope.$parent.student_list);
            $scope.isOTPVerified = false;
            if ($scope.match.username == $scope.student.phone && $scope.match.password == $scope.otp)
                $scope.isOTPVerified = true;
        }

        $scope.uploadFile = function (myFile) {
            var file = myFile;
            var uploadUrl = "/savedata";
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success(function (response) {
                $scope.student.photo = response.filename;
            }).error(function (error) {
                console.log(error);
            });
        };

        $scope.uploadFile1 = function (myFile) {
            var file = myFile;
            var uploadUrl = "/savedata";
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success(function (response) {
                $scope.student.birthcertificate = response.filename;
            }).error(function (error) {
                console.log(error);
            });
        };

        $scope.programmeSelected = false;
        $scope.onProgrammeChange = function() {
            
        }

        $scope.file = "./terms_conditions.pdf";

    }]);    
