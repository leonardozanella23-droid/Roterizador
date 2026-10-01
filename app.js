// ============================================
// ROTERIZADOR - TRANSPORTADORA SP
// Aplicação de otimização de rotas
// ============================================

// Estado global da aplicação
const state = {
    clientes: [],
    rotas: [],
    map: null,
    markers: [],
    routeLines: [],
    depotMarker: null,
    clickMode: false,
    depot: { lat: -23.4399, lng: -46.4993, name: 'Rua Estrela do Oeste, 124 - Vila Barros' }
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
    initMap();
    loadSampleData();
    renderClientes();
    renderResumo();
    setupEventListeners();
});

function initMap() {
    state.map = L.map('map').setView([state.depot.lat, state.depot.lng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(state.map);

    // Marcador do depósito
    updateDepot(state.depot.lat, state.depot.lng, state.depot.name);

    // Evento de clique no mapa para definir ponto de partida
    state.map.on('click', (e) => {
        if (state.clickMode) {
            updateDepot(e.latlng.lat, e.latlng.lng, 'Ponto personalizado');
            toggleClickMode(); // Desativar modo clique após definir
        }
    });
}

function setupEventListeners() {
    document.getElementById('form-cliente').addEventListener('submit', handleAddCliente);
    document.getElementById('form-deposito').addEventListener('submit', handleUpdateDepot);
    document.getElementById('btn-click-map').addEventListener('click', toggleClickMode);
    document.getElementById('btn-optimize').addEventListener('click', optimizeRoutes);
    document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
    document.getElementById('btn-export-json').addEventListener('click', exportJSON);
    document.getElementById('filtro-veiculo').addEventListener('change', renderClientes);
}

// ============================================
// DADOS DE EXEMPLO - SP Capital
// ============================================
function loadSampleData() {
    const sampleClientes = [
        { id: 1, nome: 'Mercado Bom Preço', endereco: 'Rua Augusta, 1500', bairro: 'Consolação', lat: -23.5535, lng: -46.6545, janelaInicio: '08:00', janelaFim: '12:00', veiculo: 1 },
        { id: 2, nome: 'Padaria Estrela', endereco: 'Av. Paulista, 1000', bairro: 'Bela Vista', lat: -23.5615, lng: -46.6555, janelaInicio: '09:00', janelaFim: '14:00', veiculo: 1 },
        { id: 3, nome: 'Restaurante Sabor & Arte', endereco: 'Rua Oscar Freire, 500', bairro: 'Jardins', lat: -23.5625, lng: -46.6725, janelaInicio: '10:00', janelaFim: '16:00', veiculo: 1 },
        { id: 4, nome: 'Farmácia Saúde', endereco: 'Rua Haddock Lobo, 200', bairro: 'Cerqueira César', lat: -23.5575, lng: -46.6685, janelaInicio: '08:00', janelaFim: '18:00', veiculo: 2 },
        { id: 5, nome: 'Supermercado União', endereco: 'Av. Rebouças, 2000', bairro: 'Pinheiros', lat: -23.5675, lng: -46.6935, janelaInicio: '09:00', janelaFim: '15:00', veiculo: 2 },
        { id: 6, nome: 'Loja de Roupas Moda', endereco: 'Rua Frei Caneca, 300', bairro: 'Bela Vista', lat: -23.5545, lng: -46.6525, janelaInicio: '10:00', janelaFim: '17:00', veiculo: 2 },
        { id: 7, nome: 'Papelaria Central', endereco: 'Av. Angélica, 800', bairro: 'Consolação', lat: -23.5465, lng: -46.6505, janelaInicio: '08:00', janelaFim: '13:00', veiculo: 3 },
        { id: 8, nome: 'Café Aroma', endereco: 'Rua Bela Cintra, 1200', bairro: 'Jardins', lat: -23.5595, lng: -46.6655, janelaInicio: '11:00', janelaFim: '18:00', veiculo: 3 },
        { id: 9, nome: 'Livraria Cultura', endereco: 'Av. Paulista, 2000', bairro: 'Bela Vista', lat: -23.5585, lng: -46.6405, janelaInicio: '09:00', janelaFim: '16:00', veiculo: 3 },
        { id: 10, nome: 'Bar do Zé', endereco: 'Rua Fidalga, 150', bairro: 'Vila Madalena', lat: -23.5465, lng: -46.6905, janelaInicio: '14:00', janelaFim: '20:00', veiculo: 4 },
        { id: 11, nome: 'Mercadinho Bairro', endereco: 'Rua Harmonia, 400', bairro: 'Sumaré', lat: -23.5445, lng: -46.6775, janelaInicio: '08:00', janelaFim: '12:00', veiculo: 4 },
        { id: 12, nome: 'Restaurante do Bairro', endereco: 'Rua dos Pinheiros, 600', bairro: 'Pinheiros', lat: -23.5645, lng: -46.6825, janelaInicio: '10:00', janelaFim: '15:00', veiculo: 4 },
        { id: 13, nome: 'Loja de Eletrônicos', endereco: 'Av. Eusébio Matoso, 800', bairro: 'Pinheiros', lat: -23.5715, lng: -46.6985, janelaInicio: '09:00', janelaFim: '17:00', veiculo: 5 },
        { id: 14, nome: 'Floricultura Primavera', endereco: 'Rua Teodoro Sampaio, 500', bairro: 'Pinheiros', lat: -23.5635, lng: -46.6855, janelaInicio: '08:00', janelaFim: '14:00', veiculo: 5 },
        { id: 15, nome: 'Pet Shop Amigo', endereco: 'Rua dos Pinheiros, 900', bairro: 'Pinheiros', lat: -23.5665, lng: -46.6885, janelaInicio: '10:00', janelaFim: '18:00', veiculo: 5 }
    ];

    state.clientes = sampleClientes;
    renderMapWithRoutes();
}

// ============================================
// PONTO DE PARTIDA
// ============================================
async function handleUpdateDepot(e) {
    e.preventDefault();

    const endereco = document.getElementById('deposito-endereco').value;

    if (!endereco) {
        alert('Digite um endereço para o ponto de partida.');
        return;
    }

    const coords = await geocodeAddress(endereco + ', São Paulo, SP');

    if (!coords) {
        alert('Não foi possível encontrar o endereço. Verifique e tente novamente.');
        return;
    }

    updateDepot(coords.lat, coords.lng, endereco);
}

function toggleClickMode() {
    state.clickMode = !state.clickMode;
    const btn = document.getElementById('btn-click-map');

    if (state.clickMode) {
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-secondary');
        btn.textContent = 'Clique no mapa... (ativo)';
        state.map.getContainer().style.cursor = 'crosshair';
    } else {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
        btn.textContent = 'Clique no mapa para definir';
        state.map.getContainer().style.cursor = '';
    }
}

function updateDepot(lat, lng, nome) {
    state.depot = { lat, lng, name: nome || 'Depósito Personalizado' };

    // Atualizar coordenadas na tela
    document.getElementById('deposito-coords').textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    // Atualizar ou criar marcador do depósito
    if (state.depotMarker) {
        state.map.removeLayer(state.depotMarker);
    }

    state.depotMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'depot-marker',
            html: '<div style="background:#1a237e;color:white;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">DEPÓSITO</div>',
            iconSize: [80, 30],
            iconAnchor: [40, 15]
        })
    }).addTo(state.map);

    state.depotMarker.bindPopup(`<b>${state.depot.name}</b><br>Ponto de partida das rotas`);

    // Redesenhar rotas se já estiverem otimizadas
    if (state.rotas.length > 0) {
        renderMapWithRoutes();
    }
}

