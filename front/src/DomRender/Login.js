const Login = {
    render: () => {

        return `
            <img src="assets/img/Logo.png" class="logo">
            <form action="" class="form" id="login">
                <div class="form-label-group">
                <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Votre courriel">
                </div>
            
                <div class="form-label-group">
                <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" name="password"
                        placeholder="Votre mot de passe" autocomplete="on">
        
                </div>
            
                <div class="checkbox mb-3">
                    <label>
                        <input type="checkbox" name="remember" value="remember-me"> Se souvenir de moi
                    </label>
                </div>
                <div>
                <button class="" type="submit">Se connecter</button>
                </div>
            </form>
            <button class="go-back">GO BACK</button>
        `
    }
}

module.exports = Login;