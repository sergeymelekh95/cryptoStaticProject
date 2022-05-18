const Header = {
    render: (customClass = "") => {
      return `
        <header id="header" class="header ${customClass}">
            <h1 class="title"></h1>
            <div class="login-btn-container">
                <a id="show-form-singUp-btn" class="show-form-singUp-btn show-form-btn">Sing Up</a>
                <a id="show-form-login-btn" class="show-form-login-btn show-form-btn">Login</a>
            </div>
        </header>
      `;
    }
};
  
const Saidbar = {
    render: (customClass = "") => {
        return `
        <div class="saidbar ${customClass}">
            <div class="logo">
                <a class="logo__link" href="#main">
                    <img src="./img/logo_icons/logo_1.svg" alt="logo">
                    <img src="./img/logo_icons/logo_2.svg" alt="logo">
                </a>
            </div>
            <nav class="mainmenu" id="mainmenu">
                <ul class="mainmenu__list">
                    <li>
                        <a class="mainmenu__link" href="#main"><img src="./img/menu_icons/home_page.svg" alt="home_page_icon"></a>
                    </li>
                    <li>
                        <a class="mainmenu__link" href="#info"><img src="./img/menu_icons/coin_info.svg" alt="coin_info"></a>
                    </li>
                    <li>
                        <a class="mainmenu__link" href="#about"><img src="./img/menu_icons/about_page.svg" alt="about_page_icon"></a>
                    </li>
                </ul>
            </nav>
            <div class="exit">
                <button id="leave-acc-btn" class="leave-acc-btn">
                    <img src="./img/leave_acc.svg" alt="about_page_icon">
                </button>
            </div>
        </div>
        `;
    }
};
  
const Content = {
    render: (customClass = "") => {
        return `<div class="content ${customClass}" id="content"></div>`;
    }
};

const Footer = {
    render: (customClass = "") => {
        return `
        <footer id="footer" class="footer ${customClass}">
            <p>&#169; by Siarhei Melekh</p>
        </footer>`;
    }
};