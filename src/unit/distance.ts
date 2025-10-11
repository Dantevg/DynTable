import { metricUnit } from "./metric";

export const distance = {
	/** Distance in millimetres */
	mm: metricUnit("m", 0.001, 1000, 0.001),
	/** Distance in centimetres */
	cm: metricUnit("m", 0.001, 1000, 0.01),
	/** Distance in metres */
	m: metricUnit("m", 0.001, 1000, 1),
	/** Distance in kilometres */
	km: metricUnit("m", 0.001, 1000, 1000),
}
