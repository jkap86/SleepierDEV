import TableMain from "../tableMain";
import { useState } from "react";
import headshot from '../../images/headshot.png';
import PlayerLeagues from "./player_leagues";

const Players = ({
    stateAllPlayers,
    state_user,
    statePlayerShares,
    leagues_count
}) => {
    const [itemActive, setItemActive] = useState('');
    const [page, setPage] = useState(1)

    const playerShares_headers = [
        [
            {
                text: 'Player',
                colSpan: 4,
                rowSpan: 2
            },
            {
                text: 'Owned',
                colSpan: 2
            },
            {
                text: 'Taken',
                colSpan: 2
            },
            {
                text: 'Available',
                colSpan: 2
            }
        ],
        [
            {
                text: 'Total',
                colSpan: 1
            },
            {
                text: '%',
                colSpan: 1
            },
            {
                text: 'Total',
                colSpan: 1
            },
            {
                text: '%',
                colSpan: 1
            },
            {
                text: 'Total',
                colSpan: 1
            },
            {
                text: '%',
                colSpan: 1
            }
        ]
    ]

    const playerShares_body = statePlayerShares
        .sort((a, b) => b.leagues_owned.length - a.leagues_owned.length)
        .map(player => {
            return {
                id: player.id,
                list: [
                    {
                        text: stateAllPlayers[player.id]?.full_name || `INACTIVE PLAYER`,
                        colSpan: 4,
                        className: 'left',
                        image: {
                            src: stateAllPlayers[player.id] ? player.id : headshot,
                            alt: stateAllPlayers[player.id]?.full_name || player.id,
                            type: 'player'
                        }
                    },
                    {
                        text: player.leagues_owned.length,
                        colSpan: 1,
                        className: 'green'
                    },
                    {
                        text: ((player.leagues_owned.length / leagues_count) * 100).toFixed(1) + '%',
                        colSpan: 1,
                        className: 'green'
                    },
                    {
                        text: player.leagues_taken.length,
                        colSpan: 1,
                        className: 'red'
                    },
                    {
                        text: ((player.leagues_taken.length / leagues_count) * 100).toFixed(1) + '%',
                        colSpan: 1,
                        className: 'red'
                    },
                    {
                        text: player.leagues_available?.length || '0',
                        colSpan: 1,
                        className: 'yellow'
                    },
                    {
                        text: ((player.leagues_available.length / leagues_count) * 100).toFixed(1) + '%',
                        colSpan: 1,
                        className: 'yellow'
                    }
                ],
                secondary_table: (
                    <PlayerLeagues
                        leagues_owned={player.leagues_owned}
                        leagues_taken={player.leagues_taken}
                        leagues_available={player.leagues_available}
                    />
                )
            }
        })

    return <>
        <TableMain
            type={'main'}
            headers={playerShares_headers}
            body={playerShares_body}
            page={page}
            setPage={setPage}
            itemActive={itemActive}
            setItemActive={setItemActive}
        />
    </>
}

export default Players;