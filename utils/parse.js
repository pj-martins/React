export default function parse(field, obj) {
	let parts = field.split('.');
	let tempObj = obj;
	for (let part of parts) {
		let match = part.match(/^(.*)\[(\d*)\]$/);
		if (match && match.length === 3) {
			tempObj = tempObj[match[1]][parseInt(match[2])];
		}
		else {
			tempObj = tempObj[part];
		}
		// if there are no periods then simply return the raw value
		if (!tempObj) return parts.length === 1 ? tempObj : undefined;
	}
	return tempObj;
}