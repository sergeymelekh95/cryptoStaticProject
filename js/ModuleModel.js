import { routes } from './pages.js';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, set, ref, update, onValue, auth, database} from './fairbase.js';

export function ModuleModel() {
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
    const topMarketCup = 10;
    let gotDataTopMarketCupData = null;
    let gotStatisticData = null;
    const defaultCoinId = 'bitcoin';
    const defaultTypeChart = 'market-cap';
    let defaultNameCoin = 'Bitcoin';
    let isLogin = null;
    let myId = null;
    let myCurrency = null;
    let myTypeChart = null;
    let myNameCoin = null;

    this.init = function(view) {
        myModuleView = view;
        this.checkAccessRights();//проверка прав доступа

        if (location.hash.slice(1) === "") {
            this.getSuppurtedCurrencies();
            if (window.sessionStorage.localData) {
                this.getDataForTable(JSON.parse(window.sessionStorage.localData).currencySelectValue);
            } else {
                this.getDataForTable();
            }
        }
    };

    this.checkAccessRights = function() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userId = auth.currentUser.uid;
                isLogin = null;

                return onValue(ref(database, '/users/' + userId), (snapshot) => {
                const username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
                myModuleView.changeStatus(snapshot.val().name);
                }, {onlyOnce: true});
            } else {
                if (!isLogin) {
                    myModuleView.toggleLoginForm();
                }

                isLogin = true;
            }
        });
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

        if (pageName === routes.info.id) {
            if (window.sessionStorage.localDataTableStatistic) {
                if (!gotStatisticData) {
                    this.getLocalDataTableStatistic();
                }
            } else {
                if (!gotStatisticData) {
                    this.getStatisticData();
                } else {
                    if (window.sessionStorage.localDataTableStatistic) {
                        this.getLocalDataTableStatistic();
                    }
                }
            }

            if (gotDataTopMarketCupData) {
                myModuleView.updateTopMarketChart();
            } else {
                this.getTop10Data();
            }
        }
    };

    const addZero = num => num < 10 ? `0${num}` : num;

    this.getSuppurtedCurrencies = function() {    
        fetch(`${api}/v3/simple/supported_vs_currencies`)
        .then(response => response.json())
        .then(arr => this.buildSelectCurrencies(arr))
        .catch(error => myModuleView.renderContent('error')); 
    };

    this.buildSelectCurrencies = function(arr) {
        supportedCurrencies = arr;
        myModuleView.buildSelectCurrencies(supportedCurrencies);
    };

    this.getDataForTable = function(currencyValue) {
        currency = !currencyValue ? dafaulCurrency : currencyValue;
        //lodaer on
        myModuleView.toggleLoader(true, 'ownChart');
        myModuleView.toggleLoader(true, 'ownTable');
        fetch(`${api}/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${countCoinsInRequest}&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`)
        .then(response => response.json())
        .then(data => this.parseDataForTable(data))
        .catch(error => myModuleView.renderContent('error'));
    };

    const checkValidNum = num => !num ? num : num.toFixed(2);
    const checkValidPrice = num => !num ? num : num;

    this.parseDataForTable = function(data) {
        dataTable = [];

        for(let i = 0; i < data.length; ++i) {
            const id = data[i].id;
            const nameCoin = data[i].name;
            const currentPrice = checkValidPrice(data[i].current_price);
            const changePercentageOneHour = checkValidNum(data[i].price_change_percentage_1h_in_currency);
            const changePercentageOneWeek = checkValidNum(data[i].price_change_percentage_7d_in_currency);
            const changePercentageOneDay = checkValidNum(data[i].price_change_percentage_24h_in_currency);
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
            then(data => parseDataHour(data.prices.slice(-13)))
            .catch(error => myModuleView.renderContent('error'));
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
            then(data => parseDataDay(data.prices))
            .catch(error => myModuleView.renderContent('error'));
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
            then(data => parseDataWeek(data.prices))
            .catch(error => myModuleView.renderContent('error'));
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
            then(data => parseDataMonth(data.prices))
            .catch(error => myModuleView.renderContent('error'));
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
            then(data => parseDataYear(data.prices))
            .catch(error => myModuleView.renderContent('error'));
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
        sessionStorage.removeItem('localData');
        sessionStorage.removeItem('colorsLine');
        sessionStorage.removeItem('localChartData');
    };

    this.getTop10Data = function(currency) {
        const myCurrency = !currency ? dafaulCurrency : currency;
        //show Loader
        myModuleView.toggleLoader(true, 'chartTop10');

        // top 10
        fetch(`${api}/v3/coins/markets?vs_currency=${myCurrency}&order=market_cap_desc&per_page=${topMarketCup}&page=1&sparkline=false`)
        .then(response => response.json())
        .then(topMarketCupData => this.parseTopMarketCupData(topMarketCupData))
        .catch(error => myModuleView.renderContent('error'));
    };

    this.setLocalDataTableStatistic = function(currency, id, name, typeChart) {
        const obj = {
            currency,
            id,
            name,
            typeChart
        };
        window.sessionStorage.setItem('localDataTableStatistic', JSON.stringify(obj));
    };

    this.getStatisticData = function(currency, id, name, typeChart) {
        gotStatisticData = true;
        myId = !id ? defaultCoinId : id;
        myCurrency = !currency ? dafaulCurrency : currency;
        myTypeChart = !typeChart ? defaultTypeChart : typeChart;
        myNameCoin = !name ? defaultNameCoin : name;

        this.setLocalDataTableStatistic(myCurrency, myId, myNameCoin, myTypeChart);

        //for table statistic
        myModuleView.toggleLoader(true, 'coinInfoTable');
        fetch(`${api}/v3/coins/markets?vs_currency=${myCurrency}&ids=${myId}&sparkline=false`)
        .then(response => response.json())
        .then(data => this.parseStatisticDataForTable(data, myCurrency))
        .catch(error => myModuleView.renderContent('error'));

        //for 3 charts
        myModuleView.toggleLoader(true, 'historycsChart');
        fetch(`${api}/v3/coins/${myId}/market_chart?vs_currency=${myCurrency}&days=max&interval=daily`)
        .then(response => response.json())
        .then(data => this.parseHistoricalDataForCharts(data, currency, id, name, myTypeChart))
        .catch(error => myModuleView.renderContent('error'));
    };

    this.updateTypeChart = function(typeChart) {
        this.getStatisticData(myCurrency, myId, myNameCoin, typeChart);
    };

    this.parseHistoricalDataForCharts = function(data, currency, id, name, myTypeChart) {
        myId = !id ? defaultCoinId : id;
        myCurrency = !currency ? dafaulCurrency : currency;
        myNameCoin = !name ? defaultNameCoin : name;

        const marketCapsArr = data.market_caps;
        const pricesArr = data.prices;
        const totalVolumes = data.total_volumes;

        const createArraysForCharts = arr => {
            const timeArr = [];
            const valueArr = [];
            const addZero = num => num < 10 ? `0${num}` : num;

            for (let i = 0; i < arr.length; ++i) {
                if (i % 200 === 0) {
                    timeArr.push(`${addZero(new Date(arr[i][0]).getDate())}.${addZero(new Date(arr[i][0]).getMonth() + 1)}.${addZero(new Date(arr[i][0]).getFullYear())}`);
                    valueArr.push(arr[i][1]);
                }
            }

            return {timeArr, valueArr};
        };

        if (myTypeChart === 'market-cap') {
            myModuleView.createChartChangeMarketCap(createArraysForCharts(marketCapsArr), myCurrency, myId, myNameCoin, myTypeChart);
        } else if (myTypeChart === 'prices') {
            myModuleView.createChartChangeMarketCap(createArraysForCharts(pricesArr), myCurrency, myId, myNameCoin, myTypeChart);
        } else {
            myModuleView.createChartChangeMarketCap(createArraysForCharts(totalVolumes), myCurrency, myId, myNameCoin, myTypeChart);
        }
    };

    this.parseTopMarketCupData = function(topMarketCupData) {
        const marketCupArr = [];
        const nameCoinsArr = [];

        for (let i = 0; i < topMarketCupData.length; ++i) {
            marketCupArr.push(topMarketCupData[i].market_cap);
            nameCoinsArr.push(topMarketCupData[i].name);
        }

        if (gotDataTopMarketCupData) {
            myModuleView.updateTopMarketChart();
        } else {
            gotDataTopMarketCupData = true;
            myModuleView.createChartTopMarketCup(marketCupArr, nameCoinsArr);
        }
    };

    this.parseStatisticDataForTable = function(data, currency) {
        const dataObj = data[0];

        const dataForTable = {
            currency,
            currentPrice: dataObj.current_price,
            image: dataObj.image,
            name: dataObj.name,
            priceChange24h: dataObj.price_change_24h,
            priceChange24hPercentage: dataObj.price_change_percentage_24h,
            high24h: dataObj.high_24h,
            low24h: dataObj.low_24h,
            marketCapChange24h: dataObj.market_cap_change_24h,
            marketCapChange24hPercentage: dataObj.market_cap_change_percentage_24h,
            lastUpdate: dataObj.last_updated,
            totalVolume: dataObj.total_volume,
            circulatingSupply: dataObj.circulating_supply,
            totalSupply: dataObj.total_supply,
            maxSupply: dataObj.max_supply,
            marketCapRank: dataObj.market_cap_rank
        };

        gotStatisticData = false;
        myModuleView.buildTableForStatisticData(dataForTable);
    };

    this.getLocalDataTableStatistic = function() {
        const parseDataCurrency = JSON.parse(window.sessionStorage.localDataTableStatistic).currency;
        const parseDataId = JSON.parse(window.sessionStorage.localDataTableStatistic).id;
        const parseDataNameCoin = JSON.parse(window.sessionStorage.localDataTableStatistic).name;

        this.getStatisticData(parseDataCurrency, parseDataId, parseDataNameCoin);
    };

    this.toggleTopMarketChart = function(state) {
        myModuleView.updateTopMarketChart(state);
    };

    this.toggleSingUpForm = function() {
        myModuleView.toggleSingUpForm();
    };

    this.toggleLoginForm = function() {
        myModuleView.toggleLoginForm();
    };

    this.submitData = function(inputEmailSingUpValue, inputPasswordSingUpValue, inputUserNameValue) {
        createUserWithEmailAndPassword(auth, inputEmailSingUpValue, inputPasswordSingUpValue)
            .then((userCredential) => {
                const user = userCredential.user;
                window.location.hash = '#about'; // при регистрации перенаправить на about
                set(ref(database, 'users/' + user.uid), {
                    email: inputEmailSingUpValue,
                    password : inputPasswordSingUpValue,
                    name: inputUserNameValue
                })
                .then(() => {
                    myModuleView.clearForm('singUp');
                    myModuleView.toggleSingUpForm();
                });
            })
            .catch((error) => {
                myModuleView.showInvalidMessage('singUp');
                myModuleView.updateDisabledSingUpFormBtn(false);
            });
    };

    this.clearForm = function(nameForm) {
        if (nameForm === 'login') {
            myModuleView.clearForm('login');
        }

        if (nameForm === 'singUp') {
            myModuleView.clearForm('singUp');
        }
    };

    this.login = function(inputEmailLoginValue, inputPasswordLoginValue) {
        signInWithEmailAndPassword(auth, inputEmailLoginValue, inputPasswordLoginValue)
        .then((userCredential) => {
            const user = userCredential.user;
            const lgDate = new Date();
            //обновляем дату последнего входа
            update(ref(database, 'users/' + user.uid), {
                last_login: lgDate,
            })
            .then(() => {
                myModuleView.clearForm('login');
                this.checkAccessRights();
                myModuleView.toggleLoginForm();
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage, 'NO login');
            myModuleView.showInvalidMessage('login');
            myModuleView.updateDisabledLoginFormBtn(false);
        });
    };

    this.singOut = function() {
        signOut(auth).then(() => {
            myModuleView.changeStatus('');
        }).catch((error) => {});
    };

    this.checkDisabledLoginFormBtn = function(inputEmailLoginValue, inputPasswordLoginValue) {
        if (inputEmailLoginValue.length > 5 && inputPasswordLoginValue.length > 6) {
            myModuleView.updateDisabledLoginFormBtn(false);
        } else {
            myModuleView.updateDisabledLoginFormBtn(true);
        }
    };

    this.checkDisabledSingUpFormBtn = function(inputEmailSingUpValue, inputPasswordSingUpValue, inputUserNameValue) {
        if (inputEmailSingUpValue.length > 5 && inputPasswordSingUpValue.length > 6 && inputUserNameValue.length > 2) {
            myModuleView.updateDisabledSingUpFormBtn(false);
        } else {
            myModuleView.updateDisabledSingUpFormBtn(true);
        }
    };

    this.disabledFormSingUpBtn = function(state) {
        if (state) {
            myModuleView.updateDisabledSingUpFormBtn(true);
        } else {
            myModuleView.updateDisabledSingUpFormBtn(false);
        }
    };

    this.disabledFormLoginBtn = function(state) {
        if (state) {
            myModuleView.updateDisabledLoginFormBtn(true);
        } else {
            myModuleView.updateDisabledLoginFormBtn(false);
        }
    };

    this.checkValidLoginPassword = function(inputPasswordLoginValue) {
        myModuleView.updateInvalidPasswordMessageLogin(inputPasswordLoginValue.length);
    };

    this.checkValidSingUpPassword = function(inputPasswordSingUpValue) {
        myModuleView.updateInvalidPasswordMessageSingUp(inputPasswordSingUpValue.length);
    };

    this.soundClick = function() {
        myModuleView.soundClick();
    };
}