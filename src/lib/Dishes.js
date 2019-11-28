import React from "react"

const Dishes = (props) => {
	const { courseList, course, checkOrder, person1BookList, person2BookList } = props;
	const person1Course = person1BookList[course];
	const person2Course = person2BookList[course];
	const courseReturn = courseList.map((menu, index) => {
		return (
			<div className="course-wrapper extended-menu flex-layout align-items-center" key={menu.id}>
				<div className="menu-name">{menu.name} (${menu.price})</div>
				<div className="person-panel graybg-800">
					<input type="checkbox" inline="true" checked={ person1Course.findIndex( personMenu => personMenu.id === menu.id ).book } onChange={checkOrder( 'person1BookList', course, menu.id)} />
				</div>
				<div className="person-panel graybg-700">
					<input type="checkbox" inline="true" checked={ person2Course.findIndex( personMenu => personMenu.id === menu.id ).book } onChange={checkOrder( 'person2BookList', course, menu.id)} />
				</div>
			</div>
		)
	});
	return (<div>{courseReturn}</div>)
}

export default Dishes;