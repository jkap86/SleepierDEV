const { Op } = require("sequelize")


const getPrevMatchup = async (axios, league_id, prev_week) => {
    const prevMatchup = await axios.get(`https://api.sleeper.app/v1/league/${league_id}/matchups/${prev_week}`)
    return prevMatchup.data
}

const updateLeaguesUser = async (axios, leagues_table, leagues, user_id, week) => {
    const cutoff = new Date(new Date() - (60 * 60 * 1000))
    const league_ids = leagues.map(league => league.league_id)
    let leagues_user_db = await leagues_table.findAll({
        where: {
            [Op.and]: {
                league_id: {
                    [Op.in]: league_ids
                }
            }
        }
    })

    leagues_user_db = leagues_user_db.map(league => league.dataValues)
    const leagues_to_add = leagues.filter(l => !leagues_user_db.find(l_db => l_db.league_id === l.league_id))
    const leagues_to_update = leagues_user_db.filter(l_db => l_db.updatedAt < cutoff)

    let new_leagues = []

    let i = 0;
    const increment = 100;

    while (i + increment < [...leagues_to_add, ...leagues_to_update].length + 1) {
        await Promise.all([...leagues_to_add, ...leagues_to_update]
            .slice(i, Math.min(i + increment, [...leagues_to_add, ...leagues_to_update].length + 1))
            .map(async league_to_update => {
                const [league, users, rosters, matchups] = await Promise.all([
                    await axios.get(`https://api.sleeper.app/v1/league/${league_to_update.league_id}`),
                    await axios.get(`https://api.sleeper.app/v1/league/${league_to_update.league_id}/users`),
                    await axios.get(`https://api.sleeper.app/v1/league/${league_to_update.league_id}/rosters`),
                    await axios.get(`https://api.sleeper.app/v1/league/${league_to_update.league_id}/matchups/${week}`)
                ])


                const prevMatchups = []

                await Promise.all(Array.from(Array(week - 1).keys()).map(async key => {
                    let prevMatchup;

                    if (!league_to_update[`matchups_${key + 1}`]) {
                        prevMatchup = await getPrevMatchup(axios, league_to_update.league_id, (key + 1))
                    } else {
                        prevMatchup = league_to_update[`matchups_${key + 1}`]
                    }
                    prevMatchups.push([`matchups_${key + 1}`, prevMatchup])
                }))

                const new_league = {
                    league_id: league_to_update.league_id,
                    name: league.data.name,
                    avatar: league.data.avatar,
                    best_ball: league.data.settings.best_ball,
                    type: league.data.settings.type,
                    scoring_settings: league.data.scoring_settings,
                    roster_positions: league.data.roster_positions,
                    users: users.data,
                    rosters: rosters.data,
                    [`matchups_${week}`]: matchups.data,
                    ...Object.fromEntries(prevMatchups),
                    updatedAt: Date.now()
                }
                new_leagues.push(new_league)
            }))
        i += increment
    }

    await leagues_table.bulkCreate(new_leagues, {
        updateOnDuplicate: ["name", "avatar", "best_ball", "type", "scoring_settings", "roster_positions",
            "users", "rosters", `matchups_${week}`, ...Array.from(Array(week - 1).keys()).map(key => `matchups_${key + 1}`), "updatedAt"]
    })

    return (
        [...leagues_user_db, ...new_leagues]
            .map(league => {
                league.rosters
                    ?.sort((a, b) => b.settings.fpts - a.settings.fpts)
                    ?.map((roster, index) => {
                        roster['rank_points'] = index + 1
                        return roster
                    })

                const standings = (
                    league.rosters
                        ?.sort((a, b) => b.settings.wins - a.settings.wins || a.settings.losses - b.settings.losses ||
                            b.settings.fpts - a.settings.fpts)
                        ?.map((roster, index) => {
                            roster['rank'] = index + 1
                            return roster
                        })
                )
                const userRoster = standings?.find(r => r.owner_id === user_id || r.co_owners?.includes(user_id))
                return {
                    ...league,
                    index: leagues.findIndex(l => {
                        return l.league_id === league.league_id
                    }),
                    userRoster: userRoster
                }
            })
            .filter(league => league.userRoster?.players?.length > 0)
            .sort((a, b) => a.index - b.index)
    )
}

const updateLeague = async (axios, leagues_table, league_id, user_id) => {
    const [league, rosters, users] = await Promise.all([
        await axios.get(`http://api.sleeper.app/v1/league/${league_id}`),
        await axios.get(`http://api.sleeper.app/v1/league/${league_id}/rosters`),
        await axios.get(`http://api.sleeper.app/v1/league/${league_id}/users`)
    ])
    rosters.data
        .sort((a, b) => b.settings.fpts - a.settings.fpts)
        .map((roster, index) => {
            roster['rank_points'] = index + 1
            return roster
        })

    const standings = (
        rosters.data
            .sort((a, b) => b.settings.wins - a.settings.wins || a.settings.losses - b.settings.losses ||
                b.settings.fpts - a.settings.fpts)
            .map((roster, index) => {
                roster['rank'] = index + 1
                return roster
            })
    )

    const userRoster = standings.find(r => r.owner_id === user_id || r.co_owners?.includes(user_id))

    if (userRoster?.players) {
        const new_league = await leagues_table.update({
            name: league.data.name,
            avatar: league.data.avatar,
            best_ball: league.data.settings.best_ball,
            type: league.data.settings.type,
            scoring_settings: league.data.scoring_settings,
            roster_positions: league.data.roster_positions,
            users: users.data,
            rosters: rosters.data
        }, {
            where: {
                league_id: league_id
            }
        })
        console.log({ sync: new_league })
        return {
            ...league.data,
            rosters: rosters.data,
            users: users.data,
            userRoster: userRoster,
            standings: standings
        }
    }
}

module.exports = {
    updateLeaguesUser: updateLeaguesUser,
    updateLeague: updateLeague
}