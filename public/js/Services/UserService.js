angular.module('StudentApp.UserService', [])
.factory('userFactory', function ($resource) {
    return $resource(
        '/api/0.1/user/:id', {
            id: '@id',
        }, {
            update: {
                method: 'PUT'
            },
            login: {
                method: 'POST',
                url: '/api/0.1/user/login',
                params: {
                    username: '@username',
                    password: '@password'
                }
            },
            generateOTP: {
                method: 'POST',
                url: '/api/0.1/user/generateOTP',
                params: {
                    username: '@username'
                }
            }
        }
    );
});
