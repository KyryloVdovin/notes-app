// Initialize Application state
let appState = {
    totalItems: 0,
    todo: {},
    completed: {},
    pending: {},
    isEditMode: false,
}

const categoriesData = { Task: 'Task', Idea: 'Idea', RandomThought: 'Random Thought' };
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

function addRow(e) {
    e.preventDefault();
    // if(document.getElementById('newTodo').value !== ''){
    //     // Make modification to the DOM

    // }

    let itemID = appState['totalItems'];
    var table = document.getElementById('todoTable');
    var row = table.insertRow(table.rows.length);
    row.setAttribute("id", `todoItem-${itemID}`);
    var task = row.insertCell(0);

    task.innerHTML += "<td><span id=\"title-" + itemID + "\">" + "new item" + "</span></td>";
    task.innerHTML += "<input id=\"inputTitle-" + itemID + "\" type=\"text\" />";;
    var inputTitle = document.getElementById('inputTitle-' + itemID);
    inputTitle.style.display = 'none';
    // task.setAttribute("id", `todoItem-${itemID}`);

    var createdAt = row.insertCell(1);
    let currentData = new Date();
    let month = months[currentData.getMonth()];
    let day = currentData.getDate();
    let year = currentData.getFullYear();
    let fullDate = `${month} ${day}, ${year}`;
    createdAt.innerHTML += "<td><span id=\"value-" + itemID + "\">" + fullDate + "</span></td>";
    // createdAt.innerHTML += "<input id=\"input-" + itemID + "\" type=\"text\" />";;
    // var input = document.getElementById('input-' + itemID);
    // input.style.display = 'none';

    var category = row.insertCell(2);

    category.innerHTML += "<td><span id=\"category-" + itemID + "\">" + categoriesData.Task + "</span></td>";
    category.innerHTML += "<select id=\"categoryDropDown-" + itemID + "\" type=\"text\" />";;
    var categoryDropDown = document.getElementById('categoryDropDown-' + itemID);
    for (let key in categoriesData) {
        let option = document.createElement("option");
        option.setAttribute('value', categoriesData[key]);

        let optionText = document.createTextNode(key);
        option.appendChild(optionText);

        categoryDropDown.appendChild(option);
    }
    categoryDropDown.style.display = 'none';

    var content = row.insertCell(3);
    content.innerHTML += "<td><span id=\"content-" + itemID + "\">" + "content" + "</span></td>";
    content.innerHTML += "<input id=\"contentInput-" + itemID + "\" type=\"text\" />";;
    var contentInput = document.getElementById('contentInput-' + itemID);
    contentInput.style.display = 'none';

    var dates = row.insertCell(4);
    dates.innerHTML += "<td>" + "dates" + "</td>";

    var editBtn = row.insertCell(5);
    editBtn.innerHTML += "<td><button>" + "edit" + "</button></td>";
    editBtn.addEventListener("click", function (e) {
        e.preventDefault();
        editButton(itemID);
    });

    var completeBtn = row.insertCell(6);
    completeBtn.innerHTML += "<td><button>" + "complete" + "</button></td>";

    var deleteBtn = row.insertCell(7);
    deleteBtn.innerHTML += "<td><button>" + "delete" + "</button></td>";

    var saveBtn = row.insertCell(8);
    saveBtn.innerHTML += "<td><button id=\"saveBtn-" + itemID + "\">" + "save" + "</button></td>";
    saveBtn.addEventListener("click", function (e) {
        e.preventDefault();
        saveButton(itemID);
    });
    saveBtn.style.display = "none";

    // var status = row.insertCell(9);
    // status.innerHTML += "<td><label><input id=\"" + itemID + "\" type=\"checkbox\" onclick=\"toggleTodo(this)\"/><span></span></label></td>";

    // Add todo state Object
    if (!appState['todo'][itemID]) {
        appState['todo'][itemID] = {
            item: 'new item',
            category: categoriesData.RandomThought,
            content: 'text',
            isEditing: false
        };
    }

    // Add Task to pending state object
    if (!appState['pending'][itemID]) {
        appState['pending'][itemID] = { item: 'new item' }
    }

    // Render Pending DOM Elements
    renderPendingElements(appState['pending'], itemID);

    // Increment the total number of items in state object
    appState['totalItems'] += 1;

    // clear input text in DOM
    // document.getElementById('newTodo').value = "";

    console.log(appState);
}

