angular.module('StudentApp.CardController', [])
    .controller('CardController', ['$scope', 'studentFactory', function ($scope, studentFactory) {
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
        $scope.save_student = function () {
            $scope.$parent.loading = true;
            $scope.$parent.student.centername = $scope.$parent.student.centername.name;
            $scope.$parent.student.status = 'center';
            if($scope.$parent.student.dateCreated == undefined) $scope.$parent.student.dateCreated = new Date();
            if ($scope.$parent.student._id === undefined) {
                //Adding Student -> POST
                studentFactory.save({
                    name: $scope.$parent.student.name,
                    description: $scope.$parent.fruit.description,
                    price: $scope.$parent.fruit.price
                }, function (response) {
                    console.log(response);
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
        };

        $scope.onCenterChange = function (centername, program) {
            $scope.$parent.student.centercode = centername.code;
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

    }]);
