const TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER;

module.exports =
{
  "src_folders" : ["./client/teste2e"],

  "selenium" : {
    "start_process" : false,
    "server_path" : "",
    "log_path" : "",
    "host" : "127.0.0.1",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : "",
      "webdriver.ie.driver" : "",
      "webdriver.firefox.driver":""
    }
  },

  "test_settings" : {
    "default" : {
      "launch_url" : "http://ondemand.saucelabs.com:80",
      "selenium_port"  : 80,
      "selenium_host"  : "ondemand.saucelabs.com",
      "silent": true,
      "username": "moonyremus",
      "access_key": "3fb9278c-3b5c-48c5-b992-70fae1a86b3a",
      "screenshots" : {
        "enabled" : false,
        "path" : ""
      },
      "desiredCapabilities": {
        "build": "build-${TRAVIS_JOB_NUMBER}",
        "tunnel-identifier": TRAVIS_JOB_NUMBER,
        "browserName": "firefox",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      },
      "chrome": {
  		  "desiredCapabilities": {
  		    "browserName": "chrome",
  		    "platform": "OS X 10.11",
  		    "version": "47"
  		 }
		  },
  		"ie11": {
  		  "desiredCapabilities": {
  		    "browserName": "internet explorer",
  		    "platform": "Windows 10",
  		    "version": "11.0"
  		  }
  		},
      "globals": {
    	"waitForConditionTimeout": 10000
      }
    }
  }

};