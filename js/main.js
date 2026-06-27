import * as sortUtility from "./features/sortUtility/index.js";
import * as panel from "./features/panel.js";
import * as crud from "./features/crud.js";
import * as store from "./features/dataStore.js";
import * as searchRes from "./features/search.js";


/* ===================================
VARIABLE DECLARATIONS
=================================== */

const body = document.querySelector("body");
const nav = document.querySelector("nav");
const toggleMenu = document.querySelector(".toggle-menu");
const sortTab = document.querySelector(".sort-tab");
const workspaceTab = document.querySelector(".workspace-tab");
const tutorialPanel = document.querySelector(".tutorial-panel");
const mobileSearchContainer = document.querySelector(".mobile-search-container");
const searchMenu = document.querySelector(".dropdown-search-menu");
const replacableItem = document.querySelector(".replacable-item");
const mobileWorkspaces = document.querySelector(".workspaces");
const desktopWorkspaces = document.querySelectorAll(".workspaces-desktop");
const deleteDialog = document.querySelector(".delete-modal-box dialog");
const foundWorkspace = document.querySelector("#found-workspace");
const dataList = nav.querySelector("#datalist-workspaces");

const main = document.querySelector(".main-content");
const dropDownMobileActions = searchMenu.querySelector(".dropdown-mobile-actions");
const dropDownDesktopActions = searchMenu.querySelector(".dropdown-desktop-actions");
const timeDate = document.querySelector(".time-date");
const clock = timeDate.querySelector(".clock");
const date = timeDate.querySelector(".date");
const dynamicTyping = document.querySelector(".dynamic-typing");
const table = document.querySelector("table");
const tableBody = table.querySelector("tbody");
const dropdownWrapperTabs = nav.querySelectorAll(".dropdown-wrapper");

const navDeskSearchInput = document.querySelector("#nav-search-input");
const navMoileSearchInput = document.querySelector("#mobile-search");
const taskInput = document.querySelector("#task-name");
const prioritySelector =  document.querySelector("#set-priority");
const dateInput = document.querySelector("#task-date");
const noSearchResultFound = searchMenu.querySelector(".no-search-result");
const foundSearch = searchMenu.querySelector(".found-search");
let currTabMode = null;
let workspaceToDelete = null;
let mobileScrollPos = null, desktopScrollPos = null;



/* ===================================
HANDLE DATA PARSING AND STORAGE
=================================== */

const workspaceObj = store.getStoreData() || {
  "health": [],
  "finance": [],
  "work": [],
  "learning": [],
  "home": [],
  "personal": [],
  "projects": [],
  "travel": [],
  "fitness": [],
  "social": [],
  "shopping": [],
  "hobbies": [],
}

const workspaceTitle = document.querySelector("#curr-workspace");
const storedName = store.getKeyValue("currWorkspaceName");
let currWWorkspaceName = (storedName && workspaceObj.hasOwnProperty(storedName)) ? storedName : "health";
let currWorkspace, defaultWorkspace;

const nameWorkspaceTitle = (workspaceName) => {
  let refinedName = (workspaceName && workspaceObj.hasOwnProperty(workspaceName)) ? workspaceName : "health";

  currWWorkspaceName = refinedName;
  store.saveKey("currWorkspaceName", refinedName);
  currWorkspace = workspaceObj[currWWorkspaceName] ||
  crud.createWorkspace(workspaceObj, currWWorkspaceName)[currWWorkspaceName];
  defaultWorkspace = currWorkspace;

  return `${refinedName}  workspace`;
}

workspaceTitle.textContent = nameWorkspaceTitle(currWWorkspaceName);


/* ===================================
HANDLE TASKBAR OPERATIONS
=================================== */

const getReplacableContainer = () => {
  return document.querySelector(".replacable-item") ||
    document.querySelector(".create-workspace-container");
}

