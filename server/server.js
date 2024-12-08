require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const { startBuild } = require('./controllers/build_controller');
const errorHandler = require('./middlewares/error_handler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.post('/build', startBuild);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
