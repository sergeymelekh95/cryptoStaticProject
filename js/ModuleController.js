import { routes } from './pages.js';

export function ModuleController() {
    let myModuleContainer = null;
    let myModuleModel = null;
    let checkedId = [];
    let checkedNameCoin = [];
    let currencySelect = null;
    let periodSelect = null;
    let selectPeriodValue = null;
    let inputEmailSingUp = null;
    let inputPasswordSingUp = null;
    let inputEmailLogin = null;
    let inputPasswordLogin = null;
    let inputUserName = null;

    this.init = function(container, model) {
        myModuleContainer = container;
        myModuleModel = model;
        checkedId = window.sessionStorage.localData ? JSON.parse(window.sessionStorage.localData).checkedId : [];

        window.addEventListener("hashchange", this.updateState);
        this.updateState(); //первая отрисовка

        currencySelect = myModuleContainer.querySelector('#currency-select');
        periodSelect = myModuleContainer.querySelector('#period');

        myModuleContainer.addEventListener('change', this.getValue);
        myModuleContainer.addEventListener('click', this.handleClick);
        myModuleContainer.addEventListener('input', this.checkDisabledFormBtn);

        inputEmailSingUp = myModuleContainer.querySelector('#email-singUp');
        inputPasswordSingUp = myModuleContainer.querySelector('#password-singUp');
        inputUserName = myModuleContainer.querySelector('#userName-input');

        inputEmailLogin = myModuleContainer.querySelector('#email-login');
        inputPasswordLogin = myModuleContainer.querySelector('#password-login');
    };

    this.getValue = function(event) {
        if (event.target.id === 'currency-select') {
            myModuleModel.updateCurrency(event.target.value);
            myModuleModel.setLocalData(checkedId, event.target.value);
        }

        if (event.target.classList.contains('table-checkbox')) {
            if (event.target.checked) {
                checkedId.push(event.target.id);
                checkedNameCoin.push(event.target.name);
                
                myModuleModel.addDataChart(checkedId, selectPeriodValue || periodSelect.value, checkedNameCoin);
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

            checkedId = [];
            checkedNameCoin = [];
            myModuleModel.setLocalData(checkedId, currencySelect.value, checkedNameCoin, periodSelect.value);
            //при изменении периода обновляю график и все данные в sessionStorage
            myModuleModel.clearChart();
        }

        if (event.target.id === 'switch-chart') {
            myModuleModel.toggleTopMarketChart(event.target.checked);
        }

        if (event.target.id === 'type-statistic') {
            myModuleModel.updateTypeChart(event.target.value);
        }
    };

    this.updateState = function() {
        const hashPageName = location.hash.slice(1).toLowerCase();
        myModuleModel.updateState(hashPageName);
        
        if (hashPageName === routes.main.id) {
            periodSelect = myModuleContainer.querySelector('#period');
            selectPeriodValue = periodSelect.value;

            currencySelect = myModuleContainer.querySelector('#currency-select');
        }
    };

    this.handleClick = function(event) {
        if (event.target.id === 'next-btn') {
            myModuleModel.showNextCoins();
        }

        if (event.target.id === 'prev-btn') {
            myModuleModel.showPrevCoins();
        }

        if (event.target.id === 'clear-btn') {
            checkedId = [];
            myModuleModel.clearChart();
            myModuleModel.soundClick();
        }

        if (event.target.classList.contains('link_info')) {
            myModuleModel.getStatisticData(currencySelect.value, event.target.getAttribute('data-id'), event.target.getAttribute('data-name'));
        }

        if (event.target.id === 'change-login-form-btn') {
            myModuleModel.toggleSingUpForm();
            myModuleModel.toggleLoginForm();
            myModuleModel.clearForm('login');
        }

        if (event.target.id === 'change-singUp-form-btn') {
            myModuleModel.toggleLoginForm();
            myModuleModel.toggleSingUpForm();
            myModuleModel.clearForm('singUp');
        }

        if (event.target.id === 'singUp-btn') {
            event.preventDefault();
            myModuleModel.disabledFormSingUpBtn(true);
            myModuleModel.submitData(inputEmailSingUp.value, inputPasswordSingUp.value, inputUserName.value);
        }

        if (event.target.id === 'login-btn') {
            event.preventDefault();
            myModuleModel.disabledFormLoginBtn(true);
            myModuleModel.login(inputEmailLogin.value, inputPasswordLogin.value);
        }

        if (event.target.id === 'leave-acc-btn') {
            myModuleModel.singOut();
        }
    };

    this.checkDisabledFormBtn = function(event) {
        if (event.target.id === 'email-login') {
            myModuleModel.checkDisabledLoginFormBtn(inputEmailLogin.value, inputPasswordLogin.value);
        }

        if (event.target.id === 'password-login') {
            myModuleModel.checkDisabledLoginFormBtn(inputEmailLogin.value, inputPasswordLogin.value);
            myModuleModel.checkValidLoginPassword(inputPasswordLogin.value);
        }

        if (event.target.id === 'email-singUp') {
            myModuleModel.checkDisabledSingUpFormBtn(inputEmailSingUp.value, inputPasswordSingUp.value, inputUserName.value);
        }

        if (event.target.id === 'password-singUp') {
            myModuleModel.checkDisabledSingUpFormBtn(inputEmailSingUp.value, inputPasswordSingUp.value, inputUserName.value);
            myModuleModel.checkValidSingUpPassword(inputPasswordSingUp.value);
        }

        if (event.target.id === 'userName-input') {
            myModuleModel.checkDisabledSingUpFormBtn(inputEmailSingUp.value, inputPasswordSingUp.value, inputUserName.value);
        }
    };
}