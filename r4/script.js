document.addEventListener('DOMContentLoaded', () => {
  const pantalla = document.getElementById('pantalla');
  const lineaOp = document.getElementById('linea-operacion');
  const botonesNumero = document.querySelectorAll('.numero');
  const botonesOperacion = document.querySelectorAll('.operacion');
  const botonIgual = document.getElementById('igual');
  const botonLimpiar = document.getElementById('limpiar');
  const botonCambiarSigno = document.getElementById('cambiar-signo');
  const botonPorcentaje = document.getElementById('porcentaje');

  let actual = '';
  let previo = '';
  let operacion = null;

  const mostrarPantalla = (texto) => {
    pantalla.textContent = texto === '' ? '0' : String(texto);
  };

  const mostrarLineaOperacion = () => {
    if (previo !== '' && operacion) {
      lineaOp.textContent = `${previo} ${operacion}`;
    } else {
      lineaOp.textContent = '';
    }
  };

  const limpiarTodo = () => {
    actual = '';
    previo = '';
    operacion = null;
    mostrarPantalla('0');
    mostrarLineaOperacion();
  };

  const safeParse = (s) => {
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : NaN;
  };

  const calcular = (aStr, bStr, op) => {
    const a = safeParse(aStr);
    const b = safeParse(bStr);
    if (isNaN(a) || isNaN(b)) return null;

    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') {
      if (b === 0) return 'indefinido';
      return a / b;
    }
    return null;
  };

  botonesNumero.forEach(btn => {
    btn.addEventListener('click', () => {
      if (actual === 'indefinido' || previo === 'indefinido') {
        limpiarTodo();
      }

      const val = btn.dataset.valor;
      if (val === '.' && actual.includes('.')) return;

      if (actual === '0' && val !== '.') {
        actual = val;
      } else {
        actual += val;
      }

      mostrarPantalla(actual);
    });
  });

  botonesOperacion.forEach(btn => {
    btn.addEventListener('click', () => {
      const nuevaOp = btn.dataset.op;

      if (actual === '' && previo === '') {
        return;
      }

      if (previo === '') {
        if (actual === '' || actual === '-') return;
        previo = actual;
        operacion = nuevaOp;
        actual = '';
        mostrarLineaOperacion();
        mostrarPantalla(previo);
        return;
      }

      if (actual === '') {
        operacion = nuevaOp;
        mostrarLineaOperacion();
        return;
      }

      const resultado = calcular(previo, actual, operacion);
      if (resultado === 'indefinido') {
        actual = 'indefinido';
        previo = '';
        operacion = null;
        mostrarPantalla('indefinido');
        mostrarLineaOperacion();
        return;
      }
      const resStr = Number.isFinite(resultado) ? String(+parseFloat(resultado.toFixed(12))) : String(resultado);
      previo = resStr;
      operacion = nuevaOp;
      actual = '';
      mostrarLineaOperacion();
      mostrarPantalla(previo);
    });
  });

  botonIgual.addEventListener('click', () => {
    if (previo === '' || actual === '' || !operacion) return;

    const resultado = calcular(previo, actual, operacion);

    if (resultado === 'indefinido') {
      pantalla.textContent = 'indefinido';
      actual = 'indefinido';
      previo = '';
      operacion = null;
      mostrarLineaOperacion();
      return;
    }

    const salida = Number.isFinite(resultado) ? String(+parseFloat(resultado.toFixed(12))) : String(resultado);
    mostrarPantalla(salida);

    actual = salida;
    previo = '';
    operacion = null;
    mostrarLineaOperacion();
  });

  botonLimpiar.addEventListener('click', limpiarTodo);

  botonCambiarSigno.addEventListener('click', () => {
    if (actual === 'indefinido') {
      limpiarTodo();
      return;
    }
    if (actual === '') {
      if (previo !== '') {
        if (previo.startsWith('-')) previo = previo.slice(1);
        else previo = '-' + previo;
        mostrarLineaOperacion();
        mostrarPantalla(previo);
      }
      return;
    }
    if (actual.startsWith('-')) actual = actual.slice(1);
    else actual = '-' + actual;
    mostrarPantalla(actual);
  });

  botonPorcentaje.addEventListener('click', () => {
    if (actual === '' || actual === 'indefinido') return;
    const n = safeParse(actual);
    if (isNaN(n)) return;
    let res;
    if (previo !== '' && operacion) {
      const p = safeParse(previo);
      res = (p * n) / 100;
    } else {
      res = n / 100;
    }
    actual = String(+parseFloat(res.toFixed(12)));
    mostrarPantalla(actual);
  });

  limpiarTodo();
});
