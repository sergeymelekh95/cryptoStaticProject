const HomePage = {
    id: "main",
    title: "Dashboard Coins Overview",
    render: (className = "container", ...rest) => {
        return `
        <section class="${className}">
            <div id="form-overlay-singUp" class="form-overlay form_closed">
                <form action="#" id="form-singUp" class="form form-singUp">
                    <a id="close-form-singUp-btn" class="close-form-btn"></a>
                    <p class="form-title">Sing Up</p>
                    <label for="email-singUp">Email</label>
                    <br />
                    <input type="email" name="email-singUp" class="email" id="email-singUp">
                    <br />
                    <label for="password-singUp">Password</label>
                    <br />
                    <input type="password" name="password-singUp" id="password-singUp" class="password-form">
                    <div>
                        <p>Already have an account?
                            <a id="change-login-form-btn" class="login-form-link">Login</a>
                        </p>
                    </div>
                    <button id="singUp-btn" class="form-btn singUp-btn">Sing Up</button>
                </form>
            </div>

            <div id="form-overlay-login" class="form-overlay form_closed">
                <form action="#" id="form-login" class="form form-login">
                    <a id="close-form-login-btn" class="close-form-btn"></a>
                    <p class="form-title">Login</p>
                    <label for="email-login">Email</label>
                    <br />
                    <input type="email" name="email-login" class="email" id="email-login">
                    <br />
                    <label for="password-login">Password</label>
                    <br />
                    <input type="password" name="password-login" id="password-login" class="password-form">
                    <div>
                        <p>Don't have an account?
                            <a id="change-singUp-form-btn" class="login-form-link">Sign up</a>
                        </p>
                    </div>
                    <button id="login-btn" class="form-btn login-btn">Login</button>
                </form>
            </div>

        </section>
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
                <div class="coin-stat-content-row-2">
                    <div class="type-statistic-block">
                        <select name="type-statistic" id="type-statistic" class="type-statistic select">
                            <option value="market-cap">Market cap</option>
                            <option value="prices">Prices</option>
                            <option value="total-volume">Volume</option>
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