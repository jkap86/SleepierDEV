import TableMain from "../tableMain";
import { useState } from "react";

const Lineup = ({ league, optimal_lineup, stateAllPlayers, matchup, lineup_check, lineup_body }) => {
    const [itemActive, setItemActive] = useState(null);

    console.log({
        optimal_lineup: optimal_lineup,
        matchup: matchup,
        lineup_check: lineup_check
    })

    const lineup_headers = [
        [
            {
                text: 'Lineup',
                colSpan: 19
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
            }
        ]
    ]

    const subs_headers = [
        [
            {
                text: itemActive ? 'Subs' : 'Optimal Lineup',
                colSpan: 19
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
            }
        ]
    ]

    const subs_body = itemActive ?
        lineup_check.find(x => x.current_player === itemActive)?.slot_options
            ?.sort((a, b) => stateAllPlayers[a]?.rank_ecr - stateAllPlayers[b]?.rank_ecr)
            ?.map((so, index) => {
                return {
                    id: so,
                    list: [
                        {
                            text: 'BN',
                            colSpan: 3,
                            className: optimal_lineup.includes(so) ? 'green' :
                                stateAllPlayers[so]?.rank_ecr >= stateAllPlayers[itemActive]?.rank_ecr ? 'red' : ''
                        },
                        {
                            text: stateAllPlayers[so]?.full_name,
                            colSpan: 10,
                            className: optimal_lineup.includes(so) ? 'left green' :
                                stateAllPlayers[so]?.rank_ecr >= stateAllPlayers[itemActive]?.rank_ecr ? 'left red' : 'left',
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
                                .trim(),
                            colSpan: 3,
                            className: optimal_lineup.includes(so) ? 'green' :
                                stateAllPlayers[so]?.rank_ecr >= stateAllPlayers[itemActive]?.rank_ecr ? 'red' : ''
                        },
                        {
                            text: stateAllPlayers[so]?.rank_ecr,
                            colSpan: 3,
                            className: optimal_lineup.includes(so) ? 'green' :
                                stateAllPlayers[so]?.rank_ecr >= stateAllPlayers[itemActive]?.rank_ecr ? 'red' : ''
                        }
                    ]
                }
            })


        :

        optimal_lineup.map((ol, index) => {
            return {
                id: ol,
                list: [
                    {
                        text: league.roster_positions[index]
                            .replace('SUPER_FLEX', 'SF')
                            .replace('FLEX', 'WRT')
                            .replace('WRRB_FLEX', 'W R')
                            .replace('REC_FLEX', 'W T'),
                        colSpan: 3,
                        className: 'green'
                    },
                    {
                        text: stateAllPlayers[ol]?.full_name,
                        colSpan: 10,
                        className: 'left green',
                        image: {
                            src: ol,
                            alt: stateAllPlayers[ol]?.full_name,
                            type: 'player'
                        }
                    },
                    {
                        text: stateAllPlayers[ol]?.player_opponent
                            .replace('at', '@')
                            .replace('vs.', '')
                            .replace(/\s/g, '')
                            .trim(),
                        colSpan: 3,
                        className: 'green'
                    },
                    {
                        text: stateAllPlayers[ol]?.rank_ecr,
                        colSpan: 3,
                        className: 'green'
                    }
                ]
            }
        })

    return <>
        <TableMain
            type={'secondary lineup'}
            headers={lineup_headers}
            body={lineup_body}
            itemActive={itemActive}
            setItemActive={setItemActive}
        />
        <TableMain
            type={'secondary subs'}
            headers={subs_headers}
            body={subs_body}
        />
    </>
}

export default Lineup;