var userState = JSON.parse(localStorage.getItem("userState"));
  if(!userState){
    location.href= "login.html";
}

$(document).ready(function(){


    var socket = io(); //Initialize Socket

    //Socket variables
    var DEBUG = 1;
    var VALIDATE_COMPANY_ID = "validate_company_id";
    var VISITOR_LIST_UPDATE = "visitor_list_update";
    var REMOVE_VISITOR = "remove_visitor";

    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    var apptsToday;
    companyData.company_id = companyData._id;


    //var curCompany = JSON.parse(localStorage.getItem('currentCompany'));
    var curUser = JSON.parse(localStorage.getItem('currentUser'));
    var companyName = companyData.name;


    $('#user-name').text(curUser.first_name + ' ' +  curUser.last_name);

    //Connect to private socket
    //var companyId = getCookie('company_id');
    socket.emit(VALIDATE_COMPANY_ID, companyData);

   /***
    * Compile all the Handle Bar Templates
    */
    //DashBoard Template
    var source = $("#visitor-list-template").html();
    var template = Handlebars.compile(source);

    //Modal Template
    var modal = $('#visitor-info-template').html();
    var modalTemplate = Handlebars.compile(modal);
    
    socket.on("connect", function(){
      console.log("a user connected");
    });
    
    //SOCKET LISTEN FOR VISITOR QUEUE
    socket.on(VISITOR_LIST_UPDATE, function (data) {
        apptsToday = data; // has client name, appt time, checked_in, and checkin_time; ALL APPTS FOR THE DAY
        console.log(data);
        console.log("I AM HERE");
        //Parse Visitor List to format Date
        for(var i = 0, len = apptsToday.length; i< len; i++){
            apptsToday[i].checkin_time = formatTime(apptsToday[i].checkin_time);
            apptsToday[i].date = formatTime(apptsToday[i].date);
        }

       //visitorList.checkin_time = visitorList;
        console.log(apptsToday);
        var compiledHtml = template(apptsToday);
        $('#visitor-list').html(compiledHtml);
    });
    
    /***
    * Listener for Opening a Modal
    */
    $(document).on('click','.patient-check-out',function(){
        var uniqueId = $(this).attr('value');
        var visitor = findVisitor(uniqueId);
        var compiledTemplate = modalTemplate(visitor);
        $('.modal-dialog').html(compiledTemplate);
    });

    /***
     * Listener for Checking out a Visitor
     */
    $(document).on('click','.check-in-btn',function(){
        var id = $(this).closest('.modal-content').find('.modal-body').attr('value');
        var apptId = $(this).closest('.modal-content').find('.modal-left').attr('value');

        var removeVisitor = findVisitor(id);
   
        removeVisitor.visitor_id = removeVisitor._id;

        $.ajax({
          dataType:'json',
          type: 'DELETE',
          url:'/api/appointments/' + apptId,
          success:function(response){
          }
        });
        

        socket.emit(REMOVE_VISITOR, removeVisitor);
    });
/*
    $(document).on('click','.checkout-btn',function(){
        var id = $(this).closest('.patient-check-out').attr('value');
        var removeVisitor = findVisitor(id);
        console.log(removeVisitor);
        //removeVisitor.visitor_id = removeVisitor._id;
        //socket.emit(REMOVE_VISITOR, removeVisitor);

    });
*/
    /***
     * Compare appointment Date to today's Date
     */
    function compareDate(appointment){
      var today = new Date();
      appointment = new Date(Date.parse(appointment));

      var appointmentDate = appointment.getFullYear() + ' ' + appointment.getDate() + ' ' + appointment.getMonth();
      var todayDate = today.getFullYear() + ' ' + today.getDate() + ' ' + today.getMonth();

      return (appointmentDate == todayDate);
    }

    /***
     * Find Specific Visitor Given Visitor ID within the Visitor Array
     * @param id
     * @returns {string}
     */
    function findVisitor(id){

        for(var visitor in visitorList) {
           if(visitorList.hasOwnProperty(visitor)){
              if(visitorList[visitor]._id === id){
                  if(DEBUG) console.log(visitorList[visitor]);
                  return visitorList[visitor];
              }
           }
        }
    }

    /***
     * Function to format a JSON date object into a string
     * @param time
     */
    function formatTime(time){
        var currentTime = new Date(Date.parse(time));
        var hour = currentTime.getHours();
        var minute = currentTime.getMinutes();

        if(minute < 10) {
            minute = '0' + minute;
        }

        if(hour >= 13){
            hour = hour-12;
            currentTime = hour + ':' + minute + 'PM';
        }

        else if(hour === 12){
            currentTime = hour + ':' + minute +'PM';
        }
        else if(hour === 0){
            currentTime = 1 + ':' + minute + 'AM';
        }
        else{
            currentTime = hour + ':' + minute +'AM';
        }

        return currentTime;

    }

    $('#logoutButton').on('click',function(){
      localStorage.setItem('userState',0);
    });


    /***
     * TODO order the list by increasing order
     * @param key
     */
    function increasingOrder(key){

    }

    /***
     * TODO order the list by decreasing order
     * @param key
     */
    function decreasingOrder(key){

    }

});
