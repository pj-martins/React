import React from 'react';
import PropTypes from 'prop-types'
import GridViewCell from './GridViewCell';
import GridViewHeaderCell from './GridViewHeaderCell';
import GridViewPager from './GridViewPager';
import { FilterMode, PagingType } from './constants';
import { showRow, sortData } from './utils';
import './assets/gridview.css';

class GridView extends React.PureComponent {
	constructor(props) {
		super(props);

		this.indexWidthInited = false;
		this.state = {
			pageSize: props.pageSize || 10,
			currentPage: props.currentPage || 1,
			filterVisible: props.filterVisible || false,
			detailGridViewComponents: this.state ? this.state.detailGridViewComponents : [],
			selectedKeys: this.state ? this.state.selectedKeys : [],
			loading: props.loading || false,
		}

		this.state.displayData = this.getDisplayData(props);
	}

	resetData(page) {

		// let expandedKeys: Array<string> = [];
		// if (this.detailGridViewComponents) {
		// 	for (let k of Object.keys(this.detailGridViewComponents)) {
		// 		if (this.detailGridViewComponents[k].isExpanded())
		// 			expandedKeys.push(k);
		// 	}
		// }

		let currPage = page || 1;

		// if (this.detailGridViewComponents) {
		// 	this.collapseAll();

		// 	if (expandedKeys && expandedKeys.length > 0) {
		// 		for (let k of expandedKeys) {
		// 			for (let d of this.displayData) {
		// 				if (d[this.grid.keyFieldName] === k) {
		// 					if (!this.detailGridViewComponents[k].isExpanded())
		// 						this.detailGridViewComponents[k].expandCollapse();
		// 					break;
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		this.setState({
			displayData: this.getDisplayData(this.props),
			currentPage: currPage,
		});
	}

	hasFilterRow() {
		if (this.props.disableFilterRow) return false;
		for (let col of this.props.columns) {
			if (col.filterMode !== FilterMode.None) {
				return true;
			}
		}
		return false;
	}

	getVisibleColumnCount() {
		if (this.props.renderRowTemplate)
			return 1;

		let count = 0;
		for (let col of this.props.columns) {
			if (!this.indexWidthInited && count !== 0 && col.columnIndex === 0) {
				col.columnIndex = count;
			}
			if (!col.hidden) {
				count++;
			}
		}

		if (!this.indexWidthInited) {
			this.indexWidthInited = true;
		}
		return count;
	}

	toggleFilter() {
		this.setState({ filterVisible: !this.state.filterVisible });
		this.props.onFilterChange && this.props.onFilterChanged();
		// this.grid.saveGridState();
	}

	rowClick(row) {
		// if (this.grid.selectMode > 0) {
		// 	this.selectedKeys[row[this.grid.keyFieldName]] = !this.selectedKeys[row[this.grid.keyFieldName]];

		// 	if (this.grid.selectMode === SelectMode.Single && this.selectedKeys[row[this.grid.keyFieldName]]) {
		// 		for (let d of this.grid.data) {
		// 			if (d[this.grid.keyFieldName] !== row[this.grid.keyFieldName]) {
		// 				this.selectedKeys[d[this.grid.keyFieldName]] = false;
		// 			}
		// 		}
		// 	}

		// 	let selectedRows = [];
		// 	for (let d of this.grid.data) {
		// 		if (this.selectedKeys[d[this.grid.keyFieldName]])
		// 			selectedRows.push(d);
		// 	}

		// 	this.selectionChanged.emit(selectedRows);
		// }
	}

	handleSortChanged(column) {
		this.props.onSortChanged && this.props.onSortChanged(column);
		this.resetData(this.state.currentPage);
		// if (this.grid.saveGridStateToStorage)
		// 	this.grid.saveGridState();
	}

	getDetailGridViewComponent(keyFieldValue) {
		let dgv = this.state.detailGridViewComponents.find((x) => x.parentKey === keyFieldValue);
		if (!dgv) {
			dgv = {
				parentKey: keyFieldValue,
			};
			this.state.detailGridViewComponents.push(dgv);
		}
		return dgv;
	}

	expandAll() {
		for (let row of this.displayData) {
			let dgvc = this.getDetailGridViewComponent(row[this.props.keyFieldName]);
			dgvc.expanded = true;
		}
		this.setState({
			detailGridViewComponents: this.state.detailGridViewComponents.slice()
		});
	}