const handleWorkspaceTabAction = (workspacesTab, tabState, clickedElem) => {
      if (!workspacesTab || !tabState || !currTabMode)
        return;

      let workspaceName = clickedElem.dataset.workspace || clickedElem.textContent.trim();
      if (workspacesTab.classList.contains("dropdown-mobile-actions") || workspacesTab.classList.contains("dropdown-desktop-actions")) {
          workspaceName = foundWorkspace.textContent.trim();
      }
  
      if (tabState === "selectTab") {
        const workspace = clickedElem;

        if (workspacesTab.contains(workspace) && !workspace.id.endsWith("-btn")) {
          workspaceTitle.textContent = nameWorkspaceTitle(workspaceName);
          currWorkspace = workspaceObj[workspaceName];
          ;
          tabState = null;
          updateTaskUi();
        }
      }

      if (tabState === "updateTab") {
        const workspace = clickedElem;
        if (workspacesTab.contains(workspace) && workspace.id !== "workspaces-cancel-btn") {
          workspacesTab.classList.remove("is-visible");
          workspaceTab.classList.remove("is-visible");

          const replacableTarget = getReplacableContainer();
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("create-workspace-container", "show-workspace-container");
          itemDiv.innerHTML = `
              <input
                type="text"
                value="${workspaceName}"
                placeholder="Update your workspace"
                id="update-workspace"
              />
              <button 
                type="button" 
                id="update-btn"
                class="fa-solid fa-sync"
                ></button>
              <button type="button" id="cancel-input-btn">x</button>
          `;
          replacableTarget.replaceWith(itemDiv);
          setTimeout(() => {
            const container = document.querySelector(".create-workspace-container");
            const realContainerPos = container.getBoundingClientRect().top + window.scrollY - 120;
            ;
            body.scrollTo({ behavior: "smooth", top: realContainerPos });
            main.scrollTo({ behavior: "smooth", top: realContainerPos });
          }, 100);
        }
      }
      
      if (tabState === "deleteTab") {
        const workspace = clickedElem;
        if (workspacesTab.contains(workspace) && workspace.id !== "workspaces-cancel-btn") {
          workspaceToDelete = workspace.dataset.workspace || workspace.textContent.trim();
          deleteDialog.showModal();
        tabState = null;
        }

        if (workspacesTab.classList.contains("dropdown-mobile-actions") || workspacesTab.classList.contains("dropdown-desktop-actions")) {
          workspaceToDelete = foundWorkspace.textContent.trim();
          deleteDialog.showModal();
        tabState = null;
        }

      }

      if (tabState === "sortTab") {
        const sortElem = clickedElem;
        let priority = null, status = null;
        let workspaceArr;

        if (workspacesTab.contains(sortElem) && sortElem.id !== "sortTab-cancel-btn") {
          const sortName = sortElem.dataset.sort;

          if (sortName === "Task Details") {
            workspaceArr = sortUtility.sortName(currWorkspace, "taskDetails");
            currWorkspace = workspaceArr[0];
          }

          if (sortName === "Expiration Date") {
            workspaceArr = sortUtility.sortOverdueDate(currWorkspace);
            currWorkspace = workspaceArr[0];
          }

          if (sortName === "Low Priority") {
            priority = "Low";
          }  else if (sortName === "Medium Priority") {
            priority = "Medium";
          } else if (sortName === "High Priority") {
            priority = "High";
          }
          if (priority) {
            workspaceArr = sortUtility.sortPriority(currWorkspace, priority);
            ;
            currWorkspace = workspaceArr[0];
          }

          if (sortName === "Pending") {
            status = "pending";
          } else if (sortName === "Completed") {
            status = "done";
          } else if (sortName === "Uncompleted") {
            status = "undone";
          }
          if (status) {
            workspaceArr = sortUtility.sortByStatus(currWorkspace, status);
            currWorkspace = workspaceArr[0];
          }

          if (sortName === "Default") {
            currWorkspace = defaultWorkspace;
          }
        }
      }
      workspacesTab.classList.remove("is-search-visible");
      searchMenu.classList.remove("is-search-visible");
    }

const closeAllDropdownWrapperTabs = (id) => {
  if (!id)
    return;

  for (const tab of dropdownWrapperTabs) {
    if (tab.id !== id && tab.classList.contains("item-desk-active")) {
      const dropdownTrigger = tab.previousElementSibling;
      const arrow = dropdownTrigger.querySelector(".arrow");

      arrow.classList.remove("item-desk-active");
      dropdownTrigger.classList.remove("item-desk-active");
      tab.classList.remove("item-desk-active");
      return;

    }
  }
}

