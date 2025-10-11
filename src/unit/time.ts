export const timeUnit = (offset: number) => (source: any): string => {
	source = Number(source)
	if (source == 0 || isNaN(source)) return "0 s"

	const inSeconds = source * offset

	const date = new Date(inSeconds * 1000)
	const d = Math.floor(inSeconds / (24 * 60 * 60))
	const h = date.getUTCHours()
	const m = date.getUTCMinutes()
	const s = date.getUTCSeconds() + date.getUTCMilliseconds() / 1000

	if (h > 0 || d > 0) {
		return `${h + d * 24}:${String(m).padStart(2, "0")} h`
	} else if (m > 0) {
		return `${m}:${String(Math.floor(s)).padStart(2, "0")}`
	} else {
		return `${s} s`
	}
}

export const time = {
	/** Time in milliseconds */
	ms: timeUnit(0.001),
	/** Time in seconds */
	s: timeUnit(1),
	/** Time in minutes */
	min: timeUnit(60),
	/** Time in hours */
	h: timeUnit(60 * 60),
	/** Time in days */
	d: timeUnit(24 * 60 * 60),
}
