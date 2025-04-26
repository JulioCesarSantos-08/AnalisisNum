let grafica;
let funcionCompilada;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('calcular').addEventListener('click', calcularSecante);
    document.getElementById('reiniciar').addEventListener('click', limpiar);
    document.getElementById('modo-oscuro').addEventListener('click', toggleModoOscuro);
});

function compilarFuncion() {
    const formula = document.getElementById('funcion').value;
    try {
        funcionCompilada = math.compile(formula);
    } catch (error) {
        mostrarMensaje("Error en la función. Usa una sintaxis válida.", true);
        throw error;
    }
}

function f(x) {
    try {
        return funcionCompilada.evaluate({ x: x });
    } catch (error) {
        mostrarMensaje("Error al evaluar f(x) en x = " + x, true);
        throw error;
    }
}

function calcularSecante() {
    try {
        compilarFuncion();

        const p0 = parseFloat(document.getElementById('p0').value);
        const p1 = parseFloat(document.getElementById('p1').value);
        const tol = parseFloat(document.getElementById('tol').value);
        const maxIter = parseInt(document.getElementById('maxIter').value);

        if (isNaN(p0) || isNaN(p1) || isNaN(tol) || isNaN(maxIter)) {
            mostrarMensaje("Por favor, ingresa todos los valores correctamente.", true);
            return;
        }

        let tabla = document.querySelector('#resultado tbody');
        tabla.innerHTML = '';

        let n = 0;
        let x0 = p0;
        let x1 = p1;
        let fx0 = f(x0);
        let fx1 = f(x1);

        let iteraciones = [];
        let valoresPn = [];

        while (n < maxIter) {
            const row = tabla.insertRow();
            row.insertCell().textContent = n;
            row.insertCell().textContent = x1.toFixed(6);
            row.insertCell().textContent = fx1.toExponential(3);

            iteraciones.push(n);
            valoresPn.push(x1);

            if (Math.abs(fx1) < tol) {
                break;
            }

            const denominador = fx1 - fx0;
            if (denominador === 0) {
                mostrarMensaje("Error: División por cero.", true);
                return;
            }

            const x2 = x1 - fx1 * (x1 - x0) / denominador;
            x0 = x1;
            fx0 = fx1;
            x1 = x2;
            fx1 = f(x1);
            n++;
        }

        dibujarGrafica(iteraciones, valoresPn, p0, p1);

        if (n === maxIter) {
            mostrarMensaje("Se alcanzó el máximo de iteraciones sin encontrar la raíz.", true);
        } else {
            mostrarMensaje("✅ Raíz aproximada encontrada: " + x1.toFixed(6));
        }
    } catch (error) {
        console.error(error);
    }
}

function dibujarGrafica(labels, pnData, xMin, xMax) {
    const ctx = document.getElementById('grafica').getContext('2d');
    if (grafica) grafica.destroy();

    const puntosFx = [];
    const paso = (xMax - xMin) / 100;
    for (let x = xMin - 1; x <= xMax + 1; x += paso) {
        try {
            puntosFx.push({ x: x, y: f(x) });
        } catch (e) {
            puntosFx.push({ x: x, y: null });
        }
    }

    grafica = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Pn en iteraciones',
                    data: labels.map((label, index) => ({ x: label, y: pnData[index] })),
                    borderColor: 'blue',
                    backgroundColor: 'lightblue',
                    fill: false,
                    tension: 0.2,
                    yAxisID: 'y',
                },
                {
                    label: 'f(x)',
                    data: puntosFx,
                    parsing: false,
                    borderColor: 'red',
                    backgroundColor: 'pink',
                    fill: false,
                    tension: 0.3,
                    yAxisID: 'y',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'x / Iteraciones' }
                },
                y: {
                    title: { display: true, text: 'Valor' }
                }
            }
        }
    });
}

function limpiar() {
    document.getElementById('funcion').value = '';
    document.getElementById('p0').value = '';
    document.getElementById('p1').value = '';
    document.getElementById('tol').value = '';
    document.getElementById('maxIter').value = '';
    document.querySelector('#resultado tbody').innerHTML = '';
    if (grafica) grafica.destroy();
    document.getElementById('mensaje').style.display = 'none';
}

function toggleModoOscuro() {
    document.body.classList.toggle('oscuro');
}

function mostrarMensaje(texto, esError = false) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.className = 'mensaje-resultado';
    if (esError) {
        mensajeDiv.classList.add('error');
    } else {
        mensajeDiv.classList.add('exito');
    }
}