nav.addEventListener("click", (e) => {
  const elem = e.target;
  const text = elem.textContent;
  const div = e.target.closest("div");
  const  li = e.target.closest("li");
  const span = e.target.closest("span");
  const iTag = e.target.closest("i");
  const button = e.target.closest("button");

  // Handle clickable nav items
  if (div?.classList.contains("toggle-menu")){
    const istoggled = div.classList.toggle("is-active");
    sortTab.classList.toggle("is-visible", istoggled);
  }

  if (span) {
    const text = span.textContent.trim();
    if (text === "Tutorial") {
      tutorialPanel.classList.toggle("tut-active");
    }

    if (span.id === "choose-mobile-workspace") {
      const isWsp = workspaceTab.classList.toggle("is-visible");
      if (!isWsp)
        mobileWorkspaces.classList.remove("is-visible");
    }
  }

  // Handle menuitems  pressdown

  const navlistMobileAll = document.querySelectorAll(".navlist-mobile > *");

  if (li) {
    const text = li.textContent.trim();
    const parentUl = li.parentElement;

    if (li.classList.contains("search-workspace-mobile")) {
      mobileSearchContainer.classList.add("search-active");
      navlistMobileAll.forEach((item) => item.classList.add("search-active"));
    }

    if (text === "Add workspace") {
      workspaceTab.classList.remove("is-visible");
      mobileWorkspaces.classList.remove("is-visible");
      mobileScrollPos = body.scrollTop;
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("create-workspace-container", "show-workspace-container");
      itemDiv.innerHTML = `
          <input
            type="text"
            placeholder="Create your workspace"
            id="create-workspace"
          />
          <button type="button" id="create-btn">+</button>
          <button type="button" id="cancel-input-btn">x</button>
      `;
      replacableItem.replaceWith(itemDiv);
      setTimeout(() => {
        const container = document.querySelector(".create-workspace-container");
        const realContainerPos = container.getBoundingClientRect().top + window.scrollY - 120;
        ;
        body.scrollTo({ behavior: "smooth", top: realContainerPos });
      }, 100);
    }

    if (text === "Select workspace") {
      mobileWorkspaces.classList.add("is-visible");
      currTabMode = "selectTab";
    }

    if (text === "Update workspace") {
      mobileWorkspaces.classList.add("is-visible");
      currTabMode = "updateTab";
      mobileScrollPos = body.scrollTop;
    }

    if (text === "Delete workspace") {
      mobileWorkspaces.classList.add("is-visible");
      currTabMode = "deleteTab";
    }

    if (li.id === "sortTab-cancel-btn") {
      sortTab.classList.remove("is-visible");
      toggleMenu.classList.remove("is-active");
    }

    if (li.id === "workspaceTab-cancel-btn") {
      workspaceTab.classList.remove("is-visible");
      mobileWorkspaces.classList.remove("is-visible");
    }

    if (li.id === "workspaces-cancel-btn") {
      mobileWorkspaces.classList.remove("is-visible");
    }

    handleWorkspaceTabAction(mobileWorkspaces, currTabMode, li);

    if (parentUl.classList.contains("sort-tab")) {
      currTabMode = "sortTab";
      ;
      handleWorkspaceTabAction(parentUl, currTabMode, li);
      store.saveToStore(workspaceObj);
      updateTaskUi();
    }

    // Desktop version

    if (li.classList.contains("nav-item-btn")) {
      li.classList.add("item-desk-active");
    }

    if (li.classList.contains("tut-desktop")) {
      const isToggled = tutorialPanel.classList.toggle("tut-active");
      li.classList.toggle("item-desk-active", isToggled);
    }

    if (li.classList.contains("dropdown-trigger")) {
      const arrow = li.querySelector(".arrow");
      const dropdownWrapper = li.nextElementSibling;
      const  childUl = dropdownWrapper.querySelector("ul");
      let id = null;

      if (childUl.classList.contains("select-tab") &&
      dropdownWrapper.contains(childUl)) {
        id = "wrapper-select-tab";
      } else if (childUl.classList.contains("update-tab") &&
    dropdownWrapper.contains(childUl)) {
        id = "wrapper-update-tab";
      } else if (childUl.classList.contains("delete-tab") &&
      dropdownWrapper.contains(childUl)) {
        id = "wrapper-delete-tab";
      } else  {
        id = null;
      }
      dropdownWrapper.id = id;
      ;

      const isTurned = arrow.classList.toggle("item-desk-active");
      li.classList.toggle("item-desk-active", isTurned);
      dropdownWrapper.classList.toggle("item-desk-active", isTurned);
      // dropdownWrapper.classList.toggle("active-wrapper", isTurned);
      closeAllDropdownWrapperTabs(id);
    }
    
    if (parentUl.classList.contains("workspaces-desktop")) {
      if (parentUl.classList.contains("select-tab"))
        currTabMode = "selectTab";
      else if (parentUl.classList.contains("update-tab")) {
        currTabMode = "updateTab";
        desktopScrollPos = main.scrollTop;
      }
      else if (parentUl.classList.contains("delete-tab"))
        currTabMode = "deleteTab";
      else currTabMode = null;

      handleWorkspaceTabAction(parentUl, currTabMode, li);
    }

    if (parentUl.classList.contains("sort-tab-desktop")) {
      currTabMode = "sortTab";
      handleWorkspaceTabAction(parentUl, currTabMode, li);
      store.saveToStore(workspaceObj);
      updateTaskUi();
    }

    if (li.classList.contains("add-workspace-desktop")) {
      const itemDiv = document.createElement("div");
      const replacableTarget = getReplacableContainer();
      ;
      desktopScrollPos = main.scrollTop;

        itemDiv.classList.add("create-workspace-container", "show-workspace-container");
        itemDiv.innerHTML = `
            <input
              type="text"
              placeholder="Create your workspace"
              id="create-workspace"
            />
            <button 
              type="button" 
              id="create-btn"
              >+</button>
            <button type="button" id="cancel-input-btn">x</button>
        `;
        replacableTarget.replaceWith(itemDiv);
        setTimeout(() => {
        document.querySelector(".create-workspace-container")
          .scrollIntoView({behavior: "smooth", block: "center"});
        }, 10);
    }
  }

  if (button) {
    if (button.id === "search-cancel-btn") {
      navlistMobileAll.forEach((item) => item.classList.remove("search-active"));
      toggleMenu.classList.remove("is-active");
      sortTab.classList.remove("is-visible");
    }

    // Desltop version
    if (button.id === "desk-search-btn") {
      searchMenu.classList.add("is-search-visible");
      handleSearchInputs();
    }
  }

  if (iTag) {
    if (iTag.id === "search-item-icon") {
      mobileSearchContainer.classList.add("search-active");
    navlistMobileAll.forEach((item) => item.classList.add("search-active"));
    }

    if (iTag.id === "search-mobile-workspace") {
      searchMenu.classList.add("is-search-visible");
      handleSearchInputs();
    }

  }

});

