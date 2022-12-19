const express = require('express')
const app = express()
const cors = require('cors')
const compression = require('compression')
const path = require('path')
const Sequelize = require('sequelize')
const https = require('https');
const axios = require('axios').create({
    headers: {
        'content-type': 'application/json'
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    timeout: 5000
})

app.use(compression())
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

const connectionString = process.env.DATABASE_URL || 'postgres://dev:password123@localhost:5432/dev'
const ssl = process.env.HEROKU ? { rejectUnauthorized: false } : false
const db = new Sequelize(connectionString, { dialect: 'postgres', dialectOptions: { ssl: ssl } })


app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});