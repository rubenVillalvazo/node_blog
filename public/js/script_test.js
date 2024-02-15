document.addEventListener('DOMContentLoaded', function () {
    // related to the searchBtn fuction when there are more that one btn
    // const allSearchBtns = document.querySelectorAll('.searchBtn');

    const searchBtn = document.querySelector('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    /* 
    ********** Commented because in this project there is not more that one searchBtn **********
                It was included just for the example and how was do it in the course 
    */
    // for (var i = 0; i < allSearchBtns.length; i++) {
    //     allSearchBtns[i].addEventListener('click', function () {
    //         searchBar.style.visibility = 'visible';
    //         searchBar.classList.add('open');
    //         this.setAttribute('aria-expanded', 'true');
    //         searchInput.focus();
    //     })
    // }

    searchBtn.addEventListener('click', function () {
        searchBar.style.visibility = 'visible';
        searchBar.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        searchInput.focus();
    })

    searchClose.addEventListener('click', function () {
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'false');
    })
});