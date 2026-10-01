// ============================================
// PÁGINA DO MOTORISTA
// Visualização da rota otimizada para o motorista
// ============================================

const state = {
    veiculo: null,
    rota: null,
    paradasConcluidas: new Set()
};

// Cores dos veículos
const vehicleColors = {
    1: '#e53935',
    2: '#1e88e5',
    3: '#43a047',
    4: '#fb8c00',
    5: '#8e24aa'
};

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const veiculoId = urlParams.get('veiculo');

    if (!veiculoId) {
        showError('Veículo não especificado. Use o link gerado pelo administrador.');
        return;
    }

    state.veiculo = parseInt(veiculoId);
    loadRota();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('btn-iniciar-navegacao').addEventListener('click', iniciarNavegacao);
}

// ============================================
// CARREGAMENTO DA ROTA
// ============================================
function loadRota() {
    // Tentar carregar do localStorage (dados salvos pela página principal)
    const rotasSalvas = localStorage.getItem('rotas_otimizadas');
    const clientesSalvos = localStorage.getItem('clientes_cadastrados');

    if (rotasSalvas) {
        const rotas = JSON.parse(rotasSalvas);
        state.rotas = rotas;

        const rota = rotas.find(r => r.veiculo === state.veiculo);

        if (rota) {
            state.rota = rota;
            renderRota();
            return;
        }
    }

    // Se não encontrou, mostrar erro
    showError('Rota não encontrada. Solicite o link atualizado ao administrador.');
}

function renderRota() {
    if (!state.rota) return;

    const rota = state.rota;
    const color = vehicleColors[rota.veiculo] || '#333';

    // Atualizar cabeçalho
    document.getElementById('veiculo-titulo').textContent = `Veículo ${rota.veiculo}`;
    document.getElementById('veiculo-info').textContent =
        `${rota.paradas.length} paradas • ${rota.distanciaTotal.toFixed(1)} km • ${formatTime(rota.tempoTotalMinutos)}`;

    // Renderizar lista de paradas
    const container = document.getElementById('lista-paradas');

    if (rota.paradas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <p>Nenhuma entrega programada para este veículo.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = rota.paradas.map((parada, idx) => {
        const isConcluida = state.paradasConcluidas.has(idx);
        const isProxima = idx === getProximaParada();

        return `
            <div class="parada-item ${isConcluida ? 'concluida' : ''} ${isProxima ? 'proxima' : ''}" data-idx="${idx}">
                <div class="parada-header">
                    <div class="parada-numero">${idx + 1}</div>
                    <div class="parada-check ${isConcluida ? 'checked' : ''}" onclick="toggleParada(${idx})">
                        ${isConcluida ? '✓' : ''}
                    </div>
                </div>
                <div class="parada-nome">${parada.nome}</div>
                <div class="parada-endereco">${parada.endereco} - ${parada.bairro}</div>
                <span class="parada-janela">Janela: ${parada.janelaInicio} - ${parada.janelaFim}</span>
                <div class="parada-acoes">
                    <button class="btn-acao btn-mapa" onclick="abrirMapa(${idx})">
                        Ver no Mapa
                    </button>
                    <button class="btn-acao btn-ligar" onclick="ligarCliente('${parada.telefone || ''}')">
                        Ligar
                    </button>
                </div>
            </div>
        `;
    }).join('');

    updateProgresso();
}

// ============================================
// INTERAÇÕES
// ============================================
function toggleParada(idx) {
    if (state.paradasConcluidas.has(idx)) {
        state.paradasConcluidas.delete(idx);
    } else {
        state.paradasConcluidas.add(idx);
    }

    saveProgresso();
    renderRota();
}

function getProximaParada() {
    for (let i = 0; i < state.rota.paradas.length; i++) {
        if (!state.paradasConcluidas.has(i)) {
            return i;
        }
    }
    return -1;
}

function updateProgresso() {
    const total = state.rota.paradas.length;
    const concluidas = state.paradasConcluidas.size;
    const percentual = total > 0 ? (concluidas / total) * 100 : 0;

    document.getElementById('progresso-fill').style.width = `${percentual}%`;
    document.getElementById('progresso-texto').textContent =
        `${concluidas} de ${total} entregas concluídas`;

    // Habilitar botão de navegação se houver próxima parada
    const btnNav = document.getElementById('btn-iniciar-navegacao');
    const proxima = getProximaParada();
    btnNav.disabled = proxima === -1;

    if (proxima !== -1) {
        btnNav.textContent = `Iniciar Navegação → ${state.rota.paradas[proxima].nome}`;
    } else {
        btnNav.textContent = 'Todas as entregas concluídas!';
    }
}

function abrirMapa(idx) {
    const parada = state.rota.paradas[idx];
    const endereco = encodeURIComponent(`${parada.endereco}, ${parada.bairro}, São Paulo, SP`);

    // Tentar abrir no Google Maps
    const url = `https://www.google.com/maps/search/?api=1&query=${endereco}`;
    window.open(url, '_blank');
}

function ligarCliente(telefone) {
    if (telefone) {
        window.location.href = `tel:${telefone}`;
    } else {
        alert('Telefone não cadastrado para este cliente.');
    }
}

function iniciarNavegacao() {
    const proxima = getProximaParada();
    if (proxima === -1) return;

    const parada = state.rota.paradas[proxima];
    const endereco = encodeURIComponent(`${parada.endereco}, ${parada.bairro}, São Paulo, SP`);

    // Abrir no Google Maps com navegação
    const url = `https://www.google.com/maps/dir/?api=1&destination=${endereco}&travelmode=driving`;
    window.open(url, '_blank');
}

// ============================================
// PERSISTÊNCIA
// ============================================
function saveProgresso() {
    const key = `progresso_veiculo_${state.veiculo}`;
    localStorage.setItem(key, JSON.stringify([...state.paradasConcluidas]));
}

function loadProgresso() {
    const key = `progresso_veiculo_${state.veiculo}`;
    const salvo = localStorage.getItem(key);
    if (salvo) {
        state.paradasConcluidas = new Set(JSON.parse(salvo));
    }
}

// ============================================
// UTILITÁRIOS
// ============================================
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
        return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
}

function showError(msg) {
    document.getElementById('lista-paradas').innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <p>${msg}</p>
        </div>
    `;
}

// Carregar progresso ao iniciar
loadProgresso();
