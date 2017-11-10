import { FilterMode, FieldType, SortDirection } from './constants';
import parse from '../utils/parse';

export function showRow(columns, row) {
	for (let col of columns) {
		if (col.filterMode !== FilterMode.None && col.filterValue !== null) {
			let itemVal = this.parserService.getObjectValue(col.fieldName, row);
			switch (col.filterMode) {
				case FilterMode.BeginsWith:
					if (!itemVal || itemVal.toLowerCase().indexOf(col.filterValue.toLowerCase()) !== 0)
						return false;
					break;
				case FilterMode.Contains:
				case FilterMode.DistinctList:
				case FilterMode.DynamicList:
					if (col.filterValue instanceof Array) {
						if (!itemVal || col.filterValue.indexOf(itemVal) === -1) {
							return false;
						}
					}
					else if (!itemVal || itemVal.toLowerCase().indexOf(col.filterValue.toLowerCase()) === -1)
						return false;
					break;
				case FilterMode.NotEqual:
					if (col.fieldType === FieldType.Date) {
						return new Date(itemVal).getTime() !== new Date(col.filterValue).getTime();
					}
					if (!itemVal || itemVal === col.filterValue)
						return false;
					break;
				case FilterMode.Equals:
					if (col.fieldType === FieldType.Date) {
						return new Date(itemVal).getTime() === new Date(col.filterValue).getTime();
					}
					if (!itemVal || itemVal !== col.filterValue)
						return false;
			}
		}
	}

	return true;
}

export function sortData(columns, data) {
	if (!data) return [];
	
	let sorts = [];
	if (this.props.columns) {
		for (let col of this.props.columns) {
			if (col.fieldName && col.sortDirection !== undefined && col.sortDirection !== SortDirection.None) {
				if (col.sortIndex === undefined)
					col.sortIndex = 0;
				sorts.push(col);
			}
		}
	}

	if (sorts.length <= 0) {
		return data;
	}

	sorts.sort((a, b) => {
		return a.sortIndex - b.sortIndex;
	});

	data.sort((a, b) => {
		for (let i = 0; i < sorts.length; i++) {

			let curr = sorts[i];
			let aval = parse(curr.fieldName, a);
			let bval = parse(curr.fieldName, b);

			if (curr.customSort) {
				var s = curr.customSort(aval, bval);
				if (s !== 0)
					return s;
			}

			if (aval && typeof aval === "string") aval = aval.toLowerCase();
			if (bval && typeof bval === "string") bval = bval.toLowerCase();

			if (aval === bval)
				continue;

			if (curr.sortDirection === SortDirection.Desc)
				return aval > bval ? -1 : 1;

			return aval < bval ? -1 : 1;
		}

		return 0;
	});

	return data;
}