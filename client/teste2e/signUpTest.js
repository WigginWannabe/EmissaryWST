module.exports = {
    beforeEach: (browser) => {
        browser
            .url('http://emissary-pseudopandas-dev.herokuapp.com/signup')
            .waitForElementVisible('body', 10000);
    },
    InputTest: (browser) => {
        browser.setValue('#form-company-name', "test" + Math.floor((Math.random() * 100000) + 1));
        browser.setValue('#form-email', "test" + Math.floor((Math.random() * 100000) + 1) + "@testing.com");
        browser.setValue('#form-phone', "123-456-7894");
        if (Math.floor((Math.random()) < 0.5)) {
            browser.useXpath().click('//*[@id="sign-up-body"]/div[1]/div/div/div[2]/div/form/fieldset[1]/div[2]/label[1]/input');
        } else {
            browser.useXpath().click('//*[@id="sign-up-body"]/div[1]/div/div/div[2]/div/form/fieldset[1]/div[2]/label[2]/input');
        }
        browser.useCss().click('#submit-company-btn').pause(1000);
        browser.assert.attributeEquals("#sign-up-body > div.top-content > div > div > div:nth-child(2) > div > form > fieldset:nth-child(1)", "style", "display: none;");
        browser.setValue('#form-employee-first', "abc" + Math.floor((Math.random() * 100000) + 1))
        browser.setValue('#form-employee-last', "efg" + Math.floor((Math.random() * 100000) + 1))
        browser.setValue('#form-employee-email', "employee" + Math.floor((Math.random() * 100000) + 1) + "@employee.com")
        browser.setValue('#form-employee-phone', "123-456-7789")
        browser.setValue('#form-password', Math.floor((Math.random() * 100000) + 1))
        browser.setValue('#form-repeat-password', Math.floor((Math.random() * 100000) + 1))
        browser.click('#submit-btn').pause(1000);
        browser.assert.urlEquals("http://emissary-pseudopandas-dev.herokuapp.com/visitors");
    },
    after: browser => browser.end(),
};