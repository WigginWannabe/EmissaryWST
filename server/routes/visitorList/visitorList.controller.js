'use strict';

/**
 * @module VisitorList
 */

//Import Resources and Libs

var Email = require('../../notification/email');
var TextModel = require('../../notification/text');

var VisitorList = require('../../models/VisitorList');
var Employee = require('../../models/Employee');
var Appointment = require('../../models/Appointment');

/* handles route for getting the Company's visitor list */
exports.getCompanyVisitorListReq = function(req, res){
    var company_id=req.params.id;
    exports.getCompanyVisitorList(company_id, function(err_msg, result){
        if(err_msg) return res.status(400).json(err_msg);
        if(result == null){
            result = new VisitorList();
            result.visitors = [];
            result.company_id=companyId;
            result.save(function(err){
                return res.status(200).json(result);
            });
        }else {
            return res.status(200).json(result);
        }
    });
};


/**
 * @function getVisitorList
 * @description get the list of visitors of the current day of the company
 * @param id the company's id
 * @example
 * // success response
 * {
 *   _id: "123124124",
 *   company_id: "12312355",
 *   visitors:
 *   [
 *     {
 *      _id: "12314125",
 *      company_id: "12314125",
 *      first_name : "test",
 *      last_name : "test",
 *      phone_number: "21324125",
 *      checkin_time: "2016-04-23T18:25:43.511Z",
 *      appointments:
 *      [
 *       {
 *          _id : "12314125",
 *          name : "test",
 *          phone_number : "0123456789",
 *          date : "2016-04-23T18:25:43.511Z",
 *          company_id : "12314125",
 *          provider_name : "test test"
 *        }
 *      ],
 *      additional_info:
 *       {
 *           allergies: "peanuts",
 *           sex: "male"
 *       }
 *     },
 *     {
 *      _id: "12314125",
 *      company_id: "12314125",
 *      first_name : "test",
 *      last_name : "test",
 *      phone_number: "21324125",
 *      checkin_time: "2016-04-23T18:25:43.511Z",
 *      appointments:
 *      [
 *        {
 *          _id : "12314125",
 *          name : "test",
 *          phone_number : "0123456789",
 *          date : "2016-04-23T18:25:43.511Z",
 *          company_id : "12314125",
 *          provider_name : "test test"
 *        }
 *      ],
 *      additional_info:
 *       {
 *           allergies: "peanuts",
 *           sex: "male"
 *       }
 *     }
 *    ]
 *  }
 * @example
 * // error response
 * {
 *  error: "Error in saving Visitor List"
 * }
 * @returns a response indicating either Success or Error
 */
exports.getCompanyVisitorList = function(company_id, callback){
    if(!company_id)
        return callback({error: "Please send company id."}, null);
    VisitorList.findOne({company_id: company_id}, function(err, list){
        if(err) return callback({error: "Getting Visitor List"}, null);
        if(list==null) {
            list = new VisitorList();
            list.visitors=[];
            list.company_id = company_id;
        }
        list.save(function(err){
            if(err)return callback({error: "Error in saving Visitor List"}, null);
            return callback(null, list);
        });
    });
};

/* handles route to delete visitor in the list*/
exports.deleteVisitorReq = function(req, res){
    var visitor_id=req.params.visitor_id;
    var company_id=req.params.company_id;
    exports.deleteVisitor(company_id, visitor_id, function(err_msg, result){
        if(err_msg)  return res.status(400).json(err_msg);
        return res.status(200).json(result);
    });
};


/**
 * @function deleteVisitor
 * @description delete the visitor off the visitor list
 * @param id the company's id
 * @param visitor_id the visitor's id
 * @example
 * // success response
 * {
 *   _id: "123124124",
 *   company_id: "12312355",
 *   visitors:
 *   [
 *     {
 *      _id: "12314125",
 *      company_id: "12314125",
 *      first_name : "test",
 *      last_name : "test",
 *      phone_number: "21324125",
 *      checkin_time: "2016-04-23T18:25:43.511Z",
 *      appointments:
 *      [
 *       {
 *          _id : "12314125",
 *          name : "test",
 *          phone_number : "0123456789",
 *          date : "2016-04-23T18:25:43.511Z",
 *          company_id : "12314125",
 *          provider_name : "test test"
 *        }
 *      ],
 *      additional_info:
 *       {
 *           allergies: "peanuts",
 *           sex: "male"
 *       }
 *     }
 *    ]
 *  }
 * @example
 * // error response
 * {
 *  error: "Error in deleting visitor."
 * }
 * @returns a response indicating either Success or Error
 */
exports.deleteVisitor = function(company_id, visitor_id, callback){
    if(!company_id)
        return callback({error: "Please send company id."}, null);
    if(!visitor_id)
        return callback({error: "Please send visitorList id."}, null);
    VisitorList.findOneAndUpdate(
        {company_id: company_id},
        {$pull: {visitors:{_id:visitor_id}}},
        {safe: true, upsert: true, new:true}, function(err, data){
            if(err) return callback({error: "Error in deleting visitor."}, null);
            return callback(null, data);
        });
};

/**
 * @function clearVisitorList
 * @description clear the list of visitors of the current day of the company
 * @param id the company's id
 * @example
 * // success response
 * {
 *   _id: "123124124",
 *   company_id: "12312355",
 *   visitors: []
 * @returns a response indicating either Success or Error
 */
