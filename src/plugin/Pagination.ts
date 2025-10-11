import Plugin from "../Plugin"
import Table, { Entry } from "../Table"

/**
 * Add pagination controls to the table.
 * 
 * There are two ways to enable pagination:
 * - Using pre-created button elements, with the constructor
 * - Automatically generating button elements, see {@link Pagination.create}
 */
export default class Pagination implements Plugin {
	table: Table

	currentPage: number = 1
	maxPage: number

	selectElem: HTMLSelectElement
	prevButton: HTMLButtonElement
	nextButton: HTMLButtonElement

	/**
	 * Add pagination controls to the table, using pre-created button elements.
	 * 
	 * @param displayCount maximum number of entries to display per page. Set to 0 to display all entries on a single page.
	 * @param parentElem element containing the pagination controls.
	 * 
	 * @see {@link Pagination.create} for generating button elements automatically.
	 */
	constructor(
		public displayCount: number,
		public parentElem: HTMLElement,
	) {
		this.selectElem = parentElem.querySelector("select")
		this.prevButton = parentElem.querySelector("button[name=prev]")
		this.nextButton = parentElem.querySelector("button[name=next]")

		this.selectElem.addEventListener("change",
			(e) => this.changePageAndUpdate(Number((e.target as HTMLSelectElement).value)))
		this.prevButton.addEventListener("click",
			() => this.changePageAndUpdate(this.currentPage - 1))
		this.nextButton.addEventListener("click",
			() => this.changePageAndUpdate(this.currentPage + 1))
	}

	/**
	 * Add pagination controls to the table, automatically generating button elements.
	 * 
	 * @param displayCount maximum number of entries to display per page. Set to 0 to display all entries on a single page.
	 * @param elem element where the pagination controls will be added.
	 */
	static create(displayCount: number, elem: HTMLElement) {
		const prevButton = elem.appendChild(document.createElement("button"))
		prevButton.classList.add("table-pagination")
		prevButton.name = "prev"
		prevButton.innerText = "Prev"

		const pageSelect = elem.appendChild(document.createElement("select"))
		pageSelect.classList.add("table-pagination")
		pageSelect.name = "page"

		const nextButton = elem.appendChild(document.createElement("button"))
		nextButton.classList.add("table-pagination")
		nextButton.name = "next"
		nextButton.innerText = "Next"

		return new Pagination(displayCount, elem)
	}

	init(table: Table) {
		this.table = table
	}

	dataTransform = (entries: Entry[]) => {
		this.maxPage = (this.displayCount > 0) ? Math.ceil(entries.length / this.displayCount) : 1
		this.update()
		return entries.slice(...this.getRange(entries.length))
	}

	changePage(page: number) {
		page = Math.max(1, Math.min(page, this.maxPage))
		this.currentPage = page
	}

	changePageAndUpdate(page: number) {
		this.changePage(page)
		this.update()
		this.table.update()
	}

	update() {
		// Hide all controls when there is only one page
		if (this.maxPage == 1) {
			this.parentElem.classList.add("pagination-hidden")
		} else {
			this.parentElem.classList.remove("pagination-hidden")
		}

		// Page selector
		if (this.selectElem) {
			this.selectElem.innerHTML = ""
			for (let i = 1; i <= this.maxPage; i++) {
				const optionElem = document.createElement("option")
				optionElem.innerText = String(i)
				this.selectElem.append(optionElem)
			}
			this.selectElem.value = String(this.currentPage)
		}

		// "Prev" button
		if (this.prevButton) this.prevButton.toggleAttribute("disabled", this.currentPage <= 1)

		// "Next" button
		if (this.nextButton) this.nextButton.toggleAttribute("disabled", this.currentPage >= this.maxPage)
	}

	getRange(nEntries?: number): [number, number] {
		const min = (this.currentPage - 1) * this.displayCount
		const max = (this.displayCount > 0)
			? Math.min(this.currentPage * this.displayCount, nEntries)
			: nEntries
		return [min, max]
	}
}
