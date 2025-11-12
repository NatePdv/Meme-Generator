'use strict'

$(onInit)

function onInit() {
    renderCars()
    renderVendors()
    renderFilterByQueryStringParams()

    addEventListeners()
}

function addEventListeners() {
    $('.btn-add').on('click', onAddCar)
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

function renderCars() {
    var cars = getCars()
    var strHtmls = cars.map(car => `
        <article data-id="${car.id}" class="car-preview">
            <button class="btn-remove">X</button>
            <h5>${car.vendor}</h5>
            <h6>Up to <span>${car.maxSpeed}</span> KMH</h6>
            <button class="btn-read" >Details</button>
            <button class="btn-update" >Update</button>
            <img onerror="this.src='img/fiat.png'" src="img/${car.vendor}.png" alt="Car by ${car.vendor}">
        </article> 
        `
    )
    $('.cars-container').html(strHtmls)

    $('.btn-remove').on('click', function () {
        const carId = $(this).closest('.car-preview').data('id')
        onDeleteCar(carId)
    })

    $('.btn-read').on('click', function () {
        const carId = $(this).closest('.car-preview').data('id')
        onReadCar(carId)
    })

    $('.btn-update').on('click', function () {
        const carId = $(this).closest('.car-preview').data('id')
        onUpdateCar(carId)
    })
}

function renderVendors() {
    const vendors = getVendors()
    const strHTMLs = vendors.map(vendor => `<option>${vendor}</option>`)

    $('.filter-vendor-select').append(strHTMLs)
}

function onReadCar(carId) {
    var car = getCarById(carId)
    var $elModal = $('.modal')
    $elModal.children('h3').text(car.vendor)
    $elModal.find('h4 span').text(car.maxSpeed)
    $elModal.children('p').text(car.desc)
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

function onDeleteCar(carId) {
    deleteCar(carId)
    renderCars()
    flashMsg(`Car Deleted`)
}

function onAddCar() {
    var vendor = prompt('vendor?')
    if (vendor) {
        const car = addCar(vendor)
        renderCars()
        flashMsg(`Car Added (id: ${car.id})`)
    }
}

function onUpdateCar(carId) {
    const car = getCarById(carId)
    var newSpeed = +prompt('Speed?', car.maxSpeed)
    if (newSpeed) {
        const car = updateCar(carId, newSpeed)
        renderCars()
        flashMsg(`Speed updated to: ${car.maxSpeed}`)
    }
}

function onSetFilterBy(filterBy) {
    filterBy = setCarFilter(filterBy)
    const queryStringParams = `?vendor=${gFilterBy.vendor}&minSpeed=${gFilterBy.minSpeed}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

    renderCars()
}

function onSetSortBy() {
    const prop = $('.sort-by').val()
    const isDesc = $('.sort-desc').prop('checked')

    const sortBy = {
        [prop]: (isDesc) ? -1 : 1
    }
    setCarSort(sortBy)
    renderCars()
}

function onNextPage() {
    nextPage()
    renderCars()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        vendor: queryStringParams.get('vendor') || '',
        minSpeed: queryStringParams.get('minSpeed') || 0
    }

    $('.filter-vendor-select').val(filterBy.vendor)
    $('.filter-speed-range').val(filterBy.minSpeed)
    setCarFilter(filterBy)
    renderCars()
}