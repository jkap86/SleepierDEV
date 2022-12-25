import TableMain from "./tableMain";
import { useState } from "react";

const Lineup = ({ roster_positions, optimal_lineup, stateAllPlayers, matchup, lineup_check, lineup_body }) => {
    const [itemActive, setItemActive] = useState(null);

    console.log({
        optimal_lineup: optimal_lineup,
        matchup: matchup,
        lineup_check: lineup_check
    })

    const subs_body = itemActive ?
        lineup_check.find(x => x.current_player === itemActive)?.slot_options
            ?.sort((a, b) => stateAllPlayers[a]?.rank_ecr - stateAllPlayers[b]?.rank_ecr)
            ?.map((so, index) => {
                return {
                    id: so,
                    list: [
                        {
                            text: 'BN',
                            colSpan: 1,
                            className: optimal_lineup.find(x => x.player === so) ? 'green' : 'red'
                        },
                        {
                            text: stateAllPlayers[so]?.full_name,
                            colSpan: 3
                        },
                        {
                            text: stateAllPlayers[so]?.player_opponent,
                            colSpan: 1
                        },
                        {
                            text: stateAllPlayers[so]?.rank_ecr,
                            colSpan: 1
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
                        text: roster_positions[index]
                            .replace('SUPER_FLEX', 'SF')
                            .replace('FLEX', 'WRT')
                            .replace('WRRB_FLEX', 'W R')
                            .replace('REC_FLEX', 'W T'),
                        colSpan: 1,
                        className: 'green'
                    },
                    {
                        text: stateAllPlayers[ol.player]?.full_name,
                        colSpan: 3,
                        className: 'green'
                    },
                    {
                        text: stateAllPlayers[ol.player]?.player_opponent,
                        colSpan: 1,
                        className: 'green'
                    },
                    {
                        text: stateAllPlayers[ol.player]?.rank_ecr,
                        colSpan: 1,
                        className: 'green'
                    }
                ]
            }
        })

    return <>
        <TableMain
            type={'secondary lineup'}
            headers={[[{ text: 'Slot', colSpan: 1 }, { text: 'Player', colSpan: 3 }, { text: 'Opp', colSpan: 1 }, { text: 'Rank', colSpan: 1 }]]}
            body={lineup_body}
            itemActive={itemActive}
            setItemActive={setItemActive}
        />
        <TableMain
            type={'secondary subs'}
            headers={[[{ text: 'Slot', colSpan: 1 }, { text: 'Player', colSpan: 3 }, { text: 'Opp', colSpan: 1 }, { text: 'Rank', colSpan: 1 }]]}
            body={subs_body}
            itemActive={itemActive}
            setItemActive={setItemActive}
        />
    </>
}

export default Lineup;