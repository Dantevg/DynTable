import Table, { Column, Data, Entry } from "../Table"
import Plugin from "../Plugin"

/**
 * Add an in-cell bar chart.
 */
export default class BarChart implements Plugin {
	table: Table

	ranges: Map<Column, [number, number] | null> = new Map()

	/**
	 * Add an in-cell bar chart.
	 */
	constructor() { }

	init(table: Table) {
		this.table = table
	}

	dataTransform({ columns, entries }: Data): Data {
		this.ranges = new Map()

		for (const entry of entries) {
			for (const [i, value] of entry.entries()) {
				const column = columns[i]
				const number = Number(value ?? 0)
				const range = this.ranges.get(column)
				if (isNaN(number) || range === null) {
					this.ranges.set(column, null)
				} else {
					this.ranges.set(column, [
						Math.min(range?.[0] ?? Number.POSITIVE_INFINITY, number),
						Math.max(range?.[1] ?? Number.NEGATIVE_INFINITY, number)
					])
				}
			}
		}

		return { columns, entries }
	}

	tdCreate(elem: HTMLTableCellElement, column: Column, _entry: Entry, value: any) {
		const range = this.ranges.get(column)
		if (!range) return

		const relative = Number(value) / range[1]
		elem.style.setProperty("--relative", `${relative * 100}%`)
	}
}
