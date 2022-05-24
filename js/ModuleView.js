import { routes } from './pages.js';

export function ModuleView() {
    let myModuleContainer = null;
    let menu = null;
    let contentContainer = null;
    let routesObj = null;
    let routeName = null;
    let header = null;
    let headerTitle = null;
    const defaultCurrency = 'usd';
    let mydataTable = null;
    let mycountCoinsInTable = null;
    let mystartCountCoinsInTable = null;
    let mycountCoinsInRequest = null;
    let supportedCurrencies = null;
    let chart = null;
    let myChart = null;
    let myTimeArr = null;
    const localChartData = {};
    let chartTopMarketCup = null;
    const barChart = 'bar';
    const pieChart = 'pie';
    let myMarketCupArr = null;
    let mynameCoinsArr = null;
    const myTension = 0.5;
    const defaultNameChart = 'market cap';
    let createdChartChanges = false;
    const invalidMessageLogin = 'Invalid email or password';
    const invalidMessageSingUp = 'Invalid email';
    const invalidMessagePasswordLogin = 'The password has to be min 7 characters!';
    const defaultDataSet = [{
        label: 'Select coins in the table below',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
    }];
    let backgroundColors = ['rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)','rgba(153, 102, 255, 0.6)','rgba(255, 159, 64, 0.6)','#7AD36E','#DBE2DB','#A09E04','#F47FF7','#78FDC7','#A38451', '#994499', '#3366cc', '#316395', '#b82e2e', '#66aa00', '#dd4477', '#0099c6', '#990099', '#109618', '#ff9900', '#dc3912', '#3366cc', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'];
    let dataSets = [];
    const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    this.init = function(container, routes) {
        myModuleContainer = container;
        routesObj = routes;
        menu = myModuleContainer.querySelector("#mainmenu");
        contentContainer = myModuleContainer.querySelector("#content");
        header = myModuleContainer.querySelector("#header");
        headerTitle = myModuleContainer.querySelector(".title");

        this.updateColors();
    };

    this.updateSelectPeriod = function() {
        if (window.sessionStorage.localData) {
            const value = JSON.parse(window.sessionStorage.localData).periodSelectValue;

            this.updatePeriodSelect(value);
        }
    };

    this.updatePeriodSelect = function(value) {
        const periodSelect = myModuleContainer.querySelector('#period');

        for (let i = 0; i < periodSelect.length; ++i) {
            if (periodSelect[i].value === value) {
                periodSelect[i].selected = true;
            }
        }

    };

    this.updateColors = function() {
        if (window.sessionStorage.colorsLine) {
            const parseColors = JSON.parse(window.sessionStorage.colorsLine);
            if (parseColors.length !== 0) {
                backgroundColors = parseColors;
            }
        }
    };

    this.addCheckbox = function() {
        if (window.sessionStorage.localData) {
            const idsArr = JSON.parse(window.sessionStorage.localData).checkedId;
            
            for(let i = 0; i < idsArr.length; ++i) {
                const checkbox = document.getElementById(`${idsArr[i]}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
        }
    };

    this.addCurrencyValue = function() {
        if (window.sessionStorage.localData) {
            const value = JSON.parse(window.sessionStorage.localData).currencySelectValue;

            const currencySelect = document.querySelector('#currency-select').getElementsByTagName('option');
            for (let i = 0; i < currencySelect.length; ++i) {
                if (currencySelect[i].value === value) {
                    currencySelect[i].selected = true;
                }
            }
            
        }
    };

    this.renderContent = function(hashPageName, countCoinsInRequest) {
        routeName = "default";

        if (hashPageName.length > 0) {
            routeName = hashPageName in routes ? hashPageName : "error";
        }

        window.document.title = routesObj[routeName].title;
        contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`);

        if (location.hash.slice(1) === routes.main.id) {
            this.buildTable(mydataTable, mycountCoinsInTable, mystartCountCoinsInTable);
            this.buildSelectCurrencies(supportedCurrencies);

            if (mydataTable) {
                this.addCheckbox();
                this.addCurrencyValue();
            }

            this.checkDisabledBtn(countCoinsInRequest);
        }

        this.updateMenuButtons(routesObj[routeName].id);
    };

    const addArrow = percent => {
        return percent > 0 ?
        '<img src="./img/table_icons/arrow-up.svg" alt="arrow-up">':
        '<img src="./img/table_icons/arrow-down.svg" alt="arrow-down">';
    };

    this.buildTable = function(dataTable, countCoinsInTable, startCountCoinsInTable) {
        if (dataTable) {
            mydataTable = dataTable;
            mycountCoinsInTable = countCoinsInTable;
            mystartCountCoinsInTable = startCountCoinsInTable;

            let dataTableStr = `
                <colgroup>
                    <col width="50"></col>
                    <col width="50"></col>
                    <col width="160"></col>
                    <col width="80"></col>
                    <col width="150"></col>
                    <col width="90"></col>
                    <col width="90"></col>
                    <col width="90"></col>
                </colgroup>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Coin</th>
                        <th class="symbol-coin">Label</th>
                        <th>Current Price (${dataTable[0].currency})</th>
                        <th class="changes">1h Change</th>
                        <th>24h Change</th>
                        <th class="changes">7d Change</th>
                    </tr>
                </thead>
                <tbody>
            `;

            for(let i = startCountCoinsInTable; i < countCoinsInTable; ++i) {
                dataTableStr += `
                    <tr>
                        <td class="checkbox-table"><input type="checkbox" class="checkbox table-checkbox" id="${mydataTable[i].id}" name="${mydataTable[i].nameCoin}"></td>
                        <td><img class="label-coin" src="${mydataTable[i].image}" alt="label_coin"></td>
                        <td class="name-coin"><a href="#info" data-name="${mydataTable[i].nameCoin}" data-id="${mydataTable[i].id}" class="link_info">${mydataTable[i].number}. ${mydataTable[i].nameCoin}</a></td>
                        <td class="symbol-coin">${mydataTable[i].symbol}</td>
                        <td class="price-coin">${mydataTable[i].currentPrice}</td>
                        <td class="changes"> ${addArrow(mydataTable[i].changePercentageOneHour)} ${Math.abs(mydataTable[i].changePercentageOneHour)} %</td>
                        <td>${addArrow(mydataTable[i].changePercentageOneDay)} ${Math.abs(mydataTable[i].changePercentageOneDay)} %</td>
                        <td class="changes">${addArrow(mydataTable[i].changePercentageOneWeek)} ${Math.abs(mydataTable[i].changePercentageOneWeek)} %</td>
                    </tr>`;
            }

            dataTableStr += `</tbody>`;
            this.toggleLoader(false, 'ownTable'); // loader off
            contentContainer.querySelector('#crypto-info-table').innerHTML = dataTableStr;

            this.addCheckbox();
            this.updateSelectPeriod();

            if (chart) {
                this.updateChart();
            } else {
                if (window.sessionStorage.localChartData) {
                    this.updateChart(JSON.parse(window.sessionStorage.localChartData));
                }
            }
        }
    };

    this.updateDisableCheckboxes = function(state) {
        const checkboxes = contentContainer.querySelectorAll('.checkbox');

        for (let i = 0; i < checkboxes.length; ++i) {
            checkboxes[i].disabled = state;            
        }
    };

    this.buildSelectCurrencies = function(arr) {
        if (arr) {
            supportedCurrencies = arr;

            let options = '';
            for(let i = 0; i < supportedCurrencies.length; ++i) {
                if (supportedCurrencies[i] === defaultCurrency) {
                    options += `<option selected value="${supportedCurrencies[i]}">${supportedCurrencies[i]}</option>`;
                } else {
                    options += `<option value="${supportedCurrencies[i]}">${supportedCurrencies[i]}</option>`;
                }
            }

            contentContainer.querySelector('#currency-select').innerHTML = options;
            this.addCurrencyValue();
        }
    };

    this.updateChart = function(localChartData) {
        if (!localChartData) {
            if (!chart) {
                this.createChart();
            } else {
                chart = null;
                document.getElementById('analytic-chart').remove();
                const chartBlock = document.getElementById('chart-block');
                const canvasGraph = document.createElement('canvas');
                canvasGraph.id = 'analytic-chart';
                canvasGraph.classList.add('analytic-chart');
                chartBlock.append(canvasGraph);
                this.createChart();
            }
        } else {
            dataSets = localChartData.dataChart;
            myTimeArr = localChartData.timeData;
            this.createChart();
        }
    };

    class DataSet {
        constructor(data, nameCoin, color, id, tension) {
            this.label = nameCoin;
            this.backgroundColor = color;
            this.borderColor = color;
            this.data = data;
            this.id = id;
            this.tension = tension;
        }
    }

    this.createDataSet = function(timeArr, priceArr, idArr, checkedNameCoinArr) {
        myTimeArr = timeArr;
        const nameCoin = checkedNameCoinArr[checkedNameCoinArr.length - 1];

        dataSets.push(new DataSet(priceArr, nameCoin, backgroundColors[backgroundColors.length - 1], idArr[idArr.length - 1], myTension));
        //удаляю последний(выбранный) цвет для того что бы его потороно не ипосльзовать
        backgroundColors.pop();
        //обновляем каждый клик
        window.sessionStorage.setItem('colorsLine', JSON.stringify(backgroundColors));

        this.updateChart();

        localChartData.dataChart = dataSets;
        localChartData.timeData = myTimeArr;
        window.sessionStorage.setItem('localChartData', JSON.stringify(localChartData));
    };

    this.removeDataSet = function(id, name) {
        if (!name) {
            dataSets = [];
        }

        //когда выключаем чекбокс вычитываем цвет линии и пушим цвет обратно в массив (чтобы все было попорядку и не повторялось)
        for (let i = 0; i < dataSets.length; ++i) {
            if(dataSets[i].id === id) {
                backgroundColors.push(dataSets[i].backgroundColor);
            }  
        }
        window.sessionStorage.setItem('colorsLine', JSON.stringify(backgroundColors));

        for(let i = 0; i < dataSets.length; ++i) {
            if(dataSets[i].label === name) {
                dataSets.splice(i, 1);
            }
        }

        if (dataSets.length === 0) {
            myTimeArr = null;
        }

        this.updateChart();

        localChartData.dataChart = dataSets;
        localChartData.timeData = myTimeArr;
        window.sessionStorage.setItem('localChartData', JSON.stringify(localChartData));
    };

    this.createChart = function() {
        const labels = !myTimeArr ? '' : myTimeArr;

        const data = {
            labels: labels,
            datasets: !myTimeArr ? defaultDataSet : dataSets
        };
    
        const config = {
            type: 'line',
            data: data,
            options: {
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Сryptocurrency changes at different times',
                        font: {
                            size: 16
                        },
                        color: '#C9C9C9'
                    },
                    legend: {
                        labels: {
                            font: {
                                size: 16,
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time',
                            font: {
                                size: 16
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Current in USD',
                            font: {
                                size: 16
                            },
                        },
                    }
                }
            }
        };

        this.toggleLoader(false, 'ownChart');
        chart = document.getElementById('analytic-chart');
        Chart.defaults.font.size = 13;
        myChart = new Chart(
            chart,
            config
        );
    };

    this.renderHeader = function(hashPageName) {
        headerTitle.innerHTML = routesObj[routeName].title;
    };

    this.updateMenuButtons = function(currentPage) {
        const menuLinks = menu.querySelectorAll(".mainmenu__link");

        for (let link of menuLinks) {
            currentPage === link.getAttribute("href").slice(1) ? link.classList.add("active") : link.classList.remove("active");
        }
    };

    this.checkDisabledBtn = function(countCoinsInRequest) {
        mycountCoinsInRequest = countCoinsInRequest;

        if (mycountCoinsInTable === mycountCoinsInRequest) {
            this.updateStateNextBtn(true);
        }

        if (mystartCountCoinsInTable === 0) {
            this.updateStatePrevBtn(true);
        }

    };

    this.updateStateNextBtn = function(state) {
        myModuleContainer.querySelector('#next-btn').disabled = state;
    };

    this.updateStatePrevBtn = function(state) {
        myModuleContainer.querySelector('#prev-btn').disabled = state;
    };

    this.getWeekDays = function(numWeekDaysArr, priceArr, idArr, checkedNameCoin) {
        const weekDays = [];

        for(let i = 0; i < numWeekDaysArr.length - 1; ++i) {
            weekDays.push(week[numWeekDaysArr[i]]);
        }
        weekDays.push('Now');

        this.createDataSet(weekDays, priceArr, idArr, checkedNameCoin);
    };

    this.getMonths = function(numMonthArr, priceArr, idArr, checkedNameCoin) {
        const orderMonths = [];

        for(let i = 0; i < numMonthArr.length; ++i) {
            orderMonths.push(months[numMonthArr[i]]);
        }
        this.createDataSet(orderMonths, priceArr, idArr, checkedNameCoin);
    };

    this.clearCheckbox = function() {
        const checkboxes = myModuleContainer.querySelectorAll('.checkbox');

        for (let i = 0; i < checkboxes.length; ++i) {
            checkboxes[i].checked = false;
        }
    };

    this.clearChart = function() {
        this.removeDataSet();
    };

    this.createChartTopMarketCup = function (marketCupArr, nameCoinsArr, typeChart) {
        myMarketCupArr = marketCupArr;
        mynameCoinsArr = nameCoinsArr;
        
        chartTopMarketCup = myModuleContainer.querySelector('#market-cup-chart');

        const data = {
            labels: mynameCoinsArr,
            datasets: [{
                label: 'Value',
                data: myMarketCupArr,
                backgroundColor:[
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    '#7AD36E',
                    '#DBE2DB',
                    '#A09E04',
                    '#F47FF7',
                    '#78FDC7',
                    '#A38451'
                ],
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 2,
                hoverBorderColor: '#372C44'
            }],
        };
    
        const config = {
            type: typeChart ? typeChart : 'bar',
            data: data,
            options: {
                maintainAspectRatio: false,//респонсивность
                plugins: {
                    title: {
                        display: true,
                        text: 'Top 10 Market cap in USD',
                        font: {
                            size: 16
                        },
                        color: '#C9C9C9'
                    },
                    legend: {
                        labels: {
                            font: {
                                size: 16,
                            }
                        }
                    }
                },
            }
        };

        this.toggleLoader(false, 'chartTop10');
        const marketCupChart = new Chart(chartTopMarketCup, config);
    };

    this.updateTopMarketChart = function(state) {
        const marketCapChart = myModuleContainer.querySelector('#market-cup-chart');
        const marketCapChartBlock = myModuleContainer.querySelector('#market-cup-chart-block');
        let typeChart = null;

        marketCapChart.remove();
        const newMarketCapChart = document.createElement('canvas');
        newMarketCapChart.id = 'market-cup-chart';
        newMarketCapChart.classList.add('market-cup-chart');
        marketCapChartBlock.append(newMarketCapChart);

        this.createChartTopMarketCup(myMarketCupArr, mynameCoinsArr, state ? pieChart : barChart);
    };

    this.buildTableForStatisticData = function(dataForTable) {
        const tableStatisticData = myModuleContainer.querySelector('#coin-stat-table');

        const numberWithCommas = num => {
            if (num !== null) {
                let parts = num.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");//разбиваю большие числа на части
                return parts.join(".");
            } else {
                return 'no data';
            }
        };

        this.toggleLoader(false, 'coinInfoTable'); // loader off

        tableStatisticData.innerHTML = `
            <colgroup>
                <col width="250"></col>
                <col width="250"></col>
            </colgroup>
            <caption class="coin-stat_title">Statistic prices(${dataForTable.currency.toUpperCase()})</caption>
            <thead>
                <tr>
                    <th class="stat-table-img-coin"><img class="label-coin" src="${dataForTable.image}" alt="label_coin"></th>
                    <th class="stat-table-name-coin">${dataForTable.name}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Current price</td>
                    <td class="table-value">${numberWithCommas(dataForTable.currentPrice)}</td>
                </tr>
                <tr>
                    <td>Change price 24h</td>
                    <td class="table-value">${dataForTable.priceChange24h.toFixed(5)}<br />${addArrow(dataForTable.priceChange24hPercentage.toFixed(2))} ${Math.abs(dataForTable.priceChange24hPercentage.toFixed(2))}%</td>
                </tr>
                <tr>
                    <td>24h min / 24h max</td>
                    <td class="table-value">${numberWithCommas(dataForTable.low24h)} / ${numberWithCommas(dataForTable.high24h)}</td>
                </tr>
                <tr>
                    <td>Market cap change 24h</td>
                    <td class="table-value">${numberWithCommas(dataForTable.marketCapChange24h.toFixed(2))}<br />${addArrow(dataForTable.marketCapChange24hPercentage.toFixed(2))} ${Math.abs(dataForTable.marketCapChange24hPercentage.toFixed(2))}%</td>
                </tr>
                <tr>
                    <td>Total volume</td>
                    <td class="table-value">${numberWithCommas(dataForTable.totalVolume)}</td>
                </tr>
                <tr>
                    <td>Circulating supply</td>
                    <td class="table-value">${(numberWithCommas(dataForTable.circulatingSupply))}</td>
                </tr>
                <tr>
                    <td>Total supply</td>
                    <td class="table-value">${numberWithCommas(dataForTable.totalSupply)}</td>
                </tr>
                <tr>
                    <td>Max supply</td>
                    <td class="table-value">${numberWithCommas(dataForTable.maxSupply)}</td>
                </tr>
                <tr>
                    <td>Market cap rank</td>
                    <td class="table-value">${numberWithCommas(dataForTable.marketCapRank)}</td>
                </tr>
            </tbody>
        `;
    };

    this.createChartChangeMarketCap = function(marketCapsObj, currency, id, nameCoin, myTypeChart) {
        if (!createdChartChanges) {
            let nameChart = defaultNameChart;

            if (myTypeChart === 'market-cap') {
                nameChart = 'market cap';
            } else if (myTypeChart === 'prices') {
                nameChart = 'prices';
            } else {
                nameChart = 'volume';
            }

            const chartMarketCups = myModuleContainer.querySelector('#change-market-cup-chart');
            const labels = marketCapsObj.timeArr;
            const data = {
                labels: labels,
                datasets: [{
                    label: `${nameCoin} ${nameChart}`,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 0.6)',
                    data: marketCapsObj.valueArr,
                    tension: 0.5
                }]
            };
        
            const config = {
                type: 'line',
                data: data,
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `History of changes ${marketCapsObj.timeArr[0]} - ${marketCapsObj.timeArr[marketCapsObj.timeArr.length - 1]}`,
                            font: {
                                size: 16
                            },
                            color: '#C9C9C9'
                        },
                        legend: {
                            labels: {
                                font: {
                                    size: 16,
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time',
                                font: {
                                    size: 14,
                                }
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: `Current in ${currency.toUpperCase()}`,
                                font: {
                                    size: 14,
                                }
                            },
                        }
                    }
                }
            };

            this.toggleLoader(false, 'historycsChart');
            myChart = new Chart(
                chartMarketCups,
                config
            );

            createdChartChanges = true;

        } else {
            this.updatecreateChartsChanges(marketCapsObj, currency, id, nameCoin, myTypeChart);
        }
    };

    this.updatecreateChartsChanges = function (marketCapsObj, currency, id, nameCoin, myTypeChart) {
        createdChartChanges = false;
        myModuleContainer.querySelector('#change-market-cup-chart').remove();
        const canvas = document.createElement('canvas');
        canvas.id = 'change-market-cup-chart';
        canvas.classList.add('change-market-cup-chart');
        const parent = myModuleContainer.querySelector('#chart-statistics-block');
        parent.append(canvas);

        this.createChartChangeMarketCap(marketCapsObj, currency, id, nameCoin, myTypeChart);
    };

    this.toggleSingUpForm = function() {
        const formOverlay = myModuleContainer.querySelector('#form-overlay-singUp');
        formOverlay.classList.toggle('form_closed');
        
        this.toggleScroll(window.getComputedStyle(formOverlay).display);
    };

    this.toggleLoginForm = function() {
        const formOverlay = myModuleContainer.querySelector('#form-overlay-login');
        formOverlay.classList.toggle('form_closed');

        this.toggleScroll(window.getComputedStyle(formOverlay).display);
    };

    this.toggleScroll = function(style) {
        if (style === 'block') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    this.clearForm = function(typeForm) {
        if (typeForm === 'login') {
            myModuleContainer.querySelector('#email-login').value = '';
            myModuleContainer.querySelector('#password-login').value = '';
        }

        if (typeForm === 'singUp') {
            myModuleContainer.querySelector('#email-singUp').value = '';
            myModuleContainer.querySelector('#password-singUp').value = '';
            myModuleContainer.querySelector('#userName-input').value = '';
        }
    };

    this.updateDisabledLoginFormBtn = function(state) {
        myModuleContainer.querySelector('#login-btn').disabled = state;
    };

    this.updateDisabledSingUpFormBtn = function(state) {
        myModuleContainer.querySelector('#singUp-btn').disabled = state;
    };

    this.changeStatus = function(userEmail) {
        myModuleContainer.querySelector('#userEmail').innerHTML = userEmail;
    };

    this.showInvalidMessage = function(formName) {
        if (formName === 'login') {
            myModuleContainer.querySelector('#invalid-message-login').innerHTML = invalidMessageLogin;
        }

        if (formName === 'singUp') {
            myModuleContainer.querySelector('#invalid-message-singUp').innerHTML = invalidMessageSingUp;
        }
    };

    this.updateInvalidPasswordMessageLogin = function(countSymbols) {
        if (countSymbols < 7) {
            myModuleContainer.querySelector('#invalid-message-login').innerHTML = invalidMessagePasswordLogin;
        } else {
            myModuleContainer.querySelector('#invalid-message-login').innerHTML = '';
        }
    };

    this.updateInvalidPasswordMessageSingUp = function(countSymbols) {
        if (countSymbols < 7) {
            myModuleContainer.querySelector('#invalid-message-singUp').innerHTML = invalidMessagePasswordLogin;
        } else {
            myModuleContainer.querySelector('#invalid-message-singUp').innerHTML = '';
        }
    };

    const createLoader = () => {
        const loader = document.createElement('div');
        loader.classList.add('loader');
        loader.id = 'loader';

        return loader;
    };

    this.toggleLoader = function(stateRequest, nameBlock) {
        const toggleLoader = (element, state) => {
            if (state) {
                element.append(createLoader());
            } else {
                if (element.querySelector('#loader')) {
                    element.querySelector('#loader').remove();
                }
            }
        };

        setTimeout(() => {
            if (nameBlock === 'chartTop10') {
                const chartTop10Block = myModuleContainer.querySelector('#market-cup-chart-block');
                toggleLoader(chartTop10Block, stateRequest);
            }

            if (nameBlock === 'historycsChart') {
                const historycsChartBlock = myModuleContainer.querySelector('#chart-statistics-block');
                toggleLoader(historycsChartBlock, stateRequest);
            }

            if (nameBlock === 'coinInfoTable') {
                const coinInfoTableBlock = myModuleContainer.querySelector('#coin-info-table-block');
                toggleLoader(coinInfoTableBlock, stateRequest);
            }

            if (nameBlock === 'ownChart') {
                const ownChartBlock = myModuleContainer.querySelector('#chart-block');
                toggleLoader(ownChartBlock, stateRequest);
            }

            if (nameBlock === 'ownTable') {
                const ownTableBlock = myModuleContainer.querySelector('#crypto-info-table-block');
                toggleLoader(ownTableBlock, stateRequest);
            }
        }, 0);
    };

    this.soundClick = function() {
        const audio = new Audio();
        audio.src = './audio/click-sound.mp3';
        audio.autoplay = true;
    };
}