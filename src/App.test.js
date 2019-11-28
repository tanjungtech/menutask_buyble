const menuData = {
    "starters": [
        {
            "id": 1,
            "name": "Soup",
            "price": 3,
            "book": false
        },
        {
            "id": 2,
            "name": "Pâté",
            "price": 5,
            "book": false
        },
        {
            "id": 3,
            "name": "Bruschetta",
            "price": 4.5,
            "book": false
        },
        {
            "id": 4,
            "name": "Prawn cocktail",
            "price": 6,
            "book": false
        }
    ],
    "mains": [
        {
            "id": 5,
            "name": "Steak",
            "price": 18,
            "book": false
        },
        {
            "id": 6,
            "name": "Meatballs",
            "price": 11.50,
            "book": false
        },
        {
            "id": 7,
            "name": "Salmon fillet",
            "price": 14,
            "book": false
        },
        {
            "id": 8,
            "name": "Vegetarian lasagna",
            "price": 12,
            "book": false
        }
    ],
    "desserts": [
        {
            "id": 9,
            "name": "Sticky toffee",
            "price": 18,
            "book": false
        },
        {
            "id": 10,
            "name": "Tiramisu",
            "price": 4.5,
            "book": false
        },
        {
            "id": 11,
            "name": "Cheesecake",
            "price": 4,
            "book": false
        },
        {
            "id": 12,
            "name": "Ice cream",
            "price": 3.5,
            "book": false
        }
    ]
}

// Function Import

const mergeData = (ref) => {
	return [...Object.values(ref)].concat.apply([], Object.values(ref));
}

const termOneValidation = (refone, reftwo, course) => {
	const allMenus1 = mergeData(refone)
	const allMenus2 = mergeData(reftwo)
	return ([...allMenus1].filter(menu => menu.book).length > 1 && refone[course].findIndex( menu => menu.book ) > -1 && [...allMenus2].filter(menu => menu.book).length > 1 && reftwo[course].findIndex( menu => menu.book ) > -1)
}

const termTwoValidation = (refone, reftwo) => {
	return Object.keys(refone).map( (course) => [...Object.values(refone[course])].filter(menu => menu.book).length < 2 ).indexOf(false) < 0 && Object.keys(reftwo).map( (course) => [...Object.values(reftwo[course])].filter(menu => menu.book).length < 2 ).indexOf(false) < 0;
}

const termThreeValidation = (refone, reftwo, stock) => {
	return [...refone].filter(menu => menu.name === stock && menu.book ).length + [...reftwo].filter(menu => menu.name === stock && menu.book ).length < 2;
}

const termFourValidation = (refone, reftwo, arraySeparated) => {
	return [...refone].filter(menu => arraySeparated.indexOf(menu.name) > -1 && menu.book ).length !== arraySeparated.length && [...reftwo].filter(menu => arraySeparated.indexOf(menu.name) > -1 && menu.book ).length !== arraySeparated.length;
}

const checkOrder = (course, menuId) => {
	const indexOrder = menuData[course].findIndex( personMenu => personMenu.id === menuId );
	const updatePersonMenu = {...[...menuData[course]][indexOrder], book: true};
	let updateCourse = [...menuData[course]];
	updateCourse.splice(indexOrder, 1, updatePersonMenu);
	const updatedFinalState = {
		...menuData,
		[course]: updateCourse
	};
	return updatedFinalState;
}

// It's only for testing case
const multipleOrder = (arrayOrder) => {
	let data = {...menuData}
	arrayOrder.map( (array) => {
		const {course, menuId} = array
		const indexOrder = data[course].findIndex( personMenu => personMenu.id === menuId );
		const updatePersonMenu = {...[...data[course]][indexOrder], book: true};
		let updateCourse = [...data[course]];
		updateCourse.splice(indexOrder, 1, updatePersonMenu);
		const updatedFinalState = {
			...data,
			[course]: updateCourse
		};
		data = updatedFinalState;
		return null;
	} )
	return data;
}

// Testing Check Order State Update (onClick function for checkbox)
test('checkOrder Function Test', () => {
	expect(checkOrder("desserts", 12)).toEqual(
		expect.objectContaining({
			"desserts": expect.arrayContaining([
				expect.objectContaining({"book": true})
			])
		})
	);
});

test('Rule 1 validation Test', () => {
	// Freely to adjust two arrays according to rules applied
	const arrayOrderOne = [
		{course: "desserts", menuId: 12},
		{course: "mains", menuId: 7}
	];

	const arrayOrderTwo = [
		{course: "starters", menuId: 1},
		{course: "starters", menuId: 3},
		{course: "mains", menuId: 7}
	];

	const setupData = [multipleOrder( arrayOrderOne ), multipleOrder(arrayOrderTwo)];
	
	// toBeTruthy => not follow the rule
	expect(termOneValidation(setupData[0], setupData[1], 'mains')).toBeFalsy();
});

test('Rule 2 validation Test', () => {
	// Freely to adjust two arrays according to rules applied
	const arrayOrderOne = [
		{course: "desserts", menuId: 12},
		{course: "mains", menuId: 7}
	];

	const arrayOrderTwo = [
		{course: "mains", menuId: 7},
		{course: "mains", menuId: 5}
	];

	const setupData = [multipleOrder( arrayOrderOne ), multipleOrder(arrayOrderTwo)];
	
	// toBeFalsy => not follow the rule
	expect(termTwoValidation(setupData[0], setupData[1])).toBeFalsy();
});

test('Rule 3 validation Test', () => {
	// Freely to adjust two arrays according to rules applied
	const arrayOrderOne = [
		{course: "desserts", menuId: 12},
		{course: "desserts", menuId: 11}
	];

	const arrayOrderTwo = [
		{course: "mains", menuId: 7},
		{course: "desserts", menuId: 11}
	];

	const setupData = [mergeData(multipleOrder( arrayOrderOne )), mergeData(multipleOrder(arrayOrderTwo))];
	
	// toBeFalsy => not follow the rule
	expect(termThreeValidation(setupData[0], setupData[1], "Cheesecake")).toBeFalsy();
});

test('Rule 4 validation Test', () => {
	// Freely to adjust two arrays according to rules applied
	const arrayOrderOne = [
		{course: "starters", menuId: 4},
		{course: "mains", menuId: 7}
	];

	const arrayOrderTwo = [
		{course: "mains", menuId: 7},
		{course: "desserts", menuId: 11}
	];

	const setupData = [mergeData(multipleOrder( arrayOrderOne )), mergeData(multipleOrder(arrayOrderTwo))];
	
	// toBeFalsy => not follow the rule
	expect(termFourValidation(setupData[0], setupData[1], ["Salmon fillet", "Prawn cocktail"])).toBeFalsy();
});
