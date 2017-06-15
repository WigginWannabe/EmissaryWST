/*
 *  Overview:
 *  This test tests the Login and Employees page.
 *  >Logs in with test account credentials
 *  >Goes to Employees page, checks the first employee are hard-coded values
 *  >Adds a new employee and checks if list has been updated
 */
module.exports = {
  beforeEach: (browser) => {
    browser
    .url('http://emissary-pseudopandas-dev.herokuapp.com/login')
    .waitForElementVisible('body',10000);
  },
  AddingEmployee: (browser) => {
    /*  Testing Account Credentials
    /   Username: test@test.com
    /   Password: password123
    */
    browser.setValue('#username',"test@test.com");
    browser.setValue('#password',"password123");
    browser.click('#loginButton').pause(1000);
    //Login and landing page should be /visitors
    browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/visitors");
    //Checks 4th button on sidebar leads to employees page and clicks
    browser.assert.attributeContains("#main-menu > li:nth-child(4) > a", "href","employees.html");
    browser.click('#main-menu > li:nth-child(4) > a');

    //Employee information (hardcoded because when the account was made)
    browser.assert.containsText("#employee-list tr td:nth-child(1)","Hi");
    browser.assert.containsText("#employee-list tr td:nth-child(2)","Lo");
    browser.assert.containsText("#employee-list tr td:nth-child(3)","1231231232");
    browser.assert.containsText("#employee-list tr td:nth-child(4)","test@test.com");

    //Test adding an employee (randomly generated email b/c database ids by unique emails)
    browser.click('.add-button').pause(1000);
    browser.setValue('#employee-first','tester');
    browser.setValue('#employee-last','testing');
    browser.setValue('#employee-email','testEmail'+Math.floor((Math.random() * 1000) + 1)+"@testing.com");
    browser.setValue('#employee-number','987-645-3210');
    browser.setValue('#employee-pw','1234567899');
    browser.setValue('#employee-confirm-pw','1234567899');

    //Checks if the length of the employee list changes
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
