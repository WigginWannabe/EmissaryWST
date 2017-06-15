/*
 *  Overview:
 *  This test tests the Login page
 *  >Logs in with test account credentials
 *  >Checks to see if now on the visitors page
 */

module.exports = {
  beforeEach: (browser) => {
    browser
    .url('http://emissary-pseudopandas-dev.herokuapp.com/login')
    .waitForElementVisible('body',10000);
  },
  LoginTest: (browser) => {
    //Simple test for logging in (account is already made and in the database)
    browser.setValue('#username',"test@test.com");
    browser.setValue('#password',"password123");
    browser.click('#loginButton').pause(1000);
    browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/visitors");
  },
  after: browser => browser.end(),

};
