var app = angular.module('StudentApp', [
    'ngRoute', 
    'ngResource', 
    'StudentApp.StudentService', 
    'StudentApp.UserService', 
    'StudentApp.LoginController', 
    'StudentApp.TableController', 
    'StudentApp.CardController', 
    'StudentApp.FormController',
    'uiSwitch'
])
.controller('MainController',  ['$scope', '$http', 'studentFactory', function ($scope, $http, studentFactory) {
    //State vars initialization
    $scope.loading = true;
    $scope.loggedIn = getCookie('username') != "";
    $scope.isStudent = getCookie('role') == "student";
    $scope.isCenter = getCookie('role') == "center";
    $scope.isAdmin = getCookie('role') == "admin";
    if($scope.isCenter) $scope.center = getCookie('center');
    // $scope.student={};
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

    $scope.$parent.selectMultiple = false;
    $scope.make_payment = function() {
        $scope.$parent.selectMultiple = !$scope.$parent.selectMultiple;
    }

    $scope.$parent.paymenting = false;
    $scope.pay_amount = function() {
        if($scope.$parent.selectMultiple.length <= 0) return;
        $scope.$parent.paymenting = true;
        $scope.payment = {
            paymentdate: new Date(),
            transactionno: "",
            paymentmode: "",
            bankname: "",
        };
    }

    //Close card handler
    $scope.cancel_payment = function () {
        $scope.$parent.paymenting = false;
        $scope.$parent.loading = false;
    };

    $scope.paymentmodes = ['Online', 'Cheque'];
    $scope.banknames = ["Allahabad Bank", "Andhra Bank", "Axis Bank", "Bank of Bahrain and Kuwait", "Bank of Baroda",
        "Bank of India", "Bank of Maharashtra", "Canara Bank", "Central Bank of India", "City Union Bank", "Corporation Bank",
        "Deutsche Bank", "Development Credit Bank", "Dhanlaxmi Bank", "Federal Bank", "HDFC Bank", "ICICI Bank", "IDBI Bank",
        "Indian Bank", "Indian Overseas Bank", "IndusInd Bank", "ING Vysya Bank", "Jammu and Kashmir Bank", "Karnataka Bank Ltd",
        "Karur Vysya Bank", "Kotak Bank", "Laxmi Vilas Bank", "Oriental Bank of Commerce", "Punjab National Bank", "Punjab & Sind Bank",
        "Shamrao Vitthal Co-operative Bank", "South Indian Bank", "State Bank of India", "Syndicate Bank", "Tamilnad Mercantile Bank Ltd.",
        "UCO Bank", "Union Bank of India", "United Bank of India", "Vijaya Bank", "Yes Bank Ltd", "Others"
    ];

    $scope.save_payment = function() {
        $scope.loading = true;
        var count = 0;
        for(i=0; i<$scope.selected.length; i++) {
            $scope.selected[i].paymentdate = $scope.payment.paymentdate;
            $scope.selected[i].transactionno = $scope.payment.transactionno;
            $scope.selected[i].paymentmode = $scope.payment.paymentmode;
            $scope.selected[i].bankname = $scope.payment.bankname;
            $scope.selected[i].status = 'payment';
            studentFactory.update({ id: $scope.selected[i]._id }, $scope.selected[i], function (response) {
                count++;
                if(count >= $scope.selected.length){
                    $scope.paymenting = false;
                    $scope.loading = false;
                    $scope.update_students();
                }
            }, function (response) {
                console.error(response);
            });
        }
    }

}]);
