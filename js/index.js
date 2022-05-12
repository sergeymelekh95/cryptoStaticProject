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
        let graph = null;
        let myChart = null;
        let subChart = null;
        const backgroundColors = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#3366cc","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"];
        const defaultDataSet = [{
            label: 'Choose coins in the checkbox below',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
        }];
        let dataSets = [];
        const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const loader = '<div class="loader"></div>';

        this.init = function(container, routes) {
            myModuleContainer = container;
            routesObj = routes;
            menu = myModuleContainer.querySelector("#mainmenu");
            contentContainer = myModuleContainer.querySelector("#content");
            header = myModuleContainer.querySelector("#header");
            headerTitle = myModuleContainer.querySelector(".title");
        };

        this.renderContent = function(hashPageName) {
            routeName = "default";

            if (hashPageName.length > 0) {
                routeName = hashPageName in routes ? hashPageName : "error";
            }

            window.document.title = routesObj[routeName].title;
            contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`);

            this.updateButtons(routesObj[routeName].id);
        };

        const addArrow = percent => {
            return percent > 0 ?
            '<img src="./img/table_icons/arrow-up.svg" alt="arrow-up">':
            '<img src="./img/table_icons/arrow-down.svg" alt="arrow-down">';
        };

        // const isLoader = num => !num ? loader : num;

        this.buildTable = function(dataTable) {

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

            for(let i = 0; i < dataTable.length; ++i) {
                dataTableStr += `
                    <tr>
                        <td class="checkbox-table"><input type="checkbox" class="checkbox" id="${dataTable[i].id}"></td>
                        <td><img class="label-coin" src="${dataTable[i].image}" alt="label_coin"></td>
                        <td class="name-coin">${dataTable[i].nameCoin}</td>
                        <td class="symbol-coin">${dataTable[i].symbol}</td>
                        <td class="price-coin">${dataTable[i].currentPrice}</td>
                        <td class="changes"> ${addArrow(dataTable[i].changePercentageOneHour)} ${Math.abs(dataTable[i].changePercentageOneHour)} %</td>
                        <td>${addArrow(dataTable[i].changePercentageOneDay)} ${Math.abs(dataTable[i].changePercentageOneDay)} %</td>
                        <td class="changes">${addArrow(dataTable[i].changePercentageOneWeek)} ${Math.abs(dataTable[i].changePercentageOneWeek)} %</td>
                    </tr>`;
            }

            dataTableStr += `</tbody>`;

            contentContainer.querySelector('#crypto-info-table').innerHTML = dataTableStr;

            // contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`, dataTableStr);
            // this.updateGraph();
        };

        this.buildSelectCurrencies = function(arr) {
            let options = '';
            for(let i = 0; i < arr.length; ++i) {
                if (arr[i] === defaultCurrency) {
                    options += `<option selected value="${arr[i]}">${arr[i]}</option>`;
                } else {
                    options += `<option value="${arr[i]}">${arr[i]}</option>`;
                }
            }
            contentContainer.querySelector('#currency-select').innerHTML = options;
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

        this.updateButtons = function(currentPage) {
            const menuLinks = menu.querySelectorAll(".mainmenu__link");

            for (let link of menuLinks) {
                currentPage === link.getAttribute("href").slice(1) ? link.classList.add("active") : link.classList.remove("active");
            }
        };
    }

    function ModuleModel() {
        let myModuleView = null;
        const api = "https://api.coingecko.com/api";
        let currency = null;
        let pageName = null;

        this.init = function(view) {
            myModuleView = view;

            this.getSuppurtedCurrencies();
            this.getDataForTable();
        };

        this.updateState = function(pageName) {
            this.pageName = pageName;

            myModuleView.renderContent(this.pageName);
            myModuleView.renderHeader(this.pageName);
        };

        const addZero = num => num < 10 ? `0${num}` : num;

        this.getSuppurtedCurrencies = function() {
            fetch(`${api}/v3/simple/supported_vs_currencies`)
            .then(response => response.json())
            .then(arr => myModuleView.buildSelectCurrencies(arr));
        };

        this.getDataForTable = function(currencyValue) {
            currency = !currencyValue ? 'usd' : currencyValue;

            fetch(`${api}/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`)
            .then(response => response.json())
            .then(data => this.parseDataForTable(data));
        };

        this.parseDataForTable = function(data) {
            const dataTable = [];

            for(let i = 0; i < data.length; ++i) {
                const id = data[i].id;
                const nameCoin = data[i].name;
                const currentPrice = data[i].current_price.toFixed(2);
                const changePercentageOneHour = data[i].price_change_percentage_1h_in_currency.toFixed(2);
                const changePercentageOneWeek = data[i].price_change_percentage_7d_in_currency.toFixed(2);
                const changePercentageOneDay = data[i].price_change_percentage_24h_in_currency.toFixed(2);
                const image = data[i].image;
                const symbol = data[i].symbol;

                dataTable.push({
                    id,
                    nameCoin,
                    currentPrice,
                    changePercentageOneHour,
                    changePercentageOneDay,
                    changePercentageOneWeek,
                    image,
                    symbol,
                    currency
                });
            }

            myModuleView.buildTable(dataTable);
        };

        this.updateCurrency = function(value) {
            this.getDataForTable(value);
        };
    }

    function ModuleController() {
        let myModuleContainer = null;
        let myModuleModel = null;

        this.init = function(container, model) {
            myModuleContainer = container;
            myModuleModel = model;

            // вешаем слушателей на событие hashchange и кликам по пунктам меню
            window.addEventListener("hashchange", this.updateState);
            this.updateState(); //первая отрисовка

            myModuleContainer.addEventListener('change', this.getValue);
        };

        this.getValue = function(event) {
            if (event.target.id === 'currency-select') {
                myModuleModel.updateCurrency(event.target.value);
            }
        };

        this.updateState = function() {
            const hashPageName = location.hash.slice(1).toLowerCase();
            myModuleModel.updateState(hashPageName);
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