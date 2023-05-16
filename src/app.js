const {app, ipcMain} = require('electron');
const {Microsoft} = require('minecraft-java-core');
const {autoUpdater} = require('electron-updater')
try {
    require('electron-reloader')(module, {ignore: ["AppData/*"],watchRenderer: true, debug: true})
} catch (_) {
}

const path = require('path');
const fs = require('fs');
//discord integration
const DiscordRPC = require('discord-rpc');
const clientId = '1107396478185509005';
const rpc = new DiscordRPC.Client({transport: 'ipc'});
const startTimestamp = new Date();
const pkg = require('../package.json')

rpc.on('ready', () => {

    rpc.setActivity({
        details: 'En train de jouer à QuantumRP',
        state: '2e Sub',
        startTimestamp,
        largeImageKey: 'logo',
        largeImageText: 'QuantumRP',
        smallImageKey: 'logo-mc',
        smallImageText: 'Sur Minecraft',
        buttons: [
            {label: 'Site web', url: pkg.publicLinks.webSite}
        ]
    }).then(() => console.log('Discord RPC créé')).catch(err => console.error(err))
});

rpc.login({clientId}).catch(console.error);
//
const UpdateWindow = require("./assets/updateWindow.js");
const MainWindow = require("./assets/mainWindow.js");

let data
let dev = process.env.NODE_ENV === 'dev';

if (dev) {
    let appPath = path.resolve('./AppData/Launcher').replace(/\\/g, '/');
    if (!fs.existsSync(appPath)) fs.mkdirSync(appPath, {recursive: true});
    app.setPath('userData', appPath);
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.whenReady().then(() => {
        UpdateWindow.createWindow();
    });
}

ipcMain.on('update-window-close', () => UpdateWindow.destroyWindow())
ipcMain.on('update-window-dev-tools', () => UpdateWindow.getWindow().webContents.openDevTools())
ipcMain.on('main-window-open', () => MainWindow.createWindow())
ipcMain.on('main-window-dev-tools', () => MainWindow.getWindow().webContents.openDevTools())
ipcMain.on('main-window-close', () => MainWindow.destroyWindow())
ipcMain.on('main-window-progress', (event, options) => MainWindow.getWindow().setProgressBar(options.DL / options.totDL))
ipcMain.on('main-window-progress-reset', () => MainWindow.getWindow().setProgressBar(0))
ipcMain.on('main-window-minimize', () => MainWindow.getWindow().minimize())


ipcMain.on('main-window-hide', () => MainWindow.getWindow().hide())
ipcMain.on('main-window-show', () => MainWindow.getWindow().show())

ipcMain.handle('Microsoft-window', async (event, client_id) => {
    return await new Microsoft(client_id).getAuth();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


autoUpdater.autoDownload = false;

ipcMain.handle('update-app', () => {
    return new Promise(async (resolve, reject) => {
        autoUpdater.checkForUpdates().then(() => {
            resolve();
        }).catch(error => {
            resolve({
                error: true,
                message: error
            })
        })
    })
})

autoUpdater.on('update-available', () => {
    const updateWindow = UpdateWindow.getWindow();
    if (updateWindow) updateWindow.webContents.send('updateAvailable');
});

ipcMain.on('start-update', () => {
    autoUpdater.downloadUpdate();
})

autoUpdater.on('update-not-available', () => {
    const updateWindow = UpdateWindow.getWindow();
    if (updateWindow) updateWindow.webContents.send('update-not-available');
});

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
});

autoUpdater.on('download-progress', (progress) => {
    const updateWindow = UpdateWindow.getWindow();
    if (updateWindow) updateWindow.webContents.send('download-progress', progress);
})