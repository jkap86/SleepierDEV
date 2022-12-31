import TableMain from "../tableMain"

const LeaguemateLeagues = ({ state_user, leaguemate }) => {


    console.log({
        state_user: state_user,
        leaguemate: leaguemate
    })

    const leaguemateLeagues_headers = [
        [
            {
                text: 'League',
                colSpan: 4,
                rowSpan: 2
            },
            {
                text: leaguemate.display_name,
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
                text: 'Ovr',
                colSpan: 1,
                className: 'small'
            },
            {
                text: 'PF',
                colSpan: 1,
                className: 'small'
            },
            {
                text: 'Record',
                colSpan: 2
            },
            {
                text: 'Ovr',
                colSpan: 1,
                className: 'small'
            },
            {
                text: 'PF',
                colSpan: 1,
                className: 'small'
            },
        ]
    ]

    const leaguemateLeagues_body = leaguemate.leagues.map((lm_league) => {
        return {
            id: lm_league.league_id,
            list: [
                {
                    text: lm_league.name,
                    colSpan: 4,
                    className: 'left',
                    image: {
                        src: lm_league.avatar,
                        alt: 'avatar',
                        type: 'league'
                    }
                },
                {
                    text: `${lm_league.lmRoster.settings.wins}-${lm_league.lmRoster.settings.losses}${lm_league.lmRoster.ties > 0 ? `-${lm_league.lmRoster.ties}` : ''}`,
                    colSpan: 2
                },
                {
                    text: lm_league.lmRoster.rank,
                    colSpan: 1
                },
                {
                    text: lm_league.lmRoster.rank_points,
                    colSpan: 1
                },
                {
                    text: `${lm_league.userRoster.settings.wins}-${lm_league.userRoster.settings.losses}${lm_league.userRoster.ties > 0 ? `-${lm_league.userRoster.ties}` : ''}`,
                    colSpan: 2
                },
                {
                    text: lm_league.userRoster.rank,
                    colSpan: 1
                },
                {
                    text: lm_league.userRoster.rank_points,
                    colSpan: 1
                }
            ]
        }
    })

    return <>
        <TableMain
            type={'secondary'}
            headers={leaguemateLeagues_headers}
            body={leaguemateLeagues_body}
        />
    </>
}

export default LeaguemateLeagues;