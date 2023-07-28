
// Initialize Application state
let appState = {
    totalItems: 0,
    totalActiveItems: 0,
    todo: {},
    completed: {},
    archived: [],
    pending: {},
    isEditMode: false,
}

const categoriesData = { Task: 'Task', Idea: 'Idea', RandomThought: 'RandomThought', Quote: 'Quote' };
const categoriesIcons = {
    Task: './img/icons/task.png', Idea: './img/icons/idea.png',
    RandomThought: './img/icons/randomThought.png', Quote: './img/icons/quote.png'
};
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

let archivedItem;
let saveBlocked = false;

function addRow(e, unarchivClicked = false) {
    e.preventDefault();

    let itemID;
    var table = document.getElementById('todoTable');

    let currentData = new Date();
    let month = months[currentData.getMonth()];
    let day = currentData.getDate();
    let year = currentData.getFullYear();
    let fullDate = `${month} ${day}, ${year}`;

    if (!unarchivClicked) {
        if (!appState['todo'][itemID]) {
            itemID = appState['totalActiveItems'];

            appState['todo'][itemID] = {
                id: itemID,
                item: 'new item',
                category: categoriesData.Task,
                content: 'text',
                iconPath: './img/icons/task.png',
                fullDate: fullDate,
                dates: '',
                isArchived: false,
            };
        }
    }
    else {
        if (!appState['todo'][archivedItem.id]) {

            itemID = archivedItem.id;
            appState['todo'][archivedItem.id] = {
                ...archivedItem,
                isArchived: false
            };
        }
    }

    var row = table.insertRow(table.rows.length);
    row.setAttribute("id", `todoItem-${itemID}`);

    var icon = row.insertCell(0);

    icon.innerHTML += "<td><img src=\"" + categoriesIcons.Task + "\" id=\"icon-" + itemID + "\"></img></td>";

    var task = row.insertCell(1);

    task.innerHTML += "<td><span id=\"title-" + itemID + "\">" + appState['todo'][itemID].item + "</span></td>";
    task.innerHTML += "<input id=\"inputTitle-" + itemID + "\" type=\"text\" />";;
    var inputTitle = document.getElementById('inputTitle-' + itemID);
    inputTitle.style.display = 'none';

    var createdAt = row.insertCell(2);
    createdAt.innerHTML += "<td><span id=\"value-" + itemID + "\">" + appState['todo'][itemID].fullDate + "</span></td>";

    var category = row.insertCell(3);

    category.innerHTML += "<td><span id=\"category-" + itemID + "\">" + appState['todo'][itemID].category + "</span></td>";
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

    var content = row.insertCell(4);
    content.innerHTML += "<td><span id=\"content-" + itemID + "\">" + appState['todo'][itemID].content + "</span></td>";
    content.innerHTML += "<input id=\"contentInput-" + itemID + "\" type=\"text\" />";;
    var contentInput = document.getElementById('contentInput-' + itemID);
    contentInput.style.display = 'none';

    var dates = row.insertCell(5);
    dates.innerHTML += "<td><span id=\"dates-" + itemID + "\">" + appState['todo'][itemID].dates + "</span></td>";
    dates.innerHTML += "<input id=\"datesInput-" + itemID + "\" type=\"text\" />";;
    var datesInput = document.getElementById('datesInput-' + itemID);
    datesInput.style.display = 'none';

    var editBtn = row.insertCell(6);
    editBtn.innerHTML += "<td><button>" + "edit" + "</button></td>";
    editBtn.addEventListener("click", function (e) {
        e.preventDefault();
        editButton(itemID);
    });

    var deleteBtn = row.insertCell(7);
    deleteBtn.innerHTML += "<td><button>" + "delete" + "</button></td>";
    deleteBtn.addEventListener("click", function (e) {
        e.preventDefault();
        deleteNote(itemID);
    });

    var saveBtn = row.insertCell(8);
    saveBtn.innerHTML += "<td><button id=\"saveBtn-" + itemID + "\">" + "save" + "</button></td>";
    var saveButtonObject = document.getElementById('saveBtn-' + itemID);
    saveButtonObject.addEventListener("click", function (e) {
        e.preventDefault();
        saveButton(itemID);
    });
    saveBtn.style.display = "none";

    datesInput.addEventListener("change", function (e) {
        e.preventDefault();
        const pattern = /\d{2}[/]\d{2}[/]\d{4}/gm;
        const splited = datesInput.value.split(',');

        for (let i = 0; i < splited.length; i++) {
            let date = splited[i].match(pattern);

            if (date === null) {
                saveButtonObject.disabled = true;
                saveButtonObject.disabled = datesInput.value !== '';

                return;
            }
            else if (date !== null) {
                saveButtonObject.disabled = false;
            }
        }
    });

    appState['totalActiveItems'] += 1;

    console.log(appState);
    countActiveElements();
}

