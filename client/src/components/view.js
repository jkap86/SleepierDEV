import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { avatar } from './functions/misc';
import TableMain from "./tableMain";

const View = ({
    stateAllPlayers,
    state_user,
    stateLeagues,
    stateLeaguemates,
    statePlayerShares
}) => {
    const [stateLeaguesFiltered, setStateLeaguesFiltered] = useState([]);
    const [statePlayerSharesFiltered, setStatePlayerSharesFiltered] = useState([]);
    const [stateLeaguematesFiltered, setStateLeaguematesFiltered] = useState([]);
    const [tab, setTab] = useState('Lineups');
    const [type1, setType1] = useState('All');
    const [type2, setType2] = useState('All');




    useEffect(() => {
        console.log({
            state_user: state_user,
            stateLeagues: stateLeagues,
            stateLeaguemates: stateLeaguemates,
            statePlayerShares: statePlayerShares
        })
    }, [stateLeagues, type1, type2])

    const leagues_headers = [
        [
            {
                text: 'League',
                colSpan: 4
            },
            {
                text: 'Record',
                colSpan: 2
            },
            {
                text: 'Rank',
                colSpan: 1
            },
            {
                text: 'Rank PF',
                colSpan: 1
            }
        ]
    ]

    const leagues_body = stateLeagues.map(league => {
        return [
            {
                text: league.name,
                colSpan: 4,
                className: 'left',
                image: {
                    src: league.avatar,
                    alt: league.name,
                    type: 'league'
                }
            },
            {
                text: `${league.userRoster.settings.wins}-${league.userRoster.settings.losses}`
                    + (league.userRoster.settings.ties > 0 ? `-${league.userRoster.settings.ties}` : ''),
                colSpan: 1
            },
            {
                text: (
                    (league.userRoster.settings.wins) /
                    (league.userRoster.settings.wins + league.userRoster.settings.losses + league.userRoster.settings.ties)
                ).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 }).slice(1, 6),
                colSpan: 1
            },
            {
                text: league.userRoster.rank,
                colSpan: 1,
                className: league.userRoster.rank / league.rosters.length <= .25 ? 'green' :
                    league.userRoster.rank / league.rosters.length >= .75 ? 'red' :
                        null
            },
            {
                text: league.userRoster.rank_points,
                colSpan: 1,
                className: league.userRoster.rank_points / league.rosters.length <= .25 ? 'green' :
                    league.userRoster.rank_points / league.rosters.length >= .75 ? 'red' :
                        null
            }
        ]
    })

    const playerShares_headers = [
        [
            {
                text: 'Player',
                colSpan: 4
            },
            {
                text: 'Owned',
                colSpan: 1
            },
            {
                text: 'Taken',
                colSpan: 1
            },
            {
                text: 'Available',
                colSpan: 1
            }
        ]
    ]

    const playerShares_body = statePlayerShares
        .sort((a, b) => b.leagues_owned.length - a.leagues_owned.length)
        .map(player => {
            return [
                {
                    text: stateAllPlayers[player.id]?.full_name,
                    colSpan: 4,
                    className: 'left',
                    image: {
                        src: player.id,
                        alt: stateAllPlayers[player.id]?.full_name || player.id,
                        type: 'player'
                    }
                },
                {
                    text: player.leagues_owned.length,
                    colSpan: 1
                },
                {
                    text: player.leagues_taken.length,
                    colSpan: 1
                },
                {
                    text: player.leagues_available.length,
                    colSpan: 1
                }
            ]
        })

    const leaguemates_headers = [
        [
            {
                text: 'Leaguemate',
                colSpan: 3,
                rowSpan: 2
            },
            {
                text: '#',
                colSpan: 1,
                rowSpan: 2
            },
            {
                text: 'Leaguemate',
                colSpan: 4
            },
            {
                text: state_user.username,
                colSpan: 4
            }
        ],
        [
            {
                text: 'Record',
                colSpan: 2
            },
            {
                text: 'Fpts',
                colSpan: 2
            },
            {
                text: 'Record',
                colSpan: 2
            },
            {
                text: 'Fpts',
                colSpan: 2
            }

        ]
    ]

    const leaguemates_body = stateLeaguemates
        .filter(x => x.display_name !== state_user.username)
        .sort((a, b) => b.leagues.length - a.leagues.length)
        .map(lm => {
            return [
                {
                    text: lm.display_name,
                    colSpan: 3,
                    className: 'left',
                    image: {
                        src: lm.avatar,
                        alt: lm.display_name,
                        type: 'user'
                    }
                },
                {
                    text: lm.leagues.length,
                    colSpan: 1
                },
                {
                    text: (
                        lm.leagues.reduce((acc, cur) => acc + cur.lmRoster.settings?.wins, 0) +
                        "-" +
                        lm.leagues.reduce((acc, cur) => acc + cur.lmRoster.settings?.losses, 0) +
                        (
                            lm.leagues.reduce((acc, cur) => acc + cur.lmRoster.settings?.ties, 0) > 0 ?
                                `${lm.leagues.reduce((acc, cur) => acc + cur.lmRoster.settings?.ties, 0)}` :
                                ''
                        )
                    ),
                    colSpan: 2
                },
                {
                    text: lm.leagues.reduce(
                        (acc, cur) =>
                            acc +
                            parseFloat(
                                cur.lmRoster.settings?.fpts +
                                '.' +
                                cur.lmRoster.settings?.fpts_decimal
                            )
                        , 0).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
                    colSpan: 2
                },
                {
                    text: (
                        lm.leagues.reduce((acc, cur) => acc + cur.userRoster.settings?.wins, 0) +
                        "-" +
                        lm.leagues.reduce((acc, cur) => acc + cur.userRoster.settings?.losses, 0) +
                        (
                            lm.leagues.reduce((acc, cur) => acc + cur.userRoster.settings?.ties, 0) > 0 ?
                                `${lm.leagues.reduce((acc, cur) => acc + cur.userRoster.settings?.ties, 0)}` :
                                ''
                        )
                    ),
                    colSpan: 2
                },
                {
                    text: lm.leagues.reduce((acc, cur) => acc + cur.userRoster.settings?.fpts, 0),
                    colSpan: 2
                }
            ]
        })

    let headers;
    let body;
    switch (tab) {
        case 'Leagues':
            headers = leagues_headers
            body = leagues_body
            break;
        case 'Players':
            headers = playerShares_headers
            body = playerShares_body
            break;
        case 'Leaguemates':
            headers = leaguemates_headers
            body = leaguemates_body
            break;
        default:
            headers = []
            body = []
            break;
    }

    const display = (
        <TableMain
            headers={headers}
            body={body}
        />
    )

    return <>
        <div id={'view'}>
            <Link to="/" className="home">
                Home
            </Link>
            {
                state_user === 'Invalid' ? <h1 className="error">USERNAME NOT FOUND</h1> :
                    !state_user ? <h1>Loading...</h1> :
                        <>
                            <div className="heading">
                                <h1>
                                    <p className="image">
                                        {
                                            avatar(state_user.avatar, state_user.display_name, 'user')
                                        }
                                        <strong>
                                            {state_user.username}
                                        </strong>
                                    </p>
                                </h1>
                                <div className="navbar">
                                    <button
                                        className={tab === 'Lineups' ? 'nav active click' : 'nav click'}
                                        onClick={() => setTab('Lineups')}>
                                        Lineups
                                    </button>
                                    <button
                                        className={tab === 'Players' ? 'nav active click' : 'nav click'}
                                        onClick={() => setTab('Players')}>
                                        Players
                                    </button>
                                    <button
                                        className={tab === 'Leagues' ? 'nav active click' : 'nav click'}
                                        onClick={() => setTab('Leagues')}>
                                        Leagues
                                    </button>
                                    <button
                                        className={tab === 'Leaguemates' ? 'nav active click' : 'nav click'}
                                        onClick={() => setTab('Leaguemates')}>
                                        Leaguemates
                                    </button>
                                </div>
                                <div className="switch_wrapper">
                                    <div className="switch">
                                        <button className={type1 === 'Redraft' ? 'sw active click' : 'sw click'} onClick={() => setType1('Redraft')}>Redraft</button>
                                        <button className={type1 === 'All' ? 'sw active click' : 'sw click'} onClick={() => setType1('All')}>All</button>
                                        <button className={type1 === 'Dynasty' ? 'sw active click' : 'sw click'} onClick={() => setType1('Dynasty')}>Dynasty</button>
                                    </div>
                                    <div className="switch">
                                        <button className={type2 === 'Bestball' ? 'sw active click' : 'sw click'} onClick={() => setType2('Bestball')}>Bestball</button>
                                        <button className={type2 === 'All' ? 'sw active click' : 'sw click'} onClick={() => setType2('All')}>All</button>
                                        <button className={type2 === 'Standard' ? 'sw active click' : 'sw click'} onClick={() => setType2('Standard')}>Standard</button>
                                    </div>
                                </div>
                            </div>
                            {display}
                        </>
            }
        </div>
    </>
}

export default View;