# all-in-one-app
Dossiers &amp; fichiers de base pour nouveau projet

# INITIATILISATION

> Créer le repo sur github

`git init`

 `git add .`
 
 `git commit -m "premier commit"`

 `git remote add origin https://github.com/octocat/Spoon-Knife`
 
 `git push origin master`

 `npm init`

`npm i express ejs pg dotenv express-session`


# CONFIGURATION DE PACKAGE JSON

Ajouter :
```
"main": "app/server.js",
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app/server.js", 
    "dev": "nodemon app/server.js"
  },
 ```
