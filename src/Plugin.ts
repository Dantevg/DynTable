import Table, { dataTransform, tdCreationHandler, thCreationHandler, trCreationHandler } from "./Table"

export default interface Plugin {
	init(table: Table): void
	
	thCreate?: thCreationHandler
	trCreate?: trCreationHandler
	tdCreate?: tdCreationHandler
	dataTransform?: dataTransform
}
