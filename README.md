# Calculadora de Edad

Aplicación web estática, responsive y accesible para calcular una edad exacta a partir de la fecha de nacimiento. Presenta años, meses y días, además de información complementaria como días vividos, meses completos, próximo cumpleaños, día de nacimiento y signo zodiacal.

## Características principales

- Cálculo automático al seleccionar o cambiar la fecha.
- Edad exacta en años, meses y días.
- Total de meses completos y días vividos.
- Próximo cumpleaños y días restantes.
- Día de la semana de nacimiento.
- Signo zodiacal como dato complementario.
- Mensaje especial cuando el cumpleaños es hoy.
- Validación de fechas vacías, inválidas y futuras.
- Manejo coherente de años bisiestos y nacimientos el 29 de febrero.
- Interfaz responsive con navegación por teclado y mensajes accesibles.
- Sin frameworks, dependencias, servidores ni recursos externos.

## Estructura de carpetas

```text
calculadora-edad/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── logo.svg
├── README.md
└── .gitignore
```

## Tecnologías utilizadas

- HTML5 semántico.
- CSS3 con variables, Grid, Flexbox, media queries y soporte para `prefers-reduced-motion`.
- JavaScript vanilla con `Date`, `Intl.DateTimeFormat` e `Intl.NumberFormat`.
- SVG local para logo y favicon.

## Cómo se calcula la edad

La fecha seleccionada se interpreta como una fecha local mediante sus componentes de año, mes y día. Así se evita el desplazamiento de un día que puede ocurrir al interpretar directamente una cadena `YYYY-MM-DD` como UTC.

La edad se calcula en tres fases:

1. Se determinan los años completos según si el cumpleaños del año actual ya ocurrió.
2. Desde el último aniversario se cuentan meses calendario completos.
3. Se cuentan los días restantes usando números de día UTC creados a partir de componentes locales. Esto evita errores por cambios de horario estacional.

Los días vividos son una diferencia de fechas de calendario. Los meses completos se derivan de los años y meses completos transcurridos.

## Fechas y años bisiestos

La función `isLeapYear` aplica la regla gregoriana: un año es bisiesto si es divisible por 4, salvo los divisibles por 100 que no sean también divisibles por 400.

Para una persona nacida el 29 de febrero, la aplicación considera el 28 de febrero como aniversario en años no bisiestos. Esta es una convención explícita y coherente para el cálculo. Puede cambiarse en `birthdayInYear` si el contexto legal o institucional requiere usar el 1 de marzo.

## Ejecución local

No se necesita instalación.

1. Descarga o clona el proyecto.
2. Abre `index.html` en un navegador moderno.

También puedes usar un servidor local opcional, por ejemplo con la extensión Live Server de tu editor. La aplicación funciona igualmente al abrir el archivo directamente.

## Subir el proyecto a GitHub

1. Crea un repositorio vacío en GitHub.
2. Abre una terminal dentro de la carpeta `calculadora-edad`.
3. Ejecuta:

```bash
git init
git add .
git commit -m "Crear calculadora de edad"
git branch -M main
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

Reemplaza `URL_DE_TU_REPOSITORIO` por la dirección que GitHub muestre para tu repositorio.

## Publicar con GitHub Pages

1. En GitHub, abre el repositorio.
2. Entra en **Settings** y después en **Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Elige la rama `main` y la carpeta `/ (root)`.
5. Guarda la configuración.

Como todas las rutas son relativas, el sitio funciona dentro de la ruta asignada al repositorio.

## Personalizar colores y estilos

Edita las variables del bloque `:root` al inicio de `css/styles.css`. Allí se concentran los colores principales, radios, sombras, espacios y transiciones. Por ejemplo:

```css
:root {
  --color-primary: #4f46e5;
  --color-violet: #7c3aed;
  --color-warm: #f97316;
}
```

También puedes sustituir `assets/logo.svg` manteniendo el mismo nombre para conservar las referencias existentes.

## Accesibilidad

La interfaz incluye HTML semántico, asociación entre `label` e `input`, mensajes de error mediante `aria-live`, `aria-invalid`, instrucciones con `aria-describedby`, foco visible, operación por teclado, contraste legible, iconos decorativos ocultos y reducción de movimiento según las preferencias del sistema.

Se recomienda verificar periódicamente el contraste y realizar pruebas con teclado y lector de pantalla después de cualquier personalización visual.

## Licencia sugerida

Se sugiere publicar el proyecto bajo la licencia MIT. Agrega un archivo `LICENSE` con el texto oficial de la licencia y los datos del titular antes de distribuirlo.
