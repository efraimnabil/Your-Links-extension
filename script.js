const saveBtn = document.getElementById('save-btn');
const inputEl = document.getElementById('input-el');
const listEl = document.getElementById('ul-el');
const deleteAllBtn = document.getElementById('delete-all');
const saveTap = document.getElementById('save-tap');
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

function renderLinks() { 
    let listItems = '';
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
    if (e.target.className === 'btn') {
        let index = e.target.parentElement.getAttribute('data-index');
        links.splice(index, 1);
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