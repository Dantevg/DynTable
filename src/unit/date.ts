export const dateUnit = (preconvert: (source: any) => string | number | Date) => (source: any): string =>
	new Date(preconvert(source)).toLocaleString()

export const date = {
	/** Timestamp in seconds since the UNIX epoch */
	timestamp: dateUnit(Number),
	/** Formatted date string */
	formatted: dateUnit(source => source),
}
