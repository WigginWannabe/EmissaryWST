# Team #17: PseudoPandas


## Deployment Site: 
http://emissary-pseudopandas-dev.herokuapp.com/


## What is Emissary:
**-	Emissary is a visitor check-in SaaS (software as a service) application designed for small businesses. A few steps to get started with the application:**
1.	Sign up and create a personal account for your own company.
2.	Log in to add employees to your company through the "Employees" section in order to provide them access to the application under your company’s account.
3.	Create new appointments through the "Schedule" page.
4.	Open up the “Check-in” page from the left menu panel to have visitors check in.
  a.	As visitor checks in, his/her name will be added to the queue on the "Visitors" page.
  b.	If an appointment matches the visitor’s information, his/her appointment time will automatically be populated in the queue.
5.	Click on a visitor from the “Visitors” page to check him/her out. If he/she had an appointment, their appointment will automatically be removed from the "Appointments" section.


## Tools Required for the Application:
1. **Node.js** (http://nodejs.org/)
2. **MongoDB** (https://www.mongodb.org/)
3. **HandleBars** (http://handlebarsjs.com/)
4. **jQuery** (https://jquery.com/)


## PseudoPandas' General Pipeline:
https://drive.google.com/file/d/0B3ukuBLkHqb3U1FjT0xPcGNCQ3M/view?usp=sharing

#### GitHub-specific Pipeline
https://drive.google.com/file/d/0B3ukuBLkHqb3VTdLazZSZDBIeVk/view?usp=sharing


## Peter's Dashboard Account:
Username: **peter@admin.com**
Password: **admin**


## Emissary Manual, Requirements, Overview
https://docs.google.com/document/d/19A0_Z7wwmyeMRsl_kKpeolrZBhVv8YJWoBwIikqI3a0/edit?usp=sharing


## Instructions to Get Started:
**Step 1:** Do a `git clone` on our project on **Github** (https://github.com/WigginWannabe/EmissaryWST).

**Step 2:** Run `npm install` in the directory of the project to install the dependencies for the backend.

**Step 3:** Run `npm start` to start the application.

**Step 4:** Run `npm run document` to generate JSDoc documentation, "index.html", inside of docs/ directory.


## Testing Instructions for e2e Testing:
*Note that nightwatch should be installed with `npm install`. These tests are from the "client/teste2e" folder.

### Method 1 (Steps to run testing on SauceLabs)
**Step 1:** In nightwatch.js and .travis.yml, change the SauceLabs credentials to your own.

**Step 2:** Run this command from the home directory to run e2e testing on SauceLabs: `nightwatch --config nightwatch.js`.

### Method 2 (Steps to Run tests locally):
**Step 1:** Install **Selenium**.

**Step 2:** Run `nightwatch --config nightwatch.json`.
 