//  Attaching event listener to main

main.addEventListener("click", (e) => {
  const elem = e.target;
  const text = elem.textContent;
  const div = e.target.closest("div");
  const span = e.target.closest("span");
  const iTag = e.target.closest("i");
  const button = e.target.closest("button");

  if (!searchMenu.contains(elem)) {
    searchMenu.classList.remove("is-search-visible");
    dropDownMobileActions.classList.remove("is-search-visible");
  }

  if (span) {
    const parentSpan = span.parentElement;
    if (span.id === "dropdown-icon") {
      dropDownMobileActions.classList.toggle("is-search-visible");
    }

    if (span.id === "mobile-action-cancel-btn") {
      dropDownMobileActions.classList.remove("is-search-visible");
    }

    if (span.id === "desktop-action-cancel-btn") {
      ;
      searchMenu.classList.remove("is-search-visible");
    }

    if (parentSpan.classList.contains("dropdown-mobile-actions")) {
      if (span.id === "mobile-action-select")
        currTabMode = "selectTab";
      else if (span.id === "mobile-action-update")
        currTabMode = "updateTab";
      else if (span.id === "mobile-action-delete")
        currTabMode = "deleteTab";
      else
        currTabMode = null;

      handleWorkspaceTabAction(dropDownMobileActions, currTabMode, span);
    }

    //DESKTOP MODE
    if (parentSpan.classList.contains("dropdown-desktop-actions")) {
      if (span.id === "desktop-action-select")
        currTabMode = "selectTab";
      else if (span.id === "desktop-action-update")
        currTabMode = "updateTab";
      else if (span.id === "desktop-action-delete")
        currTabMode = "deleteTab";
      else
        currTabMode = null;

      handleWorkspaceTabAction(dropDownDesktopActions, currTabMode, span);
    }
  }

  if (button) {
    if (button.id === "cancel-input-btn") {
      ;
      const container = getReplacableContainer();
      container.replaceWith(replacableItem);
      document.querySelector(".add-workspace-desktop").classList.remove("item-desk-active");
       if (mobileScrollPos) {
        body.scrollTo({top: mobileScrollPos, behavior: "smooth"});
        mobileScrollPos = null;
      }

      if (desktopScrollPos) {
        main.scrollTo({top: desktopScrollPos, behavior: "smooth"});
        desktopScrollPos = null;
      }
    }

    if (button.id === "close-panel-btn") {
      tutorialPanel.classList.remove("tut-active");
      nav.querySelector(".tut-desktop").classList.remove("item-desk-active");
    }

    if (button.id === "dialog-cancel-btn") {
      deleteDialog.close();
    }
    
    if (button.id === "create-btn") {
      handleCreateWorkspaceInputs();
      updateWorkspaceUi();
    }
    
    if (button.id === "update-btn") {
      handleUpdateWorkspaceInputs();
      updateWorkspaceUi();
    }

    if (button.id === "dialog-delete-btn") {
      if (workspaceToDelete) {
        const res = crud.deleteWorkspace(workspaceObj, workspaceToDelete);
        if (res !== "undefined") {
          foundSearch.classList.remove("is-search-visible");
          store.saveToStore(workspaceObj);

          if (currWWorkspaceName === workspaceToDelete) {
            currWWorkspaceName = Object.keys(workspaceObj)[0] || "health";
            workspaceTitle.textContent = nameWorkspaceTitle(currWWorkspaceName);
          }
          updateWorkspaceUi();
          updateTaskUi();
        }
        workspaceToDelete = null;
      }
      deleteDialog.close();
    }

    if (button.id === "add-task") {
      handleTaskInputs();
      updateTaskUi();
    }

    if (button.id.startsWith("delete-table-task-")) {
      const taskId = button.id.replace("delete-table-task-", "");
      const warning = deleteDialog.querySelector("p");
      const deleteBtn =  deleteDialog.querySelector("button + button");
      deleteBtn.id = `delete-task-btn-${taskId}`;
      warning.textContent = "Do you want to delete this task";
      deleteDialog.showModal();
      
    }
    
    if (button.id.startsWith("update-table-task-")) {
      const taskId = button.id.replace("update-table-task-", "");
      const tbRow = document.querySelector(`#row-${taskId}`);
      const task = currWorkspace.find((t) => t.id === taskId)
      const prevTaskDate = new Date(task.dueDate).toISOString().split("T")[0];      tbRow.innerHTML = `
        <td>
          <button
            class="edit-update-btn fa-solid fa-sync"
            id="edit-update-btn-${taskId}"
            ></button>
        </td>
        <td>
          <input
            type="text"
            value="${task.taskDetails}"
            class="edit-task-input"
            id="edit-task-input-${taskId}"
          />
        </td>
        <td>
          <select class="edit-selector">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
        </td>
        <td>
          <input
          type="date"
          value="${prevTaskDate}"
          class="edit-task-date"
          id="edit-task-date-${taskId}"
        />
        </td>
        <td>
          <button
            class="edit-cancel-btn"
            id="edit-cancel-btn-${taskId}"
            >X</button>
        </td>
      `;
    }

    if (button.classList.contains("edit-cancel-btn")) {
      updateTaskUi();
    }

    if (button.id.startsWith("edit-update-btn-")) {
      const id = button.id.replace("edit-update-btn-", "");
      handleUpdateTaskInputs(id);
    }
      

    if (button.id.startsWith("delete-task-btn-")) {
      const taskId = button.id.replace("delete-task-btn-", "");
      crud.deleteTask(workspaceObj, currWWorkspaceName, taskId);
      store.saveToStore(workspaceObj);
      updateTaskUi();
      deleteDialog.close();
    }
    
    if (button.id === "toggle-tb-action-btn") {
      table.classList.toggle("is-open");
    }
  }

  if (elem.type === "checkbox") {
    const taskid = elem.id.replace("task-marker-", "");
    const task = currWorkspace.find((t) => t.id === taskid);
    if (elem.checked) {
      task.status = "done";
    } else {
      task.status = "pending";
    }
    store.saveToStore(workspaceObj);
    updateTaskUi();
  }

});

