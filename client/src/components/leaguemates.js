import TableMain from "./tableMain";
import { useState } from "react";

const Leaguemates = ({
    stateAllPlayers,
    state_user,
    stateLeaguemates
}) => {
    const [page, setPage] = useState(1)

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
            return {
                list: [
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
            }
        })

    return <>
        <TableMain
            type={'main'}
            headers={leaguemates_headers}
            body={leaguemates_body}
            page={page}
            setPage={setPage}
        />
    </>
}

export default Leaguemates;