	collapseAll() {
		for (let row of this.displayData) {
			let dgvc = this.getDetailGridViewComponent(row[this.props.keyFieldName]);
			dgvc.expanded = false;
		}
		this.setState({
			detailGridViewComponents: this.state.detailGridViewComponents.slice()
		});
	}

	expandCollapse(keyFieldValue) {
		let dgvc = this.getDetailGridViewComponent(keyFieldValue);
		dgvc.expanded = !dgvc.expanded;
		this.setState({
			detailGridViewComponents: this.state.detailGridViewComponents.slice()
		});
	}

	getSelectedKeys() {
		let selected = [];
		for (let k of Object.keys(this.selectedKeys)) {
			if (this.selectedKeys[k]) {
				selected.push(k);
			}
		}
		return selected;
	}

	handlePageChanging() {
		// if (this.detailGridViewComponents)
		// 	this.collapseAll();
	}

	handlePageChanged(pageNumber) {
		this.setState({
			currentPage: pageNumber,
		})
		this.props.onPageChanged && this.props.onPageChanged(pageNumber);
		// if (this.grid.saveGridStateToStorage)
		// 	this.grid.saveGridState();
	}

	handlePageSizeChanged(pageSize) {
		this.setState({
			currentPage: 1,
			pageSize,
		})
		this.props.onPageSizeChanged && this.props.onPageSizeChanged(pageSize);
		// if (this.grid.saveGridStateToStorage)
		// 	this.grid.saveGridState();
	}

