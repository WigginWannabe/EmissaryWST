

module.exports = {
  beforeEach: (browser) => {
    browser
    .url('http://emissary-pseudopandas-dev.herokuapp.com/login')
    .waitForElementVisible('body',10000);
  },
  AddingAppointment: (browser) => {
    browser.setValue('#username',"testing@testing.com");
    browser.setValue('#password',"password123");
    browser.click('#loginButton').pause(1000);
    browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/visitors");
    browser.assert.attributeContains("#main-menu li:nth-child(3) a", "href","appointments.html");
    browser.click('#main-menu li:nth-child(3)');
    browser.assert.containsText("#appt-list tr td:nth-child(1)","Hello");
    browser.assert.containsText("#appt-list tr td:nth-child(2)","World");
    browser.assert.containsText("#appt-list tr td:nth-child(3)","Panda");
    browser.assert.containsText("#appt-list tr td:nth-child(4)","123-456-7890");
    browser.assert.containsText("#appt-list tr td:nth-child(5)","03/14/1596");
    browser.assert.containsText("#appt-list tr td:nth-child(6)","1:00AM");
    browser.click('.add-button').pause(1000);
    browser.setValue('#appt-first','tester'+Math.floor((Math.random() * 1000) + 1));
    browser.setValue('#appt-last','testing'+Math.floor((Math.random() * 1000) + 1));
    browser.setValue('#appt-number',''+Math.floor((Math.random() * 1000) + 1));
    browser.setValue('#appt-provider','ABC'+Math.floor((Math.random() * 1000) + 1));
    browser.setValue('#appt-date','5/30/17');
    browser.setValue('#appt-time','8:00');
    browser.execute(function(data) {
      return document.getElementById("appt-list").getElementsByTagName("tr").length;
    },function(result){
      var originalLength = result.value;
      browser.click('.save-btn').pause(1000);
      browser.execute(function(data){
          return document.getElementById("appt-list").getElementsByTagName("tr").length;
      },function(result){
        this.assert.equal(result.value-1,originalLength);
        browser.click('#appt-list tr:nth-child('+result.value+') td:nth-child(6) i').pause(1000);
        browser.execute(function(data){
        	return document.getElementById("appt-list").getElementsByTagName("tr").length;
        },function(result){
        	this.assert.equal(result.value,originalLength);
        });
      });
    });

  },
  after: browser => browser.end(),

};
