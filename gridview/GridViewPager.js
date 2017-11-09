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
		this.props.pageChanging && this.props.pageChanging();
		if (page !== undefined) {
			if (page < 1) page = 1;
			let totalPages = this.getTotalPages();
			if (page > totalPages)
				page = totalPages;

			this.props.parentGridView.resetData(page);
		}
		this.props.pageChanged(page);
	}

	getPageArray() {
		let pageArray = [];
		let totalPages = this.getTotalPages();
		let start = 1;
		let end = totalPages > 10 ? 10 : totalPages;
		if (totalPages > 10 && this.props.parentGridView.state.currentPage > 5) {
			end = this.props.parentGridView.state.currentPage + 4;
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
		let totalItems = (this.props.parentGridView.props.pagingType === PagingType.Auto ? (this.unpagedData ? this.unpagedData.length : 0) : this.parentGridView.props.totalRecords);
		let totalPages = Math.ceil(totalItems / this.props.parentGridView.state.pageSize);
		return totalPages;
	}

	gotoLast() {
		this.setPage(this.getTotalPages());
	}

	render() {
		const {
			parentGridView
		} = this.props;

		this.unpagedData = parentGridView.getUnpagedData();

		if (parentGridView.pagingType >= 2 || !parentGridView.state.displayData || !parentGridView.props.dataSource || parentGridView.props.dataSource.length < 1) return null

		return (<div className='show-hide-animation grid-pagination'>
			{parentGridView.state.pageSize > 0 &&
				(parentGridView.props.pagingType === PagingType.Auto ? this.unpagedData.length : parentGridView.props.totalRecords) > parentGridView.state.pageSize ?
				(<div>
					<ul className="pagination">
						<li onClick={() => this.setPage(1)}>First</li>
						<li onClick={() => this.setPage(parentGridView.state.currentPage - 1)}>Previous</li>
						<li styles={{ display: !this.moreToLeft ? 'none' : 'inline-block' }} onClick={() => this.setPage(parentGridView.state.currentPage - parentGridView.state.pageSize)}>...</li>
						{this.getPageArray().map((p, k) => (
							<li key={k} className={p === parentGridView.state.currentPage ? 'pagination-selected' : ''} onClick={() => this.setPage(p)}>{p}</li>
						))}
						<li styles={{display:!this.moreToRight?'none':'inline-block'}} onClick={() => this.setPage(parentGridView.state.currentPage + parentGridView.state.pageSize)} >...</li>
					<li onClick={() => this.setPage(parentGridView.state.currentPage + 1)}>Next</li>
					<li onClick={() => this.gotoLast()}>Last</li>
			</ul >
					<br />
		</div >) : null
		}
		{(parentGridView.props.pagingType === PagingType.Auto ? this.unpagedData.length : parentGridView.props.totalRecords) > 10 ? (
		<div>
		Show: <select value={parentGridView.state.pageSize} onChange={() => this.setPage(1)}> 
		{this.pageSizes.map((ps, k) => (
			<option key={k} value={ps.size}>{ps.label}</option>
		))}
		</select> &nbsp;&nbsp;&nbsp;&nbsp;
		Showing {parentGridView.state.displayData.length} of {parentGridView.props.pagingType === 0 ? this.unpagedData.length : parentGridView.props.totalRecords} total records.
		</div >
		) : null}
	</div >);
	}
}

GridViewPager.propTypes = {
	parentGridView: PropTypes.any,
	pageChanging: PropTypes.func,
	pageChanged: PropTypes.func,
};

export default GridViewPager;