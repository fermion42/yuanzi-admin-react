import cx from 'classnames';
import merge from 'lodash.merge';
import find from 'lodash.find';
import React from 'react';
import {Component} from 'relax-framework';

import A from './a';
import Utils from '../helpers/utils';
import LabelPicker from '../containers/data-types/label-picker';
import DateRangePicker from '../components/data-types/date-range-picker';
export default class Search extends Component {
	static propTypes = {
		url: React.PropTypes.string.isRequired,
		search: React.PropTypes.object.isRequired,
		searchFields: React.PropTypes.array.isRequired,
		query: React.PropTypes.object,
		history: React.PropTypes.object.isRequired
	}

	getInitState() {
		return {
			search: this.props.search || {},
		};
	}

// {search: {type: {value: 'xxxxx'}}}
	searchChange = (id, event) => {
		event.preventDefault();
		const search = this.state.search;
		if(id === 'event'){

		}
		if(event.target.value.length !== 24){
			search[id].value = 'q6fa33dae800b2ecad532372'
		}
		search[id].value = event.target.value;
		this.setState({search: search});
	}

	onDateRangeChange(id, value) {
		const search = this.state.search;
		search[id].value = value;
		this.setState({search: search});
	}

	searchSubmit = (event) => {
		event.preventDefault();
		const query = Object.assign({}, this.props.query || {});

		if (this.state.search !== {}) {
			merge(query, {search: JSON.stringify(this.state.search), s: this.state.search});
		} else {
			delete query.search;
			delete query.s;
		}
		const url = Utils.parseQueryUrl(this.props.url, query);
		this.props.history.pushState({}, url);
	}

	render() {
		return (
			<div id="DataTables_Table_0_filter" className="dataTables_filter">
				<form role="search" autoComplete='on'>
					<input type="text" style={{display:'none'}}/>
					<div className="row">
						{this.props.searchFields && this.props.searchFields.map(this.renderFormItem, this)}
					</div>
					<div className="row">
						<div className="col-lg-4">
							<button className="btn btn-sm btn-primary" type="button"
							        onClick={this.searchSubmit.bind(this)}>搜索
							</button>
						</div>
					</div>

				</form>
			</div>
		);
	}

	renderFormItem(searchField) {
		const type = searchField.type;
		var formItem;

		if (type === 'select') {
			const defaultValue = find(searchField.options, (option)=>option.selected).value;
			const options = searchField.options.map(function (item) {
				return <option value={item.value}>{item.name}</option>;
			});
			formItem = <select {...searchField}
				defaultValue={defaultValue}
				onChange={this.searchChange.bind(this, searchField.key)}
				className="form-control" id={searchField.key}>{options}</select>;
		} else {
			formItem = <input
				{...searchField}
				className="form-control"
				onChange={this.searchChange.bind(this, searchField.key)}
				placeholder={"请输入"+searchField.label}
				value={this.state.search[searchField.key].value}/>
		}


		if (type === 'labelPicker') {
			return (
				<div className="col-lg-4">
					<div className="form-group" key={searchField.key}>
						<LabelPicker onChange={::this.searchChange}
						             key={searchField.key}
						             value={this.state.search[searchField.key].value || 'all'}
						             labelsType={searchField.labelsType}
						             option={{
										id: 'labels',
										label: '标签',
										isAllShow: true
									}}
						/>
					</div>
				</div>

			)
		} else if (type === 'dateRangePicker') {
			return (
				<div className="col-lg-4">
					<div className="form-group" key={searchField.key}>
						<label className="control-label">{searchField.label}</label>
						<DateRangePicker onChange={::this.onDateRangeChange}
						                 id={searchField.key}
						                 key={searchField.key}
						                 selected={this.state.search[searchField.key].value || {}}
						                 dateFormat={searchField.options.dateFormat}
						                 maxDate={searchField.options.maxDate}
						/>
					</div>
				</div>
			);
		} else {
			return (
				<div className="col-lg-4">
					<div className="form-group" key={searchField.key}>
						<label className="control-label" for={searchField.key}>{searchField.label}</label>
						{formItem}
					</div>
				</div>
			);
		}

	}

}
