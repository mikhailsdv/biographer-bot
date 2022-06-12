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

const getRandomInt = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min)) + min //Максимум не включается, минимум включается
}

const arrayShuffle = b => {
	const a = b.slice()
	let j, x, i
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1))
		x = a[i]
		a[i] = a[j]
		a[j] = x
	}
	return a
}

module.exports = {arrayChunk, arrayFindAll, trimMessage, arrayRandom, getRandomInt, arrayShuffle}
