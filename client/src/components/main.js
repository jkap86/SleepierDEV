import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios, { all } from 'axios';
import sleeperLogo from '../images/sleeper_icon.png';
import View from "./view";
import { getLeagueData } from './functions/loadData';

const Main = () => {
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [stateState, setStateState] = useState({})
    const [stateAllPlayers, setStateAllPlayers] = useState({});
    const [state_user, setState_User] = useState(false);
    const [stateLeagues, setStateLeagues] = useState([]);
    const [stateLeaguemates, setStateLeaguemates] = useState([]);
    const [statePlayerShares, setStatePlayerShares] = useState([]);
    const [stateMatchups, setStateMatchups] = useState([]);

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

                setStateState(user.data.state)

                setState_User(user.data.user)

                setStateLeagues(user.data.leagues)

                setStateAllPlayers(allplayers.data)

                const data = getLeagueData(user.data.leagues, user.data.user.user_id, user.data.state.week)
                setStatePlayerShares(data.players)
                setStateLeaguemates(data.leaguemates)
                setStateMatchups(data.matchups)

                console.log(user.data)

            } else {
                setState_User('Invalid')
            }

            setIsLoading(false)
        }

        fetchData()

    }, [params.username])

    return <>
        <View
            isLoading={isLoading}
            stateState={stateState}
            stateAllPlayers={stateAllPlayers}
            state_user={state_user}
            stateLeagues={stateLeagues}
            stateLeaguemates={stateLeaguemates}
            statePlayerShares={statePlayerShares}
            stateMatchups={stateMatchups}
        />
    </>
}

export default Main;