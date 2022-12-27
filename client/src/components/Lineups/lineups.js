import { useState } from "react";
import Lineup_Check from "./lineup_check";
import WeeklyRankings from "./weekly_rankings";

const Lineups = ({
    stateState,
    stateAllPlayers,
    state_user,
    stateMatchups,
    syncLeague
}) => {
    const [tab, setTab] = useState('Lineup Check');

    const display = tab === 'Lineup Check' ?
        <Lineup_Check
            stateState={stateState}
            stateAllPlayers={stateAllPlayers}
            state_user={state_user}
            stateMatchups={stateMatchups}
            tab={tab}
            setTab={setTab}
            syncLeague={syncLeague}
        />
        :
        <WeeklyRankings
            stateState={stateState}
            stateAllPlayers={stateAllPlayers}
            tab={tab}
            setTab={setTab}
        />


    return <>
        {display}
    </>
}

export default Lineups;