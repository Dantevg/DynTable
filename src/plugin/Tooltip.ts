import Table, { Column, Entry } from "../Table"
import Plugin from "../Plugin"

/**
 * Add a tooltip when hovering a cell.
 */
export default class Tooltip implements Plugin {
	table: Table

	/**
	 * Add a tooltip when hovering a cell.
	 * 
	 * @param getTooltip function that returns the content of the tooltip
	 */
	constructor(
		public getTooltip: (column: Column, entry: Entry, value: any) => string
	) { }

	init(table: Table) {
		this.table = table
	}

	tdCreate(elem: HTMLTableCellElement, column: Column, entry: Entry, value: any) {
		elem.title = this.getTooltip(column, entry, value)
	}
}
