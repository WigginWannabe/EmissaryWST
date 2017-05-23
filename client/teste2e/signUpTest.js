
module.exports = {
  beforeEach: (browser) => {
    browser
    .url('http://emissary-pseudopandas.herokuapp.com/signup')
    .waitForElementVisible('body',10000);
  },
  InputTest: (browser) => {
    browser.setValue('#form-company-name',"test"+Math.floor((Math.random() * 100000) + 1));
    browser.setValue('#form-email',"test"+Math.floor((Math.random() * 100000) + 1)+"@testing.com");
    browser.setValue('#form-phone',"123-456-7894");
    browser.click('#submit-company-btn').pause(1000);
    browser.assert.attributeEquals("form fieldset:nth-child(1)", "style", "display: none;");
    
    browser.setValue('#form-employee-first',"abc"+Math.floor((Math.random() * 100000) + 1))
    browser.setValue('#form-employee-last',"efg"+Math.floor((Math.random() * 100000) + 1))
    browser.setValue('#form-employee-email',"employee"+Math.floor((Math.random() * 100000) + 1)+"@employee.com")
    browser.setValue('#form-employee-phone',"123-456-7789")
    browser.setValue('#form-password',Math.floor((Math.random() * 100000) + 1))
    browser.setValue('#form-repeat-password',Math.floor((Math.random() * 100000) + 1))
    browser.click('#submit-btn').pause(1000);
    browser.assert.urlEquals("http://emissary-pseudopandas.herokuapp.com/visitors");
  },
  after: browser => browser.end(),
};
