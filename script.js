const saveBtn = document.getElementById('save-btn');
const inputEl = document.getElementById('input-el');
const listEl = document.getElementById('ul-el');
const deleteAllBtn = document.getElementById('delete-all');
const saveTap = document.getElementById('save-tap');
const message = document.querySelector(".message");
let linksFromLocalStorage = JSON.parse(localStorage.getItem('links'));
let links = [];

if(linksFromLocalStorage) {
    links = linksFromLocalStorage;
    renderLinks();
}

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
    links.push(url);
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
        if (!result.includes(str)) {
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
            <li>
            <a href="${links[i]}" target = "_blank">
            ${links[i]}
            </a>
            <input type="button" value="Delete" class = "btn" id = "delete-link">
            </li>
        `;
}
    listEl.innerHTML = listItems;
}

listEl.addEventListener('click', function(e) {
    if (e.target.id === 'delete-link') {
        let link = e.target.parentElement.children[0].href;
        links = links.filter(function(item) {
            return item !== link;
        });
        localStorage.setItem('links', JSON.stringify(links));
        renderLinks();
    }
});

deleteAllBtn.addEventListener('click', function() {
    links = [];
    localStorage.setItem('links', JSON.stringify(links));
    renderLinks();
});

saveTap.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        links.push(tabs[0].url);
        localStorage.setItem('links', JSON.stringify(links));
        renderLinks();
    });
});

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}