function toggleTodo(cb) {

    // Make modification to the DOM content
    if (cb.checked) {
        // Check if element is present in DOM
        if (!document.getElementById(`completedList-${cb.id}`)) {
            var ul = document.getElementById('completedItems');
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(appState['pending'][cb.id]['item']));
            li.setAttribute("id", `completedList-${cb.id}`);
            ul.appendChild(li);
        }
        // Remove DOM element from pending list
        var removeElement = document.getElementById(`pendingList-${cb.id}`);
        removeElement.parentNode.removeChild(removeElement);
    } else {
        // Check if element is present in DOM
        if (!document.getElementById(`pendingList-${cb.id}`)) {
            var ul = document.getElementById('pendingItems');
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(appState['completed'][cb.id]['item']));
            li.setAttribute("id", `pendingList-${cb.id}`);
            ul.appendChild(li);
        }
        // Remove DOM element from pending list
        var removeElement = document.getElementById(`completedList-${cb.id}`);
        removeElement.parentNode.removeChild(removeElement);
    }

    // Make modification to application state
    // We need to modidy DOM State before changing the app state because we delete state objects
    if (cb.checked) {
        // Add task to Completed object
        if (!appState['completed'][cb.id]) {
            appState['completed'][cb.id] = { item: appState['pending'][cb.id]['item'] }
        }
        // Remove task from pending object
        delete appState['pending'][cb.id];
    } else {
        // Add task to Pending object
        if (!appState['pending'][cb.id]) {
            appState['pending'][cb.id] = { item: appState['completed'][cb.id]['item'] }
        }
        // Remove task from Completed object
        delete appState['completed'][cb.id];
    }
}

function editButton(itemId) {
    appState['isEditMode'] = true;

    let buttons = document.getElementById('todoTable').getElementsByTagName("button");
    for (let button of buttons) {
        button.disabled = true;
    }

    if (appState.isEditMode) {
        var item = document.getElementById(`todoItem-${itemId}`);
        var inputTitle = document.getElementById(`inputTitle-${itemId}`);
        var contentInput = document.getElementById(`contentInput-${itemId}`);
        var categoryDropDown = document.getElementById(`categoryDropDown-${itemId}`);
        let buttons = item.getElementsByTagName("button");
        let saveBtn = document.getElementById(`saveBtn-${itemId}`).parentNode;
        let createNodeBtn = document.getElementById('createNoteBtn');
        for (let button of buttons) {
            if (`todoItem-${itemId}`) {
                button.parentNode.style.display = 'none';
            }
        }
        var title = document.getElementById(`title-${itemId}`);
        var content = document.getElementById(`content-${itemId}`);
        var category = document.getElementById(`category-${itemId}`);
        inputTitle.style.display = 'block';
        contentInput.style.display = 'block';
        categoryDropDown.style.display = 'block';
        title.style.display = 'none';
        content.style.display = 'none';
        category.style.display = 'none';
        saveBtn.style.display = 'block';
        saveBtn.firstChild.disabled = false;
        createNodeBtn.disabled = true;
    }
}
function saveButton(itemId) {
    appState['isEditMode'] = false;

    let buttons = document.getElementById('todoTable').getElementsByTagName("button");
    for (let button of buttons) {
        button.disabled = false;
    }

    if (!appState.isEditMode) {
        var item = document.getElementById(`todoItem-${itemId}`);
        var inputTitle = document.getElementById(`inputTitle-${itemId}`);
        var contentInput = document.getElementById(`contentInput-${itemId}`);
        var categoryDropDown = document.getElementById(`categoryDropDown-${itemId}`);
        let buttons = item.getElementsByTagName("button");
        let saveBtn = document.getElementById(`saveBtn-${itemId}`).parentNode;
        let createNodeBtn = document.getElementById('createNoteBtn');
        for (let button of buttons) {
            if (`todoItem-${itemId}`) {
                button.parentNode.style.display = 'table-cell';
            }
        }

        var title = document.getElementById(`title-${itemId}`);
        var content = document.getElementById(`content-${itemId}`);
        var category = document.getElementById(`category-${itemId}`);
        inputTitle.style.display = 'none';
        contentInput.style.display = 'none';
        categoryDropDown.style.display = 'none';
        category.style.display = 'block';
        title.style.display = 'block';
        content.style.display = 'block';
        saveBtn.style.display = 'none';
        saveBtn.firstChild.disabled = true;
        createNodeBtn.disabled = false;
    }

    appState['todo'][itemId] = {
        item: inputTitle.value,
        category: categoryDropDown.value,
        content: contentInput.value,
        isEditing: false
    };
    updateElement(itemId);

    // if (!appState['todo'][itemId]) {
    //     appState['todo'][itemId] = {
    //         item: 'new item',
    //         category: Categories.RandomThought,
    //         isEditing: false
    //     };
    // }
}

function renderPendingElements(pending, itemID) {
    var ul = document.getElementById('pendingItems');
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(pending[itemID]['item']));
    li.setAttribute("id", `pendingList-${itemID}`);
    ul.appendChild(li);
}

function updateElement(itemId) {
    var item = document.getElementById(`todoItem-${itemId}`);
    var title = document.getElementById(`title-${itemId}`);
    var content = document.getElementById(`content-${itemId}`);
    var category = document.getElementById(`category-${itemId}`);
    title.innerHTML = appState['todo'][itemId].item;
    content.innerHTML = appState['todo'][itemId].content;
    category.innerHTML = appState['todo'][itemId].category;
}