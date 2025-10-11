export const metricPrefixes = [
	{ offset: 1e-9, symbol: "n" },
	{ offset: 1e-6, symbol: "µ" },
	{ offset: 1e-3, symbol: "m" },
	{ offset: 1, symbol: "" },
	{ offset: 1e3, symbol: "k" },
	{ offset: 1e6, symbol: "M" },
	{ offset: 1e9, symbol: "G" },
	{ offset: 1e12, symbol: "T" },
	{ offset: 1e15, symbol: "P" },
	{ offset: 1e18, symbol: "E" },
]

export const metricUnit = (suffix: string, minOffset: number, maxOffset: number, offset: number) => (source: any): string => {
	source = Number(source)
	if (source == 0 || isNaN(source)) return `0 ${suffix}`

	const prefixes = metricPrefixes.filter(prefix => prefix.offset >= minOffset && prefix.offset <= maxOffset)

	for (const prefix of prefixes) {
		if (source * offset < prefix.offset * 1000) {
			return `${Math.floor(source * offset / prefix.offset)} ${prefix.symbol}${suffix}`
		}
	}

	const prefix = prefixes.at(-1)
	return `${Math.floor(source * offset / prefix.offset)} ${prefix.symbol}${suffix}`
}
