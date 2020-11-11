
let DomGenerator = {

    cleanDom: function() {

        const container = document.querySelector('.container');
        for(const child of container.children) {
            child.innerHTML = '';
        }
    },

    menu: function(titles) {

        const navContainer =document.querySelector('.nav');

            for(var title of titles) {

                const elt = document.createElement('li');
                elt.textContent = title.replace(/_/g, ' ');
                elt.classList.add(`${title}`);
                navContainer.appendChild(elt);
            }
    },

    form: function(inputs, reference) {

        const formContainer =document.querySelector('.nav');

        const form = document.createElement('form');
        form.classList.add('form');
        form.id = (`${reference}`);

        for(var inputName of inputs) {

            const label = document.createElement('label');
            label.setAttribute("for",inputName);
            label.textContent = inputName;

            const input = document.createElement('input');
            input.type = inputName;
            input.name = inputName;
            input.placeholder = inputName;
            input.classList.add('form-control');

            formContainer.appendChild(form);
            form.appendChild(label);
            label.appendChild(input);
        }
        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = 'submit';
        form.appendChild(button);
    }

}

module.exports = DomGenerator;