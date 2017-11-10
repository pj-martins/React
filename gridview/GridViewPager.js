import React from 'react';
import PropTypes from 'prop-types'
import { PagingType } from './constants';
import './assets/gridview.css';

class GridViewPager extends React.PureComponent {
	constructor(props) {
		super(props);

		this.pageSizes = [{ size: 10, label: '10' }, { size: 25, label: '25' }, { size: 50, label: '50' }, { size: 100, label: '100' }, { size: 0, label: 'All' }];
		this.moreToLeft = false;
		this.moreToRight = false;
	}

	setPage(page) {
		this.props.onPageChanging && this.props.onPageChanging();
		if (page !== undefined) {
			if (page < 1) page = 1;
			let totalPages = this.getTotalPages();
			if (page > totalPages)
				page = totalPages;

			// this.props.parentGridView.resetData(page);
		}
		this.props.onPageChanged(page);
	}

	getPageArray() {
		let pageArray = [];
		let totalPages = this.getTotalPages();
		let start = 1;
		let end = totalPages > 10 ? 10 : totalPages;
		if (totalPages > 10 && this.props.pageNumber > 5) {
			end = this.props.pageNumber + 4;
			if (end > totalPages) {
				end = totalPages;
			}
			start = end - 9;

		}
		for (let i = start; i <= end; i++) {
			pageArray.push(i);
		}

		this.moreToRight = totalPages > end;
		this.moreToLeft = start > 1;

		return pageArray;
	}

	getTotalPages() {
		let totalPages = Math.ceil(this.props.totalRows / this.props.pageSize);
		return totalPages;
	}

	gotoLast() {
		this.setPage(this.getTotalPages());
	}

	render() {
		const {
			pageNumber,
			pageSize,
			rowsShown,
			totalRows,
			pagingType,
			onPageSizeChanged,
		} = this.props;

		if (pagingType >= PagingType.Disabled || totalRows <= 0) return null
		return (<div className='show-hide-animation grid-pagination'>
			{pageSize > 0 &&
				totalRows > pageSize ?
				(<div>
					<ul className="pagination">
						<li onClick={() => this.setPage(1)}>First</li>
						<li onClick={() => this.setPage(pageNumber - 1)}>Previous</li>
						<li style={{ display: !this.moreToLeft ? 'none' : 'inline-block' }} onClick={() => this.setPage(pageNumber - pageSize)}>...</li>
						{this.getPageArray().map((p, k) => (
							<li key={k} className={p === pageNumber ? 'pagination-selected' : ''} onClick={() => this.setPage(p)}>{p}</li>
						))}
						<li style={{ display: !this.moreToRight ? 'none' : 'inline-block' }} onClick={() => this.setPage(pageNumber + 1)} >...</li>
						<li onClick={() => this.setPage(pageNumber + 1)}>Next</li>
						<li onClick={() => this.gotoLast()}>Last</li>
					</ul >
					<br />
				</div>) : null
			}
			{totalRows > 10 ? (
				<div className="pagination-showing">
					Show: <select value={pageSize} onChange={(evt) => onPageSizeChanged(parseInt(evt.target.value))}>
						{this.pageSizes.map((ps, k) => (
							<option key={k} value={ps.size}>{ps.label}</option>
						))}
					</select> &nbsp;&nbsp;&nbsp;&nbsp;
		Showing {rowsShown} of {totalRows} total records.
		</div>
			) : null}
		</div>);
	}
}

GridViewPager.propTypes = {
	pageNumber: PropTypes.number,
	pageSize: PropTypes.number,
	totalRows: PropTypes.number,
	rowsShown: PropTypes.number,
	pagingType: PropTypes.any,
	onPageChanging: PropTypes.func,
	onPageChanged: PropTypes.func,
	onPageSizeChanged: PropTypes.func,
};

export default GridViewPager;