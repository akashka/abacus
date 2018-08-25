angular.module('StudentApp.TableController', [])
    .controller('TableController', ['$scope', 'studentFactory', 'userFactory', function ($scope, studentFactory, userFactory) {
        //Update students
        $scope.$parent.update_students = function () {
            $scope.$parent.loading = true;
            //Load students

            userFactory.query().$promise.then(function (response) {
                $scope.$parent.user_list = response;
            }, function (response) {
                //error
                console.error(response);
            });

            studentFactory.query().$promise.then(function (response) {
                //$('tbody').html('');
                $scope.$parent.student_list = response;
                $scope.$parent.loading = false;

                if ($scope.$parent.isCenter) {
                    $scope.$parent.center = getCookie('center');;
                    for (var s = 0; s < $scope.$parent.student_list.length; s++) {
                        if ($scope.$parent.student_list[s].centercode != $scope.$parent.center) {
                            $scope.$parent.student_list.splice(s, 1);
                            s--;
                        }
                    }
                }

                $scope.studentClick = function (id) {
                    $scope.$parent.loading = true;
                    $scope.$parent.editing = true;
                    studentFactory.get({ id: id },
                        function (response) {
                            console.log(response);
                            $scope.$parent.student = response;
                            $scope.$parent.loading = false;

                            //Floating label layout fix
                            $('.mdl-textfield').addClass('is-focused');
                        }, function (response) {
                            //error
                            console.error(response);
                        });
                };

                $scope.$parent.total_amount = 0;
                $scope.$parent.selected = [];

                $scope.selectedOneMultiple = function (f) {
                    var isFound = false;
                    for (var s = 0; s < $scope.$parent.selected.length; s++) {
                        if ($scope.$parent.selected[s]._id == f._id) {
                            isFound = true;
                            $scope.$parent.selected.splice(s, 1);
                            s--;
                        }
                    }
                    if (!isFound) $scope.$parent.selected.push(f);
                    $scope.$parent.total_amount = $scope.$parent.selected.length * 500;
                }

            }, function (response) {
                //error
                console.error(response);
            });


        };
    }]);
