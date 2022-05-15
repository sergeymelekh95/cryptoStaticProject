"use strict";
// Список компонентов (from components.js)
const components = {
    header: Header,
    saidbar: Saidbar,
    content: Content,
    footer: Footer
};
  
// Список поддердживаемых роутов (from pages.js)
const routes = {
    main: HomePage,
    about: AboutPage,
    default: HomePage,
    error: ErrorPage,
    info: CoinInfo,
};

const cryptoStatSPA = (function() {
    function ModuleView() {
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
        let backgroundColors = ['#743411', '#0c5922', '#bea413', '#668d1c', '#2a778d', '#a9c413', '#9c5935', '#f4359e', '#b91383', '#16d620', '#b77322', '#3b3eac', '#5574a6', '#329262', '#651067', '#8b0707', '#e67300', '#6633cc', '#aaaa11', '#22aa99', '#994499', '#3366cc', '#316395', '#b82e2e', '#66aa00', '#dd4477', '#0099c6', '#990099', '#109618', '#ff9900', '#dc3912', '#3366cc'];
        const defaultDataSet = [{
            label: 'Choose coins in the checkbox below',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
        }];
        let dataSets = [];
        const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // const loader = '<div class="loader"></div>';
        const localChartData = {};

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

        // const isLoader = num => !num ? loader : num;

        this.buildTable = function(dataTable, countCoinsInTable, startCountCoinsInTable) {
            if (dataTable) {
                mydataTable = dataTable;
                mycountCoinsInTable = countCoinsInTable;
                mystartCountCoinsInTable = startCountCoinsInTable;

                let dataTableStr = `
                    <col width="40"></col>
                    <col width="50"></col>
                    <col width="160"></col>
                    <col width="80"></col>
                    <col width="120"></col>
                    <col width="90"></col>
                    <col width="90"></col>
                    <col width="90"></col>
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
                            <td class="checkbox-table"><input type="checkbox" class="checkbox" id="${mydataTable[i].id}" name="${mydataTable[i].nameCoin}"></td>
                            <td><img class="label-coin" src="${mydataTable[i].image}" alt="label_coin"></td>
                            <td class="name-coin">${mydataTable[i].number}. ${mydataTable[i].nameCoin}</td>
                            <td class="symbol-coin">${mydataTable[i].symbol}</td>
                            <td class="price-coin">${mydataTable[i].currentPrice}</td>
                            <td class="changes"> ${addArrow(mydataTable[i].changePercentageOneHour)} ${Math.abs(mydataTable[i].changePercentageOneHour)} %</td>
                            <td>${addArrow(mydataTable[i].changePercentageOneDay)} ${Math.abs(mydataTable[i].changePercentageOneDay)} %</td>
                            <td class="changes">${addArrow(mydataTable[i].changePercentageOneWeek)} ${Math.abs(mydataTable[i].changePercentageOneWeek)} %</td>
                        </tr>`;
                }

                dataTableStr += `</tbody>`;
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
            constructor(data, nameCoin, color, id) {
                this.label = nameCoin;
                this.backgroundColor = color;
                this.borderColor = color;
                this.data = data;
                this.id = id;
            }
        }

        this.createDataSet = function(timeArr, priceArr, idArr, checkedNameCoinArr) {
            myTimeArr = timeArr;
            const nameCoin = checkedNameCoinArr[checkedNameCoinArr.length - 1];

            dataSets.push(new DataSet(priceArr, nameCoin, backgroundColors[backgroundColors.length - 1], idArr[idArr.length - 1]));
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
                            text: 'Сryptocurrency changes at different times'
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Current in USD'
                            },
                        }
                    }
                }
            };

            chart = document.getElementById('analytic-chart');
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
    }

    function ModuleModel() {
        let myModuleView = null;
        const api = "https://api.coingecko.com/api";
        let currency = null;
        let dafaulCurrency = 'usd';
        let pageName = null;
        let countCoinsInTable = 10;
        let startCountCoinsInTable = 0;
        const countCoinsInRequest = 100;
        let dataTable = [];
        let supportedCurrencies = null;
        let chartCurrency = 'usd';

        this.init = function(view) {
            myModuleView = view;

            if (location.hash.slice(1) === "") {
                this.getSuppurtedCurrencies();
                if (window.sessionStorage.localData) {
                    this.getDataForTable(JSON.parse(window.sessionStorage.localData).currencySelectValue);
                } else {
                    this.getDataForTable();
                }
            }
        };

        this.updateState = function(pageName) {
            this.pageName = pageName;

            myModuleView.renderContent(this.pageName, countCoinsInRequest);
            myModuleView.renderHeader(this.pageName);

            if(dataTable.length === 0 && pageName === routes.main.id) { 
                if (window.sessionStorage.localData) {
                    myModuleView.buildSelectCurrencies(supportedCurrencies);
                    this.getDataForTable(JSON.parse(window.sessionStorage.localData).currencySelectValue);
                } else {
                    this.getDataForTable();
                }
                
                this.getSuppurtedCurrencies();
            }
        };

        const addZero = num => num < 10 ? `0${num}` : num;

        this.getSuppurtedCurrencies = function() {    
            fetch(`${api}/v3/simple/supported_vs_currencies`)
            .then(response => response.json())
            .then(arr => this.buildSelectCurrencies(arr)); 
        };

        this.buildSelectCurrencies = function(arr) {
            supportedCurrencies = arr;

            myModuleView.buildSelectCurrencies(supportedCurrencies);
        };

        this.getDataForTable = function(currencyValue) {
            currency = !currencyValue ? dafaulCurrency : currencyValue;
            fetch(`${api}/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${countCoinsInRequest}&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`)
            .then(response => response.json())
            .then(data => this.parseDataForTable(data));
        };

        this.parseDataForTable = function(data) {
            dataTable = [];

            for(let i = 0; i < data.length; ++i) {
                const id = data[i].id;
                const nameCoin = data[i].name;
                const currentPrice = data[i].current_price.toFixed(2);
                const changePercentageOneHour = data[i].price_change_percentage_1h_in_currency.toFixed(2);
                const changePercentageOneWeek = data[i].price_change_percentage_7d_in_currency.toFixed(2);
                const changePercentageOneDay = data[i].price_change_percentage_24h_in_currency.toFixed(2);
                const image = data[i].image;
                const symbol = data[i].symbol;
                const number = i + 1;

                dataTable.push({
                    id,
                    nameCoin,
                    currentPrice,
                    changePercentageOneHour,
                    changePercentageOneDay,
                    changePercentageOneWeek,
                    image,
                    symbol,
                    currency,
                    number
                });
            }

            myModuleView.buildTable(dataTable, countCoinsInTable, startCountCoinsInTable);
            myModuleView.checkDisabledBtn(countCoinsInRequest);

            if (!window.sessionStorage.localData) {
                myModuleView.createChart();
            }
            
        };

        this.updateCurrency = function(value) {
            this.getDataForTable(value);
        };

        this.showNextCoins = function() {
            countCoinsInTable += 10;
            startCountCoinsInTable += 10;
            myModuleView.updateStatePrevBtn(false);
            myModuleView.buildTable(dataTable, countCoinsInTable, startCountCoinsInTable);

            myModuleView.checkDisabledBtn(countCoinsInRequest);
        };

        this.showPrevCoins = function() {
            countCoinsInTable -= 10;
            startCountCoinsInTable -= 10;
            myModuleView.updateStateNextBtn(false);
            myModuleView.buildTable(dataTable, countCoinsInTable, startCountCoinsInTable);

            myModuleView.checkDisabledBtn(countCoinsInRequest);
        };

        this.setLocalData = function(checkedId, currencySelectValue, checkedNameCoin, periodSelectValue) {
            const localObj = {
                checkedId,
                currencySelectValue,
                checkedNameCoin,
                periodSelectValue
            };

            window.sessionStorage.setItem('localData', JSON.stringify(localObj));
        };

        this.addDataChart = function(checkedId, periodSelecValue, checkedNameCoin) {
            if (periodSelecValue === 'hour') {
                myModuleView.updateDisableCheckboxes(true);
                fetch(`${api}/v3/coins/${checkedId[checkedId.length - 1]}/market_chart?vs_currency=${chartCurrency}&days=1&interval=minutely`).
                then(response => response.json()).
                then(data => parseDataHour(data.prices.slice(-13)));
            }

            const parseDataHour = data => {
                myModuleView.updateDisableCheckboxes(false);
                const timeArr = [];
                const priceArr = [];

                for (let  i = 0; i < data.length; ++i) {
                    timeArr.push(`${addZero(new Date(data[i][0]).getHours())}:${addZero(new Date(data[i][0]).getMinutes())}`);
                    priceArr.push(data[i][1].toFixed(1));
                }

                myModuleView.createDataSet(timeArr, priceArr, checkedId, checkedNameCoin);
            };

            if (periodSelecValue === 'day') {
                myModuleView.updateDisableCheckboxes(true);
                fetch(`${api}/v3/coins/${checkedId[checkedId.length - 1]}/market_chart?vs_currency=${chartCurrency}&days=1&interval=hourly`).
                then(response => response.json()).
                then(data => parseDataDay(data.prices));
            }

            const parseDataDay = data => {
                myModuleView.updateDisableCheckboxes(false);
                const timeArr = [];
                const priceArr = [];

                for (let  i = 0; i < data.length; ++i) {
                    timeArr.push(`${addZero(new Date(data[i][0]).getDate())}th,${addZero(new Date(data[i][0]).getHours())}:00`);
                    priceArr.push(data[i][1].toFixed(1));
                }

                myModuleView.createDataSet(timeArr, priceArr, checkedId, checkedNameCoin);
            };

            if (periodSelecValue === 'week') {
                myModuleView.updateDisableCheckboxes(true);
                fetch(`${api}/v3/coins/${checkedId[checkedId.length - 1]}/market_chart?vs_currency=${chartCurrency}&days=7&interval=daily`).
                then(response => response.json()).
                then(data => parseDataWeek(data.prices));
            }

            const parseDataWeek = data => {
                myModuleView.updateDisableCheckboxes(false);
                const timeArr = [];
                const priceArr = [];

                for (let  i = 0; i < data.length; ++i) {
                    timeArr.push(`${new Date(data[i][0]).getDay()}`);
                    priceArr.push(data[i][1].toFixed(1));
                }

                myModuleView.getWeekDays(timeArr, priceArr, checkedId, checkedNameCoin);
            };

            if (periodSelecValue == 'month') {
                myModuleView.updateDisableCheckboxes(true);
                fetch(`${api}/v3/coins/${checkedId[checkedId.length - 1]}/market_chart?vs_currency=${chartCurrency}&days=30&interval=daily`).
                then(response => response.json()).
                then(data => parseDataMonth(data.prices));
            }

            const parseDataMonth = data => {
                myModuleView.updateDisableCheckboxes(false);
                const timeArr = [];
                const priceArr = [];

                for (let  i = 0; i < data.length; ++i) {
                    timeArr.push(`${addZero(new Date(data[i][0]).getDate())}.${addZero(new Date(data[i][0]).getMonth() + 1)}`);
                    priceArr.push(data[i][1].toFixed(1));
                }

                myModuleView.createDataSet(timeArr, priceArr, checkedId, checkedNameCoin);
            };

            if (periodSelecValue == 'year') {
                myModuleView.updateDisableCheckboxes(true);
                fetch(`${api}/v3/coins/${checkedId[checkedId.length - 1]}/market_chart?vs_currency=${chartCurrency}&days=365&interval=daily`).
                then(response => response.json()).
                then(data => parseDataYear(data.prices));
            }

            const parseDataYear = data => {
                myModuleView.updateDisableCheckboxes(false);
                const timeArr = [];
                const priceArr = [];

                for(let i = 0; i < data.length; ++i) {
                    if (data.indexOf(data[i]) % 30 === 0) {
                        timeArr.push(new Date(data[i][0]).getMonth());
                        priceArr.push((data[i][1]).toFixed(1));
                    }
                }

                timeArr.pop();
                priceArr.pop();
                myModuleView.getMonths(timeArr, priceArr, checkedId, checkedNameCoin);
            };
        };

        this.removeDataChart = function(id, name) {
            myModuleView.removeDataSet(id, name);
        };

        this.clearChart = function() {
            if (window.sessionStorage.localChartData) {
                const dataChart = JSON.parse(window.sessionStorage.localChartData).dataChart;

                if (dataChart.length > 0) {
                    myModuleView.clearCheckbox();
                    myModuleView.clearChart();
                    this.clearLocalData();
                }
            }
        };

        this.clearLocalData = function() {
            sessionStorage.clear();
        };
    }

    function ModuleController() {
        let myModuleContainer = null;
        let myModuleModel = null;
        let checkedId = [];
        let checkedNameCoin = [];
        let currencySelect = null;
        let currencySelectValue = null;
        let periodSelect = null;
        let selectPeriodValue = null;

        this.init = function(container, model) {
            myModuleContainer = container;
            myModuleModel = model;
            checkedId = window.sessionStorage.localData ? JSON.parse(window.sessionStorage.localData).checkedId : [];

            // вешаем слушателей на событие hashchange и кликам по пунктам меню
            window.addEventListener("hashchange", this.updateState);
            this.updateState(); //первая отрисовка

            currencySelect = myModuleContainer.querySelector('#currency-select');
            periodSelect = myModuleContainer.querySelector('#period');

            myModuleContainer.addEventListener('change', this.getValue);
            myModuleContainer.addEventListener('click', this.updateCoin);
        };

        this.getValue = function(event) {
            if (event.target.id === 'currency-select') {
                myModuleModel.updateCurrency(event.target.value);
                myModuleModel.setLocalData(checkedId, event.target.value);
            }

            if (event.target.type === 'checkbox') {
                if (event.target.checked) {
                    checkedId.push(event.target.id);
                    checkedNameCoin.push(event.target.name);
                    
                    myModuleModel.addDataChart(checkedId,selectPeriodValue || periodSelect.value, checkedNameCoin);
                } else {
                    myModuleModel.removeDataChart(event.target.id, event.target.name);
                    const i = checkedId.indexOf(event.target.id);
                    if (i >= 0) {
                        checkedNameCoin.splice(i, 1);
                        checkedId.splice(i ,1);
                    }
                }

                myModuleModel.setLocalData(checkedId, currencySelect.value, checkedNameCoin, selectPeriodValue || periodSelect.value);
            }

            if (event.target.id === 'period') {
                selectPeriodValue = event.target.value;
                //при изменении периода обновляем график и все данные в sessionStorage

                checkedId = [];
                checkedNameCoin = [];
                myModuleModel.setLocalData(checkedId, currencySelect.value, checkedNameCoin, periodSelect.value);

                myModuleModel.clearChart();
            }
        };

        this.updateState = function() {
            const hashPageName = location.hash.slice(1).toLowerCase();
            myModuleModel.updateState(hashPageName);
            
            if (hashPageName === routes.main.id) {
                periodSelect = myModuleContainer.querySelector('#period');
                selectPeriodValue = periodSelect.value;

                currencySelect = myModuleContainer.querySelector('#currency-select');
                currencySelectValue = currencySelect.value;
            }
        };

        this.updateCoin = function(event) {
            if (event.target.id === 'next-btn') {
                myModuleModel.showNextCoins();
            }

            if (event.target.id === 'prev-btn') {
                myModuleModel.showPrevCoins();
            }

            if (event.target.id === 'clear-btn') {
                myModuleModel.clearChart();
            }
        };
    }

    return {
        init: function({container, routes, components}) {
            this.renderComponents(container, components);

            const view = new ModuleView();
            const model = new ModuleModel();
            const controller = new ModuleController();

            //связываем части модуля
            view.init(document.getElementById(container), routes);
            model.init(view);
            controller.init(document.getElementById(container), model);
        },

        renderComponents: function(container, components) {
            const root = document.getElementById(container);
            const componentsList = Object.keys(components);

            for (let item of componentsList) {
                root.innerHTML += components[item].render("component");
            }
        },
    };
})();
/* ------ end app module ----- */

/*** --- init module --- ***/
document.addEventListener("DOMContentLoaded", cryptoStatSPA.init({
    container: "cryptoStatSPA",
    routes: routes,
    components: components,
}));