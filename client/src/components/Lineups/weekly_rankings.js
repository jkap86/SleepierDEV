import TableMain from '../tableMain';
import { useState } from "react";

const WeeklyRankings = ({ stateState, stateAllPlayers, tab, setTab }) => {
    const [itemActive, setItemActive] = useState('');
    const [page, setPage] = useState(1)


    const caption = (
        <div className="primary nav">
            <button
                className={tab === 'Weekly Rankings' ? 'active click' : 'click'}
                onClick={() => setTab('Weekly Rankings')}
            >
                Weekly Rankings
            </button>
            <button
                className={tab === 'Lineup Check' ? 'active click' : 'click'}
                onClick={() => setTab('Lineup Check')}
            >
                Lineup Check
            </button>
        </div>
    )

    const weekly_rankings_headers = [
        [
            {
                text: 'Player',
                colSpan: 3
            },
            {
                text: 'Opp',
                colSpan: 1
            },
            {
                text: 'Kickoff',
                colSpan: 1
            },
            {
                text: 'Rank',
                colSpan: 1
            }

        ]
    ]

    const weekly_rankings_body = Object.keys(stateAllPlayers)
        .filter(player_id => stateAllPlayers[player_id]?.rank_ecr < 999)
        .sort((a, b) => stateAllPlayers[a]?.rank_ecr - stateAllPlayers[b]?.rank_ecr)
        .map(player_id => {
            const kickoff = new Date(parseInt(stateAllPlayers[player_id]?.gametime) * 1000)
            return {
                id: player_id,
                list: [
                    {
                        text: stateAllPlayers[player_id]?.full_name,
                        colSpan: 3
                    },
                    {
                        text: stateAllPlayers[player_id]?.player_opponent,
                        colSpan: 1
                    },
                    {
                        text: kickoff.toLocaleString("en-US", { weekday: 'short', hour: 'numeric' }),
                        colSpan: 1
                    },
                    {
                        text: stateAllPlayers[player_id]?.rank_ecr,
                        colSpan: 1
                    }
                ]
            }
        })

    return <>
        <TableMain
            type={'main'}
            headers={weekly_rankings_headers}
            body={weekly_rankings_body}
            page={page}
            setPage={setPage}
            itemActive={itemActive}
            setItemActive={setItemActive}
            caption={caption}
        />
    </>
}

export default WeeklyRankings;