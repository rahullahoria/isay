angular.module('starter.services', [])

    .factory('FILEDOG', function ($http) {
        // Might use a resource here that returns a JSON array

        var url = "http://api.file-dog.shatkonlabs.com/";
        return {
            getServices: function (type) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/services' + (type ? type : "")).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    //console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            getWork: function (worker_id) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/work/' + worker_id + "?current_time=" + new Date()).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            }

        };
    })

    .factory('WAZIR', function ($http) {
        // Might use a resource here that returns a JSON array

        var url = "http://api.wazir.shatkonlabs.com/";
        return {
            getFeedbacks: function (objectId) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/feedbacks/1/' + objectId).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    //console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            postFeedback: function (objectId,data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/feedbacks/1/' + objectId, data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            }
        };
    })

    .factory('DIGIEYE', function ($http) {
        // Might use a resource here that returns a JSON array

        var url = "http://api.digieye.shatkonlabs.com/";
        return {
            getObject: function (id) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url + '/objects/1/' + id).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    //console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },
            postObject: function (data) {
                // $http returns a promise, which has a then function, which also returns a promise
                console.log(JSON.stringify(data));
                var promise = $http.post(url + '/objects/1/', data).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(JSON.stringify(response));
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            }
        };
    })


    .factory('CallLogService', ['$q', function ($q) {
        return {

            list: function (days) {
                var q = $q.defer();
                // days is how many days back to go
                window.plugins.calllog.list(days, function (response) {
                    q.resolve(response.rows);
                }, function (error) {
                    q.reject(error)
                });
                return q.promise;
            },

            contact: function (phoneNumber) {
                var q = $q.defer();
                window.plugins.calllog.contact(phoneNumber, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error)
                });
                return q.promise;
            },

            show: function (phoneNumber) {
                var q = $q.defer();
                window.plugins.calllog.show(phoneNumber, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error)
                });
                return q.promise;
            },

            delete: function (phoneNumber) {
                var q = $q.defer();
                window.plugins.calllog.delete(id, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error)
                });
                return q.promise;
            }
        }
    }])

    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])

    .factory('Contactlist', function () {
        return {
            getAllContacts: function () {
                return [
                    {name: 'Contact 1'},
                    {name: 'Contact 2'},
                    {name: 'Contact 3'},
                    {name: 'Contact 4'}
                ];
            }
        };
    });