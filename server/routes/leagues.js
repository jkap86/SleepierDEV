const { Op } = require("sequelize")


const getPrevMatchup = async (axios, league_id, prev_week) => {
    const prevMatchup = await axios.get(`https://api.sleeper.app/v1/league/${league_id}/matchups/${prev_week}`)
    return prevMatchup.data
}

const updateLeaguesUser = async (axios, leagues_table, leagues, user_id, week) => {
    const cutoff = new Date(new Date() - (15 * 60 * 1000))
    const league_ids = leagues.map(league => league.league_id)
    let leagues_user_db = await leagues_table.findAll({
        where: {
            [Op.and]: {
                league_id: {
                    [Op.in]: league_ids
                },
                updatedAt: {
                    [Op.gt]: cutoff
                }
            }
        }
    })

    leagues_user_db = leagues_user_db.map(league => league.dataValues)
    const leagues_to_update = leagues.filter(l => !leagues_user_db.find(l_db => l_db.league_id === l.league_id))

    let new_leagues = []

    let i = 0;
    const increment = 100;

    while (i < leagues_to_update.length + 1) {
        await Promise.all(leagues_to_update
            .slice(i, Math.min(i + increment, leagues_to_update.length + 1))
            .map(async league_to_update => {
                const [league, users, rosters] = await Promise.all([
                    await axios.get(`https://api.sleeper.app/v1/league/${league_to_update.league_id}`),
                    await axios.get(`https://api.sleeper.app/v1/league/${league_to_update.league_id}/users`),
                    await axios.get(`https://api.sleeper.app/v1/league/${league_to_update.league_id}/rosters`),
                ])
                let matchups;
                try {
                    matchups = await axios.get(`https://api.sleeper.app/v1/league/${league_to_update.league_id}/matchups/${week}`)
                } catch (error) {
                    console.log(error)
                    matchups = {
                        data: []
                    }
                }

                const new_league = {
                    league_id: league_to_update.league_id,
                    name: league.data.name,
                    avatar: league.data.avatar,
                    best_ball: league.data.settings.best_ball,
                    type: league.data.settings.type,
                    settings: league.data.settings,
                    scoring_settings: league.data.scoring_settings,
                    roster_positions: league.data.roster_positions,
                    users: users.data.map(user => {
                        return {
                            user_id: user.user_id,
                            display_name: user.display_name,
                            avatar: user.avatar
                        }
                    }),
                    rosters: rosters.data.map(roster => {
                        return {
                            taxi: roster.taxi,
                            starters: roster.starters,
                            settings: roster.settings,
                            roster_id: roster.roster_id,
                            reserve: roster.reserve,
                            players: roster.players,
                            owner_id: roster.owner_id,
                            co_owners: roster.co_owners
                        }
                    }),
                    [`matchups_${week}`]: matchups.data,
                    updatedAt: Date.now()
                }
                new_leagues.push(new_league)
            }))
        i += increment
    }

    await leagues_table.bulkCreate(new_leagues, {
        updateOnDuplicate: ["name", "avatar", "best_ball", "type", "settings", "scoring_settings", "roster_positions",
            "users", "rosters", `matchups_${week}`, "updatedAt"]
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

const updateLeague = async (axios, leagues_table, league_id, user_id, week) => {
    const [league, rosters, users, matchups] = await Promise.all([
        await axios.get(`http://api.sleeper.app/v1/league/${league_id}`),
        await axios.get(`http://api.sleeper.app/v1/league/${league_id}/rosters`),
        await axios.get(`http://api.sleeper.app/v1/league/${league_id}/users`),
        await axios.get(`https://api.sleeper.app/v1/league/${league_id}/matchups/${week}`)
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
            [`matchups_${week}`]: matchups.data,
            users: users.data,
            rosters: rosters.data
        }, {
            where: {
                league_id: league_id
            }
        })

        return {
            ...league.data,
            rosters: rosters.data,
            [`matchups_${week}`]: matchups.data,
            users: users.data,
            userRoster: userRoster,
            standings: standings
        }
    }
}

const updatePrevWeekMatchups = async (axios, week, leagues_table) => {
    const all_leagues = await leagues_table.findAll()

    let new_leagues = []
    let i = 0;
    const increment = 100;

    while (i <= all_leagues.length) {
        await Promise.all(all_leagues
            .slice(i, Math.min(i + increment, all_leagues.length + 1))
            .map(async league => {
                const matchups = await axios.get(`https://api.sleeper.app/v1/league/${league.dataValues.league_id}/matchups/${week}`)


                const new_league = {
                    league_id: league.dataValues.league_id,
                    [`matchups_${week}`]: matchups.data
                }
                new_leagues.push(new_league)
            }))
        i += increment
    }
    await leagues_table.bulkCreate(new_leagues, {
        updateOnDuplicate: [`matchups_${week}`]
    })
}

module.exports = {
    updateLeaguesUser: updateLeaguesUser,
    updateLeague: updateLeague,
    updatePrevWeekMatchups: updatePrevWeekMatchups
}