// Add interactivity to clock panel
const hour = clock.querySelector(".hour");
const minute = clock.querySelector(".minute");
const second = clock.querySelector(".second");

panel.clockSetUp(hour, minute, second);
if (date.textContent !== panel.formattedDate())
  date.textContent = panel.formattedDate();

// handle dynamic text rendering
const myText = "Check your deadline against the date";
let chrIdx = 0;
const lenMyText = myText.length;

const typeText = () => {
  if (chrIdx < lenMyText) {
    dynamicTyping.textContent += myText[chrIdx];
    chrIdx++;
    setTimeout(typeText, 200);
  } else {
    setTimeout(eraseText, 2000);
  }
}
typeText();

const eraseText = () => {
  if (chrIdx > 0) {
    chrIdx--;
    dynamicTyping.textContent = myText.substring(0, chrIdx);
    setTimeout(eraseText, 70);
  } else {
    setTimeout(typeText, 1000);
  }
}
eraseText();

/* ===================================
HANDLE USER INPUTS
=================================== */

 const handleSearchInputs = () => {
const navDeskSearchValue = navDeskSearchInput.value.trim();
const navMoileSearchValue = navMoileSearchInput.value.trim();
 let activeSearch = "";
 
foundSearch.classList.remove("is-search-visible");
noSearchResultFound.classList.remove("is-search-visible");
 
 
  if (navMoileSearchValue) {
    activeSearch = navMoileSearchValue;
  } else if (navDeskSearchValue) {
    activeSearch = navDeskSearchValue;
  } else {
    return;
  }
  
  if (searchRes.searchWorkspace( 
    workspaceObj, activeSearch)) {
    foundSearch.classList.add("is-search-visible");
    foundWorkspace.textContent = activeSearch;
  } else {
    noSearchResultFound.classList.add("is-search-visible");
  }

  navMoileSearchInput.value = "";
  navDeskSearchInput.value = "";
 }

 const handleCreateWorkspaceInputs = () => {
  const createWorkspaceValue = document.querySelector("#create-workspace").value;
  if (!createWorkspaceValue) {
    return;
  }

  const workspaceContainer = getReplacableContainer();
  const divMarker = document.createElement("div");

  divMarker.classList.add("update-marker");
  divMarker.innerHTML = `
  <i class="fa-solid fa-circle-check"></i>
  `;

  const res = crud.createWorkspace(workspaceObj, createWorkspaceValue);
  if (res !== "undefined") {
    workspaceTitle.textContent = nameWorkspaceTitle(createWorkspaceValue);
     document.querySelector(".add-workspace-desktop").classList.remove("item-desk-active");
  
    document.querySelector("#create-workspace").value = "";
    workspaceContainer.replaceWith(divMarker);
    store.saveToStore(workspaceObj);
    updateTaskUi();
   
    setTimeout(() => {
      document.querySelector(".update-marker").replaceWith(workspaceContainer);
      getReplacableContainer().replaceWith(replacableItem);
    }, 2000);
  }
 }
 
