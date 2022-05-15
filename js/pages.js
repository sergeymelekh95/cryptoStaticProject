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
            <p>Coin Info Content</p>
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