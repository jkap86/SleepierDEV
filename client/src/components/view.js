import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { avatar } from './functions/misc';

const View = ({
    stateAllPlayers,
    state_user,
    stateLeagues,
    stateLeaguemates,
    statePlayerShares
}) => {
    const [stateLeaguesFiltered, setStateLeaguesFiltered] = useState([]);
    const [stateLeaguematesFiltered, setStateLeaguematesFiltered] = useState([]);
    const [statePlayerSharesFiltered, setStatePlayerSharesFiltered] = useState([]);
    const [tab, setTab] = useState('Lineup Check');
    const [type1, setType1] = useState('All');
    const [type2, setType2] = useState('All');




    useEffect(() => {
        console.log({
            state_user: state_user,
            stateLeagues: stateLeagues,
            stateLeaguemates: stateLeaguemates,
            statePlayerShares: statePlayerShares
        })
    }, [stateLeagues, type1, type2])

    return <>
        <div id={'view'}>
            <Link to="/" className="home">
                Home
            </Link>
            {/*
            <i
                onClick={() => setTab('Rankings')}
                className={`fa fa-ranking-star home clickable ${tab === 'Rankings' ? 'active' : null}`}>
            </i>
            */}
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
                                        className={tab === 'Lineup Check' ? 'nav active click' : 'nav click'}
                                        onClick={() => setTab('Lineup Check')}>
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
                        </>
            }
        </div>
    </>
}

export default View;