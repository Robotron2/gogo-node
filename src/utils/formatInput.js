const _ = require("lodash")
const formatToLower = (text) => {
	return _.toLower(text)
}
const formatToCapital = (text) => {
	return _.capitalize(text)
}

module.exports = {
	formatToLower,
	formatToCapital,
}
