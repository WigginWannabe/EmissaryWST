module.exports = {
    beforeEach: (browser) => {
        browser
            .url('http://emissary-pseudopandas-dev.herokuapp.com/login')
            .waitForElementVisible('body', 10000);
    },
    TestingVistor: (browser) => {
        browser.setValue('#username', "testing@testing.com");
        browser.setValue('#password', "password123");
        browser.click('#loginButton').pause(1000);
        browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/visitors");
        browser.assert.attributeContains("#main-menu li:nth-child(1) a", "href", "visitors");
        browser.click('#main-menu li:nth-child(1)').pause(1000);
        browser.assert.containsText("#visitor-list tr td:nth-child(1)", "First");
        browser.assert.containsText("#visitor-list tr td:nth-child(2)", "Check");
        browser.assert.containsText("#visitor-list tr td:nth-child(3)", "None");
        browser.assert.containsText("#visitor-list tr td:nth-child(4)", "6:11PM");

        browser.click('.dropdown i').pause(1000);
        browser.click('.dropdown-menu li:nth-child(1) a').pause(1000);
        browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/checkin");

        browser.click('#tap-to-check');

        var testerName = 'tester' + Math.floor((Math.random() * 1000) + 1);
        browser.setValue('#visitor-first', testerName);
        browser.setValue('#visitor-last', 'testing' + Math.floor((Math.random() * 1000) + 1));
        browser.setValue('#visitor-number', '' + Math.floor((Math.random() * 1000) + 1));
        browser.click('.submit-check-in').pause(1000);


        browser.url("http://emissary-pseudopandas-dev.herokuapp.com/visitors").pause(1000);

        browser.execute(function(data) {
            return document.getElementById("visitor-list").getElementsByTagName("tr").length;
        }, function(result) {
            var originalLength = result.value;
            browser.assert.containsText('#visitor-list tr:nth-child(' + result.value + ') td:nth-child(1)', testerName);
            browser.click('#visitor-list tr:nth-child(' + result.value + ')').pause(1000);
            browser.assert.containsText('#myModal .modal-dialog .modal-content .modal-body .modal-left p',testerName);
            browser.click('#myModal .modal-dialog .modal-content .modal-footer button:nth-child(1)').pause(1000);

            browser.execute(function(data){
               return document.getElementById("visitor-list").getElementsByTagName("tr").length;
            },function(result){
              this.assert.equal(result.value,originalLength-1);
            });

        });


    },
    after: browser => browser.end(),

};