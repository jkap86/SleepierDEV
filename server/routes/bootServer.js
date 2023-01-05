const { users } = require('../models/users');
const { leagues } = require('../models/leagues');
const { trades } = require('../models/trades');
const { getPlayersDict } = require('../routes/playersDict');
const { updatePrevWeekMatchups } = require('./leagues');

const bootServer = async (app, axios, db) => {
    let state;

    try {
        state = await axios.get('https://api.sleeper.app/v1/state/nfl')
    } catch (error) {
        console.log(error)
    }

    app.set('state', state.data)
    const allplayers = await getPlayersDict(axios, state.data.season, state.data.week)
    app.set('allplayers', allplayers)

    const users_table = users(db, state.data.season)
    await users_table.sync()
    const leagues_table = leagues(db, state.data.season)
    await leagues_table.sync({ alter: true })
    const trades_table = trades(db, state.data.season)
    await trades_table.sync({ alter: true })
    if (state.data.week === 17) {
        console.log('updating previous matchups')
        await updatePrevWeekMatchups(axios, 16, leagues_table)
    }
    app.set('users_table', users_table)
    app.set('leagues_table', leagues_table)
    app.set('trades_table', trades_table)
}

module.exports = {
    bootServer: bootServer
}