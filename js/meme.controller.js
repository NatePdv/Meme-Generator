
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
