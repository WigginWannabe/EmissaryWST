/*
 * GET home page.
 */
 
exports.init = function(req, res){
		var slack = req.app.get('slack');
		var message = "Name: " + req.param("first") + " " + req.param("last") + " || Appointment Time: "+ req.param("appointment_time");
		if(req.param("first") !== undefined)
		{
			slack.send({
 				channel: '#checkin',
  				text: message,
  				username: 'CheckInBot'
			});
		}
		res.render('checkin');
};
exports.view = function(req, res){
		var slack = req.app.get('slack');
		
		res.render('checkin');
};

exports.post = function(req, res) {
	
	var query = { first_name: data['first_name'], last_name: data['last_name'], 
    phone_number: data['phone_number'], date: data['checkin_time'] };
    db.collection("appointments").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.render('checkin');
        db.close();
	});	

}