// ============================================
// GERENCIAMENTO DE CLIENTES
// ============================================
async function handleAddCliente(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const endereco = document.getElementById('endereco').value;
    const bairro = document.getElementById('bairro').value;
    const janelaInicio = document.getElementById('janela-inicio').value;
    const janelaFim = document.getElementById('janela-fim').value;
    const veiculo = parseInt(document.getElementById('veiculo').value);

    // Geocodificar endereço
    const coords = await geocodeAddress(endereco + ', ' + bairro + ', São Paulo, SP');

    if (!coords) {
        alert('Não foi possível encontrar o endereço. Verifique e tente novamente.');
        return;
    }

    const novoCliente = {
        id: Date.now(),
        nome,
        endereco,
        bairro,
        lat: coords.lat,
        lng: coords.lng,
        janelaInicio,
        janelaFim,
        veiculo
    };

    state.clientes.push(novoCliente);
    renderClientes();
    renderMapWithRoutes();
    renderResumo();

    // Limpar formulário
    document.getElementById('form-cliente').reset();
    document.getElementById('janela-inicio').value = '08:00';
    document.getElementById('janela-fim').value = '18:00';
}

async function geocodeAddress(address) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=br`);
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Erro na geocodificação:', error);
        return null;
    }
}

function deleteCliente(id) {
    if (!confirm('Deseja realmente excluir este cliente?')) return;

    state.clientes = state.clientes.filter(c => c.id !== id);
    renderClientes();
    renderMapWithRoutes();
    renderResumo();
}

function renderClientes() {
    const container = document.getElementById('lista-clientes');
    const filtro = document.getElementById('filtro-veiculo').value;

    let clientesFiltrados = state.clientes;
    if (filtro !== 'todos') {
        clientesFiltrados = state.clientes.filter(c => c.veiculo === parseInt(filtro));
    }

    if (clientesFiltrados.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum cliente cadastrado</div>';
        return;
    }

    container.innerHTML = clientesFiltrados.map(c => `
        <div class="cliente-item">
            <div class="cliente-info">
                <div class="cliente-nome">${c.nome}</div>
                <div class="cliente-endereco">${c.endereco} - ${c.bairro}</div>
                <span class="cliente-veiculo veiculo-${c.veiculo}">Veículo ${c.veiculo}</span>
            </div>
            <button class="btn btn-danger btn-small" onclick="deleteCliente(${c.id})">Excluir</button>
        </div>
    `).join('');
}

// ============================================
// OTIMIZAÇÃO DE ROTAS
// ============================================
async function optimizeRoutes() {
    if (state.clientes.length === 0) {
        alert('Cadastre clientes antes de otimizar as rotas.');
        return;
    }

    // Agrupar clientes por veículo
    const veiculos = {};
    state.clientes.forEach(c => {
        if (!veiculos[c.veiculo]) veiculos[c.veiculo] = [];
        veiculos[c.veiculo].push(c);
    });

    state.rotas = [];

    for (const veiculoId of Object.keys(veiculos)) {
        const clientesVeiculo = veiculos[veiculoId];
        const rotaOtimizada = optimizeSingleRoute(clientesVeiculo);
        const distanciaTotal = calculateRouteDistance(rotaOtimizada);

        // Calcular tempo estimado (velocidade média 25 km/h + 15 min por parada)
        const tempoDirigindo = (distanciaTotal / 25) * 60; // minutos
        const tempoParadas = rotaOtimizada.length * 15; // 15 min por entrega
        const tempoTotalMinutos = tempoDirigindo + tempoParadas;

        state.rotas.push({
            veiculo: parseInt(veiculoId),
            paradas: rotaOtimizada,
            distanciaTotal: distanciaTotal,
            tempoTotalMinutos: tempoTotalMinutos,
            tempoDirigindo: tempoDirigindo,
            tempoParadas: tempoParadas
        });
    }

    await renderMapWithRoutes();
    renderResumo();

    // Salvar dados para acesso dos motoristas
    localStorage.setItem('rotas_otimizadas', JSON.stringify(state.rotas));
    localStorage.setItem('clientes_cadastrados', JSON.stringify(state.clientes));
}

function optimizeSingleRoute(clientes) {
    if (clientes.length <= 2) return clientes;

    // Nearest Neighbor para criar rota inicial
    let rota = nearestNeighbor(clientes);

    // 2-opt para melhorar
    rota = twoOpt(rota);

    return rota;
}

function nearestNeighbor(clientes) {
    const naoVisitados = [...clientes];
    const rota = [];

    // Começar do depósito (ponto mais próximo do centro)
    let atual = {
        lat: state.depot.lat,
        lng: state.depot.lng
    };

    while (naoVisitados.length > 0) {
        let menorDist = Infinity;
        let idxMaisProximo = 0;

        for (let i = 0; i < naoVisitados.length; i++) {
            const dist = haversine(atual.lat, atual.lng, naoVisitados[i].lat, naoVisitados[i].lng);
            if (dist < menorDist) {
                menorDist = dist;
                idxMaisProximo = i;
            }
        }

        atual = naoVisitados.splice(idxMaisProximo, 1)[0];
        rota.push(atual);
    }

    return rota;
}

function twoOpt(rota) {
    let melhoria = true;
    let iteracoes = 0;
    const maxIteracoes = 100;

    while (melhoria && iteracoes < maxIteracoes) {
        melhoria = false;
        iteracoes++;

        for (let i = 0; i < rota.length - 1; i++) {
            for (let j = i + 1; j < rota.length; j++) {
                const distAtual = getRouteDistance(rota, i, j);
                const novaRota = twoOptSwap(rota, i, j);
                const distNova = getRouteDistance(novaRota, i, j);

                if (distNova < distAtual) {
                    rota = novaRota;
                    melhoria = true;
                }
            }
        }
    }

    return rota;
}

function twoOptSwap(rota, i, j) {
    const novaRota = rota.slice(0, i);
    const meio = rota.slice(i, j + 1).reverse();
    const fim = rota.slice(j + 1);
    return [...novaRota, ...meio, ...fim];
}

function getRouteDistance(rota, start, end) {
    let dist = 0;
    const pontos = [state.depot, ...rota, state.depot];

    for (let i = 0; i < pontos.length - 1; i++) {
        dist += haversine(pontos[i].lat, pontos[i].lng, pontos[i + 1].lat, pontos[i + 1].lng);
    }
    return dist;
}

function calculateRouteDistance(rota) {
    let dist = 0;
    const pontos = [state.depot, ...rota, state.depot];

    for (let i = 0; i < pontos.length - 1; i++) {
        dist += haversine(pontos[i].lat, pontos[i].lng, pontos[i + 1].lat, pontos[i + 1].lng);
    }

    return dist;
}

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

// ============================================
// VISUALIZAÇÃO NO MAPA
// ============================================
async function renderMapWithRoutes() {
    // Limpar marcadores e linhas existentes
    state.markers.forEach(m => state.map.removeLayer(m));
    state.routeLines.forEach(l => state.map.removeLayer(l));
    state.markers = [];
    state.routeLines = [];

    for (const rota of state.rotas) {
        const color = vehicleColors[rota.veiculo] || '#333';

        // Construir lista de coordenadas: depósito -> paradas -> depósito
        const pontos = [
            [state.depot.lng, state.depot.lat],
            ...rota.paradas.map(p => [p.lng, p.lat]),
            [state.depot.lng, state.depot.lat]
        ];

        // Obter rota real pelas ruas usando OSRM
        const routeCoords = await getOSRMRoute(pontos);

        if (routeCoords) {
            // Desenhar linha da rota pelas ruas
            const line = L.polyline(routeCoords, {
                color: color,
                weight: 4,
                opacity: 0.8
            }).addTo(state.map);
            state.routeLines.push(line);
        }

        // Marcadores das paradas
        rota.paradas.forEach((p, idx) => {
            const marker = L.circleMarker([p.lat, p.lng], {
                radius: 8,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            }).addTo(state.map);

            marker.bindPopup(`
                <b>${idx + 1}. ${p.nome}</b><br>
                ${p.endereco}<br>
                ${p.bairro}<br>
                <small>Veículo ${rota.veiculo}</small>
            `);

            state.markers.push(marker);
        });
    }

    // Ajustar zoom
    if (state.markers.length > 0) {
        const group = L.featureGroup(state.markers);
        state.map.fitBounds(group.getBounds().pad(0.1));
    }
}

async function getOSRMRoute(points) {
    if (points.length < 2) return null;

    const coordsStr = points.map(p => `${p[0]},${p[1]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            // Converter de [lng, lat] para [lat, lng] (formato Leaflet)
            return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        }
        return null;
    } catch (error) {
        console.error('Erro ao obter rota OSRM:', error);
        return null;
    }
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
        return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
}

