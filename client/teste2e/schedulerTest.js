/*
 *  Overview:
 *  This test tests the Login, Scheduler, Checkin, and Visitors page.
 *  >Logs in with test account credentials
 *  >Goes to Scheduler page, schedules an appointment
 *  >Checks in for the just-created appointment
 *  >Checks to see if the visitors page is updated with this check-in
 *  >Removes this from the visitors list (NOTE: this also removes from the scheduler)
 */

module.exports = {
    beforeEach: (browser) => {
        browser
            .url('http://emissary-pseudopandas-dev.herokuapp.com/login')
            .waitForElementVisible('body', 10000);
    },
    AddingAppointment: (browser) => {
        /*  Testing Account Credentials
        /   Username: test@test.com
        /   Password: password123
        */
        browser.setValue('#username', "test@test.com");
        browser.setValue('#password', "password123");
        browser.click('#loginButton').pause(1000);
        //Login and landing page should be /visitors
        browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/visitors");
        //Checks 3rd button on main menu leads to scheduler page and clicks
        browser.assert.attributeContains("#main-menu > li:nth-child(3) > a", "href", "scheduler.html");
        browser.click('#main-menu > li:nth-child(3)');

        //NOTE (ghetto fix): clicks the hamburger menu to minimize the sidebar because this may block
        //the save button on the modal for scheduling appointments.
        browser.click('.entypo-menu');
        browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/scheduler");

        //Double clicks the calendar on today to schedule an appointment
        browser.moveToElement(".dhx_now > div.dhx_month_body", 15, 15);
        browser.doubleClick().pause(500);

        var firstname = "Hey";
        var lastname = "Yo";
        var phonenumber = "1234567890";
        //Sets input fields
        browser.setValue('body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_cal_larea > div:nth-child(1) > div.dhx_cal_ltext > textarea', firstname);
        browser.setValue('body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_cal_larea > div:nth-child(2) > div.dhx_cal_ltext > textarea', lastname);
        browser.setValue('body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_cal_larea > div:nth-child(3) > div.dhx_cal_ltext > textarea', phonenumber);
        browser.setValue('body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_cal_larea > div:nth-child(4) > div.dhx_cal_ltext > textarea', "Tester");

        //Sets the appointment time relatively approximated to the current time
        /*  NOTE: This is needed b/c the Check-In only accepts checking in within a half-hour range before
        /   or after the appointment time
        */
        var currentTime = new Date();
        var currentHour = currentTime.getHours();
        var currentMinute = currentTime.getMinutes();

        var offset = Math.floor((currentHour * 60 + currentMinute) / 15);
        browser.click("body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_cal_larea > div:nth-child(5) > div.dhx_section_time > select > option:nth-child(" + offset + ")");

        //NOTE: using browser.click on the save button does not work for some reason, this is a work-around
        browser.moveToElement("body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_btn_set.dhx_left_btn_set.dhx_save_btn_set > div:nth-child(2)", 2, 2);
        browser.mouseButtonClick(0).pause(500);

        browser
            .url('http://emissary-pseudopandas-dev.herokuapp.com/scheduler')
            .waitForElementVisible('body', 10000);

        //Checks to see that the appointment shows up with the correct name from above
        browser.execute(function(data) {
            var found = false;
            var event_id = 0;
            var x = document.querySelectorAll('[event_id]');
            for (var i = 0; i < x.length; i++) {
                if (x[i].outerHTML.includes("Hey" + " " + "Yo")) {
                    found = true;
                    event_id = x[i].outerHTML.split('"')[1];
                }
            }
            return {
                'found': found,
                'event_id': event_id
            };
        }, function(result) {

            browser.assert.equal(result.value.found, true);


            /***********************************CHECKIN TEST********************************************************/
            //Goes to the checkin page
            browser.click('#main-menu > li:nth-child(1) > a').pause(1000);
            browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/checkin");

            browser.click('#tap-to-check');

            //Type in same info as above
            browser.setValue('#visitor-first', firstname);
            browser.setValue('#visitor-last', lastname);
            browser.setValue('#visitor-number', phonenumber);
            browser.click('.submit-check-in').pause(1000);

            //Goes back to visitors page
            browser.url("http://emissary-pseudopandas-dev.herokuapp.com/visitors").pause(1000);

            //Checks if the visitor that checked in is on this list, removes that visitor, and checks if the 
            //list has decreased in size by 1.
            browser.execute(function(data) {
                return document.getElementById("visitor-list").getElementsByTagName("tr").length;
            }, function(result) {
                var originalLength = result.value;
                browser.assert.containsText('#visitor-list tr:nth-child(' + result.value + ') td:nth-child(1)', firstname).pause(1000);
                browser.click('#visitor-list tr:nth-child(' + result.value + ')').pause(1000);
                browser.assert.containsText('#myModal .modal-dialog .modal-content .modal-body .modal-left p', firstname).pause(1000);
                browser.click('#myModal .modal-dialog .modal-content .modal-footer button:nth-child(1)').pause(1000);

                browser.execute(function(data) {
                    return document.getElementById("visitor-list").getElementsByTagName("tr").length;
                }, function(result) {
                    this.assert.equal(result.value, originalLength - 1);


                });

            });


        });


    },
    after: browser => browser.end(),

};