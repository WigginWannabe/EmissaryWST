module.exports = {
    beforeEach: (browser) => {
        browser
            .url('http://emissary-pseudopandas-dev.herokuapp.com/login')
            .waitForElementVisible('body', 10000);
    },
    AddingEmployee: (browser) => {

        //login into testing admin account
        browser.setValue('#username', "admin@tests.com");
        browser.setValue('#password', "admin");
        browser.click('#loginButton').pause(1000);

        //check whether login is successful 
        browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/admin-dashboard");

        //check if company dashboard is visible
        browser.isVisible('#companyCount', function(result) {
            this.assert.equal(result.value, true);
        });

        //check if conversion rate dashboard is visible 
        browser.isVisible('#convRate', function(result) {
            this.assert.equal(result.value, true);
        });

        //check if company count is visible 
        browser.isVisible('#companyCount', function(result) {
            this.assert.equal(result.value, true);
        });

        //check if revenue generated is visible
        browser.isVisible('#revenueGenerated', function(result) {
            this.assert.equal(result.value, true);
        });

        //check if google analytics is up
        browser.isVisible('body > div > div.main-content > div:nth-child(4) > div:nth-child(3) > div.tile-title.tile-aqua', function(result) {
            this.assert.equal(result.value, true);
        });

        //check if percentage paid subscription is avaliable
        browser.isVisible('body > div > div.main-content > div:nth-child(4) > div:nth-child(4) > div.tile-stats.tile-blue', function(result) {
            this.assert.equal(result.value, true);
        });

        //check if break down pie chart is avaliable  
        browser.isVisible('#container', function(result) {
            this.assert.equal(result.value, true);
        });
    },
    after: browser => browser.end(),

};