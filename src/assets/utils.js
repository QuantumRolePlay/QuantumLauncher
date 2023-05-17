import config from './config.js';
import database from './database.js';
import logger from './logger.js';
import slider from './slider.js';

export {
    config as config,
    database as database,
    logger as logger,
    changePanel as changePanel,
    addAccount as addAccount,
    slider as Slider,
    accountSelect as accountSelect

}

function changePanel(id) {
    let panel = document.querySelector(`.panel.${id}`);
    let active = document.querySelector(`.active`)
    if (active) active.classList.toggle("active");
    panel.classList.add("active");
}

/**
 * @Depreciated
 * @param data
 */
function addAccount(data) {
    let div = document.createElement("div");
    div.classList.add("account");
    div.id = data.uuid;
    div.innerHTML = `
        <img class="account-image" src="https://minotar.net/helm/${data.name}/100">
        <div class="account-data">
        <p style="font-weight: 600" class="account-name">${data.name}</p>
        <p class="account-uuid">${data.uuid}</p>
        </div>
        <!--<div class="account-delete"><div class="icon-account-delete icon-account-delete-btn"></div></div>-->
    `
    document.querySelector('.accounts').appendChild(div);
}

/**
 * @Depreciated
 * @param uuid
 */
function accountSelect(uuid) {
    let account = document.getElementById(uuid);
    let pseudo = account.querySelector('.account-name').innerText;
    let activeAccount = document.querySelector('.active-account')

    if (activeAccount) activeAccount.classList.toggle('active-account');
    account.classList.add('active-account');
    headplayer(pseudo);
}

function headplayer(pseudo) {
    document.querySelector(".account").style.backgroundImage = `url(https://minotar.net/helm/${pseudo}/100)`;
}