require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./app/middleware/errorHandler');
const methodOverride = require('method-override');
const userRoutes = require('./app/routes/userRoutes');
const songRoutes = require('./app/routes/songRoutes');
// const postRoutes = require('./app/routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', 'views');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use('/', songRoutes);
app.use('/users', userRoutes);
// app.use('/posts', postRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
