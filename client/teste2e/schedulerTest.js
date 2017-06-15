module.exports = {
    beforeEach: (browser) => {
        browser
            .url('http://emissary-pseudopandas-dev.herokuapp.com/login')
            .waitForElementVisible('body', 10000);
    },
    AddingAppointment: (browser) => {
        browser.setValue('#username', "test@test.com");
        browser.setValue('#password', "password123");
        browser.click('#loginButton').pause(1000);
        browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/visitors");
        browser.assert.attributeContains("#main-menu > li:nth-child(3) > a", "href", "scheduler.html");
        browser.click('#main-menu > li:nth-child(3)');

        browser.click('.entypo-menu');
        browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/scheduler");
        browser.moveToElement(".dhx_now > div.dhx_month_body", 15, 15);
        browser.doubleClick().pause(500);

        var firstname = "Hey";
        var lastname = "Yo";
        var phonenumber = "1234567890";

        browser.setValue('body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_cal_larea > div:nth-child(1) > div.dhx_cal_ltext > textarea', firstname);
        browser.setValue('body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_cal_larea > div:nth-child(2) > div.dhx_cal_ltext > textarea', lastname);
        browser.setValue('body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_cal_larea > div:nth-child(3) > div.dhx_cal_ltext > textarea', phonenumber);
        browser.setValue('body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_cal_larea > div:nth-child(4) > div.dhx_cal_ltext > textarea', "Tester");

        var currentTime = new Date();
        var currentHour = currentTime.getHours();
        var currentMinute = currentTime.getMinutes();

        var offset = Math.floor((currentHour * 60 + currentMinute) / 15);
        browser.click("body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_cal_larea > div:nth-child(5) > div.dhx_section_time > select > option:nth-child(" + offset + ")");
        browser.moveToElement("body > div.dhx_cal_light.dhx_cal_light_wide > div.dhx_btn_set.dhx_left_btn_set.dhx_save_btn_set > div:nth-child(2)", 2, 2);
        browser.mouseButtonClick(0).pause(500);

        browser
            .url('http://emissary-pseudopandas-dev.herokuapp.com/scheduler')
            .waitForElementVisible('body', 10000);



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

            browser.click('#main-menu > li:nth-child(1) > a').pause(1000);
            browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/checkin");

            browser.click('#tap-to-check');

            var testerName = 'tester' + Math.floor((Math.random() * 1000) + 1);
            browser.setValue('#visitor-first', firstname);
            browser.setValue('#visitor-last', lastname);
            browser.setValue('#visitor-number', phonenumber);
            browser.click('.submit-check-in').pause(1000);


            browser.url("http://emissary-pseudopandas-dev.herokuapp.com/visitors").pause(1000);

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