angular.module('StudentApp.LoginController', [])
.controller('LoginController', ['$scope', 'userFactory', function ($scope, userFactory) {
    //Login form listener
    var working = false;
    $scope.otpSent = false;

    $scope.send = function(username, password){
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
        }, function(response) {
            console.log(response);
            setTimeout(function() {
                $this.addClass('ok');
                $state.html('Welcome!');
                $(".fa.fa-sign-out").show();
                setCookie("username", username, 14);
                setCookie("password", password, 14);
                setCookie("role", response.role, 14);
                setTimeout(function() {
                    $state.html('Log in');
                    $this.removeClass('ok loading');
                    working = false;
                    $scope.$parent.loggedIn = true;
                    $scope.$apply();
                    //load everything

                }, 1000);
            }, 1500);

        }, function(response) {
            //error
            console.error(response);
            $scope.$parent.loggedIn = false;
            $this.addClass('ko');
            $state.html('Invalid OTP!');
            var i = setTimeout(function() {
                $state.html('Log in');
                $("#login img").show();
                $this.removeClass('ko loading');
                $this.removeClass('ok loading');
                working = false;
                clearInterval(i);
            }, 1500);
        });
    };

    $scope.generateOTP = function(username) {
        userFactory.generateOTP({
            username: username
        }, function(response) {
            console.log(response);
            $scope.otpSent = true;
        }, function(response) {
            $scope.otpSent = false;            
        });
    }

    $scope.tryDifferentNumber = function() {
        $scope.otpSent = false;        
    }

}]);    
