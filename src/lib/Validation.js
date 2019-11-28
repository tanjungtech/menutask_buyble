export const validateBooking = (person1, person2) => {
	// Aggregate all menus and booking status
	const allMenus1 = mergeData(person1);
	const allMenus2 = mergeData(person2);
	
	const allValidation = {
		"type1": !termOneValidation(person1, person2, 'mains'),
		"type2": !termTwoValidation(person1, person2),
		"type3": !termThreeValidation(allMenus1, allMenus2, "Cheesecake"),
		"type4": !termFourValidation(allMenus1, allMenus2, ["Salmon fillet", "Prawn cocktail"] )
	};

	return allValidation;
}

export const mergeData = (ref) => {
	return [...Object.values(ref)].concat.apply([], Object.values(ref));
}

export const termOneValidation = (refone, reftwo, course) => {
	const allMenus1 = mergeData(refone)
	const allMenus2 = mergeData(reftwo)
	return ([...allMenus1].filter(menu => menu.book).length > 1 && refone[course].findIndex( menu => menu.book ) > -1 && [...allMenus2].filter(menu => menu.book).length > 1 && reftwo[course].findIndex( menu => menu.book ) > -1)
	return ([...allMenus1].filter(menu => menu.book).length > 1 && refone[course].findIndex( menu => menu.book ) > -1 && [...allMenus2].filter(menu => menu.book).length > 1 && reftwo[course].findIndex( menu => menu.book ) > -1)
}

export const termTwoValidation = (refone, reftwo) => {
	return Object.keys(refone).map( (course) => [...Object.values(refone[course])].filter(menu => menu.book).length < 2 ).indexOf(false) < 0 && Object.keys(reftwo).map( (course) => [...Object.values(reftwo[course])].filter(menu => menu.book).length < 2 ).indexOf(false) < 0;
}

export const termThreeValidation = (refone, reftwo, stock) => {
	return [...refone].filter(menu => menu.name === stock && menu.book ).length + [...reftwo].filter(menu => menu.name === stock && menu.book ).length < 2;
}

export const termFourValidation = (refone, reftwo, arraySeparated) => {
	return [...refone].filter(menu => arraySeparated.indexOf(menu.name) > -1 && menu.book ).length !== arraySeparated.length && [...reftwo].filter(menu => arraySeparated.indexOf(menu.name) > -1 && menu.book ).length !== arraySeparated.length;
}