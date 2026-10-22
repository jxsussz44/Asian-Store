ASIAN STORE AGUACHICA — PÁGINA WEB

ARCHIVOS
- index.html: estructura y secciones de la página.
- styles.css: diseño responsive, colores, animaciones y carrito lateral.
- script.js: catálogo, búsqueda, filtros, carrito y enlace a WhatsApp.
- assets/: logo y recortes de productos del catálogo adjunto.

CÓMO ABRIR
1. Extrae la carpeta completa.
2. Abre index.html en tu navegador (Chrome, Edge o Firefox).
3. Para publicar la página, sube la carpeta y conserva la estructura de assets/.

CÓMO CAMBIAR PRODUCTOS
Abre script.js y edita el arreglo PRODUCTS. Cada producto tiene id, name, category,
price, description e image. El precio debe estar en pesos colombianos, como número
sin puntos ni signos (por ejemplo: 17900).

CÓMO CAMBIAR EL WHATSAPP
En script.js cambia el valor de WHATSAPP_NUMBER. Usa el formato internacional con
indicativo de país, sin el signo +, espacios ni guiones.

NOTAS
- El carrito se guarda en el navegador usando localStorage.
- El total muestra el valor de los productos; el domicilio no se suma porque debe
  confirmarse directamente por WhatsApp.
- Las imágenes de producto están basadas en las imágenes del archivo catalogo.docx.
- La tipografía de Google Fonts necesita conexión a internet; se ha definido una
  tipografía alternativa si no hay conexión.
- Los enlaces a Instagram y TikTok del footer son enlaces generales de las plataformas;
  reemplázalos por los perfiles oficiales de la tienda cuando los tengas.
