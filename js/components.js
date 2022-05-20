const Header = {
    render: (customClass = "") => {
      return `
        <header id="header" class="header ${customClass}">
            <h1 class="title"></h1>
            <div class="login-btn-container">
                <p id="userEmail" class="userEmail"></p>
            </div>
            <div id="form-overlay-singUp" class="form-overlay form_closed">
                <form action="#" id="form-singUp" class="form form-singUp">
                    <p class="form-title">Sing Up</p>
                    <label for="userName-input">Name</label>
                    <br />
                    <input type="text" name="name-singUp" class="userName-input" id="userName-input">
                    <label for="email-singUp">Email</label>
                    <br />
                    <input type="email" name="email-singUp" class="email" id="email-singUp">
                    <br />
                    <label for="password-singUp">Password</label>
                    <br />
                    <input type="password" name="password-singUp" id="password-singUp" class="password-form">
                    <div class="text-form">
                        <p id="invalid-message-singUp" class="invalid-message"></p>
                        <p>Already have an account?
                            <a id="change-login-form-btn" class="login-form-link">Login</a>
                        </p>
                    </div>
                    <button id="singUp-btn" disabled="true" class="form-btn singUp-btn">Sing Up</button>
                </form>
            </div>
            <div id="form-overlay-login" class="form-overlay form_closed">
                <form action="#" id="form-login" class="form form-login">
                    <p class="form-title">Login</p>
                    <label for="email-login">Email</label>
                    <br />
                    <input type="email" name="email-login" class="email" id="email-login">
                    <br />
                    <label for="password-login">Password</label>
                    <br />
                    <input type="password" name="password-login" id="password-login" class="password-form">
                    <div class="text-form">
                        <p id="invalid-message-login" class="invalid-message"></p>
                        <p>Don't have an account?
                            <a id="change-singUp-form-btn" class="login-form-link">Sign up</a>
                        </p>
                    </div>
                    <button id="login-btn" disabled="true" class="form-btn login-btn">Login</button>
                </form>
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
                <button id="leave-acc-btn" class="leave-acc-btn"></button>
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
            <p>&#169; Siarhei Melekh</p>
        </footer>`;
    }
};