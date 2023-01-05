const { getPlayersDict, getWeeklyRankings } = require('./playersDict');
const { updatePrevWeekMatchups } = require('./leagues');

const sync_daily = async (app, axios, leagues_table) => {
    console.log(`Begin Daily Sync at ${new Date()}`)
    const previousState = app.get('state')
    const state = await axios.get('https://api.sleeper.app/v1/state/nfl')
    if (state.data.week !== previousState.week) {
        console.log('updating previous matchups')
        await updatePrevWeekMatchups(axios, previousState.week, leagues_table)
    }
    app.set('state', state.data)
    const allplayers = await getPlayersDict(axios, state.data.season, state.data.week)
    app.set('allplayers', allplayers)
    console.log(`Daily Sync completed at ${new Date()}`)
    console.log(`Next Sync scheduled for ${new Date(Date.now() + (24 * 60 * 60 * 1 * 1000))}`)
}

const rankings_sync = async (app, axios) => {
    let allplayers = app.get('allplayers')
    let state = app.get('state')
    if (state.week > 0 && state.week < 19) {
        const html = await axios.get('https://www.fantasypros.com/nfl/rankings/ppr-superflex.php')
        const weekly_rankings = await getWeeklyRankings(html.data)
        Object.keys(allplayers).filter(player_id => allplayers[player_id].rank_ecr < 999).map(player_id => {
            return allplayers[player_id].rank_ecr = 999
        })
        weekly_rankings.map(fantasypros_player => {
            const sleeper_id = Object.keys(allplayers).find(player_id => allplayers[player_id].fantasypros_id === fantasypros_player.player_id?.toString())
            if (sleeper_id) {
                allplayers[sleeper_id] = {
                    ...allplayers[sleeper_id],
                    week: fantasypros_player?.week,
                    rank_ecr: fantasypros_player?.rank_ecr,
                    rank_min: fantasypros_player?.rank_min,
                    rank_max: fantasypros_player?.rank_max,
                    rank_ave: fantasypros_player?.rank_ave,
                    rank_std: fantasypros_player?.rank_std,
                    player_opponent: fantasypros_player?.player_opponent
                }
            } else {
                console.log(`${fantasypros_player.player_name} not found!!!`)
            }
        })
        app.set('allplayers', allplayers)
    }
}

const trades_sync = async (app, axios, leagues_table, trades_table) => {
    console.log(`Begin transactions sync at ${new Date()}`)
    const week = app.get('state')?.week || 0
    const all_leagues = await leagues_table.findAll()
    const leagues_to_update = all_leagues

    let transactions_week = []
    let i = 0
    const increment = 100

    while (i <= leagues_to_update.length) {
        await Promise.all(leagues_to_update
            .slice(i, Math.min(i + increment, leagues_to_update.length + 1))
            .map(async league => {
                let transactions_league;
                try {
                    transactions_league = await axios.get(`https://api.sleeper.app/v1/league/${league.dataValues.league_id}/transactions/${week - 8}`)
                } catch (error) {
                    console.log(error)
                    transactions_league = {
                        data: []
                    }
                }
                return transactions_league.data
                    .map(transaction => {
                        const managers = transaction.roster_ids.map(roster_id => {
                            const user_id = league.dataValues.rosters.find(x => x.roster_id === roster_id)?.owner_id
                            const user = league.dataValues.users.find(x => x.user_id === user_id)
                            return user
                        })

                        if (transaction.type === 'trade') {
                            return transactions_week.push({
                                transaction_id: transaction.transaction_id,
                                status_updated: new Date(transaction.status_updated),
                                managers: managers,
                                adds: transaction.adds,
                                drops: transaction.drops,
                                draft_picks: transaction.draft_picks,
                                league: {
                                    league_id: league.league_id,
                                    name: league.name,
                                    avatar: league.avatar,
                                    rosters: league.rosters,
                                    users: league.users
                                }
                            })
                        }

                    })
            }))
        i += increment
    }
    try {
        await trades_table.bulkCreate(transactions_week, { ignoreDuplicates: true })
    } catch (error) {
        console.log(error)
    }

    console.log(`Transactions sync completed at ${new Date()}`)
}

module.exports = {
    sync_daily: sync_daily,
    rankings_sync: rankings_sync,
    trades_sync: trades_sync
}