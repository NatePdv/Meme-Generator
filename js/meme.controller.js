'use strict'

$(onInit)

function onInit() {
    renderMeme()
    renderVendors()
    renderFilterByQueryStringParams()

    addEventListeners()
}

function addEventListeners() {
    $('.btn-add').on('click', onAddMeme)
    // console.log($('.btn-add'))
    $('.btn-next').on('click', onNextPage)
    $('.modal button').on('click', onCloseModal)

    $('.sort-by').on('change', onSetSortBy)
    $('.sort-desc').on('change', onSetSortBy)

    $('.filter-vendor-select').on('change', function () {
        // console.log('this:', this)
        onSetFilterBy({ vendor: this.value })
    })

    $('.filter-speed-range').on('change', function () {
        this.title = this.value
        onSetFilterBy({ minSpeed: this.value })
    })
}

function renderMeme() {
    var meme = getMemes()
    var strHtmls = meme.map(meme => `
        <article data-id="${meme.id}" class="meme-preview">
            <button class="btn-remove">X</button>
            <h5>${meme.vendor}</h5>
            <h6>Up to <span>${meme.maxSpeed}</span> KMH</h6>
            <button class="btn-read" >Details</button>
            <button class="btn-update" >Update</button>
            <img onerror="this.src='img/fiat.png'" src="img/${meme.vendor}.png" alt="Meme by ${meme.vendor}">
        </article> 
        `
    )
    $('.meme-container').html(strHtmls)

    $('.btn-remove').on('click', function () {
        const memeId = $(this).closest('.meme-preview').data('id')
        onDeleteMeme(memeId)
    })

    $('.btn-read').on('click', function () {
        const memeId = $(this).closest('.meme-preview').data('id')
        onReadMeme(memeId)
    })

    $('.btn-update').on('click', function () {
        const memeId = $(this).closest('.meme-preview').data('id')
        onUpdateMeme(memeId)
    })
}

function renderVendors() {
    const vendors = getVendors()
    const strHTMLs = vendors.map(vendor => `<option>${vendor}</option>`)

    $('.filter-vendor-select').append(strHTMLs)
}

function onReadMeme(memeId) {
    var meme = getMemeById(memeId)
    var $elModal = $('.modal')
    $elModal.children('h3').text(meme.vendor)
    $elModal.find('h4 span').text(meme.maxSpeed)
    $elModal.children('p').text(meme.desc)
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

function onDeleteMeme(memeId) {
    deleteMeme(memeId)
    renderMeme()
    flashMsg(`Meme Deleted`)
}

function onAddMeme() {
    var vendor = prompt('vendor?')
    if (vendor) {
        const meme = addMeme(vendor)
        renderMeme()
        flashMsg(`Meme Added (id: ${meme.id})`)
    }
}

function onUpdateMeme(memeId) {
    const meme = getMemeById(memeId)
    var newSpeed = +prompt('Speed?', meme.maxSpeed)
    if (newSpeed) {
        const meme = updateMeme(memeId, newSpeed)
        renderMeme()
        flashMsg(`Speed updated to: ${meme.maxSpeed}`)
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