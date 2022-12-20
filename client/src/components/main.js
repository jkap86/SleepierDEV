import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios, { all } from 'axios';
import sleeperLogo from '../images/sleeper_icon.png';
import View from "./view";
import { getLeagueData } from './functions/loadData';

const Main = () => {
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [stateAllPlayers, setStateAllPlayers] = useState({});
    const [state_user, setState_User] = useState(false);
    const [stateLeagues, setStateLeagues] = useState([]);
    const [stateLeaguemates, setStateLeaguemates] = useState([]);
    const [statePlayerShares, setStatePlayerShares] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const user = await axios.get('/user', {
                params: {
                    username: params.username
                }
            })
            if (user.data?.leagues) {
                const allplayers = await axios.get('/allplayers')

                setState_User(user.data.user)

                setStateLeagues(user.data.leagues)

                setStateAllPlayers(allplayers.data)

                console.log({
                    ...user.data,
                    allplayers: allplayers.data
                })

                const data = getLeagueData(user.data.leagues, user.data.user.user_id)
                setStatePlayerShares(data.players)
                setStateLeaguemates(data.leaguemates)

            } else {
                setState_User('Invalid')
            }
            setIsLoading(false)
        }

        fetchData()

    }, [params.username])

    return <>
        <View
            stateAllPlayers={stateAllPlayers}
            state_user={state_user}
            stateLeagues={stateLeagues}
            stateLeaguemates={stateLeaguemates}
            statePlayerShares={statePlayerShares}
        />
    </>
}

export default Main;