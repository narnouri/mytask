/*
 * 
 * JavaScript, jQuery 
 * --------------------------
 * Copyright 2014 Nour Kayali
 * 
 */

//var serverAddr = 'http://192.168.1.64';
//var serverAddr = 'http://192.168.1.11';
var serverAddr = 'http://narnouri.noip.me:8081';

// add some users to the database when app boots
function addUsers() {
    $(function() {
        // show a spinning wheel
        $.blockUI({message: '<img src="./themes/images/ajax-loader.gif" />',
            css: {
                border: 'none',
                padding: '5px',
                backgroundColor: '#000',
                '-webkit-border-radius': '2px',
                '-moz-border-radius': '2px',
                opacity: .5,
                color: '#fff'
            }});
        $.ajax({
            url: serverAddr + '/cgi-bin/addUsers.py',
            type: 'GET',
            cache: false,
            processData: false,
            success: function(response) {
                // hide a spinning wheel
                $.unblockUI();
                console.debug('response', response);
            },
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });
}

// login process
function login() {
    $(function() {
        // showing a spinning wheel
        $.blockUI({message: '<img src="./themes/images/ajax-loader.gif" />',
            css: {
                border: 'none',
                padding: '5px',
                backgroundColor: '#000',
                '-webkit-border-radius': '2px',
                '-moz-border-radius': '2px',
                opacity: .5,
                color: '#fff'
            }});
        $.ajax({
            url: serverAddr + '/cgi-bin/users.py?username=' + $('#username').val() + '&password=' + $('#password').val(),
            type: 'GET',
            cache: false,
            contentType: 'application/json',
            processData: false,
            success: function(response) {
                // hide a spinning wheel
                $.unblockUI();
                console.debug('response', response);
                // move to maintain screen only if the username and password are found
                if (response.count >= 1) {
                    window.location = serverAddr + '/mytask/maintain.html';
                }
                else {
                    alert("Invalid username or password");
                }
            },
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });
}

// add a valid email address 
function addEmail() {
    $(function() {
        // showing a spinning wheel
        $.blockUI({message: '<img src="./themes/images/ajax-loader.gif" />',
            css: {
                border: 'none',
                padding: '5px',
                backgroundColor: '#000',
                '-webkit-border-radius': '2px',
                '-moz-border-radius': '2px',
                opacity: .5,
                color: '#fff'
            }});
        // check if the email address is exist already
        var emailExists = false;
        $('#emailsList option').each(function(i, option1) {
            if ($('#email').val() == option1.value) {
                emailExists = true;
            }
        });
        // ajax call only if the email address is new
        if (!emailExists) {
            $.ajax({
                url: serverAddr + '/cgi-bin/addEmail.py?email=' + $('#email').val(),
                type: 'GET',
                cache: false,
                contentType: 'application/json',
                processData: false,
                success: function(response) {
                    // hide a spinning wheel
                    $.unblockUI();
                    console.debug('response', response);
                    alert("Email: " + $('#email').val() + " has been added successfully");
                    $('#email').val("");
                    $('#addEmailButton').attr('disabled', true);
                    //reload emails, cities list and percentage
                    $('#emailsList').html('');
                    $('#citiesList').html('');
                    readEmailsList();
                    readCitiesList();
                    readPercentage();
                },
                error: function(xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        }
        else {
            // hide a spinning wheel
            $.unblockUI();
            alert("Email: " + $('#email').val() + " already exists");
        }
    });
}

// the process to get the current location
function getCurrentLocation() {
    $(function() {
        // showing a spinning wheel
        $.blockUI({message: '<img src="./themes/images/ajax-loader.gif" />',
            css: {
                border: 'none',
                padding: '5px',
                backgroundColor: '#000',
                '-webkit-border-radius': '2px',
                '-moz-border-radius': '2px',
                opacity: .5,
                color: '#fff'
            }});
        // check if the browser is supported
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
        function showPosition(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            //Get city name and country using google geocoding
            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng,
                dataType: "json",
                data: {
                },
                success: function(response) {
                    // hide a spinning wheel
                    $.unblockUI();
                    console.debug('response', response);
                    // choose the best availnle city
                    var result = response.results[0];
                    var city = "";
                    var country = "";
                    for (var i = 0, len = result.address_components.length; i < len; i++) {
                        var ac = result.address_components[i];
                        if (ac.types.indexOf("locality") >= 0)
                            city = ac.long_name;
                        if (ac.types.indexOf("country") >= 0)
                            country = ac.long_name;
                    }
                    if (city != '' && country != '') {
                        $('#city').val(city + ", " + country);
                        $('#addCityButton').attr('disabled', false);
                    }
                },
                error: function(xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        }
    });
}

// add city, country, latitude, and longitude to the database
function addCity() {
    $(function() {
        // showing a spinning wheel
        $.blockUI({message: '<img src="./themes/images/ajax-loader.gif" />',
            css: {
                border: 'none',
                padding: '5px',
                backgroundColor: '#000',
                '-webkit-border-radius': '2px',
                '-moz-border-radius': '2px',
                opacity: .5,
                color: '#fff'
            }});
        var city = $('#city').val().substr(0, $('#city').val().indexOf(","));
        var country;
        if ($('#city').val().indexOf("(") > -1) {
            country = $('#city').val().substring($('#city').val().lastIndexOf(",") + 2, $('#city').val().indexOf(" ("));
            lat = $('#city').val().substring($('#city').val().indexOf("lat: ") + 5, $('#city').val().indexOf(" lng"));
            lng = $('#city').val().substring($('#city').val().indexOf("lng: ") + 5, $('#city').val().indexOf(")"));
        }
        else {
            country = $('#city').val().substring($('#city').val().indexOf(",") + 2);
        }
        // check if the city, country exists already
        var cityExists = false;
        $('#citiesList option').each(function(i, option1) {
            if (city + "," + country == option1.value) {
                cityExists = true;
            }
        });
        // ajax call only if the city, country is new
        if (!cityExists) {
            $.ajax({
                url: serverAddr + '/cgi-bin/addCity.py?city=' + city + '&country=' + country + '&lat=' + lat + '&lng=' + lng + '',
                type: 'GET',
                cache: false,
                contentType: 'application/json',
                processData: false,
                success: function(response) {
                    $.unblockUI();
                    console.debug('response', response);
                    alert("City: " + city + ", " + country + " has been added successfully");
                    $('#city').val("");
                    $('#addCityButton').attr('disabled', true);
                    // reload emails, cities list and percentage
                    $('#emailsList').html('');
                    $('#citiesList').html('');
                    readEmailsList();
                    readCitiesList();
                    readPercentage();
                },
                error: function(xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        }
        else {
            // hide a spinning wheel
            $.unblockUI();
            alert("City: " + city + ", " + country + " already exists");
        }
    });
}

// save the percentage when the user release the scroll 
function savePercentage() {
    $(function() {
        // showing a spinning wheel
        $.blockUI({message: '<img src="./themes/images/ajax-loader.gif" />',
            css: {
                border: 'none',
                padding: '5px',
                backgroundColor: '#000',
                '-webkit-border-radius': '2px',
                '-moz-border-radius': '2px',
                opacity: .5,
                color: '#fff'
            }});
        $.ajax({
            url: serverAddr + '/cgi-bin/savePercentage.py?percentage=' + $('#percentage').val(),
            type: 'GET',
            cache: false,
            contentType: 'application/json',
            processData: false,
            success: function(response) {
                // hide a spinning wheel
                $.unblockUI();
                console.debug('response', response);
            },
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });
}

// read every email address storedin the database
function readEmailsList() {
    $(function() {
        // showing a spinning wheel
        $.blockUI({message: '<img src="./themes/images/ajax-loader.gif" />',
            css: {
                border: 'none',
                padding: '5px',
                backgroundColor: '#000',
                '-webkit-border-radius': '2px',
                '-moz-border-radius': '2px',
                opacity: .5,
                color: '#fff'
            }});
        $.ajax({
            url: serverAddr + '/cgi-bin/readEmails.py',
            type: 'GET',
            cache: false,
            contentType: 'application/json',
            processData: false,
            success: function(response) {
                // hide a spinning wheel
                $.unblockUI();
                console.debug('response', response);
                $("#emailsList").append('<option>Select Email</option>');
                 // update emails list
                $.each(response, function(i, item) {
                    $("#emailsList").append('<option>' + response[i] + '</option>');
                });
            },
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });
}

// read every city stored in the database
function readCitiesList() {
    $(function() {
        // showing a spinning wheel
        $.blockUI({message: '<img src="./themes/images/ajax-loader.gif" />',
            css: {
                border: 'none',
                padding: '5px',
                backgroundColor: '#000',
                '-webkit-border-radius': '2px',
                '-moz-border-radius': '2px',
                opacity: .5,
                color: '#fff'
            }});
        $.ajax({
            url: serverAddr + '/cgi-bin/readCities.py',
            type: 'GET',
            cache: false,
            contentType: 'application/json',
            processData: false,
            success: function(response) {
                // showing a spinning wheel
                $.unblockUI();
                console.debug('response', response);
                $("#citiesList").append('<option>Select City</option>');
                // update cities list
                $.each(response, function(i, item) {
                    $("#citiesList").append('<option>' + response[i] + '</option>');
                });
            },
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });
}

// read the last percentage stored in the database
function readPercentage() {
    $(function() {
        // showing a spinning wheel
        $.blockUI({message: '<img src="./themes/images/ajax-loader.gif" />',
            css: {
                border: 'none',
                padding: '5px',
                backgroundColor: '#000',
                '-webkit-border-radius': '2px',
                '-moz-border-radius': '2px',
                opacity: .5,
                color: '#fff'
            }});
        $.ajax({
            url: serverAddr + '/cgi-bin/readPercentage.py',
            type: 'GET',
            cache: false,
            contentType: 'application/json',
            processData: false,
            success: function(response) {
                // hide a spinning wheel
                $.unblockUI();
                console.debug('response', response);
                $("#percentage").val(response).slider("refresh");
            },
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });
}

// the process of sending email
function sendEmail() {
    $(function() {
        // showing a spinning wheel
        $.blockUI({message: '<img src="./themes/images/ajax-loader.gif" />',
            css: {
                border: 'none',
                padding: '5px',
                backgroundColor: '#000',
                '-webkit-border-radius': '2px',
                '-moz-border-radius': '2px',
                opacity: .5,
                color: '#fff'
            }});
        var city = $('#citiesList').find(":selected").text().substring(0, $('#citiesList').find(":selected").text().indexOf(","));
        var country = $('#citiesList').find(":selected").text().substring($('#citiesList').find(":selected").text().indexOf(",") + 1);
        var percentage = $('#percentage').val();
        var email = $('#emailsList').find(":selected").text();
        // Get latitude and longitude from the database
        $.ajax({
            url: serverAddr + '/cgi-bin/readLatLng.py?city=' + city + '&country=' + country,
            type: 'GET',
            cache: false,
            contentType: 'application/json',
            processData: false,
            success: function(response) {
                console.debug('response', response);
                var lat = response[0].toString().substring(0, response[0].toString().indexOf(","));
                var lng = response[0].toString().substring(response[0].toString().indexOf(",") + 1);
                // Get the timezone from geonames
                $.ajax({
                    url: 'http://api.geonames.org/timezoneJSON?lat=' + lat + '&lng=' + lng + '&username=narnouri',
                    dataType: "jsonp",
                    data: {
                    },
                    success: function(response) {
                        console.debug('response', response);
                        var time = response.time;
                        var emailBody = 'The slide is set to ' + percentage + '%25 and the time in ' + city + ', ' + country + ' is ' + time;
                        // send email
                        $.ajax({
                            url: serverAddr + '/cgi-bin/sendEmail.py?emailto=' + email + '&emailbody=' + emailBody,
                            type: 'GET',
                            cache: false,
                            processData: false,
                            success: function(response) {
                                console.debug('response', response);
                                alert("Email has been sent successfully to " + $('#emailsList').find(":selected").text());
                                $.unblockUI();
                            },
                            error: function(xhr, status, error) {
                                var err = eval("(" + xhr.responseText + ")");
                                alert("Error sending Email: " + err.Message);
                            }
                        });
                    },
                    error: function(xhr, status, error) {
                        var err = eval("(" + xhr.responseText + ")");
                        alert(err.Message);
                    }
                });
            },
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });
}