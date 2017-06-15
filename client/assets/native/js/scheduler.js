$(document).ready(function(){
    // scheduler.config.xml_date="%Y-%m-%d %H:%i";
    scheduler.config.lightbox.sections = [
      { name:"First Name", height:25, map_to:"first_name", type:"textarea", focus:true },
      { name:"Last Name", height:25, map_to:"last_name", type:"textarea", focus:true },
      { name:"Phone Number", height:25, map_to:"phone_number", type:"textarea"  },
      { name:"Employee", height:25, map_to:"employee", type:"textarea", focus:true },
      { name:"time", height:72, type:"time", map_to:"auto"} 
    ];
    scheduler.config.time_step = 15;
    scheduler.attachEvent("onTemplatesReady", function(){
    scheduler.templates.event_text=function(start,end,event){
        return "<b>" + event.text + "</b><br><i>" + event.employee + "</i>";
    }
    }); 

    scheduler.attachEvent("onEventAdded", function(id, event){
        console.log(event);
        newAppt = {};
        newAppt.date = formatSchedulerTime(event.start_date.toString());
        newAppt.end_date = formatSchedulerTime(event.end_date.toString());
        newAppt.company_id = myCompanyId;
        newAppt.first_name = event.first_name;
        newAppt.last_name = event.last_name;
        newAppt.phone_number = event.phone_number;
        newAppt.provider_name = event.employee;
        newAppt.is_checked_in = 0;
        updateApptList(newAppt);
        event.text = newAppt.first_name + " " +  newAppt.last_name;
    });
    scheduler.attachEvent("onEventChanged", function(id,event){
        console.log(event);
        newAppt = {};
        newAppt.id = event.id;
        newAppt.date = formatSchedulerTime(event.start_date.toString());
        newAppt.end_date = formatSchedulerTime(event.end_date.toString());
        newAppt.company_id = myCompanyId;
        newAppt.first_name = event.first_name;
        newAppt.last_name = event.last_name;
        newAppt.phone_number = event.phone_number;
        newAppt.provider_name = event.employee;
        newAppt.is_checked_in = 0;
        updateAppointment(newAppt);
    });
    scheduler.attachEvent("onEventDeleted", function(id, event){
        console.log(event);
        $.ajax({
          dataType:'json',
            type: 'DELETE',
            url:'/api/appointments/' + event.id,
            success:function(response){
              console.log(response);
          }
        });
    })
    scheduler.config.hour_date = "%g:%i%a";
    scheduler.init('scheduler_here', new Date(),"month");

    apptlist = [];

    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    var myCompanyId = companyData._id;
    var curUser = JSON.parse(localStorage.getItem('currentUser'));

  
    $('#user-name').text(curUser.first_name + ' ' +  curUser.last_name);

    var appts = getAppts();

    for(var i = 0; i < appts.length; i++)
    {
      json = new Object();
      json.id = appts[i]._id;
      json.text = appts[i].first_name.toString() + " " + appts[i].last_name.toString();
      json.first_name = appts[i].first_name.toString();
      json.last_name = appts[i].last_name.toString();
      json.employee = appts[i].provider_name.toString();
      json.phone_number = appts[i].phone_number.toString();
      json.start_date = formatDate(appts[i].date.toString()) + " " + formatTime(appts[i].date.toString());
      json.end_date = formatDate(appts[i].end_date.toString()) + " " + formatTime(appts[i].end_date.toString());

      apptlist.push((json));

    }
    scheduler.parse(apptlist, "json");

    
   /***
     * Makes a get request to display list of appts
     * @param none
     * @returns displays the appt list
     */
    function getAppts() {
       var json;
       $.ajax({
           dataType: 'json',
           type: 'GET',
           data: $('#response').serialize(),
           async: false,
           url: '/api/appointments/company/' + myCompanyId,
           success: function(response) {
               json = response;
               console.log(response);
           }
       });
       return json;
   }

   /***
     * When a patient submits their form
     * @param none
     * @returns updates the appt list
     */
    function submitForm(){
        var d = grabFormElements();
        console.log(d);
        updateApptList(d);
        appts = getAppts();
        appts = initializeAppts(appts);
        $("#appt-list").html(template(appts));
        document.getElementById("appt-form").reset();
    }

    /***
     * Makes a post request to update list of appts when adding a new appt
     * @param none
     * @returns updates the appt list
     */
   function updateApptList(obj) {
      $.ajax({
        dataType: 'json',
           type: 'POST',
           data: obj,
           async: false,
           url: '/api/appointments/',
           success: function(response) {
                appts.push(response);
                console.log(response);
           }
      });
    }


    /***
     * Grabs elements from the check in and puts it into an object
     * @param none
     * @returns new appt object
     */
    function grabFormElements(){
      var newAppt = {};
      var userTime,userDate;
      newAppt.company_id = myCompanyId;
      newAppt.first_name= $('#appt-first').val();
      newAppt.last_name = $('#appt-last').val();
      newAppt.phone_number = $('#appt-number').val();
      newAppt.provider_name = $('#appt-provider').val();

      userDate = $('#appt-date').val();
      userTime = $('#appt-time').val();

      newAppt.date = jsDate(userDate,userTime);
      return newAppt;
    } 

    /***
     * Updates an appointment when the user changes it through the scheduler GUI
     * @param event: the modified appointment
     * @return none
     */
    function updateAppointment(event) {
      $.ajax({
        dataType: 'json',
          type: 'PUT',
          data: event,
          async: false,
          url: '/api/appointments/' + event.id,
          success: function(response){
            console.log(response);
          }
      });
    }

    $(document).on('click','.delete-appt',function(){
      var apptId = $(this).closest('.appt-row').attr('value');
      console.log("delete");
      $.ajax({
        dataType:'json',
        type: 'DELETE',
        url:'/api/appointments/' + apptId,
        success:function(response){
          var updateAppts = getAppts();
          var removeAppt = initializeAppts(updateAppts);
          $("#appt-list").html(template(removeAppt));

        }
      });

    });


    /********************* FUNCTIONS TO FORMAT JAVASCRIPT DATES ********************/

    function formatDate(date){
      var d = new Date(Date.parse(date));
      var mm = d.getMonth() + 1;
      var yyyy = d.getFullYear();
      var dd = d.getDate();
      //var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep","Nov","Dec"];
      if(dd < 10){
        dd = '0' + dd;
      }
      if(mm < 10){
        mm = '0' + mm;
      }
      //console.log(monthArray[mm]);
      return  mm + '/' + dd + '/' +  + yyyy;
    }
    function formatNumber(number){
      return '(' + number.substr(0,3) + ')' + number.substr(3,3) + '-' + number.substr(6,4);
    }

    //FUNCTION TO FORMAT DATE OBJECT IN JS
    function jsDate(date,time){
      var jsDate = reFormatDate(date);
      var jsTime = reFormatTime(time);
      jsDateObj = jsDate + ' ' + jsTime;
      return jsDateObj;
    }

    //FUNCTION TO FORMAT DATE TO JS FOR ROBOTS
    function reFormatDate(date){
      var d = new Date(Date.parse(date));
      var mm = d.getMonth() + 1;
      var yyyy = d.getFullYear();
      var dd = d.getDate();

      if(dd < 10){
        dd = '0' + dd;
      }
      if(mm < 10){
        mm = '0' + mm;
      }
      return  yyyy + '-' + mm +'-' + dd;
    }


    //FUNCTION TO FORMAT TIME TO JS FOR ROBOTS
    function reFormatTime(time){
      var ampm = time.substr(-2,2);
      var formattedTime;
      var formattedHour;
      var colon = time.indexOf(":");

      if(ampm === "PM"){
        formattedHour = time.substr(0,2);

        if(formattedHour == '12')
          formattedHour = 12;  
        else
          formattedHour = 12 + parseInt(time.substr(0,2));

        formattedTime = formattedHour + time.substr(colon,3) + ":00";
      }
      else{

        formattedHour = parseInt(time.substr(0,2));
        if(formattedHour < 10){
          formattedHour = '0' + formattedHour;
        }
        if(formattedHour == 12){
          formattedHour = '00';
        }
        formattedTime = formattedHour + time.substr(colon,3) + ':00';
      }

      return formattedTime;
    }

    function formatSchedulerTime(time){
      var tokens = time.split(" ");
      var month = "";
      switch(tokens[1]){
        case "Jan":
          month = "01";
          break;
        case "Feb":
          month = "02";
          break;
        case "Mar":
          month = "03";
          break;
        case "Apr":
          month = "04";
          break;
        case "May":
          month = "05";
          break;
        case "Jun":
          month = "06";
          break;
        case "Jul":
          month = "07";
          break;
        case "Aug":
          month = "08";
          break;
        case "Sep":
          month = "09";
          break;
        case "Oct":
          month = "10";
          break;
        case "Nov":
          month = "11";
          break;
        case "Dec":
          month = "12";
          break;
        default:
          break;
      }
      var date = month + "/" + tokens[2] + "/" + tokens[3] + " " + tokens[4];
      return date;
    }

    //FUNCTION TO FORMAT TIME TO AM AND PM FOR HUMANS
    function formatTime(time){
        var currentTime = new Date(Date.parse(time));
        var hour = currentTime.getHours();
        var minute = currentTime.getMinutes();

        if(minute < 10) {
            minute = '0' + minute;
        }

        // if(hour >= 13){
        //     hour = hour-12;
        //     currentTime = hour + ':' + minute;
        // }

        // else if(hour === 12){
        //     currentTime = hour + ':' + minute;
        // }
        // else if(hour === 0){
        //     currentTime = 1 + ':' + minute;
        // }
        // else{
        //     currentTime = hour + ':' + minute;
        // }
        currentTime = hour + ":" + minute;

        return currentTime;

    }

});
