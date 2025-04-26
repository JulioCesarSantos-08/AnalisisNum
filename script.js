let grafica;

function f(x) {
    const formula = document.getElementById('funcion').value;
    try {
        return eval(formula);
    } catch (error) {
        alert("Error en la función. Usa sintaxis válida de JavaScript como Math.sin(x), Math.exp(x), etc.");
        throw error;
    }
}

function calcularSecante() {
    const p0 = parseFloat(document.getElementById('p0').value);
    const p1 = parseFloat(document.getElementById('p1').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const maxIter = parseInt(document.getElementById('maxIter').value);

    if (isNaN(p0) || isNaN(p1) || isNaN(tol) || isNaN(maxIter)) {
        alert("Por favor completa todos los campos correctamente.");
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
        row.insertCell().textContent = fx1.toFixed(6);

        iteraciones.push(n);
        valoresPn.push(x1);

        if (Math.abs(fx1) < tol) break;

        const denominador = (fx1 - fx0);
        if (denominador === 0) {
            alert("Se encontró una división por cero en el método de la secante. Cálculo detenido.");
            break;
        }

        const x2 = x1 - fx1 * (x1 - x0) / denominador;
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
    const paso = (xMax - xMin) / 100 || 0.1; // Evitar paso cero si xMin = xMax

    for (let x = xMin - 5; x <= xMax + 5; x += paso) {
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
                    data: labels.map((n, i) => ({ x: n, y: pnData[i] })),
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
                    title: { display: true, text: 'Iteraciones / Eje X' }
                },
                y: {
                    title: { display: true, text: 'Valor de Pn o f(x)' }
                }
            }
        }
    });
}

function reiniciarFormulario() {
    document.getElementById('funcion').value = "Math.pow(x, 3) - 2 * x + 2";
    document.getElementById('p0').value = "";
    document.getElementById('p1').value = "";
    document.getElementById('tol').value = "0.000001";
    document.getElementById('maxIter').value = "50";
    document.querySelector('#resultado tbody').innerHTML = "";
    if (grafica) grafica.destroy();
}