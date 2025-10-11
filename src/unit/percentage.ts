export const percentageUnit = (source: any): string => `${isNaN(source) ? 0 : Number(source)} %`

export const percentage = {
	/** Percentage between 0-100 */
	percent: percentageUnit,
	/** Percentage between 0-100 */
	'%': percentageUnit,
	/** Percentage between 0-1 */
	percent01: (source: any): string => percentageUnit(Number(source) * 100),
}
