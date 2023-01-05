

const getTrades = async (trades_table) => {
    const trades = await trades_table.findAll()

    return trades
}

module.exports = {
    getTrades: getTrades
}
