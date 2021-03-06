import React, {PropTypes} from 'react';
import {Component, mergeFragments} from 'relax-framework';

import Breadcrumbs from '../../../breadcrumbs';
import Filter from '../../../filter';
import Search from '../../../search';
import Lightbox from '../../../lightbox';
import Pagination from '../../../pagination';
import ListTable from '../../elements/table';
export default class Users extends Component {


	static propTypes = {
		breadcrumbs: PropTypes.array.isRequired,
		users: PropTypes.array,
		showFields: PropTypes.array.isRequired,
		searchFields: PropTypes.array.isRequired,
		searchValues: PropTypes.object.isRequired,
		query: PropTypes.object,
		count: PropTypes.number,
		onCheck: PropTypes.func.isRequired,
		onEditLabels: PropTypes.func.isRequired,
		onDel: PropTypes.func.isRequired,
		history: PropTypes.object.isRequired
	};

	render() {
		return (
			<div>
				<div className="ibox-content m-b-sm border-bottom">
					{this.renderSearch()}
				</div>
				<div className="ibox-content">
					<div className='table-responsive'>
						<div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap">
							<ListTable
								listSchema='user'
								renderEntries={this.props.users}
								showFields={this.props.showFields}
								onCheck={this.props.onCheck}
								onEditLabels={this.props.onEditLabels}
								onDel={this.props.onDel}
								onCheck={this.props.onCheck}
								{...this.props}
							/>
							<Pagination
								url='/admin/users'
								query={this.props.query}
								count={this.props.count}
							/>
						</div>
					</div>
				</div>
			</div>

		);
	}
	renderSearch() {
		if (this.props.searchFields.length) {
			return (
				<Search
					url='/admin/users'
					search={this.props.searchValues}
					searchFields={this.props.searchFields}
					query={this.props.query}
					history={this.props.history}
				/>
			)
		}
	}
}
