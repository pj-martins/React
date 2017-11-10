import React from 'react';
import PropTypes from 'prop-types'
import { SortDirection } from './constants';
import './assets/gridview.css';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.css';

class GridViewHeaderCell extends React.PureComponent {
	setSort(column, event) {
		if (!column.sortable) return;

		let maxIndex = -1;
		for (let col of this.props.parentGridView.props.columns.filter((c) => c.fieldName)) {
			if (col.fieldName === column.fieldName) continue;
			if (col.sortable) {
				if (!event.ctrlKey) {
					col.sortDirection = SortDirection.None;
					col.sortIndex = 0;
				}
				else if (col.sortIndex > maxIndex)
					maxIndex = col.sortIndex;
			}
		}
		if (event.ctrlKey)
			column.sortIndex = maxIndex + 1;

		if (column.sortDirection === undefined) {
			column.sortDirection = SortDirection.Asc;
		}
		else {
			switch (column.sortDirection) {
				case SortDirection.None:
				case SortDirection.Desc:
					column.sortDirection = SortDirection.Asc;
					break;
				case 1:
					column.sortDirection = SortDirection.Desc;
					break;
			}
		}

		this.props.onSortChanged(column);
	}

	dragOver(event) {
		if (!this.props.parentGridView.allowColumnOrdering) return;
		event.preventDefault();
	}

	getCaption() {
		if (this.props.column.caption) return this.props.column.caption;
		let parsedFieldName = this.props.column.fieldName;
		if (!parsedFieldName || parsedFieldName === '') return '';
		if (parsedFieldName.lastIndexOf('.') > 0) {
			parsedFieldName = parsedFieldName.substring(parsedFieldName.lastIndexOf('.') + 1, parsedFieldName.length);
		}
		return parsedFieldName.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
			return str.toUpperCase();
		});
	}

	startResize(evt) {
		// if (this.elementRef.nativeElement.parentElement.nextElementSibling === null)
		// 	return;

		// this.elementRef.nativeElement.draggable = false;
		// this._currEvt = evt;
		// this._origMove = window.onmousemove;
		// this._origUp = window.onmouseup;
		// this._lockedColumns = [];
		// this._parentTH = this.elementRef.nativeElement.parentElement;
		// var next = this._parentTH.nextElementSibling;
		// while (next !== null && next.nextElementSibling !== null) {
		// 	this._lockedColumns.push(new LockedColumn(next, next.offsetWidth));
		// 	next = next.nextElementSibling;
		// }

		// var prev = this._parentTH.previousElementSibling;
		// while (prev !== null) {
		// 	this._lockedColumns.push(new LockedColumn(prev, prev.offsetWidth));
		// 	prev = prev.previousElementSibling;
		// }

		// window.onmousemove = () => this.resize(event);
		// window.onmouseup = () => this.endResize();
	}

	render() {
		const {
			column,
		} = this.props;

		return (<div className='sort-header'>
			<div
				onClick={(evt) => this.setSort(column, evt)}
				id={column.name}
				draggable="true"
				onDragOver={(evt) => this.dragOver(evt)}
				onDragStart={(evt) => this.dragStart(evt)} onDrop={(evt) => this.drop(evt)}>
				<div>
					{this.getCaption()}
				</div>
				{(column.fieldName || column.sortField) && column.sortable ? (
					<div className='sort-arrows'>
						<div className={`sort-arrow top-empty ${(column.sortDirection || SortDirection.None) === SortDirection.None ? ' glyphicon glyphicon-triangle-top' : ''}`}></div>
						<div className={`sort-arrow bottom-empty ${(column.sortDirection || SortDirection.None) === SortDirection.None ? ' glyphicon glyphicon-triangle-bottom' : ''}`}></div>
						<div className={`sort-arrow ${(column.sortDirection || SortDirection.None) === SortDirection.Desc ? ' glyphicon glyphicon-triangle-top' : ''}`}></div>
						<div className={`sort-arrow ${(column.sortDirection || SortDirection.None) === SortDirection.Asc ? ' glyphicon glyphicon-triangle-bottom' : ''}`}></div>
					</div>
				) : null}
			</div>
			{column.allowSizing ? (
				<div className='resize-div' onMouseDown={(evt) => this.startResize(evt)}>|</div>
			) : null}
		</div>);
	}
}

GridViewHeaderCell.propTypes = {
	column: PropTypes.any,
	parentGridView: PropTypes.any,
	onSortChanged: PropTypes.func,
	onColumnOrderChanged: PropTypes.func,
};

export default GridViewHeaderCell;