function onDatesChanges() {
    const pattern = /\d{2}[/]\d{2}[/]\d{4}/gm;
    const dates = '11/07/2023, 12/07/2023, 13/07/2023';
    const splited = dates.split(',');
    for (let i = 0; i < splited.length; i++) {
        let a = splited[i].match(pattern);
        console.log(a);
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
        var datesInput = document.getElementById(`datesInput-${itemId}`);
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
        var dates = document.getElementById(`dates-${itemId}`);
        var category = document.getElementById(`category-${itemId}`);

        inputTitle.value = appState['todo'][itemId].item;
        contentInput.value = appState['todo'][itemId].content;
        datesInput.value = appState['todo'][itemId].dates;
        inputTitle.style.display = 'block';
        contentInput.style.display = 'block';
        datesInput.style.display = 'block';
        categoryDropDown.style.display = 'block';
        title.style.display = 'none';
        content.style.display = 'none';
        dates.style.display = 'none';
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
        var datesInput = document.getElementById(`datesInput-${itemId}`);
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
        var dates = document.getElementById(`dates-${itemId}`);
        var category = document.getElementById(`category-${itemId}`);

        inputTitle.style.display = 'none';
        contentInput.style.display = 'none';
        datesInput.style.display = 'none';
        categoryDropDown.style.display = 'none';
        category.style.display = 'block';
        title.style.display = 'block';
        content.style.display = 'block';
        dates.style.display = 'block';
        saveBtn.style.display = 'none';
        saveBtn.firstChild.disabled = true;
        createNodeBtn.disabled = false;
    }

    appState['todo'][itemId] = {
        ...appState['todo'][itemId],
        item: inputTitle.value,
        category: categoryDropDown.value,
        content: contentInput.value,
        dates: datesInput.value,
        isArchived: false
    };
    updateElement(itemId);
}

function deleteNote(itemId) {
    appState['todo'][itemId] = {
        ...appState['todo'][itemId],
        isArchived: true
    };
    appState['archived'].push({
        ...appState['todo'][itemId],
        isArchived: true,
    });

    appState['totalActiveItems'] -= 1;
    delete appState['todo'][itemId];
    let item = document.getElementById(`todoItem-${itemId}`);
    item.remove();

    countActiveElements();
    countArchivedElements();
}

