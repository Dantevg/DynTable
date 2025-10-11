import Plugin from "../Plugin"
import Table, { Entry } from "../Table"

/**
 * Filter out entries that do not have any values.
 */
export default class FilterNonEmpty implements Plugin {
	table: Table

	/**
	 * Filter out entries that do not have any values.
	 * 
	 * @param ignoredColumns columns to ignore when determining if an entry is empty
	 */
	constructor(public ignoredColumns: string[] = []) { }

	init(table: Table) {
		this.table = table
	}

	dataTransform = (entries: Entry[]) =>
		entries.filter(this.isNonemptyEntry.bind(this))

	isNonemptyEntry = (entry: Entry): boolean =>
		entry.filter((value, idx) =>
			value != undefined
			&& !this.ignoredColumns.includes(this.table.columns[idx].name)
		).length > 0
}
