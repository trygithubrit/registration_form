const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('docs'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/Database')
var db = mongoose.connection;

db.on('error', () => console.error("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    phno: String,
    gender: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.post("/sign_up", async (req, res) => {
    try {
        const { name, age, email, phno, gender, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send(`
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f8f9fa;
                                text-align: center;
                                padding: 50px;
                            }
                            h1 {
                                color: #dc3545;
                            }
                            p {
                                font-size: 18px;
                                color: #6c757d;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>User Already Registered</h1>
                        <p>The provided email address is already registered. Please log in or use a different email for registration.</p>
                    </body>
                </html>
            `);
        }


        const newUser = new User({
            name,
            age,
            email,
            phno,
            gender,
            password
        });

        await newUser.save();

        console.log("Record Inserted Successfully");
        return res.redirect('signup_successful.html');
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/", (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
