/**
 * Created by spider-ninja on 6/30/16.
 */
angular.module('starter.controllers', ['ionic', 'ngCordova', 'ionic.rating'])

    .controller('HomeCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $stateParams,
                                      $cordovaGeolocation, $localstorage, $cordovaDevice, $cordovaBarcodeScanner,
                                      $cordovaFileTransfer, $cordovaCamera, FILEDOG, WAZIR, DIGIEYE) {

       /* if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {
            $ionicHistory.clearHistory();
            $state.go('reg');
        }*/

        $scope.data = {};




        $scope.scanBarcode = function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                //alert(imageData.text);

                $scope.newObjectId = imageData.text;
                $scope.QrUser = null;
                $scope.newObject = false;

                DIGIEYE.getObject(imageData.text)
                    .then(function (d) {

                        if(d['objects'][0]) {
                            $scope.QrUser = d['objects'][0];
                            WAZIR.getFeedbacks($scope.newObjectId)
                                .then(function (d) {

                                    console.log(JSON.stringify(d));


                                    if(d['feedbacks'][0]) {
                                        $scope.feeds = d['feedbacks'];

                                    }
                                    else
                                        $scope.noFeeds = true;

                                    console.log(JSON.stringify($scope.feeds));
                                })
                                .finally(function () {
                                    // Stop the ion-refresher from spinning
                                    $scope.$broadcast('scroll.refreshComplete');
                                });

                        }
                        else
                            $scope.newObject = true;

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

        $scope.feedback = function () {

            $scope.show();


            WAZIR.postFeedback($scope.newObjectId,
                {

                    "digieye_user_id":"1",
                    "feedback": $scope.data.feedback,

                        "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude
                        /*"device_id": $cordovaDevice.getUUID(),*/




                }
                )
                .then(function (d) {
                    $scope.hide();

                    /*$scope.resp = d['root'].user;
                    if ($scope.resp == "")
                        alert("Failed! User already exists");
                    else*/ //{
                        $scope.data.feedback = "";


                        alert("Given successfully");

                    //}

                });
        };


        $scope.addObject = function () {

            $scope.show();


            DIGIEYE.postObject(
                {

                        "object_id": $scope.newObjectId,
                        "mobile": $scope.data.mobile,
                        "photo": $scope.data.photo,
                        "name": $scope.data.name,
                        "brand": $scope.data.brand,
                        "email": $scope.data.email,

                        "location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude
                        /*"device_id": $cordovaDevice.getUUID(),*/




                }
                )
                .then(function (d) {
                    $scope.hide();

                    $scope.resp = d['objects'];
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

    .controller('RegCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $cordovaGeolocation, $localstorage,
                                     $ionicPlatform, $cordovaDevice, $window, $cordovaLocalNotification, DIGIEYE) {


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

            /*  $scope.findContact = function () {
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
             $scope.findContact();*/


        });


        if ($localstorage.get('name') === undefined || $localstorage.get('mobile') === undefined || $localstorage.get('email') === undefined ||
            $localstorage.get('name') === "" || $localstorage.get('mobile') === "") {

        } else {
            $ionicHistory.clearHistory();
            $state.go('tab.home');

        }


        $scope.reg = function () {

                $scope.show();
                DIGIEYE.postObject({

                            "gps_location": $scope.position.coords.latitude + ',' + $scope.position.coords.longitude,
                            "name": $scope.data.name,
                            "mobile": $scope.data.mobile,
                            "type": "human",
                            "email": "" + $scope.data.email,
                            "device_id": $cordovaDevice.getUUID()

                    })
                    .then(function (d) {

                        //setObject
                        $scope.user = d['object'];
                        $localstorage.set('name', $scope.data.name);
                        $localstorage.set('mobile', $scope.data.mobile);
                        $localstorage.set('object_id', $scope.data.object_id);
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
                        $state.go('tab.home');

                    });

        };
    })
;


