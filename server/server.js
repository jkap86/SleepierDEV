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
const axiosRetry = require('axios-retry');
const { bootServer } = require('./routes/bootServer');
const { getUser, updateUser } = require('./routes/user');
const { updateLeaguesUser, updateLeague } = require('./routes/leagues');
const { sync_daily, rankings_sync, trades_sync } = require('./routes/sync');
const { getTrades } = require('./routes/trades');

app.use(compression())
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

const connectionString = process.env.DATABASE_URL || 'postgres://dev:password123@localhost:5432/dev'
const ssl = process.env.HEROKU ? { rejectUnauthorized: false } : false
const db = new Sequelize(connectionString, { logging: false, dialect: 'postgres', dialectOptions: { ssl: ssl, useUTC: false } })


axiosRetry(axios, {
    retries: 3,
    retryCondition: () => {
        return true
    }
})


bootServer(app, axios, db)

const date = new Date()
const now = Date.now()
const hour = date.getHours()
const minute = date.getMinutes()
const tzOffset = date.getTimezoneOffset()
let delay;
if (hour < 8) {
    delay = (((8 - hour) * 60) + (60 - minute)) * 60 * 1000
} else {
    delay = (((32 - hour) * 60) + (60 - minute)) * 60 * 1000
}

setTimeout(async () => {
    setInterval(async () => {
        sync_daily(app, axios, app.get('leagues_table'))
        console.log(`Daily Sync completed at ${new Date()}`)
    }, 24 * 60 * 60 * 1 * 1000)

}, delay)
console.log(`Daily Sync in ${Math.floor(delay / (60 * 60 * 1000))} hours`)

setInterval(async () => {
    rankings_sync(app, axios)
    console.log('Weekly Rankings Updated at ' + new Date())
    console.log(`UTC offset - ${new Date(Date.now() + (tzOffset * 60))}`)
}, 5 * 60 * 1000)

setTimeout(async () => {
    trades_sync(app, axios, app.get('leagues_table'), app.get('trades_table'))
}, [15 * 1000])

app.get('/user', async (req, res, next) => {
    const user = await getUser(axios, req.query.username)
    if (user?.user_id) {
        req.user = user
        next()
    } else {
        res.send(user)
    }
}, async (req, res, next) => {
    if (app.get('users_table')) {
        const user_db = await updateUser(axios, app.get('users_table'), req.user, app.get('state').season)
        req.user_db = user_db.user
        req.leagues = user_db.leagues
        next()
    }
}, async (req, res, next) => {
    const leagues_user = await updateLeaguesUser(axios, app.get('leagues_table'), req.leagues, req.user_db.user_id, app.get('state').week)
    res.send({
        user: req.user_db,
        leagues: leagues_user,
        state: app.get('state')
    })
})

app.get('/trades', async (req, res) => {
    const trades = await getTrades(app.get('trades_table'))
    res.send(trades)
})

app.get('/allplayers', (req, res) => {
    const allplayers = app.get('allplayers')
    res.send(allplayers)
})

app.get('/syncleague', async (req, res) => {
    const league_id = req.query.league_id
    const user_id = req.query.user_id
    const league = await updateLeague(axios, app.get('leagues_table'), league_id, user_id, app.get('state').week)
    res.send(league)
})

app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
