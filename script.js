const saveBtn = document.getElementById('save-btn');
const inputEl = document.getElementById('input-el');
const listEl = document.getElementById('ul-el');
const deleteAllBtn = document.getElementById('delete-all');
const saveTap = document.getElementById('save-tap');
const message = document.querySelector(".message");
const popup = document.querySelector(".popup");
let linksFromLocalStorage = JSON.parse(localStorage.getItem('links'));
let links = [];

if(linksFromLocalStorage) {
    links = linksFromLocalStorage;
    renderLinks();
}
links = unique(links);

saveBtn.addEventListener('click', function() {
    let url = inputEl.value;
    if (url === '') {
        return;
    }
    if (!isValidUrl(url)) {
        message.classList.add('show');
        setTimeout(function() {
            message.classList.remove('show');
        }
        , 1000);
        return;
    }
    links.push([url, url]);
    localStorage.setItem('links', JSON.stringify(links));
    inputEl.value = '';
    renderLinks();
});

inputEl.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        saveBtn.click();
    }
});

function unique(arr) {
    let result = [];
    for (let str of arr) {
        let isUnique = true;
        for (let el of result) {
            if (str[0] === el[0]) {
                isUnique = false;
                break;
            }
        }
        if (isUnique) {
            result.push(str);
        }
    }
    return result;
}

function renderLinks() { 
    let listItems = '';
    links = unique(links);
    for (let i = 0; i < links.length; i++) {
        listItems += `
            <li class = "list-item" draggable = "true">
            <a
            href = "${links[i][0]}" target = "_blank"> <span class= "title"> ${links[i][1]} </span>
            <span class = "url"> ${links[i][0]}</span>
            </a>
            <aside id = "del-rename">
            <input type = "button" value = "Rename" class = "btn" id = "rename-link">
            <input type = "button" value = "Delete" class = "btn" id = "delete-link">
            </aside>
            </li>
        `;
}
    listEl.innerHTML = listItems;
}

listEl.addEventListener('click', function(e) {
    if (e.target.id === 'delete-link') {
        let url = e.target.parentElement.parentElement.children[0].href;
        let index = links.findIndex(function(item) {
            return item[0] === url;
        });
        links.splice(index, 1);
        localStorage.setItem('links', JSON.stringify(links));
        renderLinks();
    }
});

listEl.addEventListener('click', function(e) {
    if (e.target.id === 'rename-link') {
        let url = e.target.parentElement.parentElement.children[0].href;
        let index = links.findIndex(function(item) {
            return item[0] === url;
        });
        popup.classList.add('show');
        let titleInput = document.getElementById('title-input');
        titleInput.value = links[index][1];
        let saveTitleBtn = document.getElementById('save-title');
        let clicked = 0;
        saveTitleBtn.addEventListener('click', function() {
            clicked++;
            let click = clicked === 1;
            if(click) {
                links[index][1] = titleInput.value;
                localStorage.setItem('links', JSON.stringify(links));
                renderLinks();
                popup.classList.remove('show');
            }
            window.location.reload();
        });
        let cancelTitleBtn = document.getElementById('cancel');
        cancelTitleBtn.addEventListener('click', function() {
            popup.classList.remove('show');
        });
    }
});
    
deleteAllBtn.addEventListener('click', function() {
    links = [];
    localStorage.setItem('links', JSON.stringify(links));
    renderLinks();
});

saveTap.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let url = tabs[0].url;
        let title = tabs[0].title;
        links.push([url, title]);
        localStorage.setItem('links', JSON.stringify(links));
        renderLinks();
    });
    window.location.reload();
});

function isValidUrl(url) {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
}

const sortableList = document.getElementById('ul-el');
const items = document.querySelectorAll('.list-item');

items.forEach((item) => {
    item.addEventListener('dragstart', () => {
        setTimeout(() => item.classList.add('dragging'), 0);
    });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
    item.addEventListener('dragend', () => {
        links = [];
        let listItems = document.querySelectorAll('.list-item');
        listItems.forEach((item) => {
            let url = item.children[0].href;
            let title = item.children[0].children[0].textContent;
            links.push([url, title]);
        });
        localStorage.setItem('links', JSON.stringify(links));
    });
});

const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');

    let siblings = [...sortableList.querySelectorAll('.list-item:not(.dragging)')];

    let nextSibling = siblings.find((sibling) => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });


    sortableList.insertBefore(draggingItem, nextSibling);
};

sortableList.addEventListener('dragover', initSortableList);
sortableList.addEventListener('dragenter', e => e.preventDefault());