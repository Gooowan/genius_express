const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const axios = require('axios');
const Users = require("../models/user");

exports.signup = (req, res) => {
    axios.get('http://127.0.0.1:8000/signup/', req.body)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.error(error);
        });
};

exports.login = (req, res) => {
    axios.get('http://127.0.0.1:8000/login/', req.body)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}

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

exports.loginuser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username }).exec();
    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
        return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
        });
    }

    try {
        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 864000000000000
        });

        res.cookie('token', token, { maxAge: 864000000000000, httpOnly: true });

        res.status(200).send({
            message: "User login successfully",
            accessToken: token
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Logout failed' });
    }
}

exports.displayProfile = async (req, res) => {
    const token = req.cookies.token
    console.log(token);
    if (!token) {
        return res.redirect('/login');
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.id;

    try {
        const user = await User.findById(userId).populate('likedSongs');
        console.log('User:', user);
        res.render('profile', { user });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while retrieving user data' });
    }
};