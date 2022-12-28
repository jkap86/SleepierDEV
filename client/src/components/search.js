import React, { useState, useEffect } from "react";

const Search = ({ id, sendSearched, placeholder, list }) => {
    const [searched, setSearched] = useState('')
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownOptions, setDropdownOptions] = useState([])

    useEffect(() => {
        handleSearch(searched)
    }, [searched])

    const handleSearch = (s) => {
        let options;
        let visible;
        if (s === '') {
            options = [];
            visible = false
        } else if (list.includes(s)) {
            options = []
            visible = false
            sendSearched(s)
        } else {
            const all_options = list
            options = all_options.filter(x =>
                x.toLowerCase()
                    .replace("'", '')
                    .includes(s.toLowerCase()))
            visible = true
        }
        setDropdownVisible(visible)
        setDropdownOptions(options)
    }

    return <>
        <div

            className={'search_wrapper'}
        >
            <input
                className={'search'}
                onChange={(e) => setSearched(e.target.value)}
                onFocus={() => setDropdownVisible(true)}

                id={id === undefined ? null : id}
                placeholder={placeholder}
                type="text"
                value={searched}
                autoComplete={'off'}
            />
            {
                searched === '' ?
                    <button
                        onClick={() => setDropdownOptions([])}
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
                dropdownVisible ?
                    <ol
                        onBlur={() => setDropdownVisible(false)}
                        className="dropdown"
                    >
                        {dropdownOptions
                            .sort((a, b) => a > b ? 1 : -1)
                            .map(option =>
                                <li key={option}>
                                    <button
                                        className="click"
                                        onMouseDown={() => setSearched(option)}
                                    >
                                        {option}
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