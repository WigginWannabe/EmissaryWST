module.exports = {
  beforeEach: (browser) => {
    browser
    .url('http://emissary-pseudopandas.herokuapp.com/login')
    .waitForElementVisible('body',10000);
  },
  LoginTest: (browser) => {
    browser.setValue('#username',"testing@testing.com");
    browser.setValue('#password',"password123");
    browser.click('#loginButton').pause(1000);
    browser.assert.urlEquals("http://emissary-pseudopandas.herokuapp.com/visitors");

  },
  after: browser => browser.end(),

};
