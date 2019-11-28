import React from 'react';
import { render } from 'react-dom';
import { validateBooking } from './lib/Validation';

import Dishes from './lib/Dishes';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.checkOrder = this.checkOrder.bind(this);
		this.state = {
			menuList: null,
			person1BookList: [],
			person2BookList: [],
			errors: {},
			totalBill: 0
		};
	}

	componentDidMount() {
		// Menu Data JSON is converted in JSON Storage
		fetch('https://jsonstorage.net/api/items/ad7a50f7-bbd2-4188-a2e0-8c8a728b1564').then(response => response.json()).then(data => {
				const personBook = Object.assign({}, ...Object.keys(data).map( (key) => {
					const menuForPerson = [...data[key]].map( (menu) => {
						let setMenu = {...menu};
						setMenu.book = false;
						return setMenu;
					})
					return {
						[key]: menuForPerson
					}
				} ));
				this.setState({
					menuList: data,
					person1BookList: personBook,
					person2BookList: personBook
				});
			});
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.person1BookList !== this.state.person1BookList || prevState.person2BookList !== this.state.person2BookList) {
			// Validate User's Booking
			const bookValidateResult = validateBooking( {...this.state.person1BookList}, {...this.state.person2BookList} );
			this.setState(prevState => ({
				...prevState,
				errors: bookValidateResult
			}));
		}
	}

	checkOrder = (name, course, menuId) => e => {
		const indexOrder = this.state[name][course].findIndex( personMenu => personMenu.id === menuId );
		const updatePersonMenu = {...[...this.state[name][course]][indexOrder], book: e.target.checked};
		let updateCourse = [...this.state[name][course]];
		updateCourse.splice(indexOrder, 1, updatePersonMenu);
		const calculateBill = e.target.checked === true ? this.state.totalBill + parseFloat(updatePersonMenu.price) : this.state.totalBill - parseFloat(updatePersonMenu.price)

		// Updating State
		this.setState(prevState => ({
			...prevState,
			[name]: {
				...prevState[name],
				[course]: updateCourse
			},
			totalBill: calculateBill
		}));
	}

    render() {
    	const { menuList, person1BookList, person2BookList, totalBill, errors } = this.state;
    	if( menuList === null ) {
			return (
				<div className="text-align-center">Loading ...</div>
			)
		}
		return (
        	<div className="default-container">
        		<div className="flex-layout justify-content-center align-items-center">
	        		<div className="order-form">
	        			<div>
		        			<h1>Order Menu for Two Diners</h1>
		        		</div>
		        		<div className="menu-wrapper">
		        			<h3>Menus</h3>
		        			<div className="person-tickers extended-menu flex-layout flex-wrap align-items-center justify-content-flex-end">
	        					<div className="person-panel primary graybg-800">Person 1</div>
	        					<div className="person-panel primary graybg-700">Person 2</div>
		        			</div>
		        			{Object.keys(menuList).map((course, index) => {
		        				return (
		        					<div className="margin-1em" key={index}>
		        						<div className="title-menu extended-menu">{course}</div>
		        						<Dishes course={course} courseList={menuList[course]} checkOrder={this.checkOrder} person1BookList={person1BookList} person2BookList={person2BookList} />
		        					</div>
		        				)
		        			})}
		        		</div>
		        		{!(!errors.type1 && !errors.type2 && !errors.type3 && !errors.type4) &&
	        				<div className="error-notice-panel">
	        					<div><strong>Error Messages:</strong></div>
			        			{
			        				errors.type1 && <div>Each person must have at least two courses, one of which must be a main.</div>
			        			}
			        			{
			        				errors.type2 && <div>Each diner cannot have more than one of the same course.</div>
			        			}
			        			{
			        				errors.type3 && <div>There is only one piece of cheesecake left.</div>
			        			}
			        			{
			        				errors.type4 && <div>Waiter expect you not to have prawn cocktail and salmon fillet in the same meal.</div>
			        			}
			        		</div>
			        	}
		        		{
		        			totalBill > 0 &&
		        			<div>
			        			<div className="total-bill-panel"><strong>Total Bill:</strong> {`$${totalBill}`}</div>
			        		</div>
		        		}
		        	</div>
		        </div>
        	</div>
        )
    }
}

render(<App />, document.getElementById('root'));