const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let email = req.body.email;

	let data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	let jsonData = JSON.stringify(data);

	const url = "https://us11.api.mailchimp.com/3.0/lists/77f72f4a6b";
	const options = {
		method: "POST",
		auth: "jessica:6f3594ece6106a05a1725eb5433bb46f-us11",
	};

	const request = https.request(url, options, function (response) {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", function (data) {
			console.log(JSON.parse(data));
		});
	});

	request.write(jsonData);
	request.end();
});

app.post("/failure", function (req, res) {
	res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Server is running on port " + port);
});

// API Key
// 6f3594ece6106a05a1725eb5433bb46f-us11

// List Id
// 77f72f4a6b
