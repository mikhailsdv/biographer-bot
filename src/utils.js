const arrayChunk = (arr, size) => {
	const result = []
	for (let i = 0; arr[i]; ) {
		result.push(arr.slice(i, i + size))
		i += size
	}
	return result
}

const arrayFindAll = (arr, f) => {
	const results = []
	for (item of arr) {
		if (f(item) === true) {
			results.push(results)
		}
	}
	return results
}

const trimMessage = str => str.replace(/\t+/gm, "")

const arrayRandom = arr => {
	return arr[Math.floor(Math.random() * arr.length)]
}

module.exports = {arrayChunk, trimMessage, arrayRandom}
