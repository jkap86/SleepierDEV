import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { avatar } from './functions/misc';
import Leagues from "./leagues";
import Players from "./players";
import Leaguemates from "./leaguemates";
import Lineups from "./lineups";

const View = ({
    stateAllPlayers,
    stateState,
    state_user,
    stateLeagues,
    stateLeaguemates,
    statePlayerShares,
    stateMatchups
}) => {
    const [stateLeaguesFiltered, setStateLeaguesFiltered] = useState([]);
    const [statePlayerSharesFiltered, setStatePlayerSharesFiltered] = useState([]);
    const [stateLeaguematesFiltered, setStateLeaguematesFiltered] = useState([]);
    const [tab, setTab] = useState('Lineups');
    const [type1, setType1] = useState('All');
    const [type2, setType2] = useState('All');


    useEffect(() => {
        console.log({
            stateAllPlayers: stateAllPlayers,
            stateState: stateState,
            state_user: state_user,
            stateLeagues: stateLeagues,
            stateLeaguemates: stateLeaguemates,
            statePlayerShares: statePlayerShares,
            stateMatchups: stateMatchups
        })
    }, [stateLeagues, type1, type2])


    let display;
    switch (tab) {
        case 'Lineups':
            display = <Lineups
                stateState={stateState}
                stateAllPlayers={stateAllPlayers}
                state_user={state_user}
                stateMatchups={stateMatchups}
            />
            break;
        case 'Leagues':
            display = <Leagues
                stateAllPlayers={stateAllPlayers}
                state_user={state_user}
                stateLeagues={stateLeagues}
            />
            break;
        case 'Players':
            display = <Players
                stateAllPlayers={stateAllPlayers}
                state_user={state_user}
                statePlayerShares={statePlayerShares}
            />
            break;
        case 'Leaguemates':
            display = <Leaguemates
                stateAllPlayers={stateAllPlayers}
                state_user={state_user}
                stateLeaguemates={stateLeaguemates}
            />
            break;
        default:
            display = null
            break;
    }

    return <>
        <div id={'view'}>
            <Link to="/" className="home">
                Home
            </Link>
            {
                state_user === 'Invalid' ? <h1 className="error">USERNAME NOT FOUND</h1> :
                    !state_user ? <h1>Loading...</h1> :
                        <>
                            <div className="heading">
                                <h1>
                                    <p className="image">
                                        {
                                            avatar(state_user.avatar, state_user.display_name, 'user')
                                        }
                                        <strong>
                                            {state_user.username}
                                        </strong>
                                    </p>
                                </h1>
                                <div className="navbar">
                                    <button
                                        className={tab === 'Lineups' ? 'nav active click' : 'nav click'}
                                        onClick={() => setTab('Lineups')}>
                                        Lineups
                                    </button>
                                    <button
                                        className={tab === 'Players' ? 'nav active click' : 'nav click'}
                                        onClick={() => setTab('Players')}>
                                        Players
                                    </button>
                                    <button
                                        className={tab === 'Leagues' ? 'nav active click' : 'nav click'}
                                        onClick={() => setTab('Leagues')}>
                                        Leagues
                                    </button>
                                    <button
                                        className={tab === 'Leaguemates' ? 'nav active click' : 'nav click'}
                                        onClick={() => setTab('Leaguemates')}>
                                        Leaguemates
                                    </button>
                                </div>
                                <div className="switch_wrapper">
                                    <div className="switch">
                                        <button className={type1 === 'Redraft' ? 'sw active click' : 'sw click'} onClick={() => setType1('Redraft')}>Redraft</button>
                                        <button className={type1 === 'All' ? 'sw active click' : 'sw click'} onClick={() => setType1('All')}>All</button>
                                        <button className={type1 === 'Dynasty' ? 'sw active click' : 'sw click'} onClick={() => setType1('Dynasty')}>Dynasty</button>
                                    </div>
                                    <div className="switch">
                                        <button className={type2 === 'Bestball' ? 'sw active click' : 'sw click'} onClick={() => setType2('Bestball')}>Bestball</button>
                                        <button className={type2 === 'All' ? 'sw active click' : 'sw click'} onClick={() => setType2('All')}>All</button>
                                        <button className={type2 === 'Standard' ? 'sw active click' : 'sw click'} onClick={() => setType2('Standard')}>Standard</button>
                                    </div>
                                </div>
                            </div>
                            {display}
                        </>
            }
        </div>
    </>
}

export default View;