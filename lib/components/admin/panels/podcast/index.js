/**
 * Created by matonghe on 16/5/30.
 */
import moment from 'moment';
import React from 'react';
import {Component} from 'relax-framework';
import Animate from '../../../animate';
import NotFound from '../not-found';
import Spinner from '../../../spinner';
import LabelPickerByType from '../../../../containers/data-types/labelPickerByType';
import Lightbox from '../../../lightbox';
import DatePicker from '../../../data-types/date-picker';
import OwnerPick from '../../../../containers/data-types/owner-picker';
var ReactQuill = require('react-quill');
import ImagePicker from '../../../../containers/data-types/image-picker'
import RefundStatus from  '../../elements/refundStatus';

import Joi from 'joi';

export default class Podcast extends Component {

	static validatorSchema = {
		title: Joi.string().min(3).required().label('标题')
	};

	validatorTypes() {
		return {
			title: Joi.string().required().label('标题')
		}
	}

	getValidatorData() {
		return {
			title: findDOMNode(this.refs.title).value
		};
	}
	static propTypes = {
		podcast: React.PropTypes.object,
		user: React.PropTypes.object.isRequired,
		breadcrumbs: React.PropTypes.array,
		isNew: React.PropTypes.bool,
		errors: React.PropTypes.any,
		isSlugValid: React.PropTypes.bool,
		validateSlug: React.PropTypes.func,
		onChange: React.PropTypes.func,
		saving: React.PropTypes.bool,
		onUpdate: React.PropTypes.func,
		onCreate: React.PropTypes.func,
		onRevisions: React.PropTypes.func,
		changePodcastValue: React.PropTypes.func,
		error: React.PropTypes.bool,
		success: React.PropTypes.bool

	};

	getInitState() {
		return {
			template: 0,
			isNextShow: false,
			isBanner: false
		};
	}

	onChange(id, event) {
		let value = event.target.value;
		switch (id) {
			case 'owner':
				value = {
					_id: event.target.value,
					nickname: event.target.selectedOptions[0].label
				};
				this.props.onChange(id, value);
				break;
			case 'isBanner':
				this.setState({isBanner: value});
				this.props.onChange(id, value);
				break;
			case 'template':
				this.setState({template: value});
				break;
			default:
				this.props.onChange(id, value);
		}

	}