	handleColumnOrderChanged(columnOrder) {
		// let sourceCol: ColumnBase;
		// let targetCol: ColumnBase;

		// for (let col of this.grid.columns) {
		// 	if (col.getIdentifier() === columnOrder.sourceIdentifier) {
		// 		sourceCol = col;
		// 		break;
		// 	}
		// }

		// for (let col of this.grid.columns) {
		// 	if (col.getIdentifier() === columnOrder.targetIdentifier) {
		// 		targetCol = col;
		// 		break;
		// 	}
		// }

		// if (!sourceCol) throw columnOrder.sourceIdentifier + " not found!";
		// if (!targetCol) throw columnOrder.targetIdentifier + " not found!";

		// let targetIndex = targetCol.columnIndex;
		// if (sourceCol.columnIndex <= targetCol.columnIndex) {
		// 	for (let col of this.grid.columns) {
		// 		if (col.getIdentifier() === sourceCol.getIdentifier()) continue;
		// 		if (col.columnIndex > sourceCol.columnIndex && col.columnIndex <= targetCol.columnIndex)
		// 			col.columnIndex--;
		// 	}
		// }
		// else {
		// 	for (let col of this.grid.columns) {
		// 		if (col.getIdentifier() === sourceCol.getIdentifier()) continue;
		// 		if (col.columnIndex < sourceCol.columnIndex && col.columnIndex >= targetCol.columnIndex)
		// 			col.columnIndex++;
		// 	}
		// }
		// sourceCol.columnIndex = targetIndex;

		// // THIS SEEMS HACKISH! IN ORDER FOR THE COMPONENT TO REDRAW, IT NEEDS TO DETECT
		// // A CHANGE TO THE COLUMNS VARIABLE ITSELF RATHER THAN WHAT'S IN THE COLLECTION
		// let sortedColumns: Array<ColumnBase> = [];
		// for (let c of this.grid.columns) {
		// 	sortedColumns.push(c);
		// }

		// this.grid.columns = sortedColumns;
		// if (this.grid.saveGridStateToStorage)
		// 	this.grid.saveGridState();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			loading: nextProps.loading || false,
			displayData: this.getDisplayData(nextProps),
		});
		this.pagingType = nextProps.pagingType || PagingType.Auto;
	}

	resizeGrid() {
		if (!this.innerTable) return;
		if (this.props.fillHeight) {
			const top = this.innerTable.parentElement.offsetTop;
			const bottom = this.innerTable.parentElement.parentElement.clientHeight - this.innerTable.clientHeight;
			this.innerTable.style.height = `${(window.innerHeight - top - bottom).toString()}px`;
		}

		if (!this.props.noHeader) {
			if (this.innerTable.rows.length > 2) {
				const headerRow = this.innerTable.rows[0];
				const firstRow = this.innerTable.rows[this.innerTable.rows.length - 2];
				for (let i = 0; i < headerRow.cells.length; i++) {
					headerRow.cells[i].style.width = `${firstRow.cells[i].offsetWidth}px`;
				}
			}

			window.setTimeout(() =>
				this.innerTable.tHead.style.display = '', 200);
		}
	}

	componentDidUpdate() {
		window.onresize = () => this.resizeGrid();
		this.resizeGrid();
	}

	getUnpagedData(props) {
		if (!props) props = this.props;
		if (!props || !props.dataSource) return [];
		let data = props.dataSource.slice();

		if (!this.disableAutoFilter && this.state.filterVisible) {
			for (let i = data.length - 1; i >= 0; i -= 1) {
				if (!showRow(this.props.columns, data[i])) {
					data.splice(i, 1);
				}
			}
		}

		return data;
	}

	getDisplayData(props) {
		if (!props) props = this.props;
		if (!props || !props.dataSource) return [];
		let data = this.getUnpagedData(props);

		if (!this.props.disableAutoSort) sortData(props.columns, data);
		if (this.state.pageSize !== 0 && this.pagingType === PagingType.Auto) {
			data = data.slice((this.state.currentPage - 1) * this.state.pageSize, this.state.currentPage * this.state.pageSize);
		}

		return data;
	}

	renderData(sortedColumns) {
		const rows = [];
		let i = 0;
		for (let row of this.state.displayData) {
			rows.push(<tr key={i} className={this.props.renderRowTemplate ? null : (this.props.getRowClass ? this.props.getRowClass(row) : '') +
				(i % 2 !== 0 ? ' gridview-alternate-row' : '') +
				(this.props.selectMode > 0 ? ' selectable-row' : '') + (this.state.selectedKeys[row[this.props.keyFieldName]] ? ' selected-row' : '')}
				onClick={(r) => this.props.rowClick ? this.props.rowClick(r) : null}>

				{this.props.renderDetailGridView ? (
					<td style={{ width: '39px' }}>
						{<button className={'glyphicon glyphicon-small ' + (
							this.getDetailGridViewComponent(row[this.props.keyFieldName]).expanded ? 'glyphicon-minus' : 'glyphicon-plus')}
							onClick={() => this.expandCollapse(row[this.props.keyFieldName])}></button>}
					</td>
				) : null}
				{sortedColumns.filter(col => !col.hidden && !this.props.renderRowTemplate).map((col, k) => (
					<td style={{ width: col.width }} key={k} className={this.props.getRowCellClass ? this.props.getRowCellClass(row) : (col.disableWrapping ? 'no-wrap' : '')}>
						<GridViewCell column={col} row={row} parentGridView={this}></GridViewCell>
					</td>
				))}
				{this.props.renderRowTemplate && !this.state.loading ? (
					<tr>
						<td colSpan={this.getVisibleColumnCount()}>{this.props.renderRowTemplate(row, this)}</td>
					</tr >
				) : null
				}
			</tr>);
			if (this.props.renderDetailGridView && !this.state.loading &&
				this.getDetailGridViewComponent(row[this.props.keyFieldName]).expanded) {
				rows.push(<tr className="detail-gridview-row">
					<td></td>
					<td colSpan={this.getVisibleColumnCount()} className='detailgrid-container' >{this.props.renderDetailGridView(row, this)}</td>
				</tr>);
			}
			i++;
		}
		return rows;
	}

	render() {
		const {
            renderDetailGridView,
			noHeader,
			allowRowSelect,
			pagingType,
			totalRecords,
			columns,
			showFooter,
			onPageChanging,
			loading,
		} = this.props;

		if (!this.state.displayData) {
			return (<div>No results found!</div>);
		}

		const sortedColumns = columns.slice();
		sortedColumns.sort((a, b) => a - b);

		return (<div>
			{loading ? (<div className='overlay-container'>
				<div className='overlay-content'>
					<br />
					<img src="data:image/gif;base64,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" />
					&nbsp;&nbsp;Loading
			</div>
			</div>) : null}
			{this.hasFilterRow() ?
				(<div>
					<div className='header-button' onClick={() => this.toggleFilter()}><div className='glyphicon glyphicon-filter'></div><strong>&nbsp;&nbsp;Filter</strong></div>
					<div className='header-button' style={{ paddingRight: '5px' }}><input type='checkbox' onClick={() => this.toggleFilter()} checked={this.state.filterVisible} /></div>
				</div>) : null}

			{renderDetailGridView ? (<div>
				<div className='header-button' onClick={() => this.collapseAll()} style={{ marginBottom: '2px' }}><div className='glyphicon glyphicon-minus'></div><strong>&nbsp;&nbsp;Collapse All</strong></div>
				<div className='header-button' onClick={() => this.expandAll()}><div className='glyphicon glyphicon-plus'></div><strong>&nbsp;&nbsp;Expand All</strong></div>
			</div>) : null}
			<table className='gridview' ref={(tbl) => this.innerTable = tbl}>
				{!noHeader ? (<thead style={{ display: 'none' }}>
					<tr>
						{renderDetailGridView ? (<th style={{ width: '39px' }}></th>) : null}
						{allowRowSelect ? (<th style={{ width: '1%' }}></th>) : null}
						{sortedColumns.filter((col) => !col.hidden).map((col, k) => (
							<th style={{ width: col.width }} key={k}>
								<GridViewHeaderCell
									onColumnOrderChanged={(c) => this.handleColumnOrderChanged(c)}
									onSortChanged={(c) => this.handleSortChanged(c)}
									column={col}
									parentGridView={this}
								>
								</GridViewHeaderCell>
							</th>
						))}
					</tr>
					{this.hasFilterRow() && this.state.filterVisible ? (
						<tr>
							{renderDetailGridView ? (
								<td style={{ width: '39px' }}></td>) : null}
							{sortedColumns.filter(col => !col.hidden).map((col, k) => (
								<td key={k}>
									{/*col.filterMode && col.filterMode !== 0 ? (
										<GridViewFilterCell parentGridView={this} column={col}>
									</GridViewFilterCell>) : null*/}
								</td>))}
						</tr>
					) : null}

				</thead>)
					: null}
				<tbody>
					{!this.state.displayData ? (
						<tr>
							<td colSpan={this.getVisibleColumnCount()}>No results found!</td>
						</tr>
					) : this.renderData(sortedColumns)}
				</tbody>
				{showFooter ? (
					<tfoot>
						<tr>
							{renderDetailGridView ? (<td style={{ width: '39px' }}></td>) : null}
							{/*sortedColumns.filter(col => !col.hidden).map((col, k) => (
								<td><GridViewFooter column={col}></GridViewFooter></td>
							))*/}
						</tr>
					</tfoot>
				) : null}
			</table>
			<GridViewPager
				totalRows={pagingType == PagingType.Auto ? this.getUnpagedData(this.props).length : totalRecords}
				rowsShown={(this.state.displayData || []).length}
				pageNumber={this.state.currentPage}
				pageSize={this.state.pageSize}
				pagingType={pagingType}
				onPageChanging={onPageChanging}
				onPageChanged={(p) => this.handlePageChanged(p)}
				onPageSizeChanged={(ps) => this.handlePageSizeChanged(ps)}
			>
			</GridViewPager>
		</div>);
	}
}

GridView.propTypes = {
	renderDetailGridView: PropTypes.func,
	noHeader: PropTypes.bool,
	allowRowSelect: PropTypes.bool,
	columns: PropTypes.array,
	renderRowTemplate: PropTypes.func,
	getRowClass: PropTypes.func,
	getRowCellClass: PropTypes.func,
	showFooter: PropTypes.bool,
	dataSource: PropTypes.array,
	totalRecords: PropTypes.number,
	disableAutoFilter: PropTypes.bool,
	disableAutoSort: PropTypes.bool,
	pageSize: PropTypes.number,
	currentPage: PropTypes.number,
	pagingType: PropTypes.any,
	onSortChanged: PropTypes.func,
	onPageChanging: PropTypes.func,
	onPageChanged: PropTypes.func,
	onSilterChanged: PropTypes.func,
	onSelectionChanged: PropTypes.func,
	filterVisible: PropTypes.bool,
	fillHeight: PropTypes.bool,
	loading: PropTypes.bool,
	keyFieldName: PropTypes.string,
	onRowClick: PropTypes.func,
	selectMode: PropTypes.any,
};

GridView.defaultProps = {
	pagingType: PagingType.Auto,
}

export default GridView;
