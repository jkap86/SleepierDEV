import { utils, read } from 'xlsx';

export const importRankings = (e, stateAllPlayers, setUploadedRankings) => {
    if (e.target.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const data = e.target.result
            const workbook = read(data, { type: 'array' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            let json = utils.sheet_to_json(worksheet)
            let uploadedRankings = []
            const cols = Object.keys(json[0])
            const p = cols.find(x => ['player', 'name'].includes(x.trim().toLowerCase()))
            const r = cols.find(x => ['rank'].includes(x.trim().toLowerCase()))
            const pos = cols.find(x => ['pos', 'position'].includes(x.trim().toLowerCase()))

            if (!(p && r && pos)) {
                setUploadedRankings({ error: 'error - column not found' })
                return
            }
            let notMatched = []
            json.map(player => {
                const player_to_update = matchRankings(player[p].trim().toLowerCase().replace(/[^a-z]/g, ""), player[pos], stateAllPlayers)
                const rank = player[r]
                if (player_to_update.error) {
                    notMatched.push(player[p])
                } else {
                    return uploadedRankings.push({
                        player: player_to_update,
                        rank: rank
                    })
                }
            })
            setUploadedRankings({
                uploadedRankings: uploadedRankings,
                notMatched: notMatched
            })

        }
        reader.readAsArrayBuffer(e.target.files[0])
    } else {
        console.log('no file')
    }
}

const matchRankings = (player, position, stateAllPlayers) => {
    let start = 0
    let end = 3
    const players_to_search = Object.keys(stateAllPlayers).filter(p => stateAllPlayers[p]?.position === position)
    let matches = players_to_search
        .filter(player_id => player.includes(stateAllPlayers[player_id]?.searchName.slice(start, end)) || stateAllPlayers[player_id]?.searchName.includes(player.slice(start, end)));

    while (matches.length > 1) {
        end += 1
        matches = players_to_search
            .filter(player_id => player.includes(stateAllPlayers[player_id]?.searchName.slice(start, end)) || stateAllPlayers[player_id]?.searchName.includes(player.slice(start, end)));
    }

    if (matches.length === 1) {
        return {
            id: matches[0],
            ...stateAllPlayers[matches[0]]
        }
    } else {
        return {
            error: {
                player: player,
                position: position,
                matches: matches,
                start: start,
                end: end

            }
        }
    }

}