import React, {PropTypes} from 'react';
import {Component} from 'relax-framework';
import TableItem from './table-item';

export default class ListTable extends Component {
    static fragments = {
        strategies: TableItem.fragments.strategy
    }

    static propTypes = {
        strategies: PropTypes.array,
        removeStrategy: PropTypes.func.isRequired,
        showFields: PropTypes.array.isRequired,
        type: PropTypes.string.isRequired,
    }

    render() {
        return (
            <table className="table table-striped table-bordered table-hover dataTables-example dataTable">
                <thead>
                <tr>
                    {this.props.showFields.map(this.renderTh, this)}
                </tr>
                </thead>
                <tbody>
                    {this.props.strategies.map(this.renderEntry, this)}
                </tbody>
            </table>

        );
    }

    renderTh (showField) {
        return (
            <th>{showField.name}</th>
        );
    }
    renderEntry (strategy) {
        return (
            <TableItem type={this.props.type} key={strategy._id} strategy={strategy} showFields={this.props.showFields} removeStrategy={this.props.removeStrategy}/>
        );
    }
}