import { useState } from "react";
import Lineup_Check from "./lineup_check";
import WeeklyRankings from "./weekly_rankings";

const Lineups = ({
    stateState,
    stateAllPlayers,
    state_user,
    stateMatchups,
    syncLeague,
    tab,
    setTab
}) => {


    const display = tab === 'Lineup Check' ?
        <Lineup_Check
            stateState={stateState}
            stateAllPlayers={stateAllPlayers}
            state_user={state_user}
            stateMatchups={stateMatchups}
            setTab={setTab}
            syncLeague={syncLeague}
        />
        :
        <WeeklyRankings
            stateState={stateState}
            stateAllPlayers={stateAllPlayers}
            setTab={setTab}
        />


    return <>
        {display}
    </>
}

export default Lineups;