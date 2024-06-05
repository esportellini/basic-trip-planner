document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("cadastro-form");
    const consultaContainer = document.querySelector(".consulta-container");
    const buscaInput = document.getElementById("busca");
    const viagensList = document.getElementById("viagens-list");
    const totalViagensSpan = document.getElementById("totalViagens");

    function salvarDadosViagem(viagem) {
        let viagens = JSON.parse(localStorage.getItem("viagens")) || [];
        viagens.push(viagem);
        localStorage.setItem("viagens", JSON.stringify(viagens));
    }

    function exibirDadosConsulta() {
        viagensList.innerHTML = "";
        let viagens = JSON.parse(localStorage.getItem("viagens")) || [];
        let filtro = buscaInput.value.trim().toLowerCase();
        viagens.forEach(function(viagem, index) {
            if (viagem.destino.toLowerCase().includes(filtro)) {
                const div = document.createElement("div");
                div.classList.add("viagem-item");
                div.innerHTML = `
                    <p><strong>Nome:</strong> ${viagem.nome}</p>
                    <p><strong>Destino:</strong> ${viagem.destino}</p>
                    <p><strong>Data:</strong> ${viagem.data}</p>
                    <p><strong>Motivo:</strong> ${viagem.motivo}</p>
                    <button class="excluir-btn" data-index="${index}">Excluir</button>
                `;
                viagensList.appendChild(div);
            }
        });
        if (viagensList.innerHTML === "") {
            viagensList.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        }
    }

    function exibirDadosTotalizados() {
        let viagens = JSON.parse(localStorage.getItem("viagens")) || [];
        totalViagensSpan.textContent = viagens.length;
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const nome = form.nome.value.trim();
        const destino = form.destino.value.trim();
        const data = form.data.value.trim();
        const motivo = form.motivo.value.trim();
        if (nome && destino && data && motivo) {
            const viagem = { nome, destino, data, motivo };
            salvarDadosViagem(viagem);
            form.reset();
            location.reload();
            exibirDadosConsulta();
            exibirDadosTotalizados();
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    });

    buscaInput.addEventListener("input", exibirDadosConsulta);

    consultaContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("excluir-btn")) {
            const index = event.target.getAttribute("data-index");
            let viagens = JSON.parse(localStorage.getItem("viagens")) || [];
            viagens.splice(index, 1);
            localStorage.setItem("viagens", JSON.stringify(viagens));
            location.reload();
            exibirDadosConsulta();
            exibirDadosTotalizados();
        }
    });

    function getViagens() {
        return JSON.parse(localStorage.getItem("viagens")) || [];
    }

    function contarPessoasPorDestino(viagens) {
        const destinos = {};
        viagens.forEach(viagem => {
            if (viagem.destino in destinos) {
                destinos[viagem.destino] += 1; // Incrementa o número de pessoas para o destino existente
            } else {
                destinos[viagem.destino] = 1; // Inicia o número de pessoas para o novo destino
            }
        });
        return destinos;
    }

    // Função para criar o gráfico de destino
    function criarGrafico(destinos) {
        const labels = Object.keys(destinos); // Nomes dos destinos
        const data = Object.values(destinos); // Número de pessoas para cada destino

        const dadosGrafico = {
            labels: labels,
            datasets: [{
                label: 'Número de Pessoas',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };

        const configGrafico = {
            type: 'bar',
            data: dadosGrafico,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        var ctx = document.getElementById('graficoDestinos').getContext('2d');
        new Chart(ctx, configGrafico);
    }

    const viagens = getViagens();

    const destinos = contarPessoasPorDestino(viagens);

    criarGrafico(destinos);

    exibirDadosConsulta();
    exibirDadosTotalizados();
});
