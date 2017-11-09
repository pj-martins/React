import React from 'react';
import PropTypes from 'prop-types'
import { FieldType } from './constants';
import parse from '../utils/parse';
import './assets/gridview.css';

class GridViewCell extends React.PureComponent {

	getLink() {
		let url = this.props.column.url;
		for (let k of Object.keys(this.props.column.parameters)) {
			url += `;${k}=${this.parserService.getObjectValue(this.props.column.parameters[k], this.props.row)}`;
		}
		return url;
	}

	getLinkTarget() {
		if (this.props.column.target) {
			return `_${this.parserService.getObjectValue(this.props.column.target, this.props.row)}`;
		}
		return '';
	}


	render() {
		const {
			column,
			row,
		} = this.props;

		if (column.renderTemplate) {
			return column.renderTemplate(row);
		}

		const objValue = parse(column.fieldName, row);
		if (column.fieldType === FieldType.Date) {
			return (<div>{objValue ? new Date(objValue).toLocaleDateString() : ''}</div>);
		}

		if (column.fieldType === FieldType.Boolean) {
			return (<div className={objValue ? 'glyphicon glyphicon-ok' : ''}></div>);
		}

		if (column.url) {
			return (<a href={this.getLink()} className={column.class} target={this.getLinkTarget()}>
				<div>{objValue || ''}</div>
			</a>);
		}

		if (column.click) {
			return (<button className={column.class} onClick={() => column.click(row)}>{objValue || ''}</button>);
		}

		if (column.editType) {
			switch (column.editType) {
				case 'textarea':
					return (<textarea style={{ width: column.width }} className={column.class} onChange={null} value={objValue || ''}></textarea>);
				case 'checkbox':
					return (<input type="checkbox" style={{ width: column.width }} className={column.class} onChange={null} checked={objValue || false} />);
				default:
					return (<input type={column.editType} style={{ width: column.width }} className={column.class} onChange={null} value={objValue || ''} />);
			}
		}

		return (<div>{objValue || ''}</div>);
	}
}

GridViewCell.propTypes = {
	column: PropTypes.any,
	row: PropTypes.any,
	parentGridView: PropTypes.any,
};

export default GridViewCell;