var app = angular.module('StudentApp', ['ngRoute', 'ngResource', 'StudentApp.StudentService', 'StudentApp.UserService', 'StudentApp.LoginController', 'StudentApp.TableController', 'StudentApp.CardController'])
.controller('MainController',  ['$scope', '$http', function ($scope, $http) {
    //State vars initialization
    $scope.loading = true;
    $scope.loggedIn = getCookie('username') != "";
    $scope.student={};
    $scope.editing = false;

    //Add student button handler
    $scope.add_student = function(){
        $scope.student={};
        $scope.editing = true;

        //Floating label layout fix
        $('.mdl-textfield').removeClass('is-focused');
    };

    //Logout button handler
    $scope.logout = function(e){
        delete_cookie('username');
        location.reload();
    };
}]);
