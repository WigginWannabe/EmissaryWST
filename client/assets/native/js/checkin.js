$(document).ready(function(){

    var socket = io();
    //var MongoClient = require('mongodb').MongoClient;
    //var url = "mongodb://ds143181.mlab.com:43181/cse112";

    var VALIDATE_COMPANY_ID = "validate_company_id";
    var ADD_VISITOR = "add_visitor";
    var GET_APPOINTMENT = "get_appointment";
    var NOT_FOUND = "Appointment not found.\n Please speak with the front desk.";
    var NOT_30MIN = "Not yet within 30 minutes of your appointment.\n Please try again later.";
    var PASSED = "Appointment time has passed.\n Please speak with the front desk.";

    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    console.log(companyData);
    socket.emit(VALIDATE_COMPANY_ID, companyData);
    
    //Prevent users from scrolling around on iPad
    document.ontouchmove = function(e) {
        e.preventDefault();
    };

    socket.on(GET_APPOINTMENT, function(data) {
        console.log(data);
        if (data.error) {
            console.log(data.error.toString());

            document.getElementById('failedCheckin').innerHTML = data.error.toString();
            showFailure();
        }
        else {
            showConfirmation();
        }
        showButton();
    });

    //Bind Listeners
    $('#tap-to-check').on('click', startCheckIn);
    $('.check-in').on('submit', submitForm);


    //When a user starts their check in
    function startCheckIn(){
        $('.check-in').addClass('show');
        $('.check-in').animate({
            top:'10%',
            opacity: '1'
        }, 700);
        $(this).addClass('hide');
        $('#clock').addClass('hide');
    }
    function showConfirmation() {
        $('#confirmation').show();
    }
    function showFailure() {
        $('#failedCheckin').show();
    }
    function showButton() {
        $('#bButton').show();
    }

    //When a patient submits their form
    function submitForm(e){
        e.preventDefault();

        var data = grabFormElements();

        //reference database to check if visitor has an appointment
        console.log("should be printing?");
        //socket.emit(GET_APPOINTMENT,data);

        //console.log(data.company_id);
        if(localStorage.getItem("slackToken")&&localStorage.getItem("slackChannel"))
        {
             $.post("https://slack.com/api/chat.postMessage",
             {
                'token': localStorage.getItem("slackToken"),
                'channel': localStorage.getItem("slackChannel"), 
                'text': "Name: " + data['first_name'] + " " + data['last_name'] + " Phone Number: " + data['phone_number']
             },
             function(data, status){
              });
        }

        socket.emit(ADD_VISITOR, data);

        $(this).animate({
            top:'35%',
            opacity:'0'
        },0);
        //$('.check-in').addClass('hide');
        //$('.submit-check-in').style.display = "none";
    }
    //Grabs elements from the check in and puts it into an object
    function grabFormElements(){
        var newVisitor = {};
        newVisitor.company_id = companyData._id;
        newVisitor.first_name= $('#visitor-first').val();
        newVisitor.last_name = $('#visitor-last').val();
        newVisitor.phone_number = $('#visitor-number').val();
        newVisitor.checkin_time = new Date();
        return newVisitor;
    }

    //CLOCK
    function updateClock () {
        var currentTime = new Date ( );
        var currentHours = currentTime.getHours ( );
        var currentMinutes = currentTime.getMinutes ( );
        //var currentSeconds = currentTime.getSeconds ( );
        // Pad the minutes and seconds with leading zeros, if required
        currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
        //currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

        // Convert the hours component to 12-hour format if needed
        currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

        // Convert an hours component of "0" to "12"
        currentHours = ( currentHours == 0 ) ? 12 : currentHours;

        // Compose the string for display
        var currentTimeString = currentHours + ":" + currentMinutes;

        $("#clock").html(currentTimeString);
    }
    updateClock();
    setInterval(updateClock, 60 * 1000);

    /***
     * Find a specific cookie name
     * @param cName
     * @returns {string|*}
     */
    function getCookie(cName) {
        var name = cName + '=';
        var cookieArray = document.cookie.split(';');

        for (var i = 0, len = cookieArray.length; i < len; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ')
                cookie.substring(1);
            if (cookie.indexOf(name) == 0)
                return cookie.substring(name.length, cookie.length);
        }

    }


});
