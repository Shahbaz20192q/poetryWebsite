const navBare = document.getElementById('navBare')
const mainHeader = document.getElementById('main-header')
const closeBtn = document.getElementById('close-btn')
const container = document.getElementById('container')

navBare.addEventListener('click', function () {
    mainHeader.style.top = '0%'
})

closeBtn.addEventListener('click', function () {
    mainHeader.style.top = '-100%'
})

container.onscroll = function () {
    mainHeader.style.top = '-100%'
}