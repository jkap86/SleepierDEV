import TableMain from "./tableMain";
import { useState } from "react";

const PlayerLeagues = ({ leagues_owned, leagues_taken, leagues_available }) => {
    const [itemActive, setItemActive] = useState(null);

    const player_leagues_headers = [
        [
            {
                text: 'League',
                colSpan: 3,
                rowSpan: 2
            },
            {
                text: 'Rank',
                colSpan: 2
            }
        ],
        [
            {
                text: 'OVR',
                colSpan: 1
            },
            {
                text: 'PF',
                colSpan: 1
            }
        ]
    ]

    const player_leagues_body = leagues_owned.map(lo => {
        return {
            id: lo.league_id,
            list: [
                {
                    text: lo.league_name,
                    colSpan: 3,
                    className: 'left',
                    image: {
                        src: lo.league_avatar,
                        alt: lo.league_name,
                        type: 'league'
                    }
                },
                {
                    text: lo.userRoster.rank,
                    colSpan: 1,
                    className: lo.userRoster.rank / lo.rosters.length <= .25 ? 'green' :
                        lo.userRoster.rank / lo.rosters.length >= .75 ? 'red' :
                            null
                },
                {
                    text: lo.userRoster.rank_points,
                    colSpan: 1,
                    className: lo.userRoster.rank_points / lo.rosters.length <= .25 ? 'green' :
                        lo.userRoster.rank_points / lo.rosters.length >= .75 ? 'red' :
                            null
                }
            ]
        }
    })

    return <>
        <TableMain
            type={'secondary'}
            headers={player_leagues_headers}
            body={player_leagues_body}
        />
    </>
}

export default PlayerLeagues;