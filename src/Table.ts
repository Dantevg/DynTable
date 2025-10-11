import Plugin from "./Plugin"

export * as format from "./format"
export { default as FilterNonEmpty } from "./plugin/FilterNonEmpty"
export { default as InsertColumn } from "./plugin/InsertColumn"
export { default as Pagination } from "./plugin/Pagination"
export { default as RemoveEmpty } from "./plugin/RemoveEmpty"
export { default as Sorting } from "./plugin/Sorting"
export { default as Tooltip } from "./plugin/Tooltip"

export type Alignment = "left" | "center" | "right"
export type Entry = any[]
export type Column = {
	name: string
	format: (value: any) => Node
	formatHeading?: (name: string) => Node
	align?: Alignment
}

export type thCreationHandler = (elem: HTMLTableCellElement, column: Column) => void
export type trCreationHandler = (elem: HTMLTableRowElement, entry?: Entry) => void
export type tdCreationHandler = (elem: HTMLTableCellElement, column: Column, entry: Entry, value: any) => void
export type dataTransform = (entries: Entry[]) => Entry[]

const createHandlerList = <T extends (...args: any[]) => void>(handlers: T[]) =>
	(...args: Parameters<T>) => {
		for (const handler of handlers) handler(...args)
	}

const createPipeline = <U, T extends (arg: U) => U>(handlers: T[]) =>
	(data: U): U => {
		for (const handler of handlers) data = handler(data)
		return data
	}

const addHandler = <T extends (...args: any[]) => any>(handlers: T[], handler?: T) => {
	if (handler != undefined) handlers.push(handler)
}

type CreationHandlers = {
	th?: thCreationHandler
	tr?: trCreationHandler
	td?: tdCreationHandler
}

export default class Table {
	plugins: Map<Function, Plugin> = new Map()
	creationHandlers: CreationHandlers
	dataPipeline: dataTransform[] = []
	dataTransform: dataTransform

	constructor(
		public tableElem: HTMLTableElement,
		public columns: Column[],
		public entries: Entry[],
		plugins: Plugin[],
	) {
		const thCreationHandlers: thCreationHandler[] = []
		const trCreationHandlers: trCreationHandler[] = []
		const tdCreationHandlers: tdCreationHandler[] = []

		for (const plugin of plugins) {
			this.plugins.set(plugin.constructor, plugin)
			plugin.init(this)
			addHandler(thCreationHandlers, plugin.thCreate?.bind(plugin))
			addHandler(trCreationHandlers, plugin.trCreate?.bind(plugin))
			addHandler(tdCreationHandlers, plugin.tdCreate?.bind(plugin))
			addHandler(this.dataPipeline, plugin.dataTransform?.bind(plugin))
		}

		this.dataTransform = createPipeline(this.dataPipeline)

		this.creationHandlers = {
			th: createHandlerList(thCreationHandlers),
			tr: createHandlerList(trCreationHandlers),
			td: createHandlerList(tdCreationHandlers),
		}
	}

	update() {
		this.tableElem.innerHTML = ""

		const thead = this.createHead()
		const tbody = this.createBody()

		this.tableElem.append(thead, tbody)
	}

	createHead(): HTMLTableSectionElement {
		const thead = document.createElement("thead")

		const headerElem = thead.appendChild(document.createElement("tr"))
		for (const column of this.columns) {
			const th = headerElem.appendChild(document.createElement("th"))
			th.setAttribute("data-column", column.name)
			if (column.align != undefined) th.setAttribute("data-align", column.align)
			th.append((column.formatHeading != undefined)
				? column.formatHeading(column.name)
				: column.name)
			this.creationHandlers.th?.(th, column)
		}
		this.creationHandlers.tr?.(headerElem)

		return thead
	}

	createBody(): HTMLTableSectionElement {
		const tbody = document.createElement("tbody")

		const entries = this.dataTransform(this.entries)

		for (const entry of entries) {
			const tr = tbody.appendChild(document.createElement("tr"))
			for (let i = 0; i < this.columns.length; i++) {
				const column = this.columns[i]
				const td = tr.appendChild(document.createElement("td"))
				td.setAttribute("data-column", column.name)
				if (column.align != undefined) td.setAttribute("data-align", column.align)
				td.setAttribute("data-value", (entry[i] != undefined) ? entry[i] : "")
				if (entry[i] == undefined) td.setAttribute("data-empty", "")
				td.append(column.format(entry[i]))
				this.creationHandlers.td?.(td, column, entry, entry[i])
			}
			this.creationHandlers.tr?.(tr, entry)
		}

		return tbody
	}
}
