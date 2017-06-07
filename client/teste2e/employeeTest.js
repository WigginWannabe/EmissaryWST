module.exports = {
  beforeEach: (browser) => {
    browser
    .url('http://emissary-pseudopandas-dev.herokuapp.com/login')
    .waitForElementVisible('body',10000);
  },
  AddingEmployee: (browser) => {
    browser.setValue('#username',"testing@testing.com");
    browser.setValue('#password',"password123");
    browser.click('#loginButton').pause(1000);
    browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/visitors");
    browser.assert.attributeContains("#main-menu li:nth-child(2) a", "href","employees.html");
    browser.click('#main-menu li:nth-child(2)');
    browser.assert.containsText("#employee-list tr td:nth-child(1)","admin");
    browser.assert.containsText("#employee-list tr td:nth-child(2)","tester");
    browser.assert.containsText("#employee-list tr td:nth-child(3)","123-456-7891");
    browser.assert.containsText("#employee-list tr td:nth-child(4)","testing@testing.com");
    browser.click('.add-button').pause(1000);
    browser.setValue('#employee-first','tester');
    browser.setValue('#employee-last','testing');
    browser.setValue('#employee-email','testEmail'+Math.floor((Math.random() * 1000) + 1)+"@testing.com");
    browser.setValue('#employee-number','987-645-3210');
    browser.setValue('#employee-pw','1234567899');
    browser.setValue('#employee-confirm-pw','1234567899');
    browser.execute(function(data) {
      return document.getElementById("employee-list").getElementsByTagName("tr").length;
    },function(result){
      var originalLength = result.value+1;
      browser.click('.save-btn').pause(1000);
      browser.execute(function(data){
          return document.getElementById("employee-list").getElementsByTagName("tr").length;
      },function(result){
        this.assert.equal(result.value,originalLength);
      });
    });

  },
  after: browser => browser.end(),

};
