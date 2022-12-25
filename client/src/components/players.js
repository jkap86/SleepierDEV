import TableMain from "./tableMain";
import { useState } from "react";

const Players = ({
    stateAllPlayers,
    state_user,
    statePlayerShares
}) => {
    const [page, setPage] = useState(1)

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
            return {
                id: player.id,
                list: [
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
                        text: player.leagues_available?.length || '0',
                        colSpan: 1
                    }
                ],
                secondary_table: 'Active'
            }
        })

    return <>
        <TableMain
            type={'main'}
            headers={playerShares_headers}
            body={playerShares_body}
            page={page}
            setPage={setPage}
        />
    </>
}

export default Players;