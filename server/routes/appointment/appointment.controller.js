'use strict';
/**
 * @module Appointments
 */

/* This module is meant to house the functions
 * used by the authorization (auth) API. The
 * actual API is set up in index.js

 Functions:
 authSignup()
 authLogin()
 authResetCredentials()
 */


/* need this to enable cross origin resource sharing.If disabled, we might
 * not need this later. This is just to get the example to work
 * when front end is served from a something other than our app server.
 */
var Appointment = require('../../models/Appointment');

/****** Company TEMPLATE ROUTES ******/
module.exports.template = {};

/**
 * @function createAppointment
 * @description create an appointment
 * @param first_name first name of patient
 * @param last_name last name of patient
 * @param phone_number phone number
 * @param date date of the appointment
 * @param company_id company the appointment is under
 * @param provider_name patient's provider
 * @example
 * // success response
 * {
 *    _id : "12314125",
 *    first_name : "test",
 *    last_name : "test",
 *    phone_number : "0123456789",
 *    date : "2016-04-23T18:25:43.511Z",
 *    company_id : "12314125",
 *    provider_name : "test test"
 * }
 * @example
 * // error response
 * {
 *  error: "Already Created"
 * }
 * @returns a response indicating either Success or Error
 */
module.exports.template.create = function(req, res) {
    var appointment = new Appointment();
    var param = req.body;

    //require provided info
    appointment.first_name = param.first_name;
    appointment.last_name = param.last_name;
    appointment.phone_number = param.phone_number;
    appointment.date = param.date;
    appointment.end_date = param.end_date;
    appointment.company_id = param.company_id;
    appointment.provider_name = param.provider_name;
    appointment.is_checked_in = 0;

    Appointment.find(
        {
            company_id:param.company_id,
            date:param.date
        }, function(err, appointments){
            if(err) return res.status(400).json({error: "Could Not Find"});
            if(appointments.length==0) {
                appointment.save(function (err, a) {
                    if (err)
                        return res.status(400).json({error: "Could Not Save"});
                    return res.status(200).json(a);
                });
            }else{
                return res.status(400).json({error: "Already Created"});
            }
        });
};


/**
 * @function getAllAppointments
 * @description get all the appointments of the company
 * @param id the company's id
 * @example
 * // success response
 *[
 * {
 *    _id : "12314125",
 *    first_name : "test",
 *    last_name : "test",
 *    phone_number : "0123456789",
 *    date : "2016-04-23T18:25:43.511Z",
 *    company_id : "12314125",
 *    provider_name : "test test"
 * },
 * {
 *    _id : "12314125",
 *    first_name : "test",
 *    last_name : "test",
 *    phone_number : "0123456789",
 *    date : "2016-04-23T18:25:43.511Z",
 *    company_id : "12314125",
 *    provider_name : "test test"
 * }
 *]
 * @example
 * // error response
 * {
 *  error: "Could Not Find"
 * }
 * @returns a response indicating either Success or Error
 */
module.exports.template.getAll = function(req, res) {
    Appointment.find({company_id: req.params.id}, function(err, result){
            if(err){
                return res.status(400).json(err);
            }
            return res.status(200).json(result);
        });
};


/**
 * @function getAppointment
 * @description get an appointment under the company
 * @param id the appointment id
 * @example
 * // success response
 * {
 *    _id : "12314125",
 *    first_name : "test",
 *    last_name : "test",
 *    phone_number : "0123456789",
 *    date : "2016-04-23T18:25:43.511Z",
 *    company_id : "12314125",
 *    provider_name : "test test"
 * }
 * @example
 * // error response
 * {
 *  error: "Could Not Find Appointment"
 * }
 * @returns a response indicating either Success or Error
 */
module.exports.template.get = function(req, res) {
    Appointment.findOne({_id: req.params.id}, function(err, a) {
        if(err || !a)
            return res.status(400).send({error: "Could Not Find Appointment"});
        return res.status(200).json(a);
    });
};

/**
 * @function updateAppointment
 * @description update an appointment under the company
 * @param id the appointment id
 * @param [name] name to be updated
 * @param [phone_number] phone number to be updated
 * @param [date] new appointment date
 * @param [provider] new provider to be updated
 * @example
 * // success response
 * {
 *    _id : "12314125",
 *    first_name : "test",
 *    last_name : "test",
 *    phone_number : "0123456789",
 *    date : "2016-04-23T18:25:43.511Z",
 *    company_id : "12314125",
 *    provider_name : "test test"
 * }
 * @example
 * // error response
 * {
 *  error: "Could Not Find Appointment To Update"
 * }
 * @returns a response indicating either Success or Error
 */
module.exports.template.update = function(req, res){
    Appointment.findOne({_id: req.params.id}, function (err, a) {
        if(err || !a)
            return res.status(401).json({error: "Could Not Find Appointment To Update"});

        if (req.body.first_name !== undefined)
            a.first_name = req.body.first_name;

        if (req.body.last_name !== undefined)
            a.last_name = req.body.last_name;

        if (req.body.phone_number !== undefined)
            a.phone_number  = req.body.phone_number ;

        if (req.body.date!== undefined)
            a.date = req.body.date;

        if (req.body.end_date !== undefined)
            a.date = req.body.end_date;

        if (req.body.provider_name!== undefined)
            a.provider_name = req.body.provider_name;
        //TO check if the date is taken already
        a.save(function(err) {
            if(err) {
                return res.status(400).json({error: "Could Not Save Appointment Update"});
            }
            return res.status(200).json(a);
        });
    });
};


/**
 * @function deleteAppointment
 * @description delete an appointment under the company
 * @param id the appointment id
 * @example
 * // success response
 * {
 *    _id : "12314125",
 *    first_name : "test",
 *    last_name : "test",
 *    phone_number : "0123456789",
 *    date : "2016-04-23T18:25:43.511Z",
 *    company_id : "12314125",
 *    provider_name : "test test"
 * }
 * @example
 * // error response
 * {
 *  error: "Could Not Find Appointment To Delete"
 * }
 * @returns a response indicating either Success or Error
 */
module.exports.template.delete = function(req, res){
    Appointment.findById(req.params.id, function(err, a) {
        if(err)
            res.status(400).json({error: "Could Not Find Appointment To Delete"});
        a.remove(function(err) {
            if(err) {
                res.status(400).json({error: "Could Not Delete Appointment"});
            } else {
                return res.status(200).json(a);
            }
        });
    });
};



/*module.exports.template.getMatch = function(req, res) {
    console.log({_id: req.params.id, first_name: req.params.first_name, 
                        last_name: req.params.last_name, 
                        phone_number: req.params.phone_number});
    Appointment.find({_id: req.params.id, first_name: req.params.first_name, 
                        last_name: req.params.last_name, 
                        phone_number: req.params.phone_number}, function(err, a) {
        if (err) {
            console.log("Appointment could not be found");
            return res.status(400).json(err);
        }
        else {
            console.log("Appointment found");
            return res.status(200).json(a);
        }
    });
}*/

 /*           var company_id = data.company_id;
            var first_name = data.first_name;
            var last_name = data.last_name;
            var phone_num = data.phone_number;
            var apptArray = a.toArray()
            var found = 0;
            for (int i = 0; i < apptArray.length; i++) {
                if (first_name == result.first_name && last_name == result.last_name && phone_num == result.phone_number) {
                   console.log("Found appointment");
                   var found = 1;
                }
            }
            if (!found) {
                console.log("No matching appointment");
            }
*/
