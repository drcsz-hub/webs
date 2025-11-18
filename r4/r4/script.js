/* lógica de la calculadora */
document.addEventListener('DOMContentLoaded', () => {
  const pantalla = document.getElementById('pantalla');
  const lineaOp = document.getElementById('linea-operacion');
  const botonesNumero = document.querySelectorAll('.numero');
  const botonesOperacion = document.querySelectorAll('.operacion');
  const botonIgual = document.getElementById('igual');
  const botonLimpiar = document.getElementById('limpiar');
  const botonCambiarSigno = document.getElementById('cambiar-signo');
  const botonPorcentaje = document.getElementById('porcentaje');

  let actual = '';    // texto que está escribiendo el usuario
  let previo = '';    // número previo (string)
  let operacion = null; // '+', '-', '*', '/'

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

  // manejo números y punto
  botonesNumero.forEach(btn => {
    btn.addEventListener('click', () => {
      // si la pantalla tiene 'indefinido' y el usuario escribe, reiniciamos
      if (actual === 'indefinido' || previo === 'indefinido') {
        limpiarTodo();
      }

      const val = btn.dataset.valor;
      // evitar entrada de varios puntos
      if (val === '.' && actual.includes('.')) return;

      // si actual es '0' y entra un número distinto de '.', reemplaza
      if (actual === '0' && val !== '.') {
        actual = val;
      } else {
        actual += val;
      }

      mostrarPantalla(actual);
    });
  });

  // operaciones
  botonesOperacion.forEach(btn => {
    btn.addEventListener('click', () => {
      const nuevaOp = btn.dataset.op;

      // si actual es vacío pero queremos permitir cambiar el signo usando +/- en su lugar
      if (actual === '' && previo === '') {
        // nada que operar
        return;
      }

      // si no hay previo aún, pasar actual a previo
      if (previo === '') {
        // si actual vacío (por ejemplo, usuario quiere aplicar op a número negativo?), no permitir
        if (actual === '' || actual === '-') return;
        previo = actual;
        operacion = nuevaOp;
        actual = '';
        mostrarLineaOperacion();
        mostrarPantalla(previo);
        return;
      }

      // si ya hay previo pero no hay actual (usuario quiere cambiar la operación)
      if (actual === '') {
        operacion = nuevaOp;
        mostrarLineaOperacion();
        return;
      }

      // si hay previo y actual -> calcular primero y dejar el resultado en previo, aplicar nueva operación
      const resultado = calcular(previo, actual, operacion);
      if (resultado === 'indefinido') {
        // mostrar indefinido y bloquear hasta limpiar
        actual = 'indefinido';
        previo = '';
        operacion = null;
        mostrarPantalla('indefinido');
        mostrarLineaOperacion();
        return;
      }
      // poner resultado (formateado) en previo y asignar nueva op
      const resStr = Number.isFinite(resultado) ? String(+parseFloat(resultado.toFixed(12))) : String(resultado);
      previo = resStr;
      operacion = nuevaOp;
      actual = '';
      mostrarLineaOperacion();
      mostrarPantalla(previo);
    });
  });

  // igual
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

    // formateo para evitar demasiados decimales flotantes
    const salida = Number.isFinite(resultado) ? String(+parseFloat(resultado.toFixed(12))) : String(resultado);
    mostrarPantalla(salida);

    // preparar para siguientes operaciones: resultado queda en "actual"
    actual = salida;
    previo = '';
    operacion = null;
    mostrarLineaOperacion();
  });

  // limpiar
  botonLimpiar.addEventListener('click', limpiarTodo);

  // cambiar signo (+/-) — funciona mientras el usuario está escribiendo o sobre el resultado
  botonCambiarSigno.addEventListener('click', () => {
    if (actual === 'indefinido') {
      limpiarTodo();
      return;
    }
    if (actual === '') {
      // si no hay actual pero hay previo, cambiar el previo
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

  // porcentaje (simple): convierte actual en porcentaje de previo si hay previo,
  // sino divide actual entre 100
  botonPorcentaje.addEventListener('click', () => {
    if (actual === '' || actual === 'indefinido') return;
    const n = safeParse(actual);
    if (isNaN(n)) return;
    let res;
    if (previo !== '' && operacion) {
      // convierte actual a porcentaje relativo a previo (p.e. 50% de previo)
      const p = safeParse(previo);
      res = (p * n) / 100;
    } else {
      res = n / 100;
    }
    actual = String(+parseFloat(res.toFixed(12)));
    mostrarPantalla(actual);
  });

  // inicializar
  limpiarTodo();
});
