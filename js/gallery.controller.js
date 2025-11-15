'use strict'

$(onInit)

function onInit() {
    renderMeme()
    renderVendors()
    renderFilterByQueryStringParams()

    addEventListeners()
}

function addEventListeners() {
    $('.btn-gallery').on('click', onAddMeme)
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
            <button class="btn-remove">X</button>
            <h5>${gallery.vendor}</h5>
            <h6>Up to <span>${gallery.maxSpeed}</span> KMH</h6>
            <button class="btn-read" >Details</button>
            <button class="btn-update" >Update</button>
        </article> 
        `
    )
    $('.gallery-container').html(strHtmls)

    $('.btn-remove').on('click', function () {
        const galleryId = $(this).closest('.gallery-preview').data('id')
        onDeleteMeme(galleryId)
    })

    $('.btn-read').on('click', function () {
        const galleryId = $(this).closest('.gallery-preview').data('id')
        onReadMeme(galleryId)
    })

    $('.btn-update').on('click', function () {
        const galleryId = $(this).closest('.gallery-preview').data('id')
        onUpdateMeme(galleryId)
    })
}

function renderVendors() {
    const vendors = getVendors()
    const strHTMLs = vendors.map(vendor => `<option>${vendor}</option>`)

    $('.filter-vendor-select').append(strHTMLs)
}

function onReadMeme(galleryId) {
    var gallery = getMemeById(galleryId)
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

function onDeleteMeme(galleryId) {
    deleteMeme(galleryId)
    renderMeme()
    flashMsg(`Meme Deleted`)
}

function onAddMeme() {
    var vendor = prompt('vendor?')
    if (vendor) {
        const gallery = addMeme(vendor)
        renderMeme()
        flashMsg(`Meme Added (id: ${gallery.id})`)
    }
}

function onUpdateMeme(galleryId) {
    const gallery = getMemeById(galleryId)
    var newSpeed = +prompt('Speed?', gallery.maxSpeed)
    if (newSpeed) {
        const gallery = updateMeme(galleryId, newSpeed)
        renderMeme()
        flashMsg(`Speed updated to: ${gallery.maxSpeed}`)
    }
}

function onSetFilterBy(filterBy) {
    filterBy = setMemeFilter(filterBy)
    const queryStringParams = `?vendor=${gFilterBy.vendor}&minSpeed=${gFilterBy.minSpeed}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

    renderMeme()
}

function onSetSortBy() {
    const prop = $('.sort-by').val()
    const isDesc = $('.sort-desc').prop('checked')

    const sortBy = {
        [prop]: (isDesc) ? -1 : 1
    }
    setMemeSort(sortBy)
    renderMeme()
}

function onNextPage() {
    nextPage()
    renderMeme()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        vendor: queryStringParams.get('vendor') || '',
        minSpeed: queryStringParams.get('minSpeed') || 0
    }

    $('.filter-vendor-select').val(filterBy.vendor)
    $('.filter-speed-range').val(filterBy.minSpeed)
    setMemeFilter(filterBy)
    renderMeme()
}