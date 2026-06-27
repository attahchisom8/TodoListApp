

/**
 * 
 * @returns getStoreData - gets an item from local storage
 * 
 * Return: The item gotten from storage
 */

export const getStoreData = () => {
	const workspaceObj = JSON.parse(localStorage.getItem("workspaceObj"));
	return workspaceObj;

}


/**
 * saveKey - saves an item to db with key that is the vslue of the item
 * @key: The given key
 * @key: workspace name
 * @value:  value to savee to key
 * 
 * Return: void
 */
export const saveKey = (key, value) => {
	localStorage.setItem(key, value);
}


/**
 * getKeyValue - function that gets the  value corresponding to a key
 * @key: the given key
 * 
 * Return: the value corresponding to the kwy
 */

export const getKeyValue = (key) => {
  return localStorage.getItem(key);
}
/**
 * saveToStore - A fuunction that saves the workspaceObj to locstorage
 * @workspaceObj: the global workspace object
 * 
 * Return: void
 */

export  const saveToStore = (workspaceObj) => {
	localStorage.setItem("workspaceObj", JSON.stringify(workspaceObj));

}