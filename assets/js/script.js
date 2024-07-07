let grafica = null;
let dataMiIndicador = async function cargarMiIndicador() {
    try {
        const response = await fetch("https://mindicador.cl/api/");
        return (miIndicadorDatos = await response.json());
    } catch (error) {
        return error;
    }
};

let timeSeries = async function cargarTimeSerie(monedaConvertir) {
    try {
        anioActual = new Date().getFullYear();
        const response = await fetch(
            `https://mindicador.cl/api/${monedaConvertir}/${anioActual}`
        );
        return await response.json();
    } catch (error) {
        return error;
    }
};

function generarGrafico(respuestaTimeSerie) {
    const ctx = document.getElementById("graficaHistorial");
    const ultimos10Dias = respuestaTimeSerie.serie.slice(0, 10).reverse();
    let labels = ultimos10Dias.map((item) => {
        const fecha = new Date(item.fecha);
        return `${fecha.getDate()}/${
            fecha.getMonth() + 1
        }/${fecha.getFullYear()}`;
    });
    let valores = ultimos10Dias.map((item) => item.valor);
    let valorMaximo = Math.max(...valores);
    let valorMinimo = Math.min(...valores);

    if (grafica != null) {
        grafica.destroy();
    }
    grafica = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Historial ultimos 10 días",
                    data: valores,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    suggestedMax: valorMaximo * 0.5,
                    suggestedMin: valorMinimo,
                    ticks: {
                        stepSize: 10,
                    },
                },
            },
        },
    });
}

async function convertir() {
    let datos = await dataMiIndicador();
    let valorCLP = document.getElementById("pesos").value;
    let monedaConvertir = document.getElementById("selectConversion").value;
    let respuestaTimeSerie = await timeSeries(monedaConvertir);
    let moneda = datos[monedaConvertir].valor;
    let resultado = (valorCLP / moneda).toFixed(2);
    document.getElementById("resultado").innerHTML = resultado;
    generarGrafico(respuestaTimeSerie);
}
