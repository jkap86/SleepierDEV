import TableMain from "../tableMain";
import { useState } from "react";
import tumbleweedgif from '../../images/tumbleweed.gif';
import reload from '../../images/reload.png';

const Lineup = ({ matchup, starting_slots, league, optimal_lineup, stateAllPlayers, state_user, lineup_check, syncLeague, players_points }) => {
    const [itemActive, setItemActive] = useState(null);
    const [syncing, setSyncing] = useState(false)

    const active_player = lineup_check.find(x => `${x.slot}_${x.index}` === itemActive)?.current_player

    const handleSync = (league_id, user_id) => {
        setSyncing(true)
        syncLeague(league_id, user_id)
        setTimeout(() => {
            setSyncing(false)
        }, 5000)
    }

    const lineup_headers = [
        [
            {
                text: 'Lineup',
                colSpan: 23
            }
        ],
        [
            {
                text: 'Slot',
                colSpan: 3
            },
            {
                text: 'Player',
                colSpan: 10
            },
            {
                text: 'Opp',
                colSpan: 3
            },
            {
                text: 'Rank',
                colSpan: 3
            },
            {
                text: 'Points',
                colSpan: 4
            }
        ]
    ]

    const lineup_body = lineup_check.map((slot, index) => {
        return {
            id: slot.slot_index,
            image: {
                src: slot.current_player,
                alt: 'player photo',
                type: 'player'
            },
            list: !matchup ? [] : [
                {
                    text: lineup_check.find(x => x.current_player === slot.current_player)?.slot,
                    colSpan: 3,
                    className: optimal_lineup.find(x => x.player === slot.current_player) ? '' : 'red'
                },
                {
                    text: stateAllPlayers[slot.current_player]?.full_name || 'Empty',
                    colSpan: 10,
                    className: optimal_lineup.find(x => x.player === slot.current_player) ? 'left' : 'left red',
                    image: {
                        src: slot.current_player,
                        alt: stateAllPlayers[slot.current_player]?.full_name,
                        type: 'player'
                    }
                },
                {
                    text: stateAllPlayers[slot.current_player]?.player_opponent
                        .replace('at', '@')
                        .replace('vs.', '')
                        .replace(/\s/g, '')
                        .trim()
                        ||
                        '-',
                    colSpan: 3,
                    className: optimal_lineup.find(x => x.player === slot.current_player) ? '' : 'red',
                },
                {
                    text: stateAllPlayers[slot.current_player]?.rank_ecr || '-',
                    colSpan: 3,
                    className: optimal_lineup.find(x => x.player === slot.current_player) ? '' : 'red'
                },
                {
                    text: players_points[slot.current_player]?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || '-',
                    colSpan: 4,
                    className: optimal_lineup.find(x => x.player === slot.current_player) ? '' : 'red'
                }
            ]
        }
    })

    const subs_headers = [
        [
            {
                text: itemActive ? 'Subs' : 'Optimal Lineup',
                colSpan: 23
            }
        ],
        [
            {
                text: 'Slot',
                colSpan: 3
            },
            {
                text: 'Player',
                colSpan: 10
            },
            {
                text: 'Opp',
                colSpan: 3
            },
            {
                text: 'Rank',
                colSpan: 3
            },
            {
                text: 'Points',
                colSpan: 4
            }
        ]
    ]

    const subs_body = itemActive ?
        lineup_check.find(x => x.slot_index === itemActive)?.slot_options
            ?.sort((a, b) => stateAllPlayers[a]?.rank_ecr - stateAllPlayers[b]?.rank_ecr)
            ?.map((so, index) => {
                const color = optimal_lineup.find(x => x.player === so) ? 'green' :
                    stateAllPlayers[so]?.rank_ecr < stateAllPlayers[active_player]?.rank_ecr ? 'yellow' : ''
                return {
                    id: so,
                    list: [
                        {
                            text: 'BN',
                            colSpan: 3,
                            className: color
                        },
                        {
                            text: stateAllPlayers[so]?.full_name,
                            colSpan: 10,
                            className: color + " left",
                            image: {
                                src: so,
                                alt: stateAllPlayers[so]?.full_name,
                                type: 'player'
                            }
                        },
                        {
                            text: stateAllPlayers[so]?.player_opponent
                                .replace('at', '@')
                                .replace('vs.', '')
                                .replace(/\s/g, '')
                                .trim()
                                || '-',
                            colSpan: 3,
                            className: color
                        },
                        {
                            text: stateAllPlayers[so]?.rank_ecr,
                            colSpan: 3,
                            className: color
                        },
                        {
                            text: players_points[so].toLocaleString("en-US", { minimumFractionDigits: 2 }),
                            colSpan: 4,
                            className: color
                        }
                    ]
                }
            })
        :
        optimal_lineup.map((ol, index) => {
            return {
                id: ol.player,
                list: [
                    {
                        text: ol.slot,
                        colSpan: 3,
                        className: 'green'
                    },
                    {
                        text: stateAllPlayers[ol.player]?.full_name,
                        colSpan: 10,
                        className: 'left green',
                        image: {
                            src: ol.player,
                            alt: stateAllPlayers[ol.player]?.full_name,
                            type: 'player'
                        }
                    },
                    {
                        text: stateAllPlayers[ol.player]?.player_opponent
                            .replace('at', '@')
                            .replace('vs.', '')
                            .replace(/\s/g, '')
                            .trim(),
                        colSpan: 3,
                        className: 'green'
                    },
                    {
                        text: stateAllPlayers[ol.player]?.rank_ecr,
                        colSpan: 3,
                        className: 'green'
                    },
                    {
                        text: players_points[ol.player].toLocaleString("en-US", { minimumFractionDigits: 2 }),
                        colSpan: 4,
                        className: 'green'
                    }
                ]
            }
        })

    return <>
        <div className="secondary nav">
            <p>
                {
                    (starting_slots || [])
                        .map((slot, index) => {
                            const starter = matchup?.starters ? matchup.starters[index] : 'Empty'
                            return players_points[starter] || 0
                        })
                        .reduce((acc, cur) => acc + cur, 0)
                        .toLocaleString("en-US", { minimumFractionDigits: 2 })
                }
            </p>
            <button
                className={`sync ${syncing ? '' : 'click'}`}
                onClick={syncing ? null : () => handleSync(league.league_id, state_user.user_id)}
            >
                <i className={`fa-solid fa-arrows-rotate ${syncing ? 'rotate' : ''}`}></i>
            </button>
            <p>
                {
                    (itemActive ? lineup_check.find(x => `${x.slot}_${x.index}` === itemActive)?.slot_options : optimal_lineup.map(x => x.player))
                        .map((player, index) => {
                            return players_points[player] || 0
                        })
                        .reduce((acc, cur) => acc + cur, 0)
                        .toLocaleString("en-US", { minimumFractionDigits: 2 })
                }
            </p>
        </div>
        {lineup_body?.length > 0 ?
            <>
                <TableMain
                    type={'secondary lineup'}
                    headers={lineup_headers}
                    body={lineup_body}
                    itemActive={itemActive}
                    setItemActive={(setItemActive)}
                />

                <TableMain
                    type={'secondary subs'}
                    headers={subs_headers}
                    body={subs_body}
                />
            </>
            :
            <div>
                <h1>No Matchups</h1>
                <img src={tumbleweedgif} alt={'tumbleweed gif'} className='gif' />
            </div>
        }
    </>
}

export default Lineup;