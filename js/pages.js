const HomePage = {
    id: "main",
    title: "Dashboard Coins Overview",
    render: (className = "container") => {
        return `
        <section class="${className}" id="chart-section">
            <div class="period-block">
                <select name="period" id="period" class="period select">
                    <option value="hour">Last hour</option>
                    <option value="day">Last 24h</option>
                    <option value="week">Last 7d</option>
                    <option value="month">Last mouth</option>
                    <option value="year">Last year</option>
                </select>
            </div>
            <div id="chart-block" class="chart-block">
                <canvas id="analytic-chart" class="analytic-chart"></canvas>
            </div>
        </section>
        <section class="${className}">
            <div id="currency-block" class="currency-block">
                <select name="currency-select" id="currency-select" class="currency-select select"></select>
            </div>
            <div id="crypto-info-table-block" class="crypto-info-table-block">
                <table id="crypto-info-table" class="crypto-info-table"></table>
            </div>
            <div class="table-btn-container">
                <div>
                    <button id="clear-btn" class="clear-btn">Clear</button>
                </div>
                <div>
                    <button id="prev-btn" class="table-btn">&lt;</button>
                    <button id="next-btn" class="table-btn">&gt;</button>
                </div>                
            </div>
        </section>
        `;
    }
};

const CoinInfo = {
    id: "info",
    title: "Coin info",
    render: (className = "container") => {
        return `
        <section class="${className}">
            <div class="coin-stat-content">
                <div class="coin-stat-content-row">
                    <div class="market-cap-block">
                        <div class="switch-block">
                            <span>Switch chart</span>
                            <label class="switch">
                                <input type="checkbox" id="switch-chart">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <div id="market-cup-chart-block" class="chart-statistics-block market-cup-chart-block">
                            <canvas id="market-cup-chart" class="market-cup-chart"></canvas>
                        </div>
                    </div>
                    <div id="coin-info-table-block" class="coin-info-table-block">
                        <table id="coin-stat-table" class="coin-info-table"></table>
                    </div>
                </div>
                <div class="coin-stat-content-row-2">
                    <div class="type-statistic-block">
                        <select name="type-statistic" id="type-statistic" class="type-statistic select">
                            <option value="market-cap">Market cap</option>
                            <option value="prices">Prices</option>
                            <option value="total-volume">Total volume</option>
                        </select>
                    </div>
                    <div id="chart-statistics-block" class="chart-statistics-block change-market-cup-chart-block">
                        <canvas id="change-market-cup-chart" class="change-market-cup-chart"></canvas>
                    </div>
                </div>
            </div>
        </section>
        `;
    }
};
  
const AboutPage = {
    id: "about",
    title: "About",
    render: (className = "container") => {
        return `
        <section class="${className}">
            <div class="about-content">
                <p class="about-text">
                    Welcome to <a class="about_link" href="#main">CryptoStat!</a> This app was founded in May 2022 by Siarhei Melekh to provide up-to-date cryptocurrency prices, charts and data about the emerging cryptocurrency markets.
                </p>
                <div class="about-title-row">
                    <div class="logo-about">
                        <a class="abot-logo__link" href="#main">
                            <img class="about-logo__img about-logo1__img" src="./img/logo_icons/logo_1.svg" alt="logo">
                            <img class="about-logo__img about-logo2__img" src="./img/logo_icons/logo_2.svg" alt="logo">
                        </a>
                    </div>
                    <h2 class="about_title">
                        <a class="about_link" href="#main">CryptoStat<a>
                    </h2>
                </div>
                <p class="about-text">
                    We are a dynamically developing web app on cryptocurrencies.<a class="about_link" href="#main"> CryptoStat<a> covers the most current and important information about the cryptocurrency market.
                </p>
                <p class="about__title_list">Related Links:</p>
                <ul class="about__list">
                    <li>All Your crypto data needs in One Place
                        <a href="#main">
                            <img src="./img/menu_icons/home_page.svg" alt="home_page_icon">
                        </a>.
                    </li>
                    <li>We provide historic Crypto Charts for Free
                        <a href="#info">
                            <img src="./img/menu_icons/coin_info.svg" alt="coin_info">
                        </a>.
                    </li>
                </ul>
                <h2 class="about_title_FAQ">Frequently Asked Questions</h2>
                <ul class="about__list_FAQ">
                    <li>
                        <p>What is the goal of the CryptoStat app?</p>
                        <p>
                            CryptoStat is a CRUD application that provides users with the most important crypto statistics they need, including price graphs, price tables and their changes, and a number of different graphs for major cryptocurrencies.
                        </p>
                    </li>
                    <li>
                        <p>What will the application be used for?</p>
                        <p>
                            With CryptoStat application, the user can easily evaluate cryptocurrency statistics, learn everything about history and performance. The user will also be able to check the current value of the selected currency in various world currencies.
                        </p>
                    </li>
                    <li>
                        <p>What is the target audience?</p>
                        <p>
                            Everyone who is interested in cryptocurrency and plans to invest, buy and sell popular digital currencies, tracking their statistics in one place.
                        </p>
                    </li>
                    <li>
                        <p>Can I use the project from mobile devices?</p>
                        <p>
                            Yes, that the web application adaptively and automatically adjusts to the available screen sizes and adequately displays information.
                        </p>
                    </li>
                </ul>
                <p class="about-text">
                    All questions and suggestions about the work of the app send to:
                    <a class="about_link" href="mailto:sergeymelekh95@gmail.com">sergeymelekh95@gmail.com</a>
                </p>
            </div>
        </section>
        `;
    }
};

const ErrorPage = {
    id: "error",
    title: "Error 404 - page not found...",
    render: (className = "container") => {
        return `
        <section class="${className}">
            <p>Error 404, page not found, try to go
                <a href="#main">
                    <img src="./img/menu_icons/home_page.svg" alt="home_page_icon">
                </a>.
            </p>
        </section>
        `;
    }
};