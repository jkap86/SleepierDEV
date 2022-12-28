import React, { useState, useEffect } from "react";
import { avatar } from './functions/misc';

const Search = ({ id, sendSearched, placeholder, list }) => {
    const [searched, setSearched] = useState('')
    const [playerFound, setPlayerFound] = useState('')
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownOptions, setDropdownOptions] = useState([])

    useEffect(() => {
        handleSearch(searched)
    }, [searched])

    useEffect(() => {
        sendSearched(playerFound)
    }, [playerFound])

    const handleSearch = (s) => {
        let options;
        let visible;

        if (s === '') {
            options = [];
            visible = false
            setPlayerFound(s)
        } else if (list.map(x => x.text).includes(s)) {
            const option = list.find(x => x.text === s)
            options = []
            visible = false
            setPlayerFound(option)
        } else {
            const all_options = list
            options = all_options.filter(x =>
                x.text.toLowerCase()
                    .replace("'", '')
                    .includes(s.toLowerCase()))
            visible = true
        }
        setDropdownVisible(visible)
        setDropdownOptions(options)
    }

    return <>
        <div
            onBlur={() => setDropdownVisible(false)}
            className={'search_wrapper'}
        >
            {
                playerFound.image ?
                    avatar(playerFound.image.src, playerFound.image.alt, playerFound.image.type)
                    :
                    null
            }
            <input
                className={'search'}
                onChange={(e) => setSearched(e.target.value)}
                onFocus={() => setDropdownVisible(true)}

                id={id === undefined ? null : id}
                placeholder={placeholder}
                type="text"
                value={searched.text || searched}
                autoComplete={'off'}
            />
            {
                searched === '' || !dropdownVisible && (searched !== '' && dropdownVisible) ?
                    <button
                        onClick={() => setSearched(' ')}
                        className={'input click'}
                    >
                        &#9660;
                    </button>
                    :
                    <button
                        type="reset"
                        onClick={() => setSearched('')}
                        className={'input click'}
                    >
                        X
                    </button>
            }
            {
                dropdownVisible && dropdownOptions.length > 0 ?
                    <ol
                        onBlur={() => setDropdownVisible(false)}
                        className="dropdown"
                    >
                        {dropdownOptions
                            .sort((a, b) => a.text > b.text ? 1 : -1)
                            .map((option, index) =>
                                <li key={`${option.text}_${index}`}>
                                    <button
                                        className="click"
                                        onMouseDown={() => setSearched(option.text)}
                                    >
                                        {
                                            option.image ?
                                                <p>
                                                    {
                                                        avatar(
                                                            option.image.src, option.image.alt, option.image.type
                                                        )
                                                    }
                                                    {option.text}
                                                </p>
                                                :
                                                option.text
                                        }
                                    </button>
                                </li>
                            )}
                    </ol>
                    :
                    null

            }
        </div>
    </>
}

export default Search;