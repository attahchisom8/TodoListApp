/**
 * searchWorkspace - search the global workspqce for a given workspace
 * @searchParam: The search parameter
 * @workspaceObj: glibal house of all workspaces
 *
 * Return: True if the workspace exist, else false
 */

export const searchWorkspace = (workspaceObj, searchParam) => {
  if (workspaceObj[searchParam] !== undefined)
    return true;
  return false;
}
