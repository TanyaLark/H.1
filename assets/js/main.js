document.addEventListener('DOMContentLoaded', async function () {

    let datePickers = document.querySelector('#date_pickers');
    //Max date для datePickers
    let today = new Date();
    let todayYear = today.getUTCFullYear();
    let todayMonth = today.getUTCMonth() + 1;
    let todayDay = today.getUTCDate();

    datePickers.innerHTML = `
            <!-- date picker1 -->
            <input class='my-4 mx-4' type="date" id="start_input" name="trip-start" 
            max="${todayYear}-${todayMonth}-${todayDay}">

            <!-- date picker2 -->
            <input class='my-4 mx-4 ' type="date" id="finish_input" name="trip-start"
            max="${todayYear}-${todayMonth}-${todayDay}">
        `;

    let newsPlaceTag = document.querySelector('#news-list-place');
    let oneNewsPlaceTag = document.querySelector('#one-news-place');

    let backButton = document.querySelector('#back-button');
    backButton.classList.add('d-none');

    //Search query
    let searchQuery = document.querySelector('#search_query');
    let show = document.querySelector('#button_show');
    const buttonShow = document.getElementById('button_show');

    buttonShow.addEventListener('click', async () => {
        let search = 'q=' + document.getElementById('search_query').value;
        if (search === 'q=') {
            search = 'q=everything'
        }
        //Получение значений дат из Date Pickers
        const datePicker1Value = document.getElementById('start_input');
        const datePicker2Value = document.getElementById('finish_input');

        let startDate = new Date(datePicker1Value.value);
        let finishDate = new Date(datePicker2Value.value);
        if(startDate > finishDate){
            alert('Временной диапазон задан не корректно.');
        } 

        let inputValueDatePickers = '&from=' + datePicker1Value.value + '&to=' + datePicker2Value.value;// даты из DatePickers в формате 2020-10-07
        getURL(search, inputValueDatePickers);
    });

    getURL();

    async function getURL(q = 'q=everything', fromTo = '') {
        URL = `https://newsapi.org/v2/everything?${q}${fromTo}&pageSize=8&apiKey=dbb88b39eac14bff9fa8ac9af1cf4b1e`;

        let news = await fetch(URL);
        news = await news.json();
        news = news.articles;

        pageRendering(news);
    }

    //функция для отрисовки страницы  pageRendering(news)
    function pageRendering(news) {
        newsPlaceTag.innerHTML = news?.map((item, i) => `
                <div class='cell py-3'>
                    <div class="card shadow h-100">
                        <img src="${item.urlToImage}" class="card-img-top shadow" alt="...">
                        <div class="card-body d-flex flex-column">
                            <h4 class="card-title">${item.title}</h4>
                            <p class='flex-grow-1 fs-6'>
                                ${item.description}
                            </p>
                            <button data-news-id='${i}'  class="btn btn-primary">Read More</button>
                        </div>
                    </div>
                </div>
            `).join('');

        let buttons = document.querySelectorAll('.cell button');

        for (let button of buttons) {
            button.addEventListener('click', function () {
                let selectedNews = news[this.dataset.newsId];

                oneNewsPlaceTag.innerHTML = `
                        <div class='py-3'>
                            <h1>${selectedNews.title}</h1>
                            <i>${new Date(selectedNews.publishedAt).toUTCString()}</i>
                            <p>
                                <i>${selectedNews.description}</i>
                            </p>
                            <img class='img-thumbnail' src="${selectedNews.urlToImage}">
                            <p>${selectedNews.content}</p>
                            <a href="${selectedNews.url}" target="_blank" class="btn btn-primary">Read Original</a>
                        </div>
                    `;

                oneNewsPlaceTag.classList.remove('d-none');
                newsPlaceTag.classList.add('d-none');
                backButton.classList.remove('d-none');
                datePickers.classList.add('d-none');
                searchQuery.classList.add('d-none');
                show.classList.add('d-none');
            });
        }

        backButton.addEventListener('click', function () {
            oneNewsPlaceTag.classList.add('d-none');
            newsPlaceTag.classList.remove('d-none');
            backButton.classList.add('d-none');
            datePickers.classList.remove('d-none');
            searchQuery.classList.remove('d-none');
            show.classList.remove('d-none');
        });
    }

});

