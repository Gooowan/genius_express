const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const axios = require('axios');

exports.signup = (req, res) => {
    axios.get('http://127.0.0.1:8000/signup/', req.body)
        .then(response => {
            res.send(response.data);

            // if (!response.data.password) {
            //     return res.status(400).send({ message: 'Password is required' });
            // }
            //
            // const user = new User({
            //     fullName: response.data.username,
            //     role: response.data.role,
            //     password: bcrypt.hashSync(response.data.password, 8)
            // });
            //
            // user.save((err, user) => {
            //     if (err) {
            //         res.status(500)
            //             .send({
            //                 message: err
            //             });
            //         return;
            //     } else {
            //         res.status(200)
            //             .send({
            //                 message: "User Registered successfully"
            //             })
            //     }
            // })
        })
        .catch(error => {
            console.error(error);
        });
};

exports.saveuser = (req, res) => {
    const { username, role, password } = req.body;
    console.log(req.body);

    const user = new User({
        username: username,
        role: role,
        password: bcrypt.hashSync(password, 8)
    });
    // console.log(user);
    user.save()
        .then(() => {
            res.status(200).send({ message: "User saved successfully" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });

};

exports.login = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .exec((err, user) => {
            if (err) {
                res.status(500)
                    .send({
                        message: err
                    });
                return;
            }
            if (!user) {
                return res.status(404)
                    .send({
                        message: "User Not found."
                    });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401)
                    .send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
            }
            const token = jwt.sign({
                id: user.id
            }, process.env.API_SECRET, {
                expiresIn: 86400
            });

            res.status(200)
                .send({
                    user: {
                        id: user._id,
                        email: user.email,
                        fullName: user.fullName,
                    },
                    message: "Login successfull",
                    accessToken: token,
                });
        });
};