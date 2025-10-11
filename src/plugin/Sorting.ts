import Plugin from "../Plugin"
import Table, { Column, Entry } from "../Table"
import Pagination from "./Pagination"

const getFromURL = (by: string, descending: boolean): [string, boolean] => {
	const params = new URLSearchParams(window.location.search)
	const sort = params.get("sort")
	const order = params.get("order")
	if (sort != undefined) by = sort.replace(/\+/g, " ")
	if (order != undefined) descending = (order.toLowerCase() == "desc")
	return [by, descending]
}

const setURL = (by: string, descending: boolean) => {
	window.history.replaceState({}, "",
		location.pathname + "?sort=" + by.replace(/\s/g, "+")
		+ "&order=" + (descending ? "desc" : "asc"))
}

const arrowUp = "▲"
const arrowDown = "▼"

/**
 * Add sorting buttons to the table heading.
 */
export default class Sorting implements Plugin {
	table: Table

	/**
	 * Add sorting buttons to the table heading.
	 * 
	 * @param by column name to sort by
	 * @param descending sort in descending order
	 * @param useURL read from and write to the URL query parameters `sort` and `order`
	 */
	constructor(
		public by: string,
		public descending = false,
		public useURL = true,
	) {
		if (this.useURL) {
			[this.by, this.descending] = getFromURL(this.by, this.descending)
		}
	}

	init(table: Table) {
		this.table = table
	}

	thCreate(elem: HTMLTableCellElement, column: Column) {
		elem.classList.toggle("sort-column", column.name == this.by)
		if (column.name == this.by) elem.classList.add(this.descending ? "sort-descending" : "sort-ascending")

		const div = document.createElement("div")
		div.classList.add("table-sort")

		const btn = document.createElement("button")
		btn.addEventListener("click", this.thClick(column))

		const up = document.createElement("span")
		up.innerText = arrowUp
		up.classList.toggle("active", column.name == this.by && !this.descending)

		const down = document.createElement("span")
		down.innerText = arrowDown
		down.classList.toggle("active", column.name == this.by && this.descending)

		btn.append(up, "\n", down)

		// Move all existing children into the div
		while (elem.firstChild) div.append(elem.firstChild)

		if (column.align == "left") div.append(btn)
		else div.prepend(btn)

		elem.append(div)
	}

	dataTransform = (entries: Entry[]) => this.sort(entries)

	thClick(column: Column) {
		return () => {
			this.descending = (column.name === this.by) ? !this.descending : true
			this.by = column.name

			if (this.table.plugins.has(Pagination)) {
				const pagination = this.table.plugins.get(Pagination) as Pagination
				if (pagination.displayCount > 0) pagination.changePage(1)
			}
			this.table.update()

			// Set URL query string for sharing
			if (this.useURL) setURL(this.by, this.descending)
		}
	}

	sort(entries: Entry[]): Entry[] {
		// Pre-create collator for significant performance improvement
		// over `a.localeCompare(b, undefined, {sensitivity: "base"})`
		// funny / weird thing: for localeCompare, supplying an empty `options`
		// object is way slower than supplying nothing...
		const collator = new Intl.Collator(undefined, { sensitivity: "base" })

		const order = (this.descending ? -1 : 1)
		const columnIdx = this.table.columns.findIndex(column => column.name == this.by)

		// When a and b are both numbers, compare as numbers.
		// Otherwise, case-insensitive compare as string.
		// Convert undefined values to -inf to sort them last
		return entries.sort((a_row, b_row) => {
			const a = a_row[columnIdx] ?? Number.NEGATIVE_INFINITY
			const b = b_row[columnIdx] ?? Number.NEGATIVE_INFINITY
			if (!isNaN(Number(a)) && !isNaN(Number(b))) {
				return order * (a - b)
			} else {
				return order * collator.compare(a, b)
			}
		})
	}
}
