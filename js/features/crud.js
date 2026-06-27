/* this module handles all activities like add, removing updating
and deleting workspaces
*/

/**
 * createWorkspace - creates a workspace
 * @newWorkspace: new workspace to create
 * @workspaceOj: global workspace obj
 * 
 * Return: A new eorkspace obj
 */

export const createWorkspace = (workspaceObj, newWorkspace) => {
	if (!newWorkspace || workspaceObj.hasOwnProperty(newWorkspace)) {
		return;
	}
	workspaceObj[newWorkspace] = [];

	return workspaceObj;
}


/**
 * updateWorkspace - updates the name of a given workspace
 * @newWorkspaceName: the workspace name
 * @oldWorkspaceName: name of the old workspace
 * @workspaces: The workspace object
 * 
 * Return: a new workspace
 */

export const updateWorkspace = (workspaceObj, oldWorkspaceName, newWorkspaceName) => {
if (workspaceObj.hasOwnProperty(oldWorkspaceName) && oldWorkspaceName !==  newWorkspaceName) {
	workspaceObj[newWorkspaceName] = workspaceObj[oldWorkspaceName];
	delete workspaceObj[oldWorkspaceName];
}

	return workspaceObj;
}


/**
 * deleteWorkspace - deletes a workspace from the global workspace object
 * @workspace: The workspace to delete rom the workspace obj
 * @workspaceObj: The global workspaceobject
 * 
 * Return: A new workspace object
 */

export const deleteWorkspace = (workspaceObj, workspace) => {
	if (workspaceObj.hasOwnProperty(workspace)) {
		delete workspaceObj[workspace];
	}
	return workspaceObj;
}


/**
 * addTask - adds a task to the current workspace
 * workspaceObj: global workspace object
 * @currWorkspace: The current workspace
 * @task: task to be added to the workspace
 * 
 * Return: The current workspace or test purposes
 */

export const addTask = (workspaceObj, currWorkspace, task) => {
	Object.keys(workspaceObj).some((workspace) => {
		if (workspace === currWorkspace) {
			workspaceObj[currWorkspace].push(task);
			return true;
		}

		return false;
	})

	return Object.fromEntries(
		Object.entries(workspaceObj).filter(([k, v]) => k === currWorkspace)
	);
}


/**
 * updateTask - update task enties
 * @workspaceObj: The workspqce obj
 * @currWorkspace: currWorkspace
 * @task: The given task
 *
 * Return: modified task in currWorkspace
 */

export const updateTask = (workspaceObj, currWorkspace, task) => {
  workspaceObj[currWorkspace].forEach((item) => {
    if (item.id === task.id) {
      Object.assign(item, task);
    }
  });

  return Object.fromEntries(
    Object.entries(workspaceObj).filter(([k, v]) => k === currWorkspace)
  );
}


/**
 * deleteTask: deletes a task from a workspace
 * @workspaceOj: The global house of all workspaces
 * @currWorkspace: The current workspace
 * task: The given task to delete
 *
 * Return: current workspace
 */

export const deleteTask = (workspaceObj, currWorkspace, id) => {
  workspaceObj[currWorkspace].forEach((item, idx) => {
    if (item.id === id) {
      workspaceObj[currWorkspace].splice(idx, 1);
    }
  });

  return Object.fromEntries(
    Object.entries(workspaceObj).filter(([k, v]) => k === currWorkspace )
  );
}