// ============================================
// RESUMO DAS ROTAS
// ============================================
function renderResumo() {
    const container = document.getElementById('resumo-rotas');

    if (state.rotas.length === 0) {
        // Mostrar contagem por veículo sem otimização
        const veiculos = {};
        state.clientes.forEach(c => {
            if (!veiculos[c.veiculo]) veiculos[c.veiculo] = 0;
            veiculos[c.veiculo]++;
        });

        const veiculosHtml = Object.keys(veiculos).map(v => `
            <div class="resumo-veiculo" style="border-left-color: ${vehicleColors[v]}">
                <h3 style="color: ${vehicleColors[v]}">Veículo ${v}</h3>
                <p>${veiculos[v]} paradas</p>
            </div>
        `).join('');

        container.innerHTML = veiculosHtml || '<div class="empty-state">Nenhuma rota cadastrada</div>';
        return;
    }

    container.innerHTML = state.rotas.map(rota => `
        <div class="resumo-veiculo" style="border-left-color: ${vehicleColors[rota.veiculo]}">
            <h3 style="color: ${vehicleColors[rota.veiculo]}">Veículo ${rota.veiculo}</h3>
            <p>${rota.paradas.length} paradas | Distância: ${rota.distanciaTotal.toFixed(1)} km</p>
            <p><strong>Tempo estimado: ${formatTime(rota.tempoTotalMinutos)}</strong></p>
            <p style="font-size: 0.75rem;">(${formatTime(rota.tempoDirigindo)} dirigindo + ${formatTime(rota.tempoParadas)} em paradas)</p>
            <button class="btn btn-primary btn-small" style="margin-top: 8px;" onclick="abrirPaginaMotorista(${rota.veiculo})">
                Abrir Página do Motorista
            </button>
        </div>
    `).join('');
}