const handleUpdateWorkspaceInputs = () => {
  const oldWorkspaceValue = document.querySelector("#update-workspace").defaultValue.trim();
  const newWorkspaceValue = document.querySelector("#update-workspace").value.trim();
  
  if (!newWorkspaceValue) {
    return;
  }
  
  if (oldWorkspaceValue === newWorkspaceValue) {
      document.querySelector("#update-workspace").value = "";
      return;
  }
  
  const workspaceContainer = getReplacableContainer();
  const divMarker = document.createElement("div");

  divMarker.classList.add("update-marker");
  divMarker.innerHTML = `
  <i class="fa-solid fa-circle-check"></i>
  `

  const res = crud.updateWorkspace(workspaceObj, oldWorkspaceValue, newWorkspaceValue);
  if (res !== "undefined") {
    workspaceContainer.replaceWith(divMarker);
    
    if (oldWorkspaceValue === currWWorkspaceName) {
      workspaceTitle.textContent = nameWorkspaceTitle(newWorkspaceValue);
    }
    
    store.saveToStore(workspaceObj);
    updateTaskUi();
   
    setTimeout(() => {
      document.querySelector(".update-marker").replaceWith(workspaceContainer);
      getReplacableContainer().replaceWith(replacableItem);
      if (mobileScrollPos) {
        body.scrollTo({top: mobileScrollPos, behavior: "smooth"});
        mobileScrollPos = null;
      }

      if (desktopScrollPos) {
        main.scrollTo({top: desktopScrollPos, behavior: "smooth"});
        desktopScrollPos = null;
      }
    }, 2000);
  }

 }
 
const handleTaskInputs = () => {
  const taskDetailsValue = taskInput.value;
  const priorityValue = prioritySelector.value;
  const dateValue = dateInput.value;
  const today = new Date().setHours(0, 0, 0, 0);

  if (!taskDetailsValue) {
    alert("Please enter your task details");
    return;
  }

  if (dateValue && new Date(dateValue) < new Date(today))
  {
    alert("Task date cannot be in the past");
    return;
  }

  const task = {
    id: crypto.randomUUID(),
    taskDetails: taskDetailsValue,
    priority: priorityValue,
    dueDate: dateValue ? new Date(dateValue).toISOString() :
    new Date().toISOString(),
    status: "pending",
  };
  crud.addTask(workspaceObj, currWWorkspaceName, task);
  store.saveToStore(workspaceObj);
  taskInput.value  = "";
  dateInput.value = "";
  prioritySelector.value = "Low";
}

