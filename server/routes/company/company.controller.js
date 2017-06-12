'use strict';

/**
 * @module Company
 */

/* This module is meant to house the functions
 * used by the authorization (auth) API. The
 * actual API is set up in index.js

 Functions:
 authSignup()
 authLogin()
 authResetCredentials()
 */


var config = require('../../config/config');

/* need this to enable cross origin resource sharing.If disabled, we might
 * not need this later. This is just to get the example to work
 * when front end is served from a something other than our app server.
 */
var Company = require('../../models/Company');
var jwt = require('jwt-simple');

/****** Company TEMPLATE ROUTES ******/
module.exports.template = {};

/** 
 * @function createCompany
 * @description Use to sign up a company or a user
 * @param name company name
 * @param email company email
 * @param phone_number company phone number
 * @param [credit_card_number] credit card number for payment
 * @param [expiration_date] the expiration date of the card
 * @param paid_time the time in which the company paid their subscription
 * @example
 * // success response
 * {
 *   _id : "12314125"
 *   name : "test",
 *   email : "test",
 *   phone_number : "0123456789",
 *   paid_time: "2016-04-23T18:25:43.511Z"
 *  }
 * @example
 * // error response
 *  {
 *   error: "Company Could Not Be Saved"
 *  }
 * @returns a response indicating either Success or Error
 */
module.exports.template.create = function(req, res) {
    var company = new Company();

    //require provided info
    company.email = req.body.email;
    company.name = req.body.name;
    company.phone_number = req.body.phone_number;
    company.is_paid = req.body.is_paid;
    company.paid_time=new Date();

    //optinal info
    /*company.expiration_date=req.body.expiration_date;
    company.credit_card_number=req.body.credit_card_number;
    */


    company.save(function(err, c) {
        if(err) {
            return res.status(400).json({error: "Company Could Not Be Saved"});
        }
        return res.status(200).json(showCompanyPublicInfo(c));
    });
};



/** 
 * @function getAllCompanies
 * @description get all registered companies
 * @example
 * // success response
 *[
 * {
 *    _id : "12314125",
 *    name : "test",
 *    email : "test",
 *    phone_number : "0123456789",
 *    paid_time: "2016-04-23T18:25:43.511Z"
 * },
 * {
 *    _id : "12314126",
 *    name : "test2",
 *    email : "test2",
 *    phone_number : "01234567890",
 *    paid_time: "2016-04-23T18:26:43.511Z"
 * }
 *]
 * @example
 * // error response
 * {
 *   error: "Getting All Companies Failed"
 * }
 * @returns a response indicating either Success or Error
 */
module.exports.template.getAll = function(req, res) {
    Company.find({},
        {
            credit_card_number:false,
            expiration_date:false
        }
        , function(err, result){
        if(err){
            return res.status(400).json({error: "Getting All Companies Failed"});
        }
        return res.status(200).json(result);
    });
};


/** 
 * @function getCompany
 * @param id the company's id
 * @description Log into the company account
 * @example
 * // success response
 *[
 * {
 *    _id : "12314125",
 *    name : "test",
 *    email : "test",
 *    phone_number : "0123456789",
 *    paid_time: "2016-04-23T18:25:43.511Z"
 * }
 * @example
 * // error response
 * {
 *   error: "Cannot Find Company. Incorrect Credentials"
 * }
 * @returns a response indicating either Success or Error
 */
module.exports.template.get = function(req, res) {
    Company.findOne({_id: req.params.id}, function(err, company) {
        if(err)
            return res.status(400).json({error: "Cannot Find Company. Incorrect Credentials"});
        return res.status(200).json(showCompanyPublicInfo(company));
    });
};


/** 
 * @function updateCompanyInfo
 * @description update the company's basic information
 * @param [name] company name
 * @param [email] company email
 * @param [phone_number] company phone number
 * @example
 * // success response
 * {
 *    _id : "12314125",
 *    name : "test",
 *    email : "test",
 *    phone_number : "0123456789",
 *    paid_time: "2016-04-23T18:25:43.511Z"
 * }
 * @example
 * // error response
 * {
 *   error: "Could Not Find Company To Update"
 * }
 * @returns a response indicating either Success or Error
 */
