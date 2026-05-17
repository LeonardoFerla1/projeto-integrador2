function criarDashboards(dados) {
    // ========== KPIs ==========
    const totalAtend = dados.length;
    const diasUnicos = new Set(dados.map(r => r.data_atendimento)).size;
    const mediaDia = (totalAtend / diasUnicos).toFixed(1);
    const tempos = dados.map(r => Number(r.tempo_resolucao_min)).filter(t => !isNaN(t));
    const tempoMedio = tempos.reduce((s, t) => s + t, 0) / tempos.length;

    document.getElementById('kpiTotal').textContent = totalAtend;
    document.getElementById('kpiMediaDia').textContent = mediaDia;
    document.getElementById('kpiTempoMedio').textContent = tempoMedio.toFixed(1);

    // ===== Dashboard 1: Linha (atendimentos por dia) =====
    const contagemPorDia = {};
    dados.forEach(row => {
        const dia = row.data_atendimento;
        contagemPorDia[dia] = (contagemPorDia[dia] || 0) + 1;
    });
    const dias = Object.keys(contagemPorDia).sort();
    const quantidades = dias.map(d => contagemPorDia[d]);

    new Chart(document.getElementById('chartLinha'), {
        type: 'line',
        data: {
            labels: dias,
            datasets: [{
                label: 'Atendimentos',
                data: quantidades,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.08)',
                borderWidth: 2.5,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 7,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    cornerRadius: 8,
                    padding: 10,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    title: { display: true, text: 'Quantidade', color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    title: { display: true, text: 'Data', color: '#64748b' },
                    ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 12 }
                }
            }
        }
    });

    // ===== Dashboard 2: Barras (motivos Março) =====
    const dadosMarco = dados.filter(r => r.data_atendimento.startsWith('2026-03'));
    const motivoCount = {};
    dadosMarco.forEach(r => { motivoCount[r.motivo] = (motivoCount[r.motivo] || 0) + 1; });
    const motivosOrdenados = Object.entries(motivoCount).sort((a, b) => b[1] - a[1]);
    const top5 = motivosOrdenados.slice(0, 5);
    const totalOutros = motivosOrdenados.slice(5).reduce((acc, [, q]) => acc + q, 0);
    const labelsBarras = top5.map(([m]) => m);
    const valoresBarras = top5.map(([, q]) => q);
    if (totalOutros > 0) { labelsBarras.push('Outros'); valoresBarras.push(totalOutros); }

    new Chart(document.getElementById('chartBarras'), {
        type: 'bar',
        data: {
            labels: labelsBarras,
            datasets: [{
                label: 'Quantidade',
                data: valoresBarras,
                backgroundColor: ['#f97316','#3b82f6','#10b981','#eab308','#8b5cf6','#94a3b8'],
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    cornerRadius: 8,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    title: { display: true, text: 'Qtd. chamados', color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    ticks: { maxRotation: 25 }
                }
            }
        }
    });

    // ===== Dashboard 3: Histograma (tempo) =====
    const faixas = [
        { label: '0-10 min', min: 0, max: 10 },
        { label: '11-20 min', min: 11, max: 20 },
        { label: '21-30 min', min: 21, max: 30 },
        { label: '31-40 min', min: 31, max: 40 },
        { label: '41-50 min', min: 41, max: 50 },
        { label: '51+ min', min: 51, max: Infinity }
    ];
    const contagemFaixas = faixas.map(f => tempos.filter(t => t >= f.min && t <= f.max).length);

    new Chart(document.getElementById('chartHistograma'), {
        type: 'bar',
        data: {
            labels: faixas.map(f => f.label),
            datasets: [{
                label: 'Chamados',
                data: contagemFaixas,
                backgroundColor: '#6366f1',
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#0f172a', cornerRadius: 8 }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    title: { display: true, text: 'Frequência', color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    title: { display: true, text: 'Faixa (minutos)', color: '#64748b' }
                }
            }
        }
    });

    document.getElementById('mediaTempo').innerHTML =
        `⏱️ Tempo médio de resolução: <strong>${tempoMedio.toFixed(1)} minutos</strong>`;
}

async function carregarDados() {
    const body = document.querySelector('.container');
    try {
        const resposta = await fetch('atendimentos.csv');
        if (!resposta.ok) throw new Error('Arquivo atendimentos.csv não encontrado');
        const texto = await resposta.text();
        const resultado = Papa.parse(texto, { header: true, skipEmptyLines: true, dynamicTyping: true });
        const registros = resultado.data.filter(r => r.data_atendimento && r.tempo_resolucao_min != null);
        if (registros.length === 0) throw new Error('Nenhum registro válido');
        criarDashboards(registros);
    } catch (erro) {
        document.body.innerHTML = `
            <div class="loading-state">
                <h2>❌ Erro ao carregar dados</h2>
                <p style="margin-top:0.5rem;">${erro.message}</p>
                <p style="font-size:0.9rem; color:#94a3b8; margin-top:0.5rem;">
                    Certifique-se de que o arquivo <strong>atendimentos.csv</strong> está na mesma pasta e que você está usando um servidor local (Live Server).
                </p>
            </div>`;
    }
}

carregarDados();