const handleUpdateTaskInputs = (id) => {
  const updateTaskDetailsInput = document.querySelector(".edit-task-input");
  const selector = document.querySelector(".edit-selector");
  const updateTaskDateInput = document.querySelector(".edit-task-date");
  let task = currWorkspace.find((t) => t.id === id);
  const updateTaskValue = updateTaskDetailsInput.value;
  const updatedSelectorValue = selector.value;
  const updatedDateValue = updateTaskDateInput.value;
  const today = new Date().setHours(0, 0, 0, 0);

  if (!updateTaskValue) {
    alert("please enter update details");
    return;
  }

  if (updatedDateValue && new Date(updatedDateValue) < new Date(today)) {
    alert("Updated date can't be in the past");
    return;
  }

  task.taskDetails =  updateTaskValue;
  task.priority = updatedSelectorValue,
  task.dueDate = updatedDateValue ? new Date(updatedDateValue).toISOString() :
    new Date().toISOString();
    task.status = "pending";
  store.saveToStore(workspaceObj);
  updateTaskUi();
}


/* ===================================
HANDLE UI KEYBOARD PRESSES
=================================== */

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key === "Enter") {
    const inputFocus = document.querySelector("input:focus");

    if (inputFocus.id === "task-name" || inputFocus.type === "date") {
      handleTaskInputs();
        updateTaskUi();
    }

    if (inputFocus.id === "mobile-search" ||
      inputFocus.id === "nav-search-input") {
      searchMenu.classList.add("is-search-visible");
      handleSearchInputs();
    }

    if (inputFocus.id === "create-workspace") {
       handleCreateWorkspaceInputs();
      updateWorkspaceUi();
    }

    if (inputFocus.id === "update-workspace") {
      handleUpdateWorkspaceInputs();
      updateWorkspaceUi();
    }

    if (inputFocus.id.startsWith("edit-task-input-")) {
      const id = inputFocus.id.replace("edit-task-input-", "");
      handleUpdateTaskInputs(id);
    }

    if (inputFocus.id.startsWith("edit-task-date-")) {
      const id = inputFocus.id.replace("edit-task-date-", "");
      handleUpdateTaskInputs(id);
    }
  }
});


/* ===================================
HANDLE DRAGGING TABLE ROWS
=================================== */

let lastAfterElement = null;
let rafId = null;
let lastY = 0;
let draggingRow = null;
let rowBoxes = [];

tableBody.addEventListener("dragstart", (e) => {
  draggingRow = e.target.closest("tr");
  draggingRow.classList.add("dragging");
  rowBoxes = [...tableBody.children].filter((row) => row !== draggingRow)
    .map((r) => {
      const box = r.getBoundingClientRect();
      return {
        row: r,
        midPoint: box.top + box.height / 2,
      }
    })
});

tableBody.addEventListener("dragend", (e) => {
  draggingRow.classList.remove("dragging");
  draggingRow = null;
  lastAfterElement = null;
  cancelAnimationFrame(rafId);
  reOrderTasks();
});

tableBody.addEventListener("dragover", (e) => {
  e.preventDefault();
  lastY = e.clientY;
  
  rafId = requestAnimationFrame(() => {
    rafId = null;
    updateRowPosition(lastY);
  });
});

const updateRowPosition = (y) => {
  const afterElement = getAfterElement(y);
  
  if (afterElement === lastAfterElement)
  return;
  
  lastAfterElement = afterElement;
  if (!afterElement) {
    tableBody.appendChild(draggingRow);
  } else {
    tableBody.insertBefore(draggingRow, afterElement);
  }
}

 
 const getAfterElement = (y) => {
   return binarySearch(y);
 }

 const binarySearch = (y) => {
  if (rowBoxes.length === 0)
    return null;

  let high = rowBoxes.length, low = 0;

  while (low < high) {
    const mid =  (low + high) >> 1;
    const rowMid = rowBoxes[mid].midPoint;

    /* In both if and else condition we are searching for an eleent whose
    midpoint  is greater than y and hence when this loop terinates we have
    found thar elenment or we didn't find it and hence return null */
    if (y > rowMid) {
      low = mid + 1; // search below the current row
    } else {
      high = mid; // take this row or  search the ones above it 
    }
  }

  if (low >= rowBoxes.length)
    return null;

  return rowBoxes[low].row || null;
 }


 const reOrderTasks = () => {
  const newOrderIds = [...tableBody.querySelectorAll("tr")]
    .map((row) => row.dataset.id);
    const orderMap = new Map(currWorkspace.map((task) => [task.id, task]));
    const reOrderedTasks = newOrderIds.map((id) => orderMap.get(id));
    ;

    currWorkspace.length = 0;
    currWorkspace.push(...reOrderedTasks);
    
    store.saveToStore(workspaceObj);
 }


