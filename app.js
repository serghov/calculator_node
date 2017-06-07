const Gpio = require('chip-gpio').Gpio;
const NodeWebcam = require("node-webcam");
const SerialPort = require("serialport");
const request = require('request');

const btn = new Gpio(7, 'in', 'both', {debounceTimeout: 1000});


const exit = () => {
	btn.unexport();
	process.exit();
};

process.on('SIGINT', exit);

const opts = {
	width: 1280,
	height: 720,
	quality: 100,
	delay: 0,
	saveShots: true,
	output: "jpeg",
	device: false,
	callbackReturn: "location",
	verbose: false
};

const Webcam = NodeWebcam.create(opts);

Webcam.capture("test_picture", function (err, data) {
});

NodeWebcam.capture("test_picture", opts, function (err, data) {

});

//Return type with base 64 image

const c_opts = {
	callbackReturn: "base64"
};


const port = new SerialPort("/dev/ttyS0", {
	baudRate: 9600,
}, (err) => {
	console.log('open');
	let n = 0;
	// setInterval(()=>{
	// 	n++;
	// 	port.write('number is ' + n + '\n');
	// }, 1000);

	// todo: add delay so we wait some time after button
	btn.watch((err, value) => {
		port.write('taking a picture number' + n++ + '\n');
		NodeWebcam.capture("test_picture", c_opts, function (err, data) {
			console.log(data);
			const image = "<img src='" + data + "'>";

		});


	});

	const doRequest = () => {
		request.get('http://serghov.com/petakan/data.txt', {}, function (err, res, body) {
			if (err) {
			} //TODO: handle err
			if (res.statusCode !== 200) {
			} //etc
			port.write(body);

			setTimeout(doRequest, 3000);
		});
	};


});

port.on('data', function (data) {
	console.log('Data: ' + data);
});