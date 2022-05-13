"use strict";
// Список компонентов (from components.js)
const components = {
    header: Header,
    saidbar: Saidbar,
    content: Content,
};
  
// Список поддердживаемых роутов (from pages.js)
const routes = {
    main: HomePage,
    about: AboutPage,
    default: HomePage,
    error: ErrorPage,
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
        // let graph = null;
        // let myChart = null;
        // let subChart = null;
        // const backgroundColors = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#3366cc","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"];
        // const defaultDataSet = [{
        //     label: 'Choose coins in the checkbox below',
        //     backgroundColor: 'rgb(255, 99, 132)',
        //     borderColor: 'rgb(255, 99, 132)',
        //     data: [],
        // }];
        // let dataSets = [];
        // const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // const loader = '<div class="loader"></div>';

        this.init = function(container, routes) {
            myModuleContainer = container;
            routesObj = routes;
            menu = myModuleContainer.querySelector("#mainmenu");
            contentContainer = myModuleContainer.querySelector("#content");
            header = myModuleContainer.querySelector("#header");
            headerTitle = myModuleContainer.querySelector(".title");
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
                            <td class="checkbox-table"><input type="checkbox" class="checkbox" id="${mydataTable[i].id}"></td>
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

                // contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`, dataTableStr);
                // this.updateGraph();
                this.addCheckbox();
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

        // this.updateGraph = function() {

        //     if (!graph) {
        //         this.createGraph();
        //     } else {
        //         graph = null;
        //         document.getElementById('analytic-chart').remove();
        //         const chartBlock = document.getElementById('chart-block');
        //         const canvasGraph = document.createElement('canvas');
        //         canvasGraph.id = 'analytic-chart';
        //         canvasGraph.classList.add('analytic-chart');
        //         chartBlock.append(canvasGraph);
        //         this.createGraph();
        //     }
        // };

        // class DataSet {
        //     constructor(data, nameCoin, color) {
        //         this.label = nameCoin;
        //         this.backgroundColor = color;
        //         this.borderColor = color;
        //         this.data = data;
        //     }
        // }

        // this.getWeekDays = function(numWeekDaysArr, priceArr, idArr) {
        //     const weekDays = [];

        //     for(let i = 0; i < numWeekDaysArr.length - 1; ++i) {
        //         weekDays.push(week[numWeekDaysArr[i]]);
        //     }
        //     weekDays.push('Now');

        //     this.createDataSet(weekDays, priceArr, idArr);
        // };

        // this.getMonths = function(numMonthArr, priceArr, idArr) {
        //     const orderMonths = [];

        //     for(let i = 0; i < numMonthArr.length; ++i) {
        //         orderMonths.push(months[numMonthArr[i]]);
        //     }
        //     this.createDataSet(orderMonths, priceArr, idArr);
        // };

        // this.createDataSet = function(timeArr, priceArr, idArr) {
        //     subChart = timeArr;

        //     const nameCoin = idArr[idArr.length - 1]; // назварние с большой буквы
        //     // const nameCoin = idArr[idArr.length - 1][0].toUpperCase() + idArr[idArr.length - 1].slice(1); // назварние с большой буквы

        //     dataSets.push(new DataSet(priceArr, nameCoin, backgroundColors[idArr.length - 1]));

        //     this.updateGraph();
        // };

        // this.removeDataSet = function(id) {

        //     if (!id) {
        //         dataSets = [];
        //     }

        //     for(let i = 0; i < dataSets.length; ++i) {
        //         if(dataSets[i].label === id) {
        //             dataSets.splice(i, 1);
        //         }
        //     }

        //     if (dataSets.length === 0) {
        //         subChart = null;
        //     }

        //     this.updateGraph();
        // };

        // this.createChart = function() {
        //     const labels = !subChart ? '' : subChart;
        
        //     const data = {
        //         labels: labels,
        //         datasets: dataSets.length === 0 ? defaultDataSet : dataSets
        //     };
        
        //     const config = {
        //         type: 'line',
        //         data: data,
        //         options: {
        //             maintainAspectRatio: false
        //         }
        //     };

        //     graph = document.getElementById('analytic-chart');
    
        //     myChart = new Chart(
        //         graph,
        //         config
        //     );
        // };

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
    }

    function ModuleModel() {
        let myModuleView = null;
        const api = "https://api.coingecko.com/api";
        let currency = null;
        let dafaulCurrency = 'usd';
        let pageName = null;
        let countCoinsInTable = 10;
        let startCountCoinsInTable = 0;
        const countCoinsInRequest = 30;
        let dataTable = [];
        let supportedCurrencies = null;

        this.init = function(view) {
            myModuleView = view;

            if (location.hash.slice(1) === routes.main.id  || location.hash.slice(1) === "") {
                this.getSuppurtedCurrencies();
                this.getDataForTable();
            }
        };

        this.updateState = function(pageName) {
            this.pageName = pageName;

            if(dataTable.length === 0 && pageName === routes.main.id) {
                if (window.sessionStorage.localData) {
                    this.getDataForTable(JSON.parse(window.sessionStorage.localData).currencySelectValue);
                } else {
                    this.getDataForTable();
                }
                
                this.getSuppurtedCurrencies();
            }

            myModuleView.renderContent(this.pageName, countCoinsInRequest);
            myModuleView.renderHeader(this.pageName);

            if(pageName === routes.main.id) {
                if (supportedCurrencies) {
                    myModuleView.buildSelectCurrencies(supportedCurrencies);
                    this.getDataForTable(JSON.parse(window.sessionStorage.localData).currencySelectValue);
                } else {
                    this.getSuppurtedCurrencies();
                }
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

        this.setLocalData = function(checkedId, currencySelectValue) {

            const localObj = {
                checkedId,
                currencySelectValue,
            };

            window.sessionStorage.setItem('localData', JSON.stringify(localObj));
        };
    }

    function ModuleController() {
        let myModuleContainer = null;
        let myModuleModel = null;
        let checkedId = [];
        let currencySelect = null;

        this.init = function(container, model) {
            myModuleContainer = container;
            myModuleModel = model;
            checkedId = window.sessionStorage.localData ? JSON.parse(window.sessionStorage.localData).checkedId : [];

            // вешаем слушателей на событие hashchange и кликам по пунктам меню
            window.addEventListener("hashchange", this.updateState);
            this.updateState(); //первая отрисовка

            currencySelect = myModuleContainer.querySelector('#currency-select');

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
                } else {
                    const i = checkedId.indexOf(event.target.id);
                    if (i >= 0) {
                        checkedId.splice(i ,1);
                    }
                }

                myModuleModel.setLocalData(checkedId, currencySelect.value);
            }
        };

        this.updateState = function() {
            const hashPageName = location.hash.slice(1).toLowerCase();

            myModuleModel.updateState(hashPageName);
        };

        this.updateCoin = function(event) {
            if (event.target.id === 'next-btn') {
                myModuleModel.showNextCoins();
            }

            if (event.target.id === 'prev-btn') {
                myModuleModel.showPrevCoins();
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