let gUserSettings = {
    bgColor: '#ffffff',
    color: '#000000'
} 
const STORAGE_KEY = 'userDB'

function loadUserSettings() {
    const userSettings = loadFromStorage(STORAGE_KEY)
    if (userSettings) gUserSettings = userSettings 
}

function setBgColor(color) {
    gUserSettings.bgColor = color
    saveToStorage(STORAGE_KEY, gUserSettings)
}

function setColor(color) {
    gUserSettings.color = color
    saveToStorage(STORAGE_KEY, gUserSettings)
}

function getUserSettings() {
    return gUserSettings
}