	onTextChange(value){
		this.props.onChange('content', value);
	}
	onIntroductionChange(value){
		this.props.onChange('lecturerIntroduction', value);
	}
	onDateChange(id, value) {
		this.props.onChange(id, value);
	}
	onImageChange(mediaItem) {
		this.props.onChange('cover', {
			_id: mediaItem._id,
			ossUrl: mediaItem.ossUrl
		});
	}
	onBannerImageChange(mediaItem) {
		this.props.onChange('bannerImg', {
			_id: mediaItem._id,
			ossUrl: mediaItem.ossUrl
		});
	}
	onAutoImageChange(mediaItem) {
		this.props.onChange('lecturerAvatar', {
			_id: mediaItem._id,
			ossUrl: mediaItem.ossUrl
		});
	}
	onSave(event) {
		event.preventDefault();
		if(this.state.isNextShow === true){
			if (this.props.isNew) {
				var newData = this.props.podcast;
				this.props.onCreate(newData);
			} else {
				this.props.onUpdate(this.props.podcast);
			}
		}else{
			this.setState({isNextShow: true});
		}
	}
	render() {
		const {isNew} = this.props;
		let result;
		if (!isNew && this.props.errors) {
			result = <NotFound />;
		} else {
			const createdUser = isNew ? this.props.user : this.props.podcast.owner;
			const breadcrumbs = this.props.breadcrumbs.slice();
			breadcrumbs.push({
				label: ''
			});

			result = (
				<div className='content'>
					{this.renderBasic()}
					<div className="form-group">
						<div className="col-sm-4 col-sm-offset-2">
							<a className='btn btn-primary' href='#'
							   onClick={this.onSave.bind(this)}>{(this.state.isNextShow) ? '保存' : '下一步'}</a>
						</div>
					</div>
				</div>
			);
		}

		return result;
	}
	onReturn(event) {
		event.preventDefault();
		this.setState({isNextShow: false});
	}
	//显示返回按钮
	renderReturnBtn() {
		if (this.state.isNextShow) {
			return (
				<a className='button button-primary' href='#'
				   onClick={this.onReturn.bind(this)}>返回</a>
			);
		}
	}
	renderowner() {
		if(this.state.isNextShow){
			return (
				<div>
					<div className="form-group">
						<label className="col-lg-2 control-label" htmlFor='owner'>发布者</label>
						<div className="col-lg-10">
							<OwnerPick user={this.props.user}
									   className='select2_demo_1 form-control'
									   option={{id: 'owner', isNullShow: true}}
									   value={this.props.podcast.owner._id}
									   otherValues={{label: this.props.podcast.owner.nickname, value: this.props.podcast.owner._id}}
									   onChange={::this.onChange}
							/>
						</div>
					</div>
					<div className="form-group">
						<label className="col-lg-2 control-label" htmlFor='lecturer'>讲师</label>
						<div className="col-lg-10">
							<input ref='lecturer' type='text' className='form-control'
								   onChange={this.onChange.bind(this,'lecturer')}
								   value={this.props.podcast.lecturer}/>
						</div>
					</div>
					<div className="form-group">

						<label className="col-lg-2 control-label" htmlFor='presenter'>主持人</label>
						<div className="col-lg-10">
							<input ref='presenter' type='text' className='form-control'
								   onChange={this.onChange.bind(this,'presenter')}
								   value={this.props.podcast.presenter}/>
						</div>
					</div>
					<div className="hr-line-dashed"></div>
					<div className="form-group">

						<label className="col-lg-2 control-label" htmlFor='roomNumber'>房间编号</label>
						<div className="col-lg-10">
							<input ref='roomNumber' type='text' className='form-control'
								   onChange={this.onChange.bind(this,'roomNumber')}
								   value={this.props.podcast.roomNumber}/>
						</div>
					</div>
					<div className="hr-line-dashed"></div>
					<div className="form-group">
						<label className="col-lg-2 control-label" htmlFor='lecturerIntroduction'>微课详情</label>
						<div className="col-lg-10" >
							<ReactQuill ref='lecturerIntroduction' style={{ border: '1px solid #e5e6e7'}}
							theme="snow"
							value={this.props.podcast.lecturerIntroduction}
							onChange={::this.onIntroductionChange} />
						</div>
					</div>
				</div>
		)

		}
	}
	renderBannerImg() {
		if(this.state.isBanner){
			return (
				<div className="form-group">
					<label className="col-lg-2 control-label" htmlFor='cover'>banner 封面</label>
					<div className="col-lg-10">
						<ImagePicker ref="bannerImg" value={this.props.podcast.bannerImg._id}
									 width={750} height={300}
									 widthAndHeightStyle={{width: '750px', height: '300px'}}
									 onChange={::this.onBannerImageChange}
						/>
						{this.renderHelpText(this.state.imageEmptyMessage)}
					</div>
				</div>
			);
		}else{
			return '';
		}
	};
	renderBasic() {
		return (<div>
			<div className="row">
				<div className="col-lg-12">

					<div className='admin-scrollable ibox float-e-margins'>
						<div className='white-options list ibox-content'>
							<form className="form-horizontal" onSubmit={this.props.onCreate.bind(this)}>
								<div className="form-group">
									<label className="col-lg-2 control-label" htmlFor='title'>微课标题</label>
									<div className="col-lg-10">
										<input ref='title' type='text' className='form-control'
											   onChange={this.onChange.bind(this,'title')}
											   value={this.props.podcast.title}/>
									</div>
								</div>
								<div className="hr-line-dashed"></div>
								<div className="form-group">
									<label className="col-lg-2 control-label" htmlFor='price'>微课费用</label>
									<div className="col-lg-10">
										<div className="input-group m-b">
											<span className="input-group-addon">$</span>
											<input ref='title' type='number' className='form-control'
												   onChange={this.onChange.bind(this,'price')}
												   value={this.props.podcast.price}/>
										</div>
									</div>
								</div>
								<div className="hr-line-dashed"></div>
								<div className="form-group">
									<label className="col-lg-2 control-label" htmlFor='startDate'>开始时间</label>
									<div className="col-lg-10">
										<DatePicker id='startDate'
													dateFormat="YYYY-MM-DD HH:mm:ss"
													defaultValue={this.props.podcast.startDate}
													maxDate={moment()}
													onChange={::this.onDateChange}
										/>
									</div>
								</div>
								<div className="hr-line-dashed"></div>
								<div className="form-group">
									<label className="col-lg-2 control-label" htmlFor='isBanner'>Banner位置显示</label>
									<div className="col-lg-10">
										<select ref='isBanner' className='form-control'
												value={this.props.podcast.isBanner}
												onChange={this.onChange.bind(this,'isBanner')}>
											<option value='false'>否</option>
											<option value='true'>是</option>
										</select>
									</div>
								</div>
								<div className="hr-line-dashed"></div>
								<div className="form-group">
									<label className="col-lg-2 control-label" htmlFor='cover'>封面</label>
									<div className="col-lg-10">
										<ImagePicker ref="cover" value={this.props.podcast.cover._id}
													 widthAndHeightStyle={{width: '228px', height: '132px'}}
													 onChange={::this.onImageChange}
										/>
										{this.renderHelpText(this.state.imageEmptyMessage)}
									</div>
								</div>
								<div className="hr-line-dashed"></div>
								{this.renderBannerImg()}
								<div className="form-group">
									<label className="col-lg-2 control-label" htmlFor='cover'>讲师头像</label>
									<div className="col-lg-10">
										<ImagePicker ref="lecturerAvatar" value={this.props.podcast.lecturerAvatar._id}
													 width={710} height={710}
													 widthAndHeightStyle={{width: '710px', height: '710px'}}
													 onChange={::this.onAutoImageChange}
										/>
										{this.renderHelpText(this.state.imageEmptyMessage)}
									</div>
								</div>
								<div className="hr-line-dashed"></div>
								<div className="form-group">
									<label className="col-lg-2 control-label" htmlFor='title'>微课详情</label>
									<div className="col-lg-10" >
										<ReactQuill ref='content' style={{ border: '1px solid #e5e6e7'}}
													theme="snow"
													value={this.props.podcast.content}
													onChange={::this.onTextChange} />

									</div>
								</div>
								<div className="hr-line-dashed"></div>
								{this.renderowner()}
								<div>
									<input type='text' hidden/>
								</div>
								<div className="hr-line-dashed"></div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>)
	}

