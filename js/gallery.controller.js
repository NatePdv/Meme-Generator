'use strict'

$(onInit)

function onInit() {
    renderGallery()

    addEventListeners()
}

function addEventListeners() {
    $('.btn-gallery').on('click', onAddGallery)
    $('.btn-gallerys').on('click', onNextPage)
    $('.btn-about').on('click', onNextPage)

    $('.modal button').on('click', onCloseModal)

    $('.sort-by').on('change', onSetSortBy)
    $('.sort-desc').on('change', onSetSortBy)

    // $('.filter-vendor-select').on('change', function () {
    //     // console.log('this:', this)
    //     onSetFilterBy({ vendor: this.value })
    // })

//     $('.filter-speed-range').on('change', function () {
//         this.title = this.value
//         onSetFilterBy({ minSpeed: this.value })
//     })
// 
}

function renderGallery() {
    var gallery = getGallery()
    var strHtmls = gallery.map(gallery => `
        <article data-id="${gallery.id}" class="gallery-preview">
        <img src="${gallery.url}" class="gallery-img">
            <button class="btn-remove">X</button>
            <h5 class="gallery-keyword">${gallery.keywords}</h5>
            <button class="btn-read" >Details</button>
            <button class="btn-update" >Update</button>
        </article> 
        `
    )
    $('.gallery-container').html(strHtmls)

    $('.btn-remove').on('click', function () {
        const galleryId = $(this).closest('.gallery-preview').data('id')
        onDeleteGallery(galleryId)
    })

    $('.btn-read').on('click', function () {
        const galleryId = $(this).closest('.gallery-preview').data('id')
        onReadGallery(galleryId)
    })

    $('.btn-update').on('click', function () {
        const galleryId = $(this).closest('.gallery-preview').data('id')
        onUpdateGallery(galleryId)
    })
}

function renderVendors() {
    const vendors = getVendors()
    const strHTMLs = vendors.map(vendor => `<option>${vendor}</option>`)

    $('.filter-vendor-select').append(strHTMLs)
}

function onReadGallery(galleryId) {
    var gallery = getGalleryById(galleryId)
    var $elModal = $('.modal')
    $elModal.children('h3').text(gallery.vendor)
    $elModal.find('h4 span').text(gallery.maxSpeed)
    $elModal.children('p').text(gallery.desc)
    $elModal.addClass('open')
}

function flashMsg(msg) {
    const $el = $('.user-msg')
    $el.text(msg)
    $el.addClass('open')
    setTimeout(() => {
        $el.removeClass('open')
    }, 3000)
}

function onCloseModal() {
    $('.modal').removeClass('open')
}

function onDeleteGallery(galleryId) {
    deleteGallery(galleryId)
    renderGallery()
    flashMsg(`Gallery Deleted`)
}

function onAddGallery() {
    var vendor = prompt('vendor?')
    if (vendor) {
        const gallery = addGallery(vendor)
        renderGallery()
        flashMsg(`Gallery Added (id: ${gallery.id})`)
    }
}

function onUpdateGallery(galleryId) {
    const gallery = getGalleryById(galleryId)
    var newSpeed = +prompt('Speed?', gallery.maxSpeed)
    if (newSpeed) {
        const gallery = updateGallery(galleryId, newSpeed)
        renderGallery()
        flashMsg(`Speed updated to: ${gallery.maxSpeed}`)
    }
}

function onSetFilterBy(filterBy) {
    filterBy = setGalleryFilter(filterBy)
    const queryStringParams = `?vendor=${gFilterBy.vendor}&minSpeed=${gFilterBy.minSpeed}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

    renderGallery()
}

function onSetSortBy() {
    const prop = $('.sort-by').val()
    const isDesc = $('.sort-desc').prop('checked')

    const sortBy = {
        [prop]: (isDesc) ? -1 : 1
    }
    setGallerySort(sortBy)
    renderGallery()
}

function onNextPage() {
    nextPage()
    renderGallery()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        vendor: queryStringParams.get('vendor') || '',
        minSpeed: queryStringParams.get('minSpeed') || 0
    }

    $('.filter-vendor-select').val(filterBy.vendor)
    $('.filter-speed-range').val(filterBy.minSpeed)
    setGalleryFilter(filterBy)
    renderGallery()
}