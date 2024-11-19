const url = "https://botafogo-atletas.mange.li/2024-1/";

const pega_json = async (caminho) => {

    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
}

const limparcontainer = () => {
    container.innerHTML = '';
};

let copia_all1 = pega_json(`${url}all`);
let copia_feminino1 = pega_json(`${url}feminino`);
let copia_masculino1 = pega_json(`${url}masculino`);

const manipulaClick = (e) => {
    const id = e.currentTarget.dataset.id
    const url = `detalhes.html?id=${id}`

    document.cookie = `id=${id}`;
    document.cookie = `altura=${e.currentTarget.dataset.altura}`

    localStorage.setItem('id', id);
    localStorage.setItem('dados', JSON.stringify(e.currentTarget.dataset))

    sessionStorage.setItem('dados', JSON.stringify(e.currentTarget.dataset))

    window.location = url;
}

const montacard = (atleta) =>{
    const cartao = document.createElement("article");
    const nome = document.createElement("h1");
    const imagem = document.createElement("img");
    const posicao = document.createElement("p")

    nome.innerHTML = atleta.nome;
    nome.style.fontFamily = 'sans-serif'
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    cartao.appendChild(imagem);

    posicao.innerHTML = atleta.posicao;
    posicao.style.fontFamily = 'sans-serif'
    cartao.appendChild(posicao);

    cartao.onclick = manipulaClick;
    cartao.dataset.id = atleta.id;
    cartao.dataset.njogos = atleta.n_jogos;
    cartao.dataset.altura = atleta.altura;

    return cartao
};

const campo_pesquisa = document.querySelector('#pesquisa');

campo_pesquisa.addEventListener('input', (campo) => {
    const campo_valor = campo.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (sessionStorage.getItem('genero') === 'qualquer') {
        limparcontainer();
        copia_all1.then((r) => r.forEach(
            (ele) => {
                if (ele.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(campo_valor)){
                    container.appendChild(montacard(ele));
                }
            }
        ));
    }
    if (sessionStorage.getItem('genero') === 'masculino') {
        limparcontainer();
        copia_masculino1.then((r) => r.forEach(
            (ele) => {
                if (ele.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(campo_valor)) {
                    container.appendChild(montacard(ele));
                }
            }
        ));
    }
    if (sessionStorage.getItem('genero') === 'feminino') {
        limparcontainer();
        copia_feminino1.then((r) => r.forEach(
            (ele) => {
                if (ele.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(campo_valor)) {
                    container.appendChild(montacard(ele));
                }
            }
        ));
    }
});

const jogadores_masculinos = () => {
    if (sessionStorage.getItem('logado')) {
        limparcontainer();
        sessionStorage.setItem('genero', 'masculino')
        pega_json(`${url}masculino`).then((r) => {
            if (r) {
                r.forEach((ele) => container.appendChild(montacard(ele)));
            }
        });
    } else {
        alert("Você precisa estar logado para acessar esta seção.");
    }
};

const jogadoras_femininos = () => {
    if (sessionStorage.getItem('logado')) {
        limparcontainer();
        sessionStorage.setItem('genero', 'feminino')
        pega_json(`${url}feminino`).then((r) => {
            if (r) {
                r.forEach((ele) => container.appendChild(montacard(ele)));
            }
        });
    } else {
        alert("Você precisa estar logado para acessar esta seção.");
    }
};

const todo = () => {
    if (sessionStorage.getItem('logado')) {
        limparcontainer();
        sessionStorage.setItem('genero', 'qualquer')
        pega_json(`${url}all`).then((r) => {
            if (r) {
                r.forEach((ele) => container.appendChild(montacard(ele)));
            }
        });
    } else {
        alert("Você precisa estar logado para acessar esta seção.");
    }
}

const manipulaBotao = () => {
    const texto = document.getElementById('senha').value;
    if (hex_sha256(texto) === '13a028b3a63fb5b048c75aca2c9fbe501aed65e6a333afc8585d902b3b7eebec') {
        sessionStorage.setItem('logado', 'sim');
        document.getElementById("pagina-login").style.display = "none";
        document.getElementById("pagina-principal").style.display = "block";
    } else {
        alert('Você errou a senha!');
    }
};

const selecionador = document.getElementById('seletor-principal')

selecionador.onchange = () => {
    if(selecionador.value === 'masculino') {
        limparcontainer()
        jogadores_masculinos()
    };

    if(selecionador.value === 'femenino') {
        limparcontainer()
        jogadoras_femininos()
    };

    if (selecionador.value === 'all') {
        limparcontainer()
        todo()
    };
}

document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('logado') === 'sim') {
        document.getElementById("pagina-principal").style.display = "block";
        document.getElementById("pagina-login").style.display = "none";
    } else {
        document.getElementById("pagina-principal").style.display = "none";
        document.getElementById("pagina-login").style.display = "block";
    }
});

document.getElementById('all').onclick = todo;
document.getElementById('feminino').onclick = jogadoras_femininos;
document.getElementById('masculino').onclick = jogadores_masculinos;
document.getElementById('botao').onclick = manipulaBotao;

document.getElementById('logout').onclick = () => {
    sessionStorage.removeItem('logado');
    document.getElementById("pagina-principal").style.display = "none";
    document.getElementById("pagina-login").style.display = "block";
};
