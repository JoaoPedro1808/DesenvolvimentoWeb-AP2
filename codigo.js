const url = "https://botafogo-atletas.mange.li/2024-1/";

const pega_json = async (caminho) => {

    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
}

const limparContainer = () => {
    container.innerHTML = '';
};

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
    const descri = document.createElement("p");

    nome.innerHTML = atleta.nome;
    nome.style.fontFamily = 'sans-serif'
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    cartao.appendChild(imagem);

    descri.innerHTML = atleta.detalhes
    cartao.appendChild(descri);

    cartao.onclick = manipulaClick;
    cartao.dataset.id = atleta.id;
    cartao.dataset.njogos = atleta.n_jogos;
    cartao.dataset.altura = atleta.altura;

    return cartao
};

const jogadores_masculinos = () => {
    if (sessionStorage.getItem('logado')) {
        limparContainer();
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
        limparContainer();
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
        limparContainer();
        pega_json(`${url}all`).then((r) => {
            if (r) {
                r.forEach((ele) => container.appendChild(montacard(ele)));
            }
        });
    } else {
        alert("Você precisa estar logado para acessar esta seção.");
    }
};

const manipulaBotao = () => {
    const texto = document.getElementById('senha').value;
    if (hex_sha256(texto) === '13a028b3a63fb5b048c75aca2c9fbe501aed65e6a333afc8585d902b3b7eebec'){
        sessionStorage.setItem('logado', 'sim')
        document.getElementById("pagina-login").style.display = "none";
        document.getElementById("pagina-principal").style.display = "block";
    }else{
        alert('vc errou a senha!')
    }
};


document.getElementById('all').onclick = todo;
document.getElementById('feminino').onclick = jogadoras_femininos;
document.getElementById('masculino').onclick = jogadores_masculinos;
document.getElementById('botao').onclick = manipulaBotao;
document.getElementById('logout').onclick = () => {sessionStorage.removeItem('logado')
    document.getElementById("pagina-principal").style.display = "none";
    document.getElementById("pagina-login").style.display = "block";
}