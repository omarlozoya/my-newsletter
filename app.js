const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
                status: "subscribed"
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    var options = {
        url: "https://us20.api.mailchimp.com/3.0/lists/" + process.env.MAILCHIMP_ID,
        method: "POST",
        headers: {
            "Authorization": "omar1 " + MAILCHIMP_KEY
        },
        body: jsonData
    }

    request(options, (err, response, body) => {
        if (err) {
            res.sendFile('failure.html');
        } else {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + '/success.html');
            } else {
                res.sendFile(__dirname + '/failure.html');
            }
        }
    });
});

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});