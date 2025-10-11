import { date } from "./unit/date"
import { distance } from "./unit/distance"
import { percentage } from "./unit/percentage"
import { time } from "./unit/time"

export * as date from "./unit/date"
export * as distance from "./unit/distance"
export * as percentage from "./unit/percentage"
export * as time from "./unit/time"

export const text = (value: any): Node => new Text(value)

export const number = (value: any): Node => {
	return text(isNaN(value) ? "0" : Number(value).toLocaleString())
}

export const units = {
	...date,
	...distance,
	...percentage,
	...time,
}
