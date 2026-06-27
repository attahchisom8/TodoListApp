
/**
 * sortName - function that takes a list and sort it by their name
 * @name: name of the property being dorted
 * @arr: the given array to sort
 * 
 * Return: in place sorted list of the array, not a new array
 */

export const sortName = (arr, name) => {
	const arrCopy = [...arr];
	return [
		arrCopy.sort((a, b) =>
		(a[name] || "").toLowerCase().localeCompare((b[name] || "").toLowerCase())),
		arr
	];
}
