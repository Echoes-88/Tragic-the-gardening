const Menu = {
    render: (logged) => {

        if(logged === 'logged') {
            return `
            <img src="assets/img/Logo.png" class="logo">
            <nav class="menu">
            <ul>
            <li class="menu-list" set-menu="play"><a href="">PLAY</a></li>
            <li class="menu-list" set-menu="account"><a href="">MON COMPTE</a></li>
            </ul>
        </nav>
        `
        } else {
            return `
            <img src="assets/img/Logo.png" class="logo">
            <nav class="menu">
            <ul>
            <li class="menu-list" set-menu="login"><a href="">LOGIN</a></li>
            <li class="menu-list" set-menu="createAccount"><a href="">CREER UN COMPTE</a></li>
            </ul>
        </nav>
        `
        }
    }
}

module.exports = Menu;