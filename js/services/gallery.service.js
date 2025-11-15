'use strict'
const STORAGE_KEY = 'galleryDB'
const gImgs = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    url: `img/${i + 1}.jpg`,
    keywords: ['funny', 'cat']
}));
var gGallery
_createGallery()
function getGallery() {
    return gGallery
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


function _createGallery() {
    var gallery = loadFromStorage(STORAGE_KEY)
    if (!gallery || !gallery.length) {
        gallery = []
        for (let i = 0; i < 18; i++) {
            gallery.push(gImgs[i])
        }
    }
    gGallery = gallery
    _saveGalleryToStorage()
}


function _saveGalleryToStorage() {
    saveToStorage(STORAGE_KEY, gGallery)
}
