'use strict'
const STORAGE_KEY = 'galleryDB'
// const PAGE_SIZE = 5
var gImgs = [{id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat']}]
var gGallery
var gFilterBy = { vendor: '', minSpeed: 0 }
var gPageIdx = 0
_createGallery()
function getGallery() {
    var gallery = gGallery.filter(gallery => gallery.vendor.includes(gFilterBy.vendor) &&
        gallery.maxSpeed >= gFilterBy.minSpeed)
    // const idxStart = gPageIdx * PAGE_SIZE
    gallery = gallery.slice(idxStart, idxStart + PAGE_SIZE)
    return gallery
}
function deleteGallery(galleryId) {
    const galleryIdx = gGallery.findIndex(gallery => galleryId === gallery.id)
    gGallery.splice(galleryIdx, 1)
    _saveGalleryToStorage()
}
function addGallery(vendor) {
    const gallery = _createGallery(vendor)
    gGallery.unshift(gallery)
    _saveGalleryToStorage()
    return gallery
}

function getGalleryById(galleryId) {
    const gallery = gGallery.find(gallery => galleryId === gallery.id)
    return gallery
}

function updateGallery(galleryId, newSpeed) {
    const gallery = gGallery.find(gallery => gallery.id === galleryId)
    gallery.maxSpeed = newSpeed
    _saveGalleryToStorage()
    return gallery
}

function _createGallery(vendor) {
    return {
        id: makeId(),
        vendor,
        maxSpeed: getRandomIntInclusive(50, 250),
        desc: makeLorem()
    }
}

function _createGallery() {
    var gallery = loadFromStorage(STORAGE_KEY)
    if (!gallery || !gallery.length) {
        gallery = []
        for (let i = 0; i < 18; i++) {
            var vendor = gVendors[getRandomIntInclusive(0, gVendors.length - 1)]
            gallery.push(_createGallery(vendor))
        }
    }
    gGallery = gallery
    _saveGalleryToStorage()
}


function setGalleryFilter(filterBy = {}) {
    if (filterBy.vendor !== undefined) gFilterBy.vendor = filterBy.vendor
    if (filterBy.minSpeed !== undefined) gFilterBy.minSpeed = filterBy.minSpeed
    return gFilterBy
}


function setGalleryort(sortBy = {}) {
    if (sortBy.maxSpeed !== undefined) {
        gGallery.sort((c1, c2) => (c1.maxSpeed - c2.maxSpeed) * sortBy.maxSpeed)
    } else if (sortBy.vendor !== undefined) {
        gGallery.sort((c1, c2) => c1.vendor.localeCompare(c2.vendor) * sortBy.vendor)
    }
}

// function nextPage() {
//     gPageIdx++
//     if (gPageIdx * PAGE_SIZE >= gGallery.length) {
//         gPageIdx = 0
//     }
// }

function _saveGalleryToStorage() {
    saveToStorage(STORAGE_KEY, gGallery)
}
