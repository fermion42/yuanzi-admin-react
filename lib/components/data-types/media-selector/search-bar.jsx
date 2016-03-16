import cx from 'classnames';
import React, {PropTypes} from 'react';
import {Component} from 'relax-framework';

import Upload from '../../upload';

export default class SearchBar extends Component {
  static propTypes = {
    view: PropTypes.string.isRequired,
	  onClose: PropTypes.func.isRequired,
	  onCrop: PropTypes.func.isRequired,
    changeView: PropTypes.func.isRequired,
    onAddMedia: PropTypes.func.isRequired,
    mimeTypes: PropTypes.array.isRequired
  }

  onChangeView (view) {
    this.props.changeView(view);
  }

  render () {
    return (
      <div className='search-bar'>
        <span className={cx('view-switch', this.props.view === 'small' && 'active')} onClick={this.onChangeView.bind(this, 'small')}>
          <i className='material-icons'>photo_size_select_large</i>
        </span>
        <span className={cx('view-switch', this.props.view === 'big' && 'active')} onClick={this.onChangeView.bind(this, 'big')}>
          <i className='material-icons'>photo_size_select_actual</i>
        </span>
        <Upload accept={this.props.mimeTypes.toString()} onFile={this.props.onAddMedia} className='dropzone-button' activeClassName='dropzone-button'>
          <i className='material-icons'>file_upload</i>
          <span>UPLOAD</span>
        </Upload>
		  <span className='view-center pull-right'>
			  <button className='btn btn-primary btn-xs' onClick={this.props.onClose}>确定</button>
		  </span>
      </div>
    );
  }
}
