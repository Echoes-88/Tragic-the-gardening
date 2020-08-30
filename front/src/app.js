const paragraphe = document.getElementById('test');

fetch('http://localhost:2000/deck/init').then(function(response) {
    response.text().then(function(text) {

        var arrayOfObjects = eval(text);

            console.log(arrayOfObjects);



        // paragraphe.textContent = text[0].id
    });
  });