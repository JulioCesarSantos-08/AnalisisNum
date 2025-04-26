let grafica;
let funcionCompilada;

function compilarFuncion() {
    const formula = document.getElementById('funcion').value;
    try {
        funcionCompilada = math.compile(formula);
    } catch (error) {
        alert("Error en la función. Usa una sintaxis válida como: x^2 - 2x + 1, sin(x), exp(x), etc.");
        throw error;
    }
}

function f(x) {
    try {
        return funcionCompilada.evaluate({ x: x });
    } catch (error) {
        alert("Error al evaluar la función en x = " + x);
        throw error;
    }
}

function calcularSecante() {
    compilarFuncion(); // Compilamos cada vez que se calcule para actualizar cambios en la fórmula

    const p0 = parseFloat(document.getElementById('p0').value);
    const p1 = parseFloat(document.getElementById('p1').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const maxIter = parseInt(document.getElementById('maxIter').value);

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
        row.insertCell().textContent = fx1.toFixed(6);

        iteraciones.push(n);
        valoresPn.push(x1);

        if (Math.abs(fx1) < tol) break;

        const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
        x0 = x1;
        fx0 = fx1;
        x1 = x2;
        fx1 = f(x1);
        n++;
    }

    dibujarGrafica(iteraciones, valoresPn, p0, p1);
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
                    label: 'Pn en cada iteración',
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