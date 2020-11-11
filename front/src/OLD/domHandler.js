const ServerRequest = require('./serverRequest');

let DomHandler = {

    add: function(parent, children, type, reference) {

        // Cleaning dom
        const container = document.querySelector('.container');
        for(const child of container.children) {
            child.innerHTML = '';
        }

        // Creating dom element
        const parentElt =document.querySelector(`${parent}`);
        
        // Menu
        if(type === 'li') {
            for(var child of children) {

                const childElt = document.createElement(type);
                childElt.textContent = child.replace(/_/g, ' ');
                childElt.classList.add(`${child}`);
                parentElt.appendChild(childElt);
            }
        }
        // Forms
        if(type === 'input') {

            const form = document.createElement('form');
            form.classList.add('form');
            form.id = (`${reference}`);

            for(var child of children) {

                const label = document.createElement('label');
                label.setAttribute("for",child);
                label.textContent = child;

                const childElt = document.createElement(type);
                childElt.type = child;
                childElt.name = child;
                childElt.placeholder = child;
                childElt.classList.add('form-control');

                parentElt.appendChild(form);
                form.appendChild(label);
                label.appendChild(childElt);
            }
            const button = document.createElement('button');
            button.type = 'submit';
            button.textContent = 'submit';
            form.appendChild(button);

        }
    },
}

module.exports = DomHandler;