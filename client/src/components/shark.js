import { useEffect, useState } from "react";
import axios from 'axios';

const Shark = ({ }) => {
    const [sharkleagues, setSharkLeagues] = useState([])
    const [stateAllPlayers, setStateAllPlayers] = useState({})
    const [active, setActive] = useState('')


    const leagues = [
        {
            league_id: '786430856779681792',
            roster_id: 5,
            username: 'cityslickas'
        },
        {
            league_id: '786432483213361152',
            roster_id: 9,
            username: 'FalseTruther'
        },
        {
            league_id: '786431644054781952',
            roster_id: 6,
            username: 'rubik'

        },
        {
            league_id: '786431173407678464',
            roster_id: 4,
            username: 'MNFC'
        },
        {
            league_id: '786431397568045056',
            roster_id: 4,
            username: 'jkap86'
        },
        {
            league_id: '786431933210103808',
            roster_id: 12,
            username: 'Tbuford3165'
        }
    ]
    useEffect(() => {
        const fetchData = async () => {
            const stateAllPlayers = await axios.get('/allplayers')
            setStateAllPlayers(stateAllPlayers.data)
            const matchups = await Promise.all(leagues.map(async league => {
                const matchup = await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/matchups/17`)
                return {
                    ...matchup.data.find(x => x.roster_id === league.roster_id),
                    username: league.username
                }
            }))
            setSharkLeagues(matchups)
        }
        fetchData()
    })


    return <>
        Shark Watch

        <table className="main">
            {
                sharkleagues.map((user =>
                    <tbody>
                        <tr
                            className={active === user.username ? 'active' : ''}
                            onClick={() => setActive(prevState => prevState === user.username ? '' : user.username)}
                            key={user.username}>
                            <td className="left">
                                {user.username}
                            </td>
                            <td>
                                {(user.starters.reduce((acc, cur) => acc + user.players_points[cur], 0)).toFixed(2)}
                            </td>
                        </tr>
                        {
                            active === user.username ?
                                <tr>
                                    <td colSpan={2}>
                                        <table className="secondary">
                                            <tbody>
                                                {
                                                    user.starters.map(starter =>
                                                        <tr>
                                                            <td>{stateAllPlayers[starter]?.full_name}</td>
                                                            <td>{user.players_points[starter]}</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                : null
                        }
                    </tbody>
                ))
            }
        </table>
    </>
}

export default Shark;