

export const getLeagueData = (leagues, user_id, week) => {
    let players_all = [];
    let leaguemates_all = [];
    let matchups_all = []

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

        let matchups_league = { league: league }
        Array.from(Array(week).keys()).map(key => {
            matchups_league[`matchups_${key + 1}`] = league[`matchups_${key + 1}`]
        })
        matchups_all.push(matchups_league)
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
        leaguemates: leaguematesCount,
        matchups: matchups_all
    }
}

export const getLineupCheck = (matchup, league, stateAllPlayers) => {
    const position_map = {
        'QB': ['QB'],
        'RB': ['RB', 'FB'],
        'WR': ['WR'],
        'TE': ['TE'],
        'FLEX': ['RB', 'FB', 'WR', 'TE'],
        'SUPER_FLEX': ['QB', 'RB', 'FB', 'WR', 'TE'],
        'WRRB_FLEX': ['RB', 'FB', 'WR'],
        'REC_FLEX': ['WR', 'TE']
    }
    const starting_slots = league.roster_positions.filter(x => Object.keys(position_map).includes(x))

    let player_ranks = []
    matchup.players.map(player_id => {
        player_ranks.push({
            id: player_id,
            rank: stateAllPlayers[player_id]?.rank_ecr || 999
        })
    })

    const getOptimalLineup = () => {
        let optimal_lineup = []
        let player_ranks_filtered = player_ranks
        starting_slots.map((slot, index) => {
            const slot_options = player_ranks_filtered
                .filter(x => position_map[slot].includes(stateAllPlayers[x.id]?.position))
                .sort((a, b) => a.rank - b.rank || matchup.starters.includes(a.id) - matchup.starters.includes(b.id))

            const optimal_player = slot_options[0]?.id
            player_ranks_filtered = player_ranks_filtered.filter(x => x.id !== optimal_player)
            optimal_lineup.push(optimal_player)
        })

        return optimal_lineup
    }

    let optimal_lineup = getOptimalLineup()

    const findSuboptimal = () => {
        let lineup_check = []
        starting_slots.map((slot, index) => {
            const cur_id = matchup.starters[index]
            const isInOptimal = optimal_lineup.includes(cur_id)

            return lineup_check.push({
                index: index,
                slot: slot,
                current_player: matchup.starters[index],
                notInOptimal: !isInOptimal,
                earlyInFlex: false,
                lateNotInFlex: false,
                nonQBinSF: position_map[slot].includes('QB') && stateAllPlayers[matchup.starters[index]]?.position !== 'QB',
                slot_options: matchup.players
                    .filter(x =>
                        !matchup.starters.includes(x) &&
                        position_map[slot].includes(stateAllPlayers[x]?.position)
                    )
            })
        })
        return lineup_check
    }

    const lineup_check = findSuboptimal()

    return {
        optimal_lineup: optimal_lineup,
        lineup_check: lineup_check
    }
}



/*
        return lineup_check.push({
            index: index,
            slot: slot,
            current_player: matchup.starters[index],
            notInOptimal: !optimalLineup.find(x => x.player === matchup.starters[index]),
            earlyInFlex: gametime.getDay() > 1 && gametime.getDay() < 7 &&
                position_map[slot].length > 1,
            lateNotInFlex: (gametime.getDay() >= 0 && gametime.getDay() < 3 || gametime.getDay() === 0 && gametime.getHours() > 17) &&
                position_map[slot].length === 1,
            nonQBinSF: position_map[slot].includes('QB') && stateAllPlayers[matchup.starters[index]]?.position !== 'QB',
            slot_options: slot_options,
        })

        return {
        optimal_lineup: optimalLineup,
        lineup_check: lineup_check
    }

*/