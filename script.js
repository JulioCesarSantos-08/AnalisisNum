let grafica;

function f(x) {
    return Math.cos(x) - x;
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

    dibujarGrafica(iteraciones, valoresPn);
}

function dibujarGrafica(labels, data) {
    const ctx = document.getElementById('grafica').getContext('2d');
    if (grafica) grafica.destroy(); // Destruir gráfica anterior

    grafica = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pn en cada iteración',
                data: data,
                borderColor: 'blue',
                backgroundColor: 'lightblue',
                fill: false,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Iteraciones'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor de Pn'
                    }
                }
            }
        }
    });
}