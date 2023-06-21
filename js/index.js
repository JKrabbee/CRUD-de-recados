const formLogin = document.getElementById('form-login')
const formCadastro = document.getElementById('form-cadastro')

formLogin.addEventListener('submit', (event) => {
    event.preventDefault()

    const validateForm = formLogin.checkValidity()

    if (!validateForm) {
        formLogin.classList.add('was-validated')
        return
    }

    formLogin.classList.remove('was-validated')

    const emailLogin = document.getElementById('login-email').value
    const passwordLogin = document.getElementById('login-password').value

    const user = {
        email: emailLogin,
        password: passwordLogin
    }
    
    login(user)
})

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault()

    if(!event.target.checkValidity()) {
        event.target.classList.add('was-validated')
        return
    }

    event.target.classList.remove('was-validated')

    const nome = document.getElementById('cadastro-name').value
    const email = document.getElementById('cadastro-email').value
    const senha = document.getElementById('cadastro-password').value
    const repetirSenha = document.getElementById('cadastro-repetir-password').value

    if (senha != repetirSenha) {
        return alert('Erro na senha!')
    }
    await cadastrarUsuario(nome, email, senha)
})

async function cadastrarUsuario (nome, email, senha) {
    const newUser = {
        nome: nome,
        email: email,
        password: senha
    }

    try {
        const response = await apiConfig.post('/usuarios/cadastrar', newUser)

        console.log(response.data);

        return alert(response.data.mensagem)
    } catch (error) {
        alert(error)
    }
}

async function login(usuario) {
    try {
        const response = await apiConfig.post('/usuarios/login', usuario)

        console.log(response);
        sessionStorage.setItem('token', response.data.dados.token)
        sessionStorage.setItem('email', response.data.dados.email)

        window.location.href = './html/home.html'

        return true
    } catch (error) {
        alert(error.response.data.mensagem);
        return false
    }
}