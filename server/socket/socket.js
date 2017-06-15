'use strict';

var express = require('express');
var server;
var io = require('socket.io')();
var exports = module.exports;

//Constants for listening to Sockets
var CONNECTION = "connection";
var VALIDATE_COMPANY_ID = "validate_company_id";
var VISITOR_LIST_UPDATE = "visitor_list_update";
var DISCONNECT = "disconnect";
var REMOVE_VISITOR = "remove_visitor";
var ADD_VISITOR = "add_visitor";
var NOTIFY_ERROR = "notify_error";
var GET_APPOINTMENT = "get_appointment";
var NOT_FOUND = "Appointment not found.\n Please schedule an appointment.";
var NOT_30MIN = "Appointment is not within 30 minutes.\n Please try again later.";
var PASSED = "Appointment time has passed.\n Please schedule another appointment.";
var MIN30SEC = 1800000;
var error_msg = false;

var AppointmentCtr = require('../routes/appointment/appointment.controller');
var VisitorListCtr = require('../routes/visitorList/visitorList.controller');
var Company = require('../models/Company');
var Appointment = require('../models/Appointment');
/********** Socket IO Module **********/
exports.createServer = function(io_in) {
    io = io_in;

    /*
     * This handles the 'connection' event, which is send when the user is
     * trying to connect a socket.
     *
     * Note that when the connection is established for that client,
     * the '_admin_id' needs to be set so that the client can be added to the
     * room and notified when changes are being made.
     */
    io.on(CONNECTION, function (socket) {
        console.log("SOCKET CONNECTED");

        /* company_id is required to connect to join right socket to listen to*/
        socket.on(VALIDATE_COMPANY_ID, function(data){
            console.log(data);
            var company_id = data.company_id;
            Company.findOne({_id: company_id}, function(err, c){
                if(err || !c)
                    return;
                else {
                    socket.join(company_id);
                    VisitorListCtr.getCompanyVisitorList(company_id, function(err_msg, result){
                        if(err_msg)
                            exports.notifyError(company_id, {error: err_msg});
                        else {
                            exports.notifyNewList(company_id, result);
                        }

                    });
                }
            });
        });

        //requires the company_id to be sent
        socket.on(VISITOR_LIST_UPDATE, function(data) {
            var company_id = data.company_id;
            console.log("Appointment " + data);
            AppointmentCtr.getToday(company_id, function(err_msg, result) {
                console.log(result);
                if (err_msg) {
                    exports.notifyError(company_id, {error: err_msg});
                }
                else
                    exports.notfiyNewList(company_id,result);
            });


            // VisitorListCtr.getCompanyVisitorList(company_id, function(err_msg, result){
            //     if(err_msg) {
            //         exports.notifyError(company_id, {error: err_msg});
            //     }
            //     else
            //         exports.notifyNewList(company_id, result);
            // });
        });

        socket.on(DISCONNECT, function() {
            // console.log('user disconnected from ' + company_id);
        });

        //requires the company_id and visitor_id to be sent
        socket.on(REMOVE_VISITOR, function(data) {
            console.log(data.company_id);
            var company_id = data.company_id;
            var visitor_id = data.visitor_id;
            if(!company_id ||  !visitor_id) return;
            VisitorListCtr.deleteVisitor(company_id, visitor_id, function(err_msg, result){
                if(err_msg){
                    console.log("error");
                    exports.notifyError(company_id, {error: err_msg});
                }
                else
                    exports.notifyNewList(company_id, result);

            });
        });

        //require the params to be set with info of the visitor
        socket.on(ADD_VISITOR, function(data) {
            console.log("LOOKING FOR APPOINTMENT");
            var company_id = data.company_id;
            var appt = getMatch(socket, data);
            if (error_msg != false) {
                console.log(error_msg);
                exports.notifyError(company_id, {error: error_msg});
            }

        });

        /*socket.on(GET_APPOINTMENT, function(data) {
            console.log("please print");
            if (data.error) {
                alert("error occured when getting appointment");
            }
            else {
                alert("checkin success");
            }
        });*/
    });
        //socket.on(GET_APPOINTMENT, function (data) {});
    return server;
};

var getMatch = function(socket, data) {
    console.log(data.company_id);

    Appointment.find({first_name: data.first_name, 
                        last_name: data.last_name, 
                        company_id: data.company_id}, function(err, a) {
        if (err) {
            console.log("Appointment could not be found");
            error_msg = NOT_FOUND;
        }
        else {
            console.log(a);
            /* Check if appointment time is today */
            if (!a.length) {
                console.log("No matching appointments");
                error_msg = NOT_FOUND;
            }
            else {
                console.log("Appointment found");
                var closest = Number.MAX_VALUE;
                var date = null;
                var curr = a[0].date;
                var now = new Date();
                var timeLeft = 0;
                var apptToCheckin = null;
                // Loop through list of appointments to find closest one within 
                // 30 minutes of the current time right now
                for (var i = 0; i < a.length; i++) {
                    curr = a[i].date;
                    timeLeft = Date.parse(curr) - Date.parse(now)
                    if (timeLeft >= (-MIN30SEC)) {
                        if (Date.parse(curr) < closest) {
                            date = curr;
                            apptToCheckin = i;
                        }
                    }
                }
                console.log(date);
                timeLeft = Date.parse(date) - Date.parse(now)
                if (date == null) {
                    console.log("Could not find an appointment");
                    error_msg = true;
                }
                if (timeLeft < (-MIN30SEC)) {
                    console.log("appointment passed time");
                    error_msg = PASSED;
                }
                else if (timeLeft <= MIN30SEC) {
                    console.log("appointment confirmed");
                    a[apptToCheckin].is_checked_in = true;
                    a[apptToCheckin].save( function(err) {

                        if (err) {
                            console.log("hi error");
                            socket.emit(GET_APPOINTMENT, { error: err });
                        } 
                        else {
                            console.log("hi not error :" + a[apptToCheckin]);
                            socket.emit(GET_APPOINTMENT, { succes: true });
                        }
                    })
                    error_msg = false;
                }
                else {
                    console.log("Not within 30 minutes before appointment");
                    error_msg = NOT_30MIN;
                }

            }
            if (error_msg) {
                socket.emit(GET_APPOINTMENT, { error: error_msg });
            }
            else {
                console.log("ADDING VISITOR");
                //console.log(data);
                //console.log(data.company_id);
                var company_id = data.company_id;
                VisitorListCtr.create(data, function(err_msg, result){
                    if(err_msg){
                        console.log("error");
                        exports.notifyError(company_id, {error: err_msg});
                    }
                    else {
                        console.log(result);
                        exports.notifyNewList(company_id, result);
                    }
                });
            }
        }
    });
}



/*
 * A function that allows you to notify all clients that
 * the queue has been updated.
 *
 * The client side needs to be listening for the 'queue_updated' event. When
 * this event is triggered, the client side can retrieve the whole queue of
 * patients to reflect the changes.
 */
exports.notifyNewList = function(company_id, data) {
    io.to(company_id).emit(VISITOR_LIST_UPDATE, data);
};

exports.notifyError = function(company_id, data) {
    io.to(company_id).emit(NOTIFY_ERROR, data);
};

/*
 * Set up a custom namespace.
 *
 * On the client side get the socket as follows to robobetty:
 *   var socket = io('/visitorList');
 */
var nsp = io.of('/visitorList');

// To be used with authorization.
// io.set('authorization', socketioJwt.authorize({
//   secret: jwtSecret,
//   handshake: true
// }));