// ============================================
// PÁGINA DO MOTORISTA
// ============================================
function abrirPaginaMotorista(veiculo) {
    const url = `motorista.html?veiculo=${veiculo}`;
    const novaJanela = window.open(url, '_blank');

    // Se o navegador bloquear, abrir na mesma aba
    if (!novaJanela || novaJanela.closed || typeof novaJanela.closed === 'undefined') {
        window.location.href = url;
    }
}

// ============================================
// EXPORTAÇÃO
// ============================================
function exportCSV() {
    if (state.clientes.length === 0) {
        alert('Nenhum cliente para exportar.');
        return;
    }

    let csv = 'Cliente,Endereço,Bairro,Latitude,Longitude,Janela Início,Janela Fim,Veículo\n';

    state.clientes.forEach(c => {
        csv += `"${c.nome}","${c.endereco}","${c.bairro}",${c.lat},${c.lng},${c.janelaInicio},${c.janelaFim},${c.veiculo}\n`;
    });

    downloadFile(csv, 'rotas_clientes.csv', 'text/csv');
}

function exportJSON() {
    if (state.clientes.length === 0) {
        alert('Nenhum cliente para exportar.');
        return;
    }

    const data = {
        data: new Date().toISOString(),
        totalClientes: state.clientes.length,
        rotas: state.rotas.length > 0 ? state.rotas : null,
        clientes: state.clientes
    };

    downloadFile(JSON.stringify(data, null, 2), 'rotas_clientes.json', 'application/json');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