exports.deleteReq = function(req, res){
    var list_id=req.params.id;
    exports.delete(list_id, function(err_msg, result){
        if(err_msg)  return res.status(400).json(err_msg);
        return res.status(200).json(result);
    });
};


/**
 * @function clearAVisitor
 * @description clear a visitor of the current day of the company
 * @param id the company's id
 * @param visitor_id the visitor's id
 * @example
 * // success response
 * {
 *   _id: "123124124",
 *   company_id: "12312355",
 *   visitors:
 *   [
 *     {
 *      _id: "12314125",
 *      company_id: "12314125",
 *      first_name : "test",
 *      last_name : "test",
 *      phone_number: "21324125",
 *      checkin_time: "2016-04-23T18:25:43.511Z",
 *      appointments:
 *      [
 *       {
 *          _id : "12314125",
 *          name : "test",
 *          phone_number : "0123456789",
 *          date : "2016-04-23T18:25:43.511Z",
 *          company_id : "12314125",
 *          provider_name : "test test"
 *        }
 *      ],
 *      additional_info:
 *       {
 *           allergies: "peanuts",
 *           sex: "male"
 *       }
 *     }
 *    ]
 *  }
 * @example
 * // error response
 * {
 *  error: "Can't find company while deleting a visitor."
 * }
 * @returns a response indicating either Success or Error
 */
exports.delete = function(list_id, callback){
    if(!list_id)
        return callback({error: "Please send list id."}, null);
    VisitorList.findOne({_id: list_id}, function(err, list){
        if(err || list==null) return callback({error: "Can't find company while deleting a visitor."}, null);
        list.visitors=[];
        list.save(function(err){
            if(err) return callback({error: "Can't save while deleting a visitor."}, null);
            return callback(null, list);
        });
    });
};

// This route will be called when a visitor checks in
exports.createReq = function(req, res) {
    exports.create(req.body, function(err_msg, result){
        if(err_msg)  return res.status(400).json(err_msg);
        return res.status(200).json(result);
    });
};


/**
 * @function addVisitor
 * @description add a visitor to the visitor list
 * @param company_id the company's id
 * @param first_name first name of visitor
 * @param last_name last name of visitor
 * @param phone_number phone number of visitor
 * @param checkin_time check-in time
 * @param [additional_info] additional info about the visitor
 * @example
 * // success response
 * {
 *   _id: "123124124",
 *   company_id: "12312355",
 *   visitors:
 *   [
 *     {
 *      _id: "12314125",
 *      company_id: "12314125",
 *      first_name : "test",
 *      last_name : "test",
 *      phone_number: "21324125",
 *      checkin_time: "2016-04-23T18:25:43.511Z",
 *      appointments:
 *      [
 *       {
 *          _id : "12314125",
 *          name : "test",
 *          phone_number : "0123456789",
 *          date : "2016-04-23T18:25:43.511Z",
 *          company_id : "12314125",
 *          provider_name : "test test"
 *        }
 *      ],
 *      additional_info:
 *       {
 *           allergies: "peanuts",
 *           sex: "male"
 *       }
 *     },
 *     {
 *      _id: "12314125",
 *      company_id: "12314125",
 *      first_name : "test",
 *      last_name : "test",
 *      phone_number: "21324125",
 *      checkin_time: "2016-04-23T18:25:43.511Z",
 *      appointments:
 *      [
 *        {
 *          _id : "12314125",
 *          name : "test",
 *          phone_number : "0123456789",
 *          date : "2016-04-23T18:25:43.511Z",
 *          company_id : "12314125",
 *          provider_name : "test test"
 *        }
 *      ],
 *      additional_info:
 *       {
 *           allergies: "peanuts",
 *           sex: "male"
 *       }
 *     }
 *    ]
 *  }
 * @example
 * // error response
 * {
 *  error: "Error getting Visitor List"
 * }
 * @returns a response indicating either Success or Error
 */
exports.create = function(param, callback){
    //required fields
    var company_id = param.company_id;
    var first_name = param.first_name;
    var last_name = param.last_name;
    var phone_number = param.phone_number;
    var checkin_time = param.checkin_time;

    //optional dic var
    var additional_info = param.additional_info;

    // find all the appointments for this visitor
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var tomorrow= new Date();
    tomorrow.setDate(today.getDate()+1);
    tomorrow.setHours(0, 0, 0, 0);

    var query=
    {
        company_id: company_id,
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        date: {$gte:today, $lt: tomorrow}
    };

    Appointment.find(query, function(err, appointments){
        var visitor =
        {
            company_id: company_id,
            last_name: last_name,
            first_name: first_name,
            phone_number: phone_number,
            checkin_time: checkin_time,
            additional_info: additional_info,
            appointments: appointments
        };
        VisitorList.findOne(
            {company_id: company_id},
            function(err, list) {
                if(err)
                    return callback({error: "Error getting Visitor List"}, null);
                if(list==null) {
                    list = new VisitorList();
                    list.visitors=[];
                    list.company_id = company_id;
                }
                list.visitors.push(visitor);
                list.save(function(err){
                    if(err) return callback({error: "Error saving while creating Visitor List"}, null);
                    return callback(null, list);
                    /*Employee.find({company : req.body.company_id},
                     function(err, employees) {
                     var i = 0;
                     var respond = function() {
                     i++;
                     if(i == employees.length) {
                     res.status(200).json(list);
                     }
                     };

                     Email.sendEmail(req.body.name, employees, function(){respond();});
                     TextModel.sendText(req.body.name, employees, function(){respond();});
                     }
                     );*/
                });
            }
        );
    });
};

