let grafica;

function f(x) {
    const formula = document.getElementById('funcion').value;
    try {
        return eval(formula);
    } catch (error) {
        alert("Error en la función. Usa sintaxis válida de JavaScript, como: Math.sin(x), Math.exp(x), etc.");
        throw error;
    }
}

function calcularSecante() {
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

    // Datos para función f(x)
    const puntosFx = [];
    const paso = (xMax - xMin) / 100;
    for (let x = xMin - 1; x <= xMax + 1; x += paso) {
        try {
            puntosFx.push({ x: x, y: f(x) });
        } catch (e) {
            puntosFx.push({ x: x, y: null }); // En caso de error, dejar el punto en blanco
        }
    }

    grafica = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Pn en cada iteración',
                    data: pnData,
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