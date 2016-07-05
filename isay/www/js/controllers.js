angular.module('starter.controllers', ['ionic', 'ngCordova', 'ionic-timepicker', 'ion-datetime-picker', 'ionic.rating'])

    .controller('ServiceListCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $localstorage, BlueTeam) {

        if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {
            $ionicHistory.clearHistory();
            $state.go('reg');
        }

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.show();

        var temp = BlueTeam.getServices().then(function (d) {

            $ionicHistory.clearHistory();
            $scope.services = window.services = d['root'];
            console.log(JSON.stringify($scope.services));
            $scope.hide();
        });


    })

    .controller('ScoreCardCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $localstorage, BlueTeam) {

        if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {
            $ionicHistory.clearHistory();
            $state.go('reg');
        }

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.show();

        var temp = BlueTeam.getScore().then(function (d) {


            $scope.scores = d['root'].scores;

            $scope.hide();
        });


    })

    .controller('ContactCtrl', function ($scope, Contactlist) {
        $scope.contacts = Contactlist.getAllContacts();
    })

    .controller('WorkerTimerCtrl', function ($scope, $state, $ionicLoading, $window, $ionicHistory, $cordovaGeolocation,
                                             $cordovaDevice, $localstorage, PhoneContactsFactory, $timeout, $ionicPlatform, BlueTeam) {
        $scope.stop = true;

        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {


                $scope.position = position;

            }, function (err) {

                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };


            });


        BlueTeam.getWork($localstorage.get('user_id')).then(function (d) {


            $scope.work = d['root'].work;
            /*{"root":
             {"work":
             {
             "user_worker_id":"1",
             "service_request_id":"1",
             "start_time":"18:25:38",
             "end_time":"10:36:38",
             "customer_name":"rahul need maid",
             "customer_mobile": "8989898911",
             "customer_address":"sdaf"
             }
             }
             }*/

        });

        $scope.reload = function () {
            $window.location.reload(true);
        }

        $scope.startTimer = function () {
            var d = new Date();
            $scope.startTime = "" + new Date();
            $scope.startTimeShow = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
                d.getFullYear() + " at " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            $scope.stop = true;
            console.log($scope.startTime);

            $scope.upTime($scope.startTime);
            /*{
             "root":{
             "id": 2,
             "start_time": "Mon Mar 07 2016 19:37:59 GMT+0530 (IST)",
             "service_request_id": 1,
             "device_id": "safd",
             "gps_location":"21.132,123.231"

             }

             }*/
            BlueTeam.postWork($localstorage.get('user_id'), {
                    "root": {
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "start_time": $scope.startTime,
                        "service_request_id": $scope.work.service_request_id/*,
                         "device_id": $cordovaDevice.getUUID()*/
                    }
                })
                .then(function (d) {

                    $scope.work.log_id = d['root'].id;

                });
        };

        $scope.stopTimer = function () {
            var d = new Date();
            $scope.stop = false;
            $scope.endTime = "" + new Date();
            $scope.endTimeShow = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
                d.getFullYear() + " at " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

            BlueTeam.postWork($localstorage.get('user_id'), {
                    "root": {
                        "id": $scope.work.log_id,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "end_time": $scope.endTime,
                        "service_request_id": $scope.work.service_request_id/*,
                         "device_id": $cordovaDevice.getUUID()*/
                    }
                })
                .then(function (d) {
                    $timeout(function () {
                        $window.location.reload(true);
                    }, 10000);
                    $scope.work.log_id = d['root'].id;

                });
        };

        $scope.now = null;
        $scope.upTime = function (countTo) {
            if ($scope.stop == true) {
                now = new Date();
                //*console.log(''+now*/);
                countTo = new Date(countTo);
                difference = (now - countTo);

                $scope.days = Math.floor(difference / (60 * 60 * 1000 * 24) * 1);
                $scope.hours = Math.floor((difference % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) * 1);
                $scope.mins = Math.floor(((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
                $scope.secs = Math.floor((((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);

                /*document.getElementById('days').firstChild.nodeValue = days;
                 document.getElementById('hours').firstChild.nodeValue = hours;
                 document.getElementById('minutes').firstChild.nodeValue = mins;
                 document.getElementById('seconds').firstChild.nodeValue = secs;*/

                clearTimeout($scope.upTime.to);
                $scope.upTime.to = $timeout(function () {
                    $scope.upTime(countTo);
                }, 1000);
            }
        }
    })

    .controller('RegCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $cordovaGeolocation, $localstorage,
                                     PhoneContactsFactory, $ionicPlatform, $cordovaDevice, $window, $cordovaLocalNotification, BlueTeam) {


        $scope.data = {"name": "", "email": "", "mobile": "", "password": ""};
        $scope.user = {"name": "", "email": "", "mobile": "", "password": ""};
        console.log("regcont started");
        $scope.registered = true;
        $scope.checked = false;

        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {


                $scope.position = position;

            }, function (err) {

                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };


            });


        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.login = function () {


            $scope.show();
            BlueTeam.loginUser({
                    "root": {
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "mobile": $scope.data.mobile,
                        "password": $scope.data.password,
                        "device_id": $cordovaDevice.getUUID()

                    }
                })
                .then(function (d) {

                    //setObject
                    $scope.user = d['root'].user;
                    console.log(JSON.stringify($scope.user));
                    $scope.hide();
                    if ($scope.user.user_exist == true) {
                        $localstorage.set('name', $scope.user.name);
                        $localstorage.set('user_id', $scope.user.id);
                        $localstorage.set('mobile', $scope.user.mobile);
                        $localstorage.set('email', $scope.user.email);
                        $localstorage.set('type', $scope.user.type);
                        //$window.location.reload(true)

                        $timeout(function () {
                            $window.location.reload(true);
                        }, 5000);

                        if ($scope.user.type == "worker")
                            $state.go('tab.worker-timer');
                        else
                            $state.go('tab.service-list');

                    } else {
                        $scope.pwdError = true;
                    }

                });


        }
        $scope.checkReg = function () {
            console.log("trying to check");
            if ($scope.checked == false && $scope.data.mobile != undefined) {
                $scope.checked = true;
                BlueTeam.checkMobile($scope.data.mobile)
                    .then(function (d) {

                        console.log(d['root'].user.user_exist);
                        $scope.registered = d['root'].user.user_exist;

                    });


            }
            /*else $scope.data.password = "";*/
        };
        $scope.pwdError = false;
        $scope.checkSamePwd = function () {

            if ($scope.data.password != $scope.data.conf_password) {
                $scope.pwdError = true;
            }
            $scope.pwdError = false;


        };

        $ionicPlatform.ready(function () {
            $scope.scheduleSingleNotification = function () {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: 'Hi, got net request',
                    text: 'Need maid',
                    data: {
                        customProperty: 'custom value'
                    }
                }).then(function (result) {
                    // ...
                });
            };

            //$scope.scheduleSingleNotification();

            $scope.findContact = function () {
                // var fields = ["id", "displayName", "name", "nickname", "phoneNumbers", "emails", "addresses", "ims", "organizations", "birthday", "note", "photos", "categories", "urls"];

                PhoneContactsFactory.find().then(function (contacts) {
                    $arr = [];
                    $buff = [];
                    if ($localstorage.get('lastContactId'))
                        lastContactId = parseInt($localstorage.get('lastContactId'));
                    else
                        lastContactId = -1;
                    var newlastContactId = lastContactId;
                    console.log("Last Id saved ", lastContactId);
                    var j = 0;
                    var i = 0
                    for (i = 0; i < contacts.length; i++) {

                        if (lastContactId < contacts[i].id) {
                            $arr.push({
                                //name: contacts[i].name.formatted,
                                id: contacts[i].id,
                                all: JSON.stringify(contacts[i])
                            });


                            $buff.push({
                                //name: contacts[i].name.formatted,
                                id: contacts[i].id,
                                all: contacts[i]
                            });

                            if (lastContactId < contacts[i].id)
                                newlastContactId = contacts[i].id;

                            j++;

                            if (j > 20) {

                                BlueTeam.postRaw({
                                        "root": {
                                            "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                                            "raw": $buff,

                                            "device_id": $cordovaDevice.getUUID()
                                        }
                                    }, "contacts")
                                    .then(function (d) {


                                    });
                                j = 0;
                                $buff = [];

                            }
                        }
                    }


                    $localstorage.set('lastContactId', newlastContactId);
                    if ($buff.length > 0) {
                        BlueTeam.postRaw({
                                "root": {
                                    "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                                    "raw": $buff,

                                    "device_id": $cordovaDevice.getUUID()
                                }
                            }, "contacts")
                            .then(function (d) {


                            });

                    }
                    //$scope.contacts = $arr;
                    //console.log(JSON.stringify($scope.contacts));


                });
            };
            $scope.findContact();


        });


        if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('email') === undefined ||
            $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {

        } else {
            $ionicHistory.clearHistory();
            if ($localstorage.get('type') == "worker")
                $state.go('tab.worker-timer');
            else
                $state.go('tab.service-list');
        }


        $scope.regUser = function () {
            if ($scope.checked == false) {
                $scope.checkReg();
                return;
            }
            if ($scope.registered) {
                $scope.login();
                return;
            }

            if ($scope.data.password == $scope.data.conf_password) {
                $scope.show();
                BlueTeam.regUser({
                        "root": {
                            "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                            "name": $scope.data.name,
                            "mobile": $scope.data.mobile,
                            "type": "customer",
                            "password": $scope.data.password,
                            "conf_password": $scope.data.conf_password,
                            "email": "" + $scope.data.email,
                            "device_id": $cordovaDevice.getUUID()
                        }
                    })
                    .then(function (d) {

                        //setObject
                        $scope.user = d['root'];
                        $localstorage.set('name', $scope.data.name);
                        $localstorage.set('mobile', $scope.data.mobile);
                        $localstorage.set('email', $scope.data.email);
                        $localstorage.set('type', "customer");
                        $localstorage.set('user_id', $scope.user.id);
                        $scope.data.name = "";
                        $scope.data.mobile = "";
                        $scope.data.email = "";
                        $scope.data.password = "";
                        $scope.data.conf_password = "";

                        $timeout(function () {
                            $window.location.reload(true);
                        }, 5000);

                        $scope.hide();
                        $state.go('tab.service-list');

                    });
            } else $scope.pwdError = true;
        };
    })

    .controller('DigieyeCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                         $cordovaGeolocation, $localstorage, $cordovaDevice, $cordovaBarcodeScanner,
                                         $cordovaFileTransfer, $cordovaCamera, BlueTeam) {

        $scope.data = {};


        $scope.type = $localstorage.get('type');


        $scope.customer = true;
        if ($scope.type == "cem") {
            $scope.cem = true;
            $scope.customer = false;
        }

        $scope.scanBarcode = function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                //alert(imageData.text);

                BlueTeam.getUserById(imageData.text)
                    .then(function (d) {

                        $scope.QrUser = d['root']['workers'][0];

                        console.log(JSON.stringify($scope.QrUser));
                    })
                    .finally(function () {
                        // Stop the ion-refresher from spinning
                        $scope.$broadcast('scroll.refreshComplete');
                    });

                console.log("Barcode Format -> " + imageData.text);
                console.log("Barcode Format -> " + imageData.format);
                console.log("Cancelled -> " + imageData.cancelled);
            }, function (error) {
                console.log("An error happened -> " + error);
            });
        };

        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        // image upload

        $scope.data = {"ImageURI": "Select Image"};
        $scope.takePicture = function (type1) {
            console.log("take Pic Got clicked", type1);
            $scope.uploadeType = type1;
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA
            };
            $cordovaCamera.getPicture(options).then(
                function (imageData) {
                    $scope.picData = imageData;
                    $scope.ftLoad = true;
                    $localstorage.set('fotoUp', imageData);

                    $ionicLoading.show({template: 'wait...', duration: 500});
                    $scope.uploadPicture();
                },
                function (err) {
                    $ionicLoading.show({template: 'Error...', duration: 500});
                })
        }

        $scope.selectPicture = function (type1) {

            $scope.uploadeType = type1;

            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            };

            $cordovaCamera.getPicture(options).then(
                function (imageURI) {
                    window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {

                        $scope.picData = fileEntry.toURL();
                        $scope.ftLoad = true;
                        $scope.uploadPicture();
                        console.log($scope.picData);
                        //var image = document.getElementById('myImage');
                        //image.src = fileEntry.nativeURL;
                    });
                    $ionicLoading.show({template: 'wait...', duration: 500});
                },
                function (err) {
                    $ionicLoading.show({template: 'error...', duration: 500});
                })
        };

        $scope.calculateAge = function calculateAge(birthdayRaw) { // birthday is a date
            var birthday = new Date(birthdayRaw);
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };

        $scope.uploadPicture = function () {
            $ionicLoading.show({template: 'wait uploading the document, this may take a while ..'});

            var fileURL = $scope.picData;

            var options = new FileUploadOptions();
            options.fileKey = "fileToUpload";
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1) + ".jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode = true;

            var params = {};
            params.username = "rahul";
            params.password = "rahul";

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(
                fileURL,
                encodeURI("http://api.file-dog.shatkonlabs.com/files/rahul"),
                viewUploadedPictures,
                function (error) {
                    $ionicLoading.show({
                        template: 'Something went wrong ...'
                    });
                    $ionicLoading.hide();
                },
                options);
        };

        var viewUploadedPictures = function (response) {
            console.log(JSON.stringify(response), "hi", response.response);
            $ionicLoading.show({template: 'trying to load the pic ...'});
            server = "http://api.file-dog.shatkonlabs.com/files/rahul/" + JSON.parse(response.response).file.id;

            if($scope.uploadeType == "p") $scope.data.photo = JSON.parse(response.response).file.id;
            if($scope.uploadeType == "vc") $scope.data.voter_card = JSON.parse(response.response).file.id;
            if($scope.uploadeType == "pc") $scope.data.pan_card = JSON.parse(response.response).file.id;
            if($scope.uploadeType == "ac") $scope.data.adhar_card = JSON.parse(response.response).file.id;
            if($scope.uploadeType == "dl") $scope.data.driving_license = JSON.parse(response.response).file.id;

            $scope.picData = server;
            $scope.ftLoad = true;
            console.log($scope.picData);

            $ionicLoading.hide();
        }

        $scope.viewPictures = function () {
            $ionicLoading.show({template: 'Sto cercando le tue foto...'});
            server = "http://www.yourdomain.com/upload.php";
            if (server) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState === 4) {
                        if (xmlhttp.status === 200) {
                            document.getElementById('server_images').innerHTML = xmlhttp.responseText;
                        }
                        else {
                            $ionicLoading.show({template: 'Errore durante il caricamento...', duration: 1000});
                            return false;
                        }
                    }
                };
                xmlhttp.open("GET", server, true);
                xmlhttp.send()
            }
            ;
            $ionicLoading.hide();
        };

        $scope.addWorker = function () {

            $scope.show();


            BlueTeam.postWorker(
                {
                    "root": {
                        "name": $scope.data.name,
                        "mobile": $scope.data.mobile,
                        "photo": $scope.data.photo,
                        "voter_card": $scope.data.voter_card,
                        "pan_card": $scope.data.pan_card,
                        "adhar_card": $scope.data.adhar_card,
                        "driving_license": $scope.data.driving_license,

                        "type1": $scope.data.type,

                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        /*"device_id": $cordovaDevice.getUUID(),*/
                        "ref_id": $localstorage.get('user_id'),

                        "gender": $scope.data.gender


                    }
                }
                )
                .then(function (d) {
                    $scope.hide();

                    $scope.resp = d['root'].user;
                    if ($scope.resp == "")
                        alert("Failed! User already exists");
                    else {
                        $scope.data.voter_card = "";
                        $scope.data.pan_card = "";
                        $scope.data.adhar_card = "";
                        $scope.data.driving_license = "";
                        $scope.data.name = "";
                        $scope.data.mobile = "";
                        $scope.data.emergency_mobile = "";
                        $scope.data.type = "";
                        $scope.data.address = "";
                        $scope.data.native_place = ""
                        $scope.data.native_add = "";
                        $scope.data.dob = "";
                        $scope.data.education = "";
                        $scope.data.experience = "";
                        $scope.data.gender = "";
                        $scope.data.remark = "";
                        $scope.data.salary = "";
                        $scope.data.bonus = "";

                        alert("Registered Successfuly");

                    }

                });
        };


    })


    .controller('ServiceTypeCtrl', function ($scope, $state, $stateParams) {


        if (window.services === undefined)
            $state.go('tab.service-list');

        for (i = 0; i < window.services.length; i++) {
            if (window.services[i].name == $stateParams.id) {
                $scope.plans = window.services[i].plans;
            }
        }

        $scope.service = $stateParams.id;

    })

    .controller('FinishCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams) {

        $scope.$on('$ionicView.enter', function () {
            // Code you want executed every time view is opened
            $ionicHistory.clearHistory();
            $timeout(function () {
                $state.go('tab.service-list');
            }, 10000)
        })

    })

    .controller('AboutCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams) {


    })
    .controller('SurveyCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams) {

        $scope.goodAns = ["B", "A", "B", "B", "B", "B", "B", "A"];
        $scope.showQ = true;
        $scope.postSurvey = function () {
            $scope.showQ = false;

        };
    })

    .controller('PriceCalCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                          $cordovaGeolocation, $localstorage, BlueTeam) {
        $scope.data = {};


        $scope.data.hours = "";
        $scope.selectedTime = new Date();
        $scope.selectedTime.setHours(7);
        $scope.data.time = ("0" + ($scope.selectedTime.getHours() % 12)).slice(-2) + ':'
            + "00" + " "
            + (($scope.selectedTime.getHours() > 12) ? "PM" : "AM");
        $scope.data.time24 = "";

        $scope.timePickerCallback = function (val) {
            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTime = $scope.selectedTime = new Date(val * 1000);
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
                $scope.data.time24 = ("0" + selectedTime.getUTCHours()).slice(-2) + ':' + ("0" + selectedTime.getUTCMinutes()).slice(-2) + ':00';
                $scope.data.time = ("0" + (parseInt(selectedTime.getUTCHours()) % 12)).slice(-2) + ':' + ("0" + selectedTime.getUTCMinutes()).slice(-2) + " " + ((selectedTime.getUTCHours() > 12) ? "PM" : "AM");
                console.log($scope.data.time24);
            }
        };


        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.address = $localstorage.get('address');

        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.timePickerObject = {
            inputEpochTime: (7 * 60 * 60),  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: 'Start time',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.timePickerCallback(val);
            }
        };

        $scope.timeClicked = false;

        $scope.timeSet = function () {
            $scope.timeClicked = true;
        };

        $scope.show();
        BlueTeam.getServices("?type=monthly").then(function (d) {

            $ionicHistory.clearHistory();
            $scope.montlhyServices = d['root'];
            console.log(JSON.stringify($scope.montlhyServices));
            $scope.hide();
        });

        // making post api call to the server by using angular based service

        $scope.cal = function () {
            if (!$scope.timeClicked)
                return false;
            $scope.show();


            BlueTeam.calPrice($scope.data.service,
                {
                    "root": {
                        "days": $scope.data.days,
                        "startHr": $scope.selectedTime.getUTCHours(),
                        "selectedTime": $scope.time24,
                        "hours": $scope.data.hours
                    }
                }
                )
                .then(function (d) {
                    $scope.hide();

                    $scope.resp = d['root'];


                    $scope.max = $scope.resp.max;

                    $scope.min = $scope.resp.min;

                    $scope.data.days = $scope.resp.days;
                    $scope.forDays = $scope.resp.forDays;


                    //<strike>
                    $scope.discount = $scope.resp.discount;
                    $scope.avg = $scope.resp.avg;

                    console.log("max", $scope.max, $scope.min, $scope.avg, $scope.forDays);
                });
        };

    })

    .controller('FeedbackCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $timeout, $stateParams, $localstorage, $cordovaGeolocation, BlueTeam) {
        $scope.data = {};

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.email = "" + $localstorage.get('email');
        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.feedback = function () {
            $scope.show();


            BlueTeam.postFeedback({
                    "root": {
                        "name": $scope.data.name,
                        "mobile": "" + $scope.data.mobile,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "email": $scope.data.email,
                        "feedback": $scope.data.feedback_text
                    }
                })
                .then(function (d) {
                    $scope.hide();
                    $ionicHistory.clearHistory();
                    $state.go('finish');
                    //$scope.services = d['data']['services'];
                });
        };

    })

    .controller('T&CCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams, BlueTeam) {


        BlueTeam.getTnc()
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.conditions = d['root']['conditions'];
                $scope.TERMS = d['root']['TERMS'];
            });

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };

    })

    .controller('ServiceRequestCtrl', function ($scope, $state, $ionicPopup, $cordovaGeolocation, $ionicHistory, $timeout, $stateParams, $localstorage, BlueTeam) {

        $scope.user_id = $localstorage.get('user_id');
        $scope.data = {};
        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.email = "" + $localstorage.get('email');

        // to get current location of the user
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        BlueTeam.getMysr($localstorage.get('mobile'))
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.srs = d['root']['srs'];
                console.log(JSON.stringify($scope.srs));
            });

        // set the rate and max variables
        $scope.rating = {};

        $scope.rating.max = 5;

        $scope.updateRating = function ($user_id, $rating) {
            BlueTeam.updateRating({
                    "root": {
                        "customer_id": $scope.user_id,
                        "user_id": $user_id,
                        "rating": "" + $rating/*,
                         "device_id": $cordovaDevice.getUUID()*/
                    }
                })
                .then(function (d) {
                    //$scope.services = d['data']['services'];
                    $scope.doRefresh();
                });
        };
        $scope.doRefresh = function () {
            BlueTeam.getMysr($localstorage.get('mobile'))
                .then(function (d) {

                    //$scope.hide();
                    //$ionicHistory.clearHistory();
                    //$state.go('finish');
                    $scope.srs = d['root']['srs'];

                    console.log(JSON.stringify($scope.srs));
                })
                .finally(function () {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        $scope.data.feedback_text = null;


        // An elaborate, custom popup
        $scope.inform = function () {
            var sendInfoPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.feedback_text"/>',
                title: 'Please Type what you inform about?',
                subTitle: 'You can inform here about the worker holiday or anything you want to communicate to BlueTeam.',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Send</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.feedback_text) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();

                            } else {

                                return $scope.data.feedback_text;
                            }
                        }
                    }
                ]
            });

            sendInfoPopup.then(function (res) {
                console.log("tep", res);
                if (res) {
                    $scope.feedback();
                }
            });
        };

        $scope.feedback = function () {
            //$scope.show();


            BlueTeam.postFeedback({
                    "root": {
                        "name": $scope.data.name,
                        "mobile": "" + $scope.data.mobile,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "email": $scope.data.email,
                        "feedback": $scope.data.feedback_text
                    }
                })
                .then(function (d) {
                    //$scope.hide();
                    //$ionicHistory.clearHistory();
                    //$state.go('finish');
                    //$scope.services = d['data']['services'];
                });
        };


        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };

    })

    .controller('SeeRequestCtrl', function ($scope, $state, $window, $cordovaGeolocation, $cordovaDevice,
                                            $ionicLoading, $timeout, $ionicPopup, $ionicHistory, $timeout, $stateParams, $localstorage, BlueTeam) {

        $scope.data = {};
        $scope.user_id = $localstorage.get('user_id');
        $scope.data.status = "open";


        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 1000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;
                console.log(JSON.stringify(position))

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });


        BlueTeam.getMysrByCEMId($scope.user_id, $scope.data.status)
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.srs = d['root']['srs'];
                console.log(JSON.stringify($scope.srs));
            });

        // set the rate and max variables
        $scope.rating = {};

        $scope.rating.max = 5;

        $scope.update = function (key, value, sr_id, index) {
            var updateConfirmPopup = $ionicPopup.confirm({
                title: 'Confirm Update',
                template: 'Are you sure to Update?'
            });

            updateConfirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    //setObject

                    $scope.show();

                    BlueTeam.updateSR(sr_id, {
                            "root": {
                                "sr_id": sr_id,
                                "user_id": $localstorage.get('user_id'),
                                "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                                "key": key,
                                "value": value,
                                "device_id": $cordovaDevice.getUUID()
                            }
                        })
                        .then(function (d) {
                            $scope.srs[index].dontshow = true;
                            /*$timeout(function () {
                             $window.location.reload(true);
                             }, 10000);*/
                            //$scope.work.log_id = d['root'].id;

                        });

                } else {
                    console.log('You are not sure');
                }
            });


        };

        $scope.doRefresh = function () {
            BlueTeam.getMysrByCEMId($scope.user_id, $scope.data.status)
                .then(function (d) {

                    //$scope.hide();
                    //$ionicHistory.clearHistory();
                    //$state.go('finish');
                    $scope.srs = d['root']['srs'];

                    console.log(JSON.stringify($scope.srs));
                })
                .finally(function () {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };

    })


    .controller('BlueteamVerifiedTypeCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $timeout, $stateParams, BlueTeam) {

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.show();

        BlueTeam.getVerification()
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.pre = d['root']['pre'];
                $scope.process = d['root']['process'];
                $scope.hide();
            });

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };

    })

    .controller('TakePaymentCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                             $cordovaGeolocation, $localstorage, $cordovaDevice, BlueTeam) {
        $scope.data = {};


        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.address = $localstorage.get('address');
        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 1000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;
                console.log(JSON.stringify(position))

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };


        // making post api call to the server by using angular based service

        /*
         * {"root":
         {
         "sr_id": "2",
         "amount": "2000",
         "user_id": "10",
         "name": "vikas nagar",
         "mobile": "9560625626",
         "device_id": "sdafd",
         "gps_location": "123.123,1231.13",
         "customer_id": "20",
         "check_no": "31232123"


         }}*/

        $scope.confPayment = function () {
            $scope.show();

            BlueTeam.makePayment({
                    "root": {
                        "name": $scope.data.name,
                        "sr_id": $scope.data.sr_id,
                        "amount": $scope.data.amount,
                        "customer_id": "" + $scope.data.customer_id,
                        "check_no": $scope.data.check_no,
                        "mobile": "" + $scope.data.mobile,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,

                        "user_id": $localstorage.get('user_id'),
                        "device_id": $cordovaDevice.getUUID()
                    }
                })
                .then(function (d) {
                    $scope.hide();
                    $ionicHistory.clearHistory();
                    $state.go('finish');
                    //$scope.services = d['data']['services'];
                });
        };

    })

    .controller('VWCtrl', function ($scope, $state, $ionicLoading, $localstorage, $ionicHistory, $timeout, $stateParams, BlueTeam) {

        $scope.user_id = $localstorage.get('user_id');

        $scope.items = null;

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.show();

        $scope.calculateAge = function calculateAge(birthdayRaw) { // birthday is a date
            var birthday = new Date(birthdayRaw);
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };

        BlueTeam.getRefWorkers($scope.user_id)
            .then(function (d) {

                $scope.hide();
                $scope.workers = d['root']['workers'];
            });

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };


    })

    .controller('F&QCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $timeout, $stateParams, BlueTeam) {

        $scope.items = null;

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.show();

        BlueTeam.getFaq()
            .then(function (d) {

                //$scope.hide();
                //$ionicHistory.clearHistory();
                //$state.go('finish');
                $scope.hide();
                $scope.items = d['root']['faqs'];
            });

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };


    })
    .controller('ContactUsCtrl', function ($scope, $state, $ionicHistory, $timeout, $stateParams, BlueTeam) {


    })


    .controller('TabCtrl', function ($scope, $state, $ionicPopup, $cordovaSocialSharing, $ionicPlatform, $ionicModal, $timeout, $ionicHistory, $cordovaToast, $localstorage) {

        $scope.count = 0;
        $ionicPlatform.registerBackButtonAction(function (event) {
            if ($state.current.name == "tab.service-list") {
                $cordovaToast.showLongBottom('Press 2 more time to exit').then(function (success) {
                    // success
                }, function (error) {
                    // error
                });

                $scope.count++;
                if ($scope.count >= 3)
                    navigator.app.exitApp();
            }

            if ($state.current.name == "reg") {
                $cordovaToast.showLongBottom('Press 2 more time to exit').then(function (success) {
                    // success
                }, function (error) {
                    // error
                });

                $scope.count++;
                if ($scope.count >= 3)
                    navigator.app.exitApp();
            }
            else {
                navigator.app.backHistory();
            }
        }, 100);


        $scope.type = $localstorage.get('type');
        $scope.name = $localstorage.get('name');

        $scope.customer = true;
        if ($scope.type == "cem") {
            $scope.cem = true;
            $scope.customer = false;
        }

        if ($scope.type != "customer")
            $scope.customer = false;

        $scope.logout = function () {
            var logoutConfirmPopup = $ionicPopup.confirm({
                title: 'Confirm Logout',
                template: 'Are you sure to LogOut?'
            });

            logoutConfirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    //setObject
                    $localstorage.set('name', "");
                    $localstorage.set('mobile', "");
                    $localstorage.set('email', "");
                    $localstorage.set('type', "");
                    $localstorage.set('user_id', "");

                    $timeout(function () {
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();


                    }, 100);
                    $state.go('reg');
                } else {
                    console.log('You are not sure');
                }
            });
        };

        // Open the login modal
        $scope.share = function () {
            $cordovaSocialSharing.share("Get relief from Cook/Maid/Driver/Babysitter on leave. " +
                "Book Now on-demand/monthly to get reliable and Blueteam verified worker. " +
                "https://goo.gl/545wov", "Book Now BlueTeam Verified Workers");
        };


    })

    .controller('AddWorkerCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                           $cordovaGeolocation, $localstorage, $cordovaDevice, $cordovaBarcodeScanner,
                                           $cordovaFileTransfer, $cordovaCamera, BlueTeam) {

        $scope.slots = [
            {epochTime: 12600, step: 15, format: 12},
            {epochTime: 54900, step: 1, format: 24}
        ];

        $scope.data = {};


        $scope.type = $localstorage.get('type');


        $scope.customer = true;
        if ($scope.type == "cem") {
            $scope.cem = true;
            $scope.customer = false;
        }


        $scope.data.hours = "";
        $scope.selectedTime = new Date();
        $scope.selectedTime.setHours(7);
        $scope.data.time = ("0" + ($scope.selectedTime.getHours() % 12)).slice(-2) + ':'
            + "00" + " "
            + (($scope.selectedTime.getHours() > 12) ? "PM" : "AM");
        $scope.data.time24 = "";

        $scope.timePickerCallback = function (val) {
            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTime = $scope.selectedTime = new Date(val * 1000);
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
                $scope.data.time24 = ("0" + selectedTime.getUTCHours()).slice(-2) + ':' + ("0" + selectedTime.getUTCMinutes()).slice(-2) + ':00';
                $scope.data.time = ("0" + (parseInt(selectedTime.getUTCHours()) % 12)).slice(-2) + ':' + ("0" + selectedTime.getUTCMinutes()).slice(-2) + " " + ((selectedTime.getUTCHours() > 12) ? "PM" : "AM");
                console.log($scope.data.time24);
            }
        };


        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };


        $scope.timePickerObject = {
            inputEpochTime: (7 * 60 * 60),  //Optional
            step: 15,  //Optional
            format: 12,  //Optional
            titleLabel: 'Start time',  //Optional
            setLabel: 'Set',  //Optional
            closeLabel: 'Close',  //Optional
            setButtonType: 'button-positive',  //Optional
            closeButtonType: 'button-stable',  //Optional
            callback: function (val) {    //Mandatory
                $scope.timePickerCallback(val);
            }
        };

        $scope.timeClicked = false;

        $scope.timeSet = function () {
            $scope.timeClicked = true;
        };

        $scope.show();
        BlueTeam.getServices("?type=monthly").then(function (d) {

            $ionicHistory.clearHistory();
            $scope.montlhyServices = d['root'];
            console.log(JSON.stringify($scope.montlhyServices));
            $scope.hide();
        });

        // making post api call to the server by using angular based service

        $scope.addWorker = function () {

            $scope.show();


            BlueTeam.postWorker(
                {
                    "root": {
                        "name": $scope.data.name,
                        "mobile": $scope.data.mobile,
                        "email": "",
                        "type1": $scope.data.type,
                        "address": $scope.data.address,
                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        /*"device_id": $cordovaDevice.getUUID(),*/
                        "ref_id": $localstorage.get('user_id'),
                        "emergency_no": $scope.data.emergency_mobile,
                        "native_place": $scope.data.native_place,
                        "native_add": $scope.data.native_add,
                        "dob": $scope.data.dob,
                        "education": $scope.data.education,
                        "experience": $scope.data.experience,
                        "gender": $scope.data.gender,
                        "remark": $scope.data.remark,
                        "salary": $scope.data.salary,
                        "bonus": $scope.data.bonus,
                        "timings": [
                            {
                                "start_time": $scope.data.startTime,
                                "end_time": $scope.data.startTime
                            }
                        ],
                        "services": [2, 3, 4]

                    }
                }
                )
                .then(function (d) {
                    $scope.hide();

                    $scope.resp = d['root'].user;
                    if ($scope.resp == "")
                        alert("Failed! User already exists");
                    else {
                        $scope.data.name = "";
                        $scope.data.mobile = "";
                        $scope.data.emergency_mobile = "";
                        $scope.data.type = "";
                        $scope.data.address = "";
                        $scope.data.native_place = ""
                        $scope.data.native_add = "";
                        $scope.data.dob = "";
                        $scope.data.education = "";
                        $scope.data.experience = "";
                        $scope.data.gender = "";
                        $scope.data.remark = "";
                        $scope.data.salary = "";
                        $scope.data.bonus = "";

                        alert("Registered Successfuly");

                    }

                });
        };

    })

    .controller('BookCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                      $cordovaGeolocation, $localstorage, $cordovaDevice, BlueTeam) {
        //for datetime picker
        console.log("start book ctrl");
        $scope.datetimeValue = new Date();
        $scope.datetimeValue.setHours(7);
        $scope.datetimeValue.setMinutes(0);

        $scope.type = $localstorage.get('type');
        if ($scope.type != "customer")
            $scope.notCustomer = true;

        $scope.data = {};
        $scope.data.hours = "";

        if (window.services === undefined)
            $state.go('tab.service-list');

        for (i = 0; i < window.services.length; i++) {

            if (window.services[i].name == $stateParams.id) {

                for (j = 0; j < window.services[i].plans.length; j++) {

                    if (window.services[i].plans[j].name == $stateParams.type) {

                        $scope.price = window.services[i].plans[j].price;
                    }
                }
            }
        }


        $scope.service = $stateParams.id;
        $scope.type = $stateParams.type;

        $scope.data.name = $localstorage.get('name');
        $scope.data.mobile = parseInt($localstorage.get('mobile'));
        $scope.data.address = $localstorage.get('address');
        $scope.position = {
            "coords": {
                "longitude": null,
                "latitude": null
            }
        };
        // to get current location of the user
        var posOptions = {
            timeout: 1000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.position = position;
                console.log(JSON.stringify(position))

            }, function (err) {
                // error
                console.log(JSON.stringify(err));
                $scope.position = {
                    "coords": {
                        "longitude": null,
                        "latitude": null
                    }
                };
            });

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(function () {
                $scope.hide();
            }, 5000);

        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.data.startTimeSet = false;

        $scope.takeStartTime = function () {
            console.log($scope.datetimeValue.toString(), $scope.data.drv.toString());
            $scope.data.startTimeSet = true;
        };
        // making post api call to the server by using angular based service

        $scope.conf = function () {
            if (!$scope.data.startTimeSet) {
                return false;
            }
            $scope.data.startTime = "" + ("0" + ($scope.data.drv.getHours())).slice(-2)
                + ":" + ("0" + ($scope.data.drv.getMinutes())).slice(-2) + ":00";
            $scope.data.endTime = "" + ("0" + ($scope.data.drv.getHours() + parseInt($scope.data.hours)) % 24 ).slice(-2)
                + ":" + ("0" + ($scope.data.drv.getMinutes())).slice(-2) + ":00";

            $scope.show();
            //$localstorage.set('name', $scope.data.name);
            //$localstorage.set('mobile', $scope.data.mobile);
            $localstorage.set('address', $scope.data.address);
            console.log(JSON.stringify($scope.position));
            BlueTeam.makeServiceRequest({
                    "root": {
                        "name": $scope.data.name,
                        "mobile": "" + $scope.data.mobile,
                        "location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                        "requirements": $scope.service,
                        "user_id": $localstorage.get('user_id'),
                        "start_datatime": $scope.data.drv + "",
                        "service_type": $scope.type,
                        "remarks": $scope.type + " by mobile app," + $scope.data.remark,
                        "start_time": $scope.data.startTime,
                        "end_time": $scope.data.endTime,
                        "address": $scope.data.address,
                        "remark": $scope.data.remark,
                        "priority": "" + 3,
                        "device_id": $cordovaDevice.getUUID()
                    }
                })
                .then(function (d) {
                    $scope.hide();
                    $ionicHistory.clearHistory();
                    $state.go('finish');
                    //$scope.services = d['data']['services'];
                });
        };

    });