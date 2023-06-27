class SummaryRow {
	constructor(orderNumber, productName, cost) {
		this.orderNumber = orderNumber;
		this.productName = productName;
		this.cost = cost;
	}
}

const createOrderNumbersSummary = async (orderNumbers) => {
	const input = document.querySelector('input[placeholder="Item Code"]');
	const submitButton = document.querySelector("#searchbutton");
	const resetButton = document.querySelector("#clearFilterBtn");

	// order number summary
	const summary = [];

	// bad codes array
	const badCodes = [];

	// Returns a Promise that resolves after "ms" Milliseconds
	const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	for (const orderNumber of orderNumbers) {
		let inventoryCell;
		let nameCell;
		let costCell;

		// try up to 3 times in case they fail for spotty internet
		for (i = 0; i < 3; i++) {
			// reset page
			resetButton.click();

			// type the code into the input
			const event = new Event("input", { bubbles: true });
			input.value = orderNumber;
			input.dispatchEvent(event);

			await timer(750);

			// press submit button
			submitButton.click();

			await timer(500);

			// look at the page and store some info
			const firstRow = document.querySelectorAll(
				'p[style="color: black; font-weight: lighter; font-size: 14px;"]'
			);
			inventoryCell = firstRow.item(8);
			nameCell = firstRow.item(13);

			const secondRow = document.querySelectorAll(
				'span[ref="eCellValue"]'
			);
			costCell = secondRow.item(4);

			if (inventoryCell || nameCell || costCell) {
				// we got something, no need to search again
				break;
			}
		}

		// keep track of codes that never return anything so they can be investigated later
		if (!inventoryCell || !nameCell || !costCell) {
			badCodes.push(orderNumber);
		}

		// update summary
		summary.push(
			new SummaryRow(
				orderNumber,
				nameCell?.textContent ?? "no product found",
				costCell?.innerText ?? "no cost found"
			)
		);
	}

	console.table(summary);
	console.table(badCodes);
};

const orderNumbers = [
	"148327",
	"12341234",
	"12341234",
	"824365",
	"807837",
	"994374",
	"846494",
	"767261",
	"789045",
	"841944",
	"248328",
];
createOrderNumbersSummary(orderNumbers);
