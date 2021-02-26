const Form = {
    login: () => {

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
    },

    createAccount: () => {
        
        return `
        <img src="assets/img/Logo.png" class="logo">
        <form action="" class="form" id="createAccount">

          <div class="form-label-group">
            <label for="lastname">Lastname</label>
              <input type="lastname" class="form-control" id="lastname" name="lastname" aria-describedby="lastnameHelp" placeholder="Votre nom" value="">
          </div>

          <div class="form-label-group">
            <label for="firstname">Firstname</label>
              <input type="firstname" class="form-control" id="firstname" name="firstname" aria-describedby="firstnameHelp" placeholder="Votre prénom" value="">
          </div>

          <div class="form-label-group">
            <label for="pseudo">Nickname</label>
              <input type="pseudo" class="form-control" id="pseudo" name="pseudo" aria-describedby="pseudoHelp" placeholder="Votre pseudo" value="">
          </div>

          <div class="form-label-group">
            <label for="email">Email</label>
              <input type="email" class="form-control" id="emailCreate" name="email" aria-describedby="emailHelp" placeholder="Votre courriel" autocomplete="username" value="">
          </div>

          <div class="form-label-group">
            <label for="password">Password</label>
              <input type="password" class="form-control" id="passwordCreate" name="password" placeholder="Votre mot de mot de passe" autocomplete="on">
          </div>

          <div class="form-label-group">
            <label for="passwordConfirm">Confirm password</label>
              <input type="password" class="form-control" id="passwordConfirm" name="passwordConfirm" placeholder="Confirmez votre mot de passe" autocomplete="new-password">
          </div>

              <button type="submit" class="">Submit</button>
      </form>
      <button class="go-back">GO BACK</button>
        `
    }
}

module.exports = Form;