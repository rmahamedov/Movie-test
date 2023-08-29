const searchLink = document.querySelector('.search__link'),
    mainContent = document.querySelector('.main__content'),
    mainClose = document.querySelector('.main__close'),
    mainBlock = document.querySelector('.main__block'),
    moviesLink = document.querySelector('.movies__link'),
    mainSolo = document.querySelector('.main__solo'),
    formMain = document.querySelector('.form__main'),
    formInput = document.querySelector('.header__input'),
    pagination = document.querySelector('.pagination'),
    headerBtn = document.querySelector('.header__btn'),
    headerAbs = document.querySelector('.header__abs'),
    headerItems = document.querySelector('.header__items'),
    anime = document.querySelector('.anime')

function openMenu(e) {
    e.preventDefault()
    const removeAndAddClass = headerBtn.classList.contains('active') ? 'remove' : 'add'
    headerBtn.classList[removeAndAddClass]('active')
    headerAbs.classList[removeAndAddClass]('active')
    headerItems.classList[removeAndAddClass]('active')
    document.body.classList[removeAndAddClass]('active')
}

headerBtn.addEventListener('click', (e) => openMenu(e))
headerAbs.addEventListener('click', (e) => openMenu(e))

function openSearchPanel(e, bool = true) {
    e.preventDefault()
    mainContent.classList[bool ? 'add' : 'remove']('active')
}
searchLink.addEventListener('click', (e) => openSearchPanel(e))
mainClose.addEventListener('click', (e) => openSearchPanel(e, false))

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
const getLink = (url) => url.split('www.').join('')

const host = 'https://kinopoiskapiunofficial.tech'
const hostName = 'X-API-KEY';
const hostKey = '8cc49aba-151f-437d-927c-8d6093ddb608'

class Kino {
    constructor() {
        this.date = new Date().getMonth()
        this.months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
        this.currentYear = new Date().getFullYear()
        this.currentMonth = this.months[this.date]
    }
    fStart = async (url) => {
        const res = await fetch(url, {
            headers: {
                [hostName]: hostKey,
                'Content-Type': 'application/json'
            }
        })
        const json = await res.json()
        return json
    }

    getTopMovies = (page = 1) => this.fStart(`${host}/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=${page}`)
    getSoloFilm = (id) => this.fStart(`${host}/api/v2.2/films/${id}`)
    getReleases = (page = 1, year = this.currentYear, month = this.currentMonth) => this.fStart(`${host}/api/v2.1/films/releases?year=${year}&month=${month}&page=${page}`)
    getFrames = (id) => this.fStart(`${host}/api/v2.2/films/${id}/images?type=STILL&page=1`)
    getReviews = (id) => this.fStart(`${host}/api/v2.2/films/${id}/reviews?page=1&order=DATE_DESC`)
    getSearch = (page = 1, keyword) => this.fStart(`${host}/api/v2.1/films/search-by-keyword?keyword=${keyword}&page=${page}`)
}

const db = new Kino()


renderTrendMovies = (element = [], fn = [], films = [], params = []) => {
    anime.classList.add('active')
    element.forEach((item, i) => {
        const parent = document.querySelector(`${item} .swiper-wrapper`)
        db[fn[i]](params[i]).then(data => {
                data[films[i]].forEach(element => {
                    const slide = document.createElement('div')
                    slide.classList.add('swiper-slide')
                    console.log(element);
                    slide.innerHTML = `
                    <div class="movie__item" data-id="${element.filmId}">
                        <img src="${element.posterUrlPreview}" alt="" />
                    </div>
                `
                    parent.append(slide)
                })
                const movieItem = document.querySelectorAll('.movie__item')

                movieItem.forEach(item => {
                    item.addEventListener('click', () => {
                        let attr = item.getAttribute('data-id')
                    })
                })

                new Swiper(`${item}`, {
                    spaceBetween: 30,
                    slidesPerView: 1,
                    loop: true,
                    navigation: {
                        nextEl: `${item} .swiper-button-next`,
                        prevEl: `${item} .swiper-button-prev`
                    },
                    breakpoints: {
                        1440: {
                            slidePerView: 6
                        },
                        1200: {
                            slidePerView: 5
                        },
                        960: {
                            slidePerView: 4
                        },
                        720: {
                            slidePerView: 3
                        },
                        480: {
                            slidePerView: 2
                        },
                    }
                })
            })
            .then(() => {
                const pages = 13
                const randomNum = random(1, pages)
                renderHeader(randomNum)
            })
            .catch(e => {
                anime.classList.remove('active')
                console.log(e);
            })

    })
}
renderTrendMovies(['.trend__tv-slide', '.popular__actors-slider'], ['getTopMovies', 'getReleases'], ['films', 'releases'], [1, 1])

const renderHeader = (page) => {
    db.getTopMovies(page).then(res => {
            anime.classList.add('active')
            const max = random(0, res.films.length - 1)
            const filmId = res.films[max].filmId
            const filmRating = res.films[max].rating
            db.getSoloFilm(filmId).then(response => {
                    const info = response.data
                    const headerText = document.querySelector('.header__text')
                    headerText.innerHTML = `
                <h1 class="header__title">${info.nameRu || info.nameEn}</h1>
                <div class="header__balls">
                    <span class="header__year">${info.year}</span>
                    <span class="logo__span header__rating header__year">${info.ratingAgeLimits}+</span>
                    <div class="header__seasons header__year">${info.seasons.length}</div>
                    <div class="header__stars header__year">
                        <span class="icon-solid"></span>
                        ${filmRating}
                    </div>
                </div>
                <p class="header__descr">
                    ${info.description}
                </p>
                <div class="header__buttons">
                    <a href="${getLink(info.webUrl)}" class="header__watch">
                        <span className="icon-solid"></span>
                        watch
                    </a>
                    <a href="" className="header__more header__watch">
                        More information
                    </a>
                </div>
            `
                    anime.classList.remove('active')
                })
                .catch(e => {
                    anime.classList.remove('active')
                    console.log(e);
                })
        })
        .catch(e => {
            anime.classList.remove('active')
            console.log(e);
        })
}