import Plugin from "../Plugin"
import Table, { Data, Entry } from "../Table"

/**
 * Remove values considered empty from the table data.
 */
export default class RemoveEmpty implements Plugin {
	table: Table

	emptyValues: Set<any>

	/**
	 * Remove values considered empty from the table data.
	 * 
	 * @param emptyValues values to consider empty (default: `[null, "", "0", 0]`)
	 */
	constructor(emptyValues: any[] = [null, "", "0", 0]) {
		this.emptyValues = new Set(emptyValues)
	}

	init(table: Table) {
		this.table = table
	}

	dataTransform = ({ columns, entries }: Data) =>
		({ columns, entries: entries.map(entry => entry.map(value => this.emptyValues.has(value) ? undefined : value)) })
}
