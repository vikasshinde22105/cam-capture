const mongoose = require('mongoose');

var camCaptureSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    picture:{
		type:String,
	}
	
});

camCaptureSchema.pre('save', function (next) {
next();
});

mongoose.model('CamCapture', camCaptureSchema);