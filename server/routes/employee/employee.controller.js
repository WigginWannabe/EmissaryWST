'use strict';

/** 
 * @module Employee
 */

/*
 * This module is meant to house all of the API
 * routes that pertain to users
 */
var exports = module.exports;

var Employee = require('../../models/Employee');


/**
 * @function employeeLogin
 * @description log in as an employee of the company
 * @param email employee's email
 * @param password employee's password
 * @example
 * // success response
 * {
 *   id : "12314125",
 *   email : "test@yahoo.com",
 *   phone_number : "6581922344"
 *   role : "a_admin"
 * }
 * @example
 * // error response
 * {
 *  error: "Incorrect Credentials"
 * }
 * @returns a response indicating either Success or Error
 */
exports.login = function(req, res) {
    var loginTime = new Date();

    Employee.findOne({email:req.body.email}, function(err, e) {
        if(err || !e){
          return res.status(400).send({error: "Can not Find"});
        }
        if(!e.validPassword(req.body.password)) {
          return res.status(400).send({error: "Incorrect Credentials"});
        }
        e.last_login = loginTime;
        e.save(function(err, updatedEmployee) {
            if (err || !e) {
                return res.status(400).send({error: "/login: Error saving login time"});
            }

            var employee_json = updatedEmployee.toJSON();
            delete employee_json.password;
            return res.status(200).json(employee_json);
        });
    });
};


/**
 * @function getAllEmployees
 * @description get all the employees of the company
 * @param id the company's id
 * @example
 * // success response
 *[
 * {
 *    id : "12314125",
 *    email : "test",
 *    phone_number : "0123456789",
 *    role : "a_admin"
 *    company_id: "12314125"
 * },
 * {
 *    id : "12314125",
 *    email : "test",
 *    phone_number : "0123456789",
 *    role : "a_admin"
 *    company_id: "12314125"
 * }
 *]
 * @example
 * // error response
 * {
 *  error: "Cannot Find"
 * }
 * @returns a response indicating either Success or Error
 */
exports.getAllEmployees = function(req, res) {
  Employee.find({company_id : req.params.id}, { password: 0}, function(err, result) {
    if(err){
      return res.status(400).send({error: "Cannot Find"});
    }
    return res.status(200).json(result);
  });
};


/**
 * @function getEmployee
 * @description get the employee by his/her id
 * @param id the employee's id
 * @example
 * // success response
 * {
 *    id : "12314125",
 *    email : "test",
 *    phone_number : "0123456789",
 *    role : "a_admin"
 *    company_id: "12314125"
 * }
 * @example
 * // error response
 * {
 *  error: "Cannot Find"
 * }
 * @returns a response indicating either Success or Error
 */
exports.getById = function(req, res) {
   Employee.findById(req.params.id, { password: 0}, function(err, employee) {
      if(err) {
          return res.status(400).json({error: "Cannot Find"});
      } else {
          console.log(employee);
          return res.status(200).json(employee);
      }
    });
};


/** 
 * @function createEmployee
 * @description Create an employee in a company. A role is required:
 * c_admin: company admin,
 * a_admin: app administrator,
 * c_receptionist: compay receptionist,
 * c_employee: company employee
 * @param name employee's name
 * @param email employee's email
 * @param phone_number employee's phone number
 * @param company_id id of the company
 * @param password password associated with the employee
 * @param role the employee's role
 * @example
 * // success response
 * {
 *   id : "12314125"
 *   email : "test",
 *   phone_number : "0123456789",
 *   role: "a_admin"
 *  }
 * @example
 * // error response
 *  {
 *   error: "Cannot save"
 *  }
 * @returns a response indicating either Success or Error
 */
exports.insert = function(req, res) {
    var employee = new Employee();

    /* required info */
    employee.first_name = req.body.first_name;
    employee.last_name = req.body.last_name;
    employee.email = req.body.email,
    employee.phone_number  = req.body.phone_number,
    employee.company_id = req.body.company_id,
    employee.password = employee.generateHash(req.body.password),
    employee.role =  req.body.role;

    employee.save(function(err, e) {
        if(err) {
            return res.status(400).json({error: "Cannot Save"});
        }
        var employee_json=e.toJSON();
        delete employee_json.password;
        return res.status(200).json(employee_json);
    });
};


/** 
 * @function updateEmployee
 * @description update the employee's information
 * @param [name] employee's name
 * @param [email] employee's email
 * @param [password] employee's password
 * @param [phone_number] employee's phone number
 * @param [role] employee's role
 * @example
 * // success response
 * {
 *    id : "12314125",
 *    email : "test",
 *    phone_number : "0123456789",
 *    role : "a_admin"
 *    company_id: "12314125"
 * }
 * @example
 * // error response
 * {
 *  error: "Cannot Update"
 * }
 * @example
 * // error response
 * {
 *  error: "Cannot Save"
 * }
 * @returns a response indicating either Success or Error
 */
exports.update = function(req, res) {
    Employee.findById(req.params.id, function (err, employee) {
        if(err)
            return res.status(400).json({error: "Cannot Update"});
 
        employee.first_name = req.body.first_name || employee.first_name;
        employee.last_name = req.body.last_name || employee.last_name;
        employee.email = req.body.email || employee.email;
        employee.phone_number = req.body.phone_number || employee.phone_number;
        employee.password = employee.generateHash(req.body.password) || employee.password;
        employee.role = req.body.role || employee.role;

        employee.save(function(err) {
            console.log(err);
            console.log(employee);
            if(err)
                return res.status(400).json({error: "Cannot Save"});
            var employee_json=employee.toJSON();
            delete employee_json.password;
            return res.status(200).send(employee_json);
        });
   });
};


/** 
 * @function deleteEmployee
 * @description delete the employee from the company
 * @param id employee's id
 * @example
 * // success response
 * {
 *    id : "12314125",
 *    email : "test",
 *    phone_number : "0123456789",
 *    role : "a_admin"
 *    company_id: "12314125"
 * }
 * @example
 * // error response
 * {
 *  error: "Cannot Find"
 * }
 * @returns a response indicating either Success or Error
 */
exports.delete = function(req, res) {
  Employee.findById(req.params.id, function(err, employee) {
    return employee.remove(function(err) {
      if(err) {
        res.status(400).json({error: "Cannot Find"});
      } else {
          var employee_json=employee.toJSON();
          delete employee_json.password;
          return res.status(200).send(employee_json);
      }
    });
  });
};
