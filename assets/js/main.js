document.addEventListener('DOMContentLoaded', async function () {

    let datePickers = document.querySelector('#date_pickers');
    //Даты по умолчанию для datePickers
    let today = new Date();
    let todayYear = today.getUTCFullYear();
    let todayMonth = today.getUTCMonth() + 1;
    let todayDay = today.getUTCDate();

    let monthAgo = new Date(todayYear, todayMonth - 1, todayDay + 1);
    let monthAgoYear = monthAgo.getUTCFullYear();
    let monthAgoMonth = monthAgo.getUTCMonth();
    let monthAgoDay = monthAgo.getUTCDate();

    datePickers.innerHTML = `
            <!-- date picker1 -->
            <input class='my-4 mx-4' type="date" id="start_input" name="trip-start" 
            value="${monthAgoYear}-${monthAgoMonth}-${monthAgoDay}"
            min="2018-01-01" max="2020-12-31">

            <!-- date picker2 -->
            <input class='my-4 mx-4 ' type="date" id="finish_input" name="trip-start"
            value="${todayYear}-${todayMonth}-${todayDay}"
            min="2018-01-01" max="2020-12-31">
        `;


    let newsPlaceTag = document.querySelector('#news-list-place');
    let oneNewsPlaceTag = document.querySelector('#one-news-place');

    let backButton = document.querySelector('#back-button');
    backButton.classList.add('d-none');

    //Search query
    const buttonShow = document.getElementById('button_show');
    buttonShow.addEventListener('click', async () => {
        search = 'q=' + document.getElementById('search_query').value;
        if (search === 'q=') {
            search = 'q=everything'
        }
        //Получение значений дат из Date Pickers
        const datePicker1Value = document.getElementById('start_input');
        const datePicker2Value = document.getElementById('finish_input');
        let inputValueDatePickers = '&from=' + datePicker1Value.value + '&to=' + datePicker2Value.value;// даты из DatePickers в формате 2020-10-07
        console.log(inputValueDatePickers);
        getURL(search, inputValueDatePickers);

    });

    getURL();

    async function getURL(q = 'q=everything', fromTo = '') {
        URL = `https://newsapi.org/v2/everything?${q}${fromTo}&pageSize=32&apiKey=dbb88b39eac14bff9fa8ac9af1cf4b1e`;

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

            });
        }

        backButton.addEventListener('click', function () {
            oneNewsPlaceTag.classList.add('d-none');
            newsPlaceTag.classList.remove('d-none');
            backButton.classList.add('d-none');
        });
    }

});

