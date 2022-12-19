import { Link } from 'react-router-dom';
import { useState } from 'react';
import sleeperLogo from '../images/sleeper_icon.png';

const Homepage = () => {
    const [username, setUsername] = useState('')

    return <div id='homepage'>
        <div className='home_wrapper'>
            <img
                alt='sleeper_logo'
                className='home'
                src={sleeperLogo}
            />

            <div className='home'>
                <strong className='home'>
                    Sleepier
                </strong>
                <input
                    className='home'
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Link to={`/${username}`}>
                    <button
                        className='home click'
                    >
                        Submit
                    </button>
                </Link>
            </div>

        </div>
        {/*
            
*/}
    </div>
}

export default Homepage;