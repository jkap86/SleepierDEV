import TableMain from '../tableMain';
import { useState } from "react";
import { getLineupCheck } from '../functions/loadData';
import Lineup from "./lineup";

const Lineup_Check = ({ stateState, stateAllPlayers, state_user, stateMatchups, tab, setTab, syncLeague }) => {
    const [itemActive, setItemActive] = useState('');
    const [page, setPage] = useState(1)
    const [searched, setSearched] = useState('')

    const lineups_headers = [
        [
            {
                text: 'League',
                colSpan: 6,
                rowSpan: 2
            },
            {
                text: '#Slots',
                colSpan: 8
            }
        ],
        [
            {
                text: 'Suboptimal',
                colSpan: 2,
                className: 'small'
            },
            {
                text: 'Early in Flex',
                colSpan: 2,
                className: 'small'
            },
            {
                text: 'Late not in Flex',
                colSpan: 2,
                className: 'small'
            },
            {
                text: 'Non QBs in SF',
                colSpan: 2,
                className: 'small'
            }
        ]
    ]

    const lineups_body = stateMatchups.map(matchup_league => {
        const matchup = matchup_league[`matchups_${stateState.week}`]?.find(x => x.roster_id === matchup_league.league.userRoster.roster_id)
        let lineups = getLineupCheck(matchup, matchup_league.league, stateAllPlayers)
        const optimal_lineup = lineups.optimal_lineup
        const lineup_check = lineups.lineup_check
        const starting_slots = lineups.starting_slots

        const lineup_body = (starting_slots || []).map((slot, index) => {
            const starter = matchup?.starters ? matchup.starters[index] : 'Empty'
            return {
                id: `${slot}_${index}`,
                image: {
                    src: starter,
                    alt: 'player photo',
                    type: 'player'
                },
                list: !matchup ? [] : [
                    {
                        text: matchup_league.league.roster_positions[index]
                            .replace('SUPER_FLEX', 'SF')
                            .replace('FLEX', 'WRT')
                            .replace('WRRB_FLEX', 'W R')
                            .replace('REC_FLEX', 'W T'),
                        colSpan: 3,
                        className: optimal_lineup.includes(starter) ? '' : 'red'
                    },
                    {
                        text: stateAllPlayers[starter]?.full_name || 'Empty',
                        colSpan: 10,
                        className: optimal_lineup.includes(starter) ? 'left' : 'left red',
                        image: {
                            src: starter,
                            alt: stateAllPlayers[starter]?.full_name,
                            type: 'player'
                        }
                    },
                    {
                        text: stateAllPlayers[starter]?.player_opponent
                            .replace('at', '@')
                            .replace('vs.', '')
                            .replace(/\s/g, '')
                            .trim()
                            ||
                            'NA',
                        colSpan: 3,
                        className: optimal_lineup.includes(starter) ? '' : 'red',
                    },
                    {
                        text: stateAllPlayers[starter]?.rank_ecr || 999,
                        colSpan: 3,
                        className: optimal_lineup.includes(starter) ? '' : 'red'
                    }
                ]
            }
        })

        return {
            id: matchup_league.league.league_id,
            search: {
                text: matchup_league.league.name,
                image: {
                    src: matchup_league.league.avatar,
                    alt: matchup_league.league.name,
                    type: 'league'
                }
            },
            list: [
                {
                    text: matchup_league.league.name,
                    colSpan: 6,
                    className: 'left',
                    image: {
                        src: matchup_league.league.avatar,
                        alt: matchup_league.league.name,
                        type: 'league'
                    }
                },
                {
                    text: lineup_check.filter(x => x.notInOptimal).length > 0 ?
                        lineup_check.filter(x => x.notInOptimal).length :
                        '√',
                    colSpan: 2,
                    className: lineup_check.filter(x => x.notInOptimal).length > 0 ?
                        'red' : 'green'
                },
                {
                    text: lineup_check.filter(x => x.earlyInFlex).length > 0 ?
                        lineup_check.filter(x => x.earlyInFlex).length :
                        '√',
                    colSpan: 2,
                    className: lineup_check.filter(x => x.earlyInFlex).length > 0 ?
                        'red' : 'green'
                },
                {
                    text: lineup_check.filter(x => x.lateNotInFlex).length > 0 ?
                        lineup_check.filter(x => x.lateNotInFlex).length :
                        '√',
                    colSpan: 2,
                    className: lineup_check.filter(x => x.lateNotInFlex).length > 0 ?
                        'red' : 'green'
                },
                {
                    text: lineup_check.filter(x => x.nonQBinSF).length > 0 ?
                        lineup_check.filter(x => x.nonQBinSF).length :
                        '√',
                    colSpan: 2,
                    className: lineup_check.filter(x => x.nonQBinSF).length > 0 ?
                        'red' : 'green'
                }
            ],
            secondary_table: (
                <Lineup
                    league={matchup_league.league}
                    optimal_lineup={optimal_lineup}
                    stateAllPlayers={stateAllPlayers}
                    state_user={state_user}
                    lineup_check={lineup_check}
                    lineup_body={lineup_body}
                    syncLeague={syncLeague}
                    searched={searched}
                    setSearched={setSearched}
                />
            )
        }
    })

    const caption = (
        <div className="primary nav">
            <select
                className={'click'}
                onChange={(e) => setTab(e.target.value)}
            >
                <option>Lineup Check</option>
                <option>{`Week ${stateState.week} Rankings`}</option>
            </select>
            <i className="fa-regular fa-rectangle-list"></i>
        </div>
    )

    return <>
        {caption}
        <TableMain
            type={'main'}
            headers={lineups_headers}
            body={lineups_body}
            page={page}
            setPage={setPage}
            itemActive={itemActive}
            setItemActive={setItemActive}
            search={true}
            searched={searched}
            setSearched={setSearched}
        />
    </>
}

export default Lineup_Check;