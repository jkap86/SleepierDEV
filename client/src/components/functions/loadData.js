

export const getLeagueData = (leagues, user_id) => {
    let players_all = [];
    let leaguemates_all = [];

    leagues.map(league => {
        league.rosters.map(roster => {
            roster.players?.map(player_id => {
                players_all.push({
                    id: player_id,
                    league_id: league.league_id,
                    league_name: league.name,
                    league_avatar: league.avatar,
                    status: (
                        roster.starters?.includes(player_id) ?
                            'Starter' :
                            roster.taxi?.includes(player_id) ?
                                'Taxi' :
                                roster.reserve?.includes(player_id) ?
                                    'IR' :
                                    'Bench'
                    ),
                    rosters: league.rosters,
                    userRoster: league.userRoster,
                    users: league.users,
                    scoring_settings: league.scoring_settings,
                    rank: roster.rank,
                    rank_pts: roster.rank_points,
                    roster: roster,
                    roster_positions: league.roster_positions,
                    type: league.type,
                    best_ball: league.best_ball,
                    manager: (league.users.find(x =>
                        x.user_id === roster.owner_id
                    )) || (league.users.find(x =>
                        roster.co_owners?.includes(x.user_id)
                    )) || {
                        display_name: 'Orphan',
                        user_id: 0
                    },
                    wins: roster.settings.wins,
                    losses: roster.settings.losses,
                    ties: roster.settings.ties,
                    fpts: parseFloat(`${roster.settings.fpts}.${roster.settings.fpts_decimal}`),
                    fpts_against: parseFloat(`${roster.settings.fpts_against}.${roster.settings.fpts_against_decimal}`)
                })
            })
        })

        league.users.map(user => {
            let lmRoster = league.rosters.find(x =>
                x.owner_id === user.user_id ||
                x.co_owners?.includes(user.user_id)
            )
            if (lmRoster) {
                leaguemates_all.push({
                    ...user,
                    league: {
                        ...league,
                        lmRoster: lmRoster
                    }
                })
            }
        })
    })

    let playersCount = [];
    let leaguematesCount = [];

    players_all.map(player => {
        const index = playersCount.findIndex(obj => {
            return obj.id === player.id
        })
        if (index === -1) {
            let leagues_owned = players_all.filter(x => x.id === player.id && x.manager?.user_id === user_id)
            let leagues_taken = players_all.filter(x => x.id === player.id && x.manager?.user_id !== user_id)
            playersCount.push({
                id: player.id,
                leagues_owned: leagues_owned,
                leagues_taken: leagues_taken,
                leagues_available: leagues.filter(x =>
                    !leagues_owned.find(y => y.league_id === x.league_id) &&
                    !leagues_taken.find(y => y.league_id === x.league_id)
                )
            })
        }
    })

    leaguemates_all.map(lm => {
        const index = leaguematesCount.findIndex(obj => {
            return obj.user_id === lm.user_id
        })
        if (index === -1) {
            leaguematesCount.push({
                user_id: lm.user_id,
                display_name: lm.display_name,
                avatar: lm.avatar,
                leagues: leaguemates_all.filter(x => x.user_id === lm.user_id).map(x => x.league)
            })
        }
    })

    return {
        players: playersCount,
        leaguemates: leaguematesCount
    }
}

