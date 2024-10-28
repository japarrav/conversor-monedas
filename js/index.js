async function convertir() {
    const monto = document.getElementById("monto").value;
    const moneda = document.getElementById("moneda").value;
    const resultadoDiv = document.getElementById("resultado");

    if (!monto || monto <= 0) {
        resultadoDiv.innerText = "Por favor, ingrese un monto válido.";
        return;
    }

    try {
        const response = await fetch("https://mindicador.cl/api/");
        if (!response.ok) throw new Error("Error al obtener datos de la API");

        const data = await response.json();
        const valorMoneda = data[moneda].valor;
        const resultado = (monto / valorMoneda).toFixed(2);

        resultadoDiv.innerText = `Resultado: $${resultado}`;

        obtenerHistorial(moneda, data[moneda].nombre);
    } catch (error) {
        resultadoDiv.innerText = `Error: ${error.message}`;
    }
}

async function obtenerHistorial(moneda, nombreMoneda) {
    try {
        const response = await fetch(`https://mindicador.cl/api/${moneda}`);
        if (!response.ok) throw new Error("Error al obtener historial");

        const data = await response.json();
        const ultimosDiezDias = data.serie.slice(0, 10);
        const fechas = ultimosDiezDias.map(d => new Date(d.fecha).toLocaleDateString());
        const valores = ultimosDiezDias.map(d => d.valor);

        renderizarGrafico(fechas, valores, nombreMoneda);
    } catch (error) {
        console.error("Error al obtener historial:", error);
    }
}

function renderizarGrafico(fechas, valores, nombreMoneda) {
    const ctx = document.getElementById("grafico").getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: `Historial últimos 10 días (${nombreMoneda})`,
                data: valores,
                borderColor: '#ff6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor'
                    }
                }
            }
        }
    });
}