	renderNext() {
		let result;
		if (this.props.saving) {
			result = (
				<Animate transition='slideDownIn' key='saving'>
					<div className='saving'>
						<Spinner />
						<span>{this.props.savingLabel}</span>
					</div>
				</Animate>
			);
		} else if (this.props.errors) {
			result = (
				<Animate transition='slideDownIn' key='error'>
					<div className='error' ref='success'>
						<i className='material-icons'>error_outline</i>
						<span>Something went bad!</span>
					</div>
				</Animate>
			);
		} else if (this.props.success) {
			result = (
				<Animate transition='slideDownIn' key='success'>
					<div className='success' ref='success'>
						<i className='material-icons'>check</i>
						<span>All good!</span>
					</div>
				</Animate>
			);
		}
		return result;
	}

	renderSaving() {
		let result;
		if (this.props.saving) {
			result = (
				<Animate transition='slideDownIn' key='saving'>
					<div className='saving'>
						<Spinner />
						<span>{this.props.savingLabel}</span>
					</div>
				</Animate>
			);
		} else if (this.props.errors) {
			result = (
				<Animate transition='slideDownIn' key='error'>
					<div className='error' ref='success'>
						<i className='material-icons'>error_outline</i>
						<span>Something went bad!</span>
					</div>
				</Animate>
			);
		} else if (this.props.success) {
			result = (
				<Animate transition='slideDownIn' key='success'>
					<div className='success' ref='success'>
						<i className='material-icons'>check</i>
						<span>All good!</span>
					</div>
				</Animate>
			);
		}
		return result;
	}

	renderHelpText(messages) {
		//return (
		//	<span className="help-block has-error">{messages.map(this.renderMessage, this)}</span>
		//);
	}

	renderMessage(message) {
		var i = 0;
		return (
			<span className="help-block has-error" key={i++}>{message}</span>
		);
	}
}
