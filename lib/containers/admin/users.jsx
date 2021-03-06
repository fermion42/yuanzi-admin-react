import * as usersActions from '../../client/actions/users';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Component, buildQueryAndVariables, mergeFragments} from 'relax-framework';
import Utils from '../../helpers/utils';

import queryProps from '../../decorators/query-props';
import Users from '../../components/admin/panels/users';
import {userConfig} from './containerInitConfig';
import Lightbox from '../../components/lightbox';
import LabelPickerByType from '../data-types/labelPickerByType';

import countBy from 'lodash.countby';
@connect(
	(state) => ({
		users: state.users.data.items,
		count: state.users.data.count
	}),
	(dispatch) => bindActionCreators(usersActions, dispatch)
)
@queryProps({
	page: 1,
	limit: 20,
	sort: 'createdAt',
	order: 'desc',
	search: JSON.stringify(userConfig.searchValues || {})
})
export default class UsersContainer extends Component {
	static fragments = mergeFragments({
		usersCount: {
			count: 1
		}
	}, {users: userConfig.fragments.user});
	static defaultRequiredSearch = userConfig.defaultRequiredSearch;

	static panelSettings = userConfig;

	static propTypes = {
		breadcrumbs: PropTypes.array.isRequired,
		users: PropTypes.array,
		showFields: PropTypes.array,
		searchFields: PropTypes.array,
		query: PropTypes.object,
		count: PropTypes.number,
		hasQueryChanged: PropTypes.bool.isRequired,
		queryVariables: PropTypes.object.isRequired,
		removeUser: PropTypes.func.isRequired,
		updateUser: PropTypes.func.isRequired
	}

	getInitState() {
		return {
			searchValues: userConfig.searchValues || {},
			checking: false,
			labelsSelectting: false
		};
	}
	onCheck(data){
		this.setState({
			checking: true,
			checkUser: data
		});
	}
	cancelCheck(){
		this.setState({
			checking: false
		});
	}
	refuseCheck(){
		this.setState({
			checking: false
		});
		let checkUser = this.state.checkUser;
		checkUser.talentStatus = 'rejected';
		checkUser.talentInfo = {};
		this.props.updateUser(userConfig.fragments, checkUser)
			.done();

	}
	passedCheck(){
		this.setState({
			checking: false
		});
		let checkUser = this.state.checkUser;
		console.log("===============",checkUser);
		checkUser.talentStatus = 'done';
		this.props.updateUser(userConfig.fragments, checkUser)
			.done();

	}
	onEditLabels(data){
		this.setState({
			labelsSelectting: true,
			edittingUser: data
		});
	}

	cancelEditLabels(){
		this.setState({labelsSelectting: false});
	}
	confirmEditLabels(selectedLabels){
		this.setState({labelsSelectting: false});
		this.props.updateUser({user: {_id: 1,labels:{_id: 1,title: 1}}}, {_id:this.state.edittingUser._id,labels: selectedLabels})
			.done();
	}

	onDel(data){
		data.isDel = data.isDel  === '封号' ? false: true;
		this.props.updateUser(userConfig.fragments, data).done()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.hasQueryChanged) {
			const vars = {
				users: {
					...nextProps.queryVariables
				}
			};

			nextProps
				.getAdmin(buildQueryAndVariables(
					this.constructor.fragments,
					vars
				))
				.done();
		}
	}

	render() {
		return (
			<div>
				<Users
					{...this.props}
					{...this.state}
					onCheck={::this.onCheck}
					onEditLabels={::this.onEditLabels}
					onDel={::this.onDel}
				/>
				{this.renderCheck()}
				{this.renderLabelPickerByType()}
			</div>
		);
	}
	renderCheck(){
		if(this.state.checking){
			return (
				<Lightbox className='xs' header={true} title="申请资料" onClose={this.cancelCheck.bind(this)}>
					<ul className="list-group">
						<li className="list-group-item">
							姓名: {this.state.checkUser.talentInfo.name}
						</li>
						<li className="list-group-item">
							手机: {this.state.checkUser.talentInfo.mobile}
						</li>
						<li className="list-group-item">
							微信: {this.state.checkUser.talentInfo.wechat}
						</li>
						<li className="list-group-item">
							擅长领域: {this.state.checkUser.talentInfo.goodAt}
						</li>
						<li className="list-group-item">
							其他: {this.state.checkUser.talentInfo.goodAtOther}
						</li>
					</ul>
					<div className="btn-group">
						<a className='btn btn-primary vmargined' href='#'
						   onClick={this.passedCheck.bind(this)}>通过</a>
						<a className='btn btn-white margined' href='#'
						   onClick={this.refuseCheck.bind(this)}>拒绝</a>
					</div>
				</Lightbox>
			);
		}
	}

	renderLabelPickerByType() {
		if (this.state.labelsSelectting) {
			return (
				<Lightbox className='small' header={false} headerWithoutBorder={true}
						  onClose={this.cancelEditLabels.bind(this)}>
					<div className='centered'>
						<LabelPickerByType
							selectedLabelsMaxLength={3}
							labelsType='userAssortment'
							selectedLabels={this.state.edittingUser.labels}
							onConfirm={::this.confirmEditLabels}
						/>

					</div>
				</Lightbox>
			);
		}

	}
}
