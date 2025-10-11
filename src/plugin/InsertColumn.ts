import Plugin from "../Plugin"
import Table, { Column, Entry } from "../Table"

/**
 * Insert a column before or after another column.
 */
export default class InsertColumn implements Plugin {
	table: Table

	placement: InsertPosition

	/**
	 * Insert a column before or after another column.
	 * 
	 * @param column name of the column to insert before or after
	 * @param placement place to insert the column, either `"before"` or `"after"`
	 * @param classes classes to assign to the inserted column
	 * @param getElement function that returns the content of the inserted column
	 */
	constructor(
		public column: string,
		placement: "before" | "after",
		public classes: string[],
		public getElement: (column: Column, entry: Entry, value: any) => Node,
	) {
		this.placement = (placement == "before") ? "beforebegin" : "afterend"
	}

	init(table: Table) {
		this.table = table
	}

	thCreate(elem: HTMLTableCellElement, column: Column) {
		if (column.name == this.column) {
			const th = elem.insertAdjacentElement(this.placement, document.createElement("th"))
			th.classList.add(...this.classes)
		}
	}

	tdCreate(elem: HTMLTableCellElement, column: Column, entry: Entry, value: any) {
		if (column.name == this.column) {
			const td = elem.insertAdjacentElement(this.placement, document.createElement("td"))
			td.classList.add(...this.classes)
			td.append(this.getElement(column, entry, value))
		}
	}
}