/* ===================================
HANDLE ANIMATING TOGGLE MENU SECTIONS
=================================== */

const options = {
  threshold: 0.03,
  rootMargin: "0px 0px -50px 0px",
} 
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-section");
    } else {
      entry.target.classList.remove("show-section");
    }
  })
 }, options);

const tutorialPanelSections = tutorialPanel.querySelectorAll(".tut-article > section");
tutorialPanelSections.forEach((section) => observer.observe(section));


/* ===================================
HANDLE UI UPDATE
=================================== */

const updateWorkspaceUi = () => {
  const fragment = document.createDocumentFragment();
  const dataFragment = document.createDocumentFragment();
  const workspaceList = document.querySelectorAll(".workspaces, .workspaces-desktop");

  dataList.innerHTML = "";
  workspaceList.forEach(ul => {
    ul.innerHTML = "";

    if (ul.classList.contains("workspaces")) {
      ul.innerHTML = `
        <li id="workspaces-cancel-btn">Cancel</li>
      `;
    }
  });

  for (const key in workspaceObj) {
    const li = document.createElement("li");
    const option = document.createElement("option")
    option.value = key;
    li.dataset.workspace = key;
    li.textContent = key;

    dataFragment.appendChild(option);
    fragment.appendChild(li);
  }

  dataList.appendChild(dataFragment);
  mobileWorkspaces.appendChild(fragment.cloneNode(true));
  desktopWorkspaces.forEach((desk) => {
    desk.appendChild(fragment.cloneNode(true));
  });
}

updateWorkspaceUi();

const formatDate = (date) => {
  date = new Date(date);
  const year = date.getUTCFullYear().toString().substring(2, 4);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  return `${day}/${month}/${year}`;
}

const refreshTaskState = () => {
  const today = new Date().setHours(0, 0, 0, 0);
  currWorkspace.forEach((task) => {
    if (new Date(task.dueDate) < new Date(today) && task.status === "pending") {
      task.status = "undone";
    }
  });
  store.saveToStore(workspaceObj);
}

const updateTaskUi = () =>  {
  const fragment = document.createDocumentFragment();
  const today = new Date().setHours(0, 0, 0, 0);

  refreshTaskState();
  currWorkspace.forEach((task) => {
    const formatedDate = formatDate(task.dueDate);
    const tr = document.createElement("tr");
    const isDone = task.status === "done";
    const completed = isDone && (new Date(task.dueDate) < new Date(today));
    const isUndone = task.status === "undone";
    const iconClass = isDone ? "fa-check" : (isUndone ? "fa-xmark" : "");
    const labelClass = isUndone ? "label-red" : (isDone ? "label-green" : "");
    const labelTitle =  isUndone ? "Uncompleted task": (
      completed ? "Completed task" : (isDone ? "Unmark if not completed" : "Pending"));

    tr.id = `row-${task.id}`;
    tr.dataset.id = task.id;
    tr.draggable = true;
    tr.innerHTML = `
      <td>
        <div class="tb-status-container">
          <input
            type="checkbox"
            ${isDone ? "checked" : ""}
            ${completed ? "disabled" : ""}
            ${isUndone ? "disabled": ""}
            class="status-check"
            id="task-marker-${task.id}"
            title="check the box to mark as completed"
          />
          <label
            for="task-marker-${task.id}"
            class=${labelClass}
            title="${labelTitle}"
          ><i class="fa-solid ${iconClass}"></i></label>
        </div>
      </td>
      <td id="task-details-${task.id}">${task.taskDetails}</td>
      <td>${task.priority}</td>
      <td>
        <button
          class="fa-solid fa-pen-to-square"
          title="update item"
          id="update-table-task-${task.id}"
        ></button>
        <button
          class="fa-solid fa-trash-can"
          title="delete item"
          id="delete-table-task-${task.id}"
          ></button>
      </td>
      <td id="date-${task.id}">${formatedDate}</td>
    `;

    fragment.appendChild(tr);
  });

  tableBody.innerHTML = "";
  tableBody.appendChild(fragment);
}

updateTaskUi();


// window.updateTaskUi = updateTaskUi;
