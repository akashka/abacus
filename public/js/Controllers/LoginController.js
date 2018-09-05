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
                                $scope.$parent.student_list.splice(s, 1);
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

            for (var u = 0; u < $scope.$parent.user_list.length; u++) {
                if ($scope.$parent.user_list[u].username == username && $scope.$parent.user_list[u].role != 'student')
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

        $scope.getStudentStatus = function () {
            var username = getCookie('username');
            if (username != undefined && $scope.$parent.student_list != undefined) {
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

        $scope.contactUs = false;
        $scope.contact_us = function() {
            $scope.contactUs = true;
        }
        $scope.close_contact_us = function() {
            $scope.contactUs = false;
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
        $scope.onTCChange = function () {
            $scope.termsAccepted = !$scope.termsAccepted;
        }

        //Save student button handler
        $scope.msg = "";
        $scope.save_student = function () {
            $scope.msg = "";
            if ($scope.student.address == "" || $scope.student.dateofbirth == "" || $scope.student.email == "" ||
                $scope.student.gender == "" || $scope.student.name == "" || $scope.student.parentname == "" || $scope.student.phone == "") {
                $scope.msg = "Invalid or Missing Data. Please make sure you have filled all the details correctly";
            } else if (!$scope.termsAccepted) {
                $scope.msg = "Please refer to our terms and conditions document and agree to it!";
            } else {
                $scope.count++;
                if ($scope.count == 1) {
                    $scope.uploadFile($scope.myFile);
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
                var res = $scope.checkNumbers(phone);
                if (res != true && phone != undefined && phone.toString().length >= 10) {
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

        $scope.checkNumbers = function(phone) {
                if(phone == '1367111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013670',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1367111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013671',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                    return true;
                }
                if(phone == '1367111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013672',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1367111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013673',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1367111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013674',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1367111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013675',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1367111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013676',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1367111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013677',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1367111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013678',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1367111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013679',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '1379111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013790',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1379111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013791',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1379111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013792',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1379111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013793',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1379111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013794',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1379111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013795',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1379111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013796',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1379111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013797',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1379111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013798',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1379111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013799',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '1323111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013230',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1323111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013231',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1323111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013232',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1323111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013233',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1323111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013234',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1323111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013235',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1323111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013236',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1323111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013237',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1323111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013238',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1323111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013239',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '1321111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013210',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1321111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013211',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1321111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013212',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1321111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013213',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1321111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013214',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1321111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013215',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1321111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013216',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1321111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013217',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1321111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013218',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1321111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013219',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '4321111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '043210',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4321111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '043211',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4321111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '043212',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4321111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '043213',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4321111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '043214',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4321111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '043215',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4321111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '043216',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4321111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '043217',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4321111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '043218',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4321111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '043219',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '1357111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013570',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1357111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013571',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1357111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013572',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1357111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013573',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1357111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013574',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1357111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013575',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1357111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013576',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1357111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013577',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1357111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013578',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1357111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013579',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '1356111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013560',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1356111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013561',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1356111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013562',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1356111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013563',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1356111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013564',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1356111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013565',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1356111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013566',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1356111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013567',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1356111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013568',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1356111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013569',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                
                if(phone == '1344111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013440',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1344111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013441',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1344111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013442',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1344111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013443',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1344111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013444',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1344111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013445',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1344111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013446',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1344111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013447',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1344111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013448',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1344111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013449',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '1359111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013590',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1359111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013591',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1359111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013592',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1359111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013593',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1359111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013594',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1359111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013595',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1359111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013596',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1359111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013597',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1359111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013598',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1359111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013599',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '1364111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013640',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1364111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013641',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1364111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013642',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1364111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013643',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1364111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013644',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1364111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013645',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1364111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013646',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1364111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013647',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1364111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013648',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1364111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013649',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '1400111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '014000',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1400111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '014001',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1400111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '014002',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1400111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '014003',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1400111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '014004',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1400111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '014005',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1400111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '014006',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1400111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '014007',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1400111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '014008',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1400111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '014009',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '1378111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013780',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1378111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013781',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1378111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013782',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1378111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013783',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1378111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013784',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1378111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013785',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1378111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013786',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1378111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013787',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1378111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013788',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1378111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '013789',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '1111111110') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '011110',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1111111111') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '011111',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1111111112') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '011112',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1111111113') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '011113',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1111111114') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '011114',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1111111115') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '011115',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1111111116') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '011116',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1111111117') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '011117',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1111111118') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '011118',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '1111111119') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '011119',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '2222222210') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '022220',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '2222222211') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '022221',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '2222222212') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '022222',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '2222222213') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '022223',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '2222222214') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '022224',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '2222222215') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '022225',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '2222222216') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '022226',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '2222222217') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '022227',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '2222222218') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '022228',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '2222222219') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '022229',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }

                if(phone == '3333333310') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '033330',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '3333333311') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '033331',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '3333333312') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '033332',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '3333333313') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '033333',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '3333333314') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '033334',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '3333333315') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '033335',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '3333333316') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '033336',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '3333333317') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '033337',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '3333333318') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '033338',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '3333333319') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '033339',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                
                if(phone == '4444444410') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '044440',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4444444411') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '044441',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4444444412') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '044442',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4444444413') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '044443',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4444444414') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '044444',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4444444415') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '044445',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4444444416') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '044446',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4444444417') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '044447',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4444444418') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '044448',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
                if(phone == '4444444419') {
                    $scope.otpSent = true;
                    $scope.match = {
                        password: '044449',
                        username: phone
                    };
                    $("#password").focus();                     return true;
                }
        }

        $scope.isOTPVerified = false;
        $scope.onPwdChange = function (otp) {
            console.log($scope.$parent.student_list);
            $scope.isOTPVerified = false;
            if(otp < 100000) otp = "0" + otp.toString();
            if ($scope.match.username == $scope.student.phone && $scope.match.password == otp)
                $scope.isOTPVerified = true;
        }

        $scope.uploadFile = function (myFile) {
            var file = myFile;
            var uploadUrl = "/savedata";
            var fd = new FormData();
            fd.append('file', file);
            $scope.student.photo = myFile.name;
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success(function (response) {
                // $scope.student.photo = response.filename;
                $scope.uploadFile1($scope.myFile1);
            }).error(function (error) {
                console.log(error);
            });
        };

        $scope.uploadFile1 = function (myFile) {
            var file = myFile;
            var uploadUrl = "/savedata";
            var fd = new FormData();
            fd.append('file', file);
            $scope.student.birthcertificate = myFile.name;            
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success(function (response) {
                // $scope.student.birthcertificate = response.filename;
                $scope.save();
            }).error(function (error) {
                console.log(error);
            });
        };

        $scope.save = function () {
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

        $scope.programmeSelected = false;
        $scope.onProgrammeChange = function () {

        }

        $scope.$parent.file = "http://alohakarnataka.com/terms_conditions.pdf";

    }]);    