function countActiveElements() {
    let activeTasks = 0;
    let activeIdea = 0;
    let activeRandomThought = 0;
    let activeQuote = 0;

    for (const [key, value] of Object.entries(appState['todo'])) {
        switch (value.category) {
            case 'Task':
                activeTasks = !value.isArchived ? activeTasks + 1 : activeTasks;
                break;
            case 'Idea':
                activeIdea = !value.isArchived ? activeIdea + 1 : activeIdea;
                break;
            case 'RandomThought':
                activeRandomThought = !value.isArchived ? activeRandomThought + 1 : activeRandomThought;
                break;
            case 'Quote':
                activeQuote = !value.isArchived ? activeQuote + 1 : activeQuote;
                break;
        }
    }

    var taskSummaryActiveCount = document.getElementById('task-summary-active-count');
    var randomThoughtSummaryActiveCount = document.getElementById('random-thought-summary-active-count');
    var ideaSummaryActiveCount = document.getElementById('idea-summary-active-count');
    var quotesSummaryActiveCount = document.getElementById('quotes-summary-active-count');

    taskSummaryActiveCount.innerHTML = activeTasks;
    randomThoughtSummaryActiveCount.innerHTML = activeRandomThought;
    ideaSummaryActiveCount.innerHTML = activeIdea;
    quotesSummaryActiveCount.innerHTML = activeQuote;
}
function countArchivedElements() {
    let archivedTasks = 0;
    let archivedIdea = 0;
    let archivedRandomThought = 0;
    let archivedQuote = 0;

    for (const [key, value] of Object.entries(appState['archived'])) {
        switch (value.category) {
            case 'Task':
                archivedTasks = value.isArchived ? archivedTasks + 1 : archivedTasks;
                break;
            case 'Idea':
                archivedIdea = value.isArchived ? archivedIdea + 1 : archivedIdea;
                break;
            case 'RandomThought':
                archivedRandomThought = value.isArchived ? archivedRandomThought + 1 : archivedRandomThought;
                break;
            case 'Quote':
                archivedQuote = value.isArchived ? archivedQuote + 1 : archivedQuote;
                break;
        }
    }

    var taskSummaryArchivedCount = document.getElementById('task-summary-archived-count');
    var randomThoughtSummaryArchivedCount = document.getElementById('random-thought-summary-archived-count');
    var ideaSummaryArchivedCount = document.getElementById('idea-summary-archived-count');
    var quotesSummaryArchivedCount = document.getElementById('quotes-summary-archived-count');

    taskSummaryArchivedCount.innerHTML = archivedTasks;
    randomThoughtSummaryArchivedCount.innerHTML = archivedRandomThought;
    ideaSummaryArchivedCount.innerHTML = archivedIdea;
    quotesSummaryArchivedCount.innerHTML = archivedQuote;
}
let category;

function setCategory(type) {
    category = type;
}

function showArchivedTasks(e) {
    e.preventDefault();
    let table = document.getElementById('archived-items');
    table.innerHTML = '';

    let archivedItems = [...appState.archived];
    let sortedItems = archivedItems.filter(item => item.category === category);

    sortedItems.map((item, index) => {
        createArchivedItem(item, index);
    });
}

function createArchivedItem(item, itemID) {
    let table = document.getElementById('archived-items');
    var row = table.insertRow(table.rows.length);
    row.setAttribute("id", `todoItem-${itemID}`);

    var icon = row.insertCell(0);

    icon.innerHTML += "<td><img src=\"" + categoriesIcons[item.category] + "\" id=\"icon-" + itemID + "\"></img></td>";

    var task = row.insertCell(1);

    task.innerHTML += "<td><span id=\"title-" + item.item + "\">" + item.item + "</span></td>";

    var createdAt = row.insertCell(2);
    createdAt.innerHTML += "<td><span id=\"value-" + itemID + "\">" + item.fullDate + "</span></td>";

    var category = row.insertCell(3);

    category.innerHTML += "<td><span id=\"category-" + item.category + "\">" + item.category + "</span></td>";

    var content = row.insertCell(4);
    content.innerHTML += "<td><span id=\"content-" + item.content + "\">" + item.content + "</span></td>";

    var dates = row.insertCell(5);
    dates.innerHTML += "<td>" + item.dates + "</td>";

    var unarchiveBtn = row.insertCell(6);
    unarchiveBtn.innerHTML += "<td><button>" + "unarchive" + "</button></td>";
    unarchiveBtn.addEventListener("click", function (e) {
        e.preventDefault();
        unarchiveItem(e, item);
    });
}


function unarchiveItem(e, item) {
    archivedItem = [...appState.archived].find(element => element.id === item.id);
    const index = appState.archived.indexOf(item);

    if (index > -1) {
        appState.archived.splice(index, 1);
    }

    addRow(e, true);
    showArchivedTasks(e);
    countArchivedElements();
    countActiveElements();
}

function updateElement(itemId) {
    countActiveElements();

    var title = document.getElementById(`title-${itemId}`);
    var content = document.getElementById(`content-${itemId}`);
    var dates = document.getElementById(`dates-${itemId}`);
    var category = document.getElementById(`category-${itemId}`);
    var icon = document.getElementById(`icon-${itemId}`);
    title.innerHTML = appState['todo'][itemId].item;
    content.innerHTML = appState['todo'][itemId].content;
    dates.innerHTML = appState['todo'][itemId].dates;
    category.innerHTML = appState['todo'][itemId].category;
    icon.src = categoriesIcons[appState['todo'][itemId].category];
}