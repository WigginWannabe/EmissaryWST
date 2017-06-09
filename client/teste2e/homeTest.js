
module.exports = {
  beforeEach: (browser) => {
    browser
    .url('http://emissary-pseudopandas-dev.herokuapp.com')
    .waitForElementVisible('body',10000);
  },
  HeaderVisibility: (browser) => {
    browser.assert.attributeContains("#main-menu li a", "href","index.html");
    browser.assert.attributeContains("#main-menu li:nth-child(2) a", "href","#features");
    browser.assert.attributeContains("#main-menu li:nth-child(3) a", "href","#pricing");
    browser.assert.attributeContains("#main-menu li:nth-child(4) a", "href","http://emissary-pseudopandas-dev.herokuapp.com/login.html");
    browser.assert.attributeContains("#main-menu li:nth-child(5) a", "href","http://emissary-pseudopandas-dev.herokuapp.com/signup.html");

  },
  after: browser => browser.end(),

};