module.exports.template.update = function(req, res){
    Company.findOne({_id: req.params.id}, function (err, c) {
        if(err || !c)
            return res.status(401).json({error: "Could Not Find Company To Update"});

        //update email
        if (req.body.email !== undefined)
            c.email = req.body.email;

        //update company name
        if (req.body.name !== undefined)
            c.name = req.body.name;

        //update company's phone number
        if (req.body.phone_number !== undefined)
            c.phone_number = req.body.phone_number;

        c.save(function(err) {
            if(err) {
                return res.status(400).json({error: "Could Not Save Company Update"});
            }
            return res.status(200).json(showCompanyPublicInfo(c));
        });
    });
};


/** 
 * @function deleteCompany
 * @description Delete the company
 * @param id company id in the database
 * @example
 * // success response
 * {
 *   _id : "12314125"
 *   name : "test",
 *   email : "test",
 *   phone_number : "0123456789",
 *   paid_time: "2016-04-23T18:25:43.511Z"
 *  }
 * @example
 * // error response
 *  {
 *   error: "Could Not Find Company To Delete"
 *  }
 * @returns a response indicating either Success or Error
 */
module.exports.template.delete = function(req, res){
    Company.findById(req.params.id, function(err, c) {
        if(err)
            res.status(400).json({error: "Could Not Find Company To Delete"});
        c.remove(function(err) {
            if(err) {
                res.status(400).json({error: "Could Not Delete Company"});
            } else {
                return res.status(200).json(showCompanyPublicInfo(c));
            }
        });
    });
};


/** 
 * @function resetCompany
 * @description Reset the company's information
 * @param name company name
 * @param email company email
 * @param phone_number company phone number
 * @example
 * // success response
 * {
 *   _id : "12314125"
 *   name : "test",
 *   email : "test",
 *   phone_number : "0123456789",
 *   paid_time: "2016-04-23T18:25:43.511Z"
 *  }
 * @example
 * // error response
 *  {
 *   error: "Cannot Find Company"
 *  }
 * @example
 * // error response
 *  {
 *   error: "Could Not Save Company Credentials Update"
 *  }
 * @returns a response indicating either Success or Error
 */
module.exports.template.resetCredentials = function(req, res) {
    Company.findOne({email: req.params.user}, function (err, c) {
        if(err || !c)
            return res.status(400).json({error: "Cannot Find Company"});


        // if the user is found but the password is wrong
        if(!c.validPassword(req.body.password))
            return res.status(400).send('loginMessage', 'Oops! Wrong password');
        //update password

        //upadate password
        if (req.body.newpassword !== undefined)
            c.password = c.generateHash(req.body.newpassword);

        //update email
        if (req.body.newemail !== undefined)
            c.email = req.body.newemail;

        //update company name
        if (req.body.new_company_name !== undefined)
            c.company_name = req.body.new_company_name;

        //update company's phone number
        if (req.body.new_company_phone_number !== undefined)
            c.company_phone_number = req.body.new_company_phone_number;

        c.save(function(err) {
            if(err) {
                res.status(400).send({error: "Could Not Save Company Credentials Update"});
            }
        });
        return res.status(200).json(showCompanyPublicInfo(c));
    });
};


/** 
 * @function showCompanyPublicInfo
 * @description show all information about the company
 * @param c the company object
 * @example
 * // success response
 * {
 *   _id : "12314125"
 *   name : "test",
 *   email : "test",
 *   phone_number : "0123456789",
 *   paid_time: "2016-04-23T18:25:43.511Z"
 * }
 * @returns a JSON object with the company's info from within
 */
function showCompanyPublicInfo(c){
    return {
        _id: c._id,
        name: c.name,
        email: c.email,
        phone_number: c.phone_number,
        paid_time: c.paid_time
    }
}
