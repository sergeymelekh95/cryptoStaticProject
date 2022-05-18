const HomePage = {
    id: "main",
    title: "Dashboard Coins Overview",
    render: (className = "container", ...rest) => {
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
            <table id="crypto-info-table" class="crypto-info-table"></table>
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
    render: (className = "container", ...rest) => {
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

                    <div class="coin-info-table-block">
                        <table id="coin-stat-table" class="coin-info-table"></table>
                    </div>
                </div>

                <div class="chart-statistics-block change-market-cup-chart-block">
                    <canvas id="change-market-cup-chart" class="change-market-cup-chart"></canvas>
                </div>

                <div class="change-prices-chart-block chart-statistics-block">
                    <canvas id="change-prices-chart" class="change-prices-chart"></canvas>
                </div>
                <div class="change-total-volume-chart-block chart-statistics-block">
                    <canvas id="change-total-volume-chart" class="change-total-volume-chart"></canvas>
                </div>
            </div>
        </section>
        `;
    }
};
  
const AboutPage = {
    id: "about",
    title: "About",
    render: (className = "container", ...rest) => {
        return `
        <section class="${className}">
            <p>About Content</p>
        </section>
        `;
    }
};

const ErrorPage = {
    id: "error",
    title: "Error 404 - page not found...",
    render: (className = "container", ...rest) => {
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