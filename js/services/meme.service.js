'use strict'
const STORAGE_KEY = 'memeDB'
const PAGE_SIZE = 5
var gImgs = [{id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat']}]



var gMeme
var gFilterBy = { vendor: '', minSpeed: 0 }
var gPageIdx = 0

_createMeme()

function getVendors() {
    return gVendors
}

function getMeme() {
    var meme = gMeme.filter(meme => meme.vendor.includes(gFilterBy.vendor) &&
        meme.maxSpeed >= gFilterBy.minSpeed)

    const idxStart = gPageIdx * PAGE_SIZE
    meme = meme.slice(idxStart, idxStart + PAGE_SIZE)
    return meme
}

function deleteMeme(memeId) {
    const memeIdx = gMeme.findIndex(meme => memeId === meme.id)
    gMeme.splice(memeIdx, 1)
    _saveMemeToStorage()
}

function addMeme(vendor) {
    const meme = _createMeme(vendor)
    gMeme.unshift(meme)
    _saveMemeToStorage()
    return meme
}

function getMemeById(memeId) {
    const meme = gMeme.find(meme => memeId === meme.id)
    return meme
}

function updateMeme(memeId, newSpeed) {
    const meme = gMeme.find(meme => meme.id === memeId)
    meme.maxSpeed = newSpeed
    _saveMemeToStorage()
    return meme
}

function _createMeme(vendor) {
    return {
        id: makeId(),
        vendor,
        maxSpeed: getRandomIntInclusive(50, 250),
        desc: makeLorem()
    }
}

function _createMeme() {
    var meme = loadFromStorage(STORAGE_KEY)
    if (!meme || !meme.length) {
        meme = []

        for (let i = 0; i < 21; i++) {
            var vendor = gVendors[getRandomIntInclusive(0, gVendors.length - 1)]
            meme.push(_createMeme(vendor))
        }
    }
    gMeme = meme
    _saveMemeToStorage()
}


function setMemeFilter(filterBy = {}) {
    if (filterBy.vendor !== undefined) gFilterBy.vendor = filterBy.vendor
    if (filterBy.minSpeed !== undefined) gFilterBy.minSpeed = filterBy.minSpeed
    return gFilterBy
}


function setMemeort(sortBy = {}) {
    if (sortBy.maxSpeed !== undefined) {
        gMeme.sort((c1, c2) => (c1.maxSpeed - c2.maxSpeed) * sortBy.maxSpeed)
    } else if (sortBy.vendor !== undefined) {
        gMeme.sort((c1, c2) => c1.vendor.localeCompare(c2.vendor) * sortBy.vendor)
    }
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gMeme.length) {
        gPageIdx = 0
    }
}

function _saveMemeToStorage() {
    saveToStorage(STORAGE_KEY, gMeme)
}
