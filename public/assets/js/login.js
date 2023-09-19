var notyf = new Notyf();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function () {
    const button = document.querySelector('#submit')
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const username = document.querySelector('#username').value
        const password = document.querySelector('#password').value

        fetch('/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "username": username, "password": password })
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    notyf.success('Login sucessfull');
                    sleep(2000).then(() => { window.location.href = '/characters' });
                } else if (response.success == false) {
                    notyf.error(response.message);
                }
            })
    });

    const signupButton = document.querySelector('#signupSubmit')
    signupButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const username = document.querySelector('#signupUsername').value
        const password = document.querySelector('#signupPassword').value
        const passwordConf = document.querySelector('#signupPasswordConf').value

        if(username == ''){
            notyf.error('You need to enter a username');
            return
        }

        if(password == ''){
            notyf.error('You need to enter a password');
            return
        }

        if(passwordConf == ''){
            notyf.error('Please enter your password again to confirm');
            return
        }

        if(password !== passwordConf){
            notyf.error('Passwords do not match');
            return
        }

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "username": username, "password": password })
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    notyf.success('Signup sucessfull');
                    sleep(2000).then(() => { window.location.href = '/characters' });
                } else if (response.success == false) {
                    notyf.error(response.message);
                }
            })
    });

    const login = document.querySelector('#login-tab')
    const signup = document.querySelector('#signup-tab')

    const toggles = document.querySelectorAll('#toggle').forEach(item => {
        item.addEventListener('click', event => {
          event.preventDefault();
          login.classList.toggle('d-none')
          signup.classList.toggle('d-none')
        })
    })
    


    
});