# Discovery y auditoria de contenido

**Proyecto:** GALAGOM - Soluciones Logisticas  
**Fuente principal:** <https://www.galagom.com/>  
**Fecha de auditoria:** 11 de septiembre de 2026  
**Alcance:** discovery solamente. No se han creado componentes ni configuracion de la aplicacion.

## 1. Estado del repositorio

- `/Users/josemanrique/Desktop/galagom` existe, pero esta vacio y no contiene una aplicacion inicial.
- No se encontraron `package.json`, `src/`, `app/`, `pages/`, `public/`, configuracion de Next.js, Tailwind, TypeScript o ESLint.
- La ruta esta dentro de un repositorio Git cuyo root efectivo es `/Users/josemanrique`. Ese repositorio contiene archivos y proyectos ajenos a GALAGOM y no debe utilizarse para inferir la arquitectura del nuevo sitio.
- La rama actual es `master`, sin commits en el repositorio detectado. La rama de feature solicitada (`feature/galagom-redesign`) debera crearse antes de la implementacion, cuando se confirme el inicio de Foundation.
- En esta fase no se modificaron archivos salvo este documento.

## 2. Fuentes consultadas

- Homepage: <https://www.galagom.com/>
- Sitemap index: <https://www.galagom.com/sitemap_index.xml>
- Sitemap de paginas: <https://www.galagom.com/page-sitemap.xml>
- Sitemap de entradas: <https://www.galagom.com/post-sitemap.xml>
- Sitemap local/KML: <https://www.galagom.com/local-sitemap.xml> y <https://www.galagom.com/locations.kml>
- Cotizacion: <https://www.galagom.com/cotizar/>
- Aviso de privacidad: <https://www.galagom.com/privacidad/>
- Entrada de prueba: <https://www.galagom.com/2024/10/30/hello-world/>
- Pagina de prueba: <https://www.galagom.com/borrar/>
- WordPress REST API publica: `/wp-json/wp/v2/pages` y `/wp-json/wp/v2/media`
- Robots: <https://www.galagom.com/robots.txt>

## 3. Inventario de URLs publicas

| URL | Estado observado | Decision para el rediseño |
| --- | --- | --- |
| `/` | Pagina principal comercial. Contiene propuesta, servicios, experiencia, cobertura, unidades, formularios y contacto. | Migrar y reorganizar en homepage. |
| `/cotizar/` | Flujo extenso de cotizacion de mudanzas con personaje, imagenes y recursos alojados en `mudatodo.com`. | No migrar tal cual. Sustituir por formulario GALAGOM de baja friccion y confirmar si este flujo externo sigue siendo parte del negocio. |
| `/privacidad/` | Aviso para GALAGOM S.A. de C.V., Cancún, Quintana Roo. Incluye placeholders de correo y URL. | Mantener como pagina legal solo despues de completar y validar los datos faltantes con el cliente. |
| `/borrar/` | Pagina Divi de prueba: `Contact Me`, datos de Divi Trainer, Lorem ipsum, direccion de San Francisco y preguntas demo. | Excluir completamente y retirar del sitemap con redireccion o respuesta 410 segun estrategia de migracion. |
| `/2024/10/30/hello-world/` | Entrada WordPress inicial con comentario de prueba, Lorem ipsum y datos de plantilla. | Excluir, desindexar y retirar del sitemap. |
| `/locations.kml` | Placemark GALAGOM sin coordenadas, direccion ni telefono. | No usar como fuente de mapa o geolocalizacion. |
| `/category/uncategorized/`, feeds, autor y comentarios | Rastros de WordPress, no contenido comercial util. | No recrear en el nuevo sitio salvo necesidad SEO demostrada. |

El `page-sitemap.xml` actual contiene cuatro paginas: `/`, `/privacidad/`, `/borrar/` y `/cotizar/`. El `post-sitemap.xml` contiene solamente `hello-world`. No existe evidencia de paginas publicas individuales de servicios o ciudades.

## 4. Contenido comercial verificable

### Identidad y propuesta

- Nombre usado: **GALAGOM Soluciones Logísticas**.
- El sitio se presenta como empresa de transporte y logística en Cancún.
- Declara experiencia de **más de 17 años** brindando servicios en Quintana Roo.
- Declara ofrecer soluciones innovadoras y personalizadas para necesidades de transporte.
- Valores expresados: integridad y honradez.
- Mensaje editorial: aliado estratégico para una logística eficiente, entregas precisas, atención excepcional, cumplimiento de tiempos prometidos e integridad de cada pedido.

### Servicios explícitos

1. **Fletes Isla Mujeres y Cozumel**
   - El sitio declara servicio en todo el estado de Quintana Roo.
   - Menciona específicamente Holbox, Isla Mujeres y Cozumel.
2. **Recolección y Reparto**
   - Declara contar con unidades con capacidad a la medida del requerimiento.
3. **Almacenaje**
   - Declara almacenar la carga hasta que este lista para reparto.
4. **Carga nacional y local**
   - Describe la coordinación y ejecución del traslado desde origen hasta destino final.
5. **Soluciones 3PL**
   - El sitio enumera almacenamiento, gestión de inventarios, preparación de pedidos, embalaje y transporte hasta el cliente final.

### Servicios nombrados en footer o formularios

- Carga en general.
- Mudanzas Cancún.
- Mudanzas Nacionales.
- Mudanzas y Fletes.
- Traslado de mercancía.
- Reparto.
- Flete foráneo.

Estos nombres aparecen como enlaces, opciones de formulario o etiquetas comerciales, pero no todos tienen una descripción propia verificable. Deben mostrarse como servicios individuales solo cuando exista contenido editorial suficiente y el cliente confirme su alcance.

### Cobertura

Hechos expresamente encontrados:

- Cancún, Quintana Roo, México, como ubicación corporativa.
- Servicio declarado en todo el estado de Quintana Roo.
- Holbox, Isla Mujeres y Cozumel mencionados de forma explícita.
- El formulario de cotizacion incluye Quintana Roo y localidades como Cancún, Cozumel, Isla Mujeres, Playa del Carmen, Tulum, Bacalar, Chetumal, Felipe Carrillo Puerto, José María Morelos, Lázaro Cárdenas, Mahahual y Puerto Morelos, entre otras.

El formulario incluye estados y localidades de gran parte de México, pero esa lista parece ser una fuente de selección para cotización y no una afirmación suficiente de cobertura operativa. No se debe convertir esa lista en mapa, páginas SEO o promesa comercial sin confirmación.

### Operación y unidades

- La página tiene una sección titulada **Unidades**.
- El texto asociado habla de servicios integrales de transporte de carga y almacenamiento, adaptación a procesos, comunicación fluida y atención personalizada.
- No hay datos verificables sobre cantidad de vehículos, modelos, tonelaje, capacidades, tipos de unidad o especificaciones técnicas.
- Se pueden usar fotografías relevantes, pero no añadir fichas técnicas ni estadísticas.

### Contacto y horarios

- Teléfono mostrado repetidamente: **+52 998 222 5373**.
- Ubicación mostrada: **Cancún, Quintana Roo, México**.
- Horario mostrado en el header: **Lun - Sab: 09:00 - 17:00**.
- Correo encontrado en el aviso de privacidad: **hola@galagom.com**.
- No se encontró dirección postal concreta, coordenadas, WhatsApp confirmado, redes sociales corporativas ni un endpoint público propio para el formulario.

El correo `hola@galagom.com` aparece en el aviso legal como contacto, por lo que puede considerarse dato publicado, pero conviene confirmarlo antes de usarlo como canal principal. No debe inferirse que el teléfono sea WhatsApp.

## 5. Formularios actuales y riesgos de contenido

### Formulario de homepage

La homepage incluye dos formularios con nombres, email, teléfono, descripción, origen, destino, tipo de servicio y bienes a trasladar. Las opciones visibles incluyen almacenaje, traslado de mercancía, mudanza, reparto y flete foráneo.

### `/cotizar/`

La pagina carga un cotizador de mudanzas de `mudatodo.com`, con:

- Imagen de `Alan`, marca y recursos de Mudatodo.
- Fecha ideal del servicio.
- Estado, municipio/localidad de origen y destino.
- Niveles, elevador y acarreo.
- Inventario y empaque.
- Artículos pesados o delicados.
- Modalidad exclusiva o compartida.
- Teléfono y correo.

Esto no debe presentarse como funcionalidad propia de GALAGOM sin confirmación contractual y técnica. El nuevo formulario propuesto debe quedar desacoplado de cualquier backend ficticio; si no existe endpoint, debe tener una capa de envio pendiente claramente identificada.

## 6. Assets y fotografia

La API publica de medios devuelve 97 assets. La mayoria no tiene texto alternativo y varios proceden de una plantilla de logística de 2022-2023. El uso final requiere revisión visual y confirmación de licencia/origen.

### Assets prioritarios para revisión

Todos usan como base `https://www.galagom.com/wp-content/uploads/`.

| Asset | Dimensiones observadas | Uso potencial | Observacion |
| --- | ---: | --- | --- |
| `2024/11/mudanzas-fletes-cancun.jpg` | 1920x857 | Hero o cabecera | Es el asset más reciente con alt: “Mudanzas y fletes Cancún”. Confirmar que represente a GALAGOM. |
| `2024/11/empresa-de-transporte-y-logistica-cancun.jpg` | 600x497 | Open Graph o editorial | Imagen usada por metadata y schema actual. |
| `2024/11/bg_galagom_logistica.jpg` | 1920x857 | Fondo de hero | Nombre alineado con la marca; validar contenido real. |
| `2024/11/galagom-servicios-de-carga.png` | 709x876 | Seccion de servicios/about | Imagen actualmente visible en homepage. |
| `2024/11/galagom-soluciones-logisticas-2.png` | 709x876 | Editorial o servicios | Validar duplicación y sujeto. |
| `2024/11/galagom-soluciones-logisticas.jpg` | 709x876 | Editorial o servicios | Validar duplicación y sujeto. |
| `2022/12/fletes-ultima-milla.png` | 812x507 en homepage | Unidades / ultima milla | Referenciado por homepage, aunque no apareció en la respuesta de medios. Verificar URL real antes de migrar. |
| `2024/11/transporte-de-carga-en-general.png` | 812x507 en homepage | Unidades / carga general | Referenciado por homepage, aunque no apareció en la respuesta de medios. Verificar URL real antes de migrar. |
| `2024/11/logo-galagom-wb-250.png` | 250x66 | Logo sobre fondo oscuro | Asset de header actual. |
| `2024/11/logo-galagom-350.png` | 350x257 | Logo footer | Asset de footer actual; validar proporción y fondo. |
| `2024/11/logo-galagom-white.png` | 350x257 | Logo sobre fondos oscuros | Revisar legibilidad y variante correcta. |
| `2024/11/favicon.jpg` | 512x512 | Favicon / icono | Convertir a formato moderno si se confirma como favicon de marca. |

### Assets descartados o no utilizables sin validación

- `2024/11/personal-trainer-27.jpg`: imagen no relacionada, usada por `/borrar/`; excluir.
- `2024/11/organic-farming-illustrations-02.png`: ilustración agrícola no relacionada; excluir.
- `2024/11/bf_20_tb_11.png`: nombre genérico de builder/icono; excluir salvo identificación posterior.
- Recursos con nombres genéricos o de plantilla como `theme_image_04`, `theme_image_07`, `theme_image_08`, `theme_image_09`, `000`, `0000`, `010`, `025`, `102`, `2220`, `1`, `2`, `3`, `4`, `5`: no usar automáticamente.
- Fotografías genéricas de barcos, aviones, almacenes, repartidores o camiones de 2022-2023: revisar una por una; no asumir que muestran flota, instalaciones o personal de GALAGOM.
- Recursos alojados en `mudatodo.com`: no copiar ni depender de ellos para la nueva experiencia.

### Recomendación de imagen

Priorizar fotografías realmente propias de GALAGOM. Como no se pudo demostrar cuáles assets son fotografías corporativas, la primera implementación debe usar únicamente imágenes validadas por el cliente o, de forma provisional documentada, los assets de homepage cuya relación con GALAGOM sea clara. Todas las imágenes nuevas deberán tener `alt` descriptivo, dimensiones definidas y `next/image` con `sizes` correcto.

## 7. Contenido incorrecto, placeholder o dudoso

Debe excluirse:

- `Hello world!`, comentario predeterminado de WordPress y autor de prueba.
- `/borrar/` completo.
- Lorem ipsum y preguntas FAQ de Divi.
- Teléfono `(253)-352-4624`, email `hello@divitrainer.com`, email `hello@divifitness.com`, teléfonos Divi y dirección de San Francisco.
- Dirección `Alnahas Building, 2 AlBahr St, Tanta AlGharbia, Egypt`, emails `mori.com` y cualquier dato de esa plantilla.
- Recursos de Mudatodo y el personaje Alan, salvo que el cliente confirme una integración legítima.
- URLs o enlaces de plantilla como `https://www.mudanzasyfletesgomez`, hasta confirmar propiedad, relación comercial y destino.

El aviso de privacidad tiene placeholders que deben bloquear la publicación final:

- `\[correo electrónico de contacto\]` aparece en las finalidades secundarias y derechos ARCO.
- `\[URL del sitio web\]` aparece en cambios del aviso.
- Debe confirmarse si el nombre legal, domicilio en Cancún y alcance de datos financieros/laborales siguen vigentes.

## 8. Sitemap propuesto para la primera versión

### URLs recomendadas

| URL propuesta | Tipo | Base de contenido | Estado |
| --- | --- | --- | --- |
| `/` | Homepage | Todo el contenido comercial verificable de la página actual | Recomendada |
| `/cotizar/` | Conversión | Formulario propio simplificado, con envío pendiente de endpoint | Recomendada |
| `/privacidad/` | Legal | Aviso actual corregido por el cliente | Recomendada, bloqueada hasta completar placeholders |
| `/servicios/` | Índice opcional | Resumen de los cinco servicios explícitos | Solo si se redacta contenido suficiente |
| `/servicios/recoleccion-y-reparto/` | Servicio | Descripción actual de recolección y reparto | Posible, requiere ampliación/confirmación |
| `/servicios/almacenaje/` | Servicio | Descripción actual de almacenaje | Posible, requiere ampliación/confirmación |
| `/servicios/carga-nacional-y-local/` | Servicio | Descripción actual de carga | Posible, requiere ampliación/confirmación |
| `/servicios/soluciones-3pl/` | Servicio | Alcance explícito de 3PL | Posible, requiere ampliación/confirmación |
| `/cobertura/` | Cobertura | Quintana Roo y destinos expresamente mencionados | Posible, sin subpáginas inicialmente |
| `/nosotros/` | Editorial | Experiencia, valores y propuesta actual | Posible; puede iniciar como sección de homepage |

### URLs no recomendadas inicialmente

- `/cobertura/isla-mujeres/`, `/cobertura/cozumel/`, `/cobertura/holbox/`: no existe contenido individual suficiente; evitar doorway pages.
- Páginas para todas las localidades del formulario: la lista no demuestra cobertura comercial específica.
- Blog, categorías, autor, comentarios y feeds: no hay contenido editorial real.
- `/borrar/` y `/hello-world/`: no migrar.

La opción más conservadora para la primera entrega es una homepage sólida, `/cotizar/` y `/privacidad/` corregida. Las páginas internas se habilitan solo después de aprobar el copy ampliado.

## 9. Estructura propuesta de la homepage

1. Skip link y header accesible.
2. Hero: transporte/logística en Cancún, propuesta de valor verificada, CTA “Cotizar un flete” y CTA a servicios.
3. Barra de confianza: más de 17 años, Quintana Roo, atención personalizada y servicios 3PL; sin cifras adicionales.
4. Servicios: fletes a islas, recolección y reparto, almacenaje, carga nacional/local y 3PL.
5. “Tu carga, de origen a destino”: flujo limitado a etapas compatibles con servicios confirmados. No afirmar preparación o embalaje como servicio general fuera del alcance 3PL.
6. Cobertura: Quintana Roo, Holbox, Isla Mujeres y Cozumel; mapa/rutas como representación editorial, no como prueba de cobertura adicional.
7. Nosotros: aliado estratégico, precisión, tiempos prometidos, integridad y honradez.
8. Unidades: fotografía y mensaje de adaptación; sin capacidades técnicas.
9. 3PL: almacenamiento, inventarios, preparación de pedidos, embalaje y transporte al cliente final, exactamente dentro del alcance publicado.
10. Cotización/contacto: formulario propio, teléfono y ubicación confirmados.
11. CTA final.
12. Footer con servicios, cobertura, contacto, privacidad y copyright.

FAQ no se recomienda en esta fase: las únicas preguntas encontradas son Lorem ipsum de `/borrar/`. Podrían añadirse después de validación comercial y no deben generar `FAQPage` schema hasta cumplir condiciones de contenido visible y elegibilidad.

## 10. Arquitectura de componentes propuesta

```text
src/
  app/
    layout.tsx
    page.tsx
    cotizar/page.tsx
    privacidad/page.tsx
    servicios/page.tsx                 # solo si se aprueba contenido
    servicios/[slug]/page.tsx          # solo con páginas útiles
    cobertura/page.tsx                 # solo con alcance confirmado
    nosotros/page.tsx                  # opcional si no queda como sección
    sitemap.ts
    robots.ts
  components/
    layout/
      site-header.tsx
      site-footer.tsx
      skip-link.tsx
    navigation/
      mobile-navigation.tsx
    sections/
      hero.tsx
      trust-strip.tsx
      about-section.tsx
      process-flow.tsx
      final-cta.tsx
    services/
      service-card.tsx
      services-grid.tsx
    coverage/
      coverage-map.tsx
      route-line.tsx
    forms/
      quote-form.tsx
      field-error.tsx
    ui/
      button.tsx
      container.tsx
      section-heading.tsx
      reveal.tsx
  data/
    site.ts
    services.ts
    coverage.ts
  lib/
    quote-schema.ts
    metadata.ts
    structured-data.ts
  types/
    site.ts
  hooks/
    use-reduced-motion.ts
  styles/
    tokens.css
```

Mantener Server Components por defecto. Reservar Client Components para menu móvil, formulario, acordeones futuros y animaciones que requieran viewport/estado.

## 11. Dependencias propuestas

Dependencias de runtime:

- `next`, `react`, `react-dom`.
- `typescript`.
- `tailwindcss` y su integración compatible con la versión de Next elegida.
- `motion` usando la API moderna del paquete.
- `lucide-react` para iconografía funcional.
- `react-hook-form` y `zod` para el formulario.
- `@hookform/resolvers` para integrar Zod con React Hook Form.

Dependencias de desarrollo:

- ESLint y configuración compatible con Next/TypeScript.
- Runner de tests solo si el repositorio lo necesita después de Foundation.
- Playwright únicamente para el smoke test E2E de QA, no para discovery.

No instalar mapas, sliders, gestores de estado, librerías de partículas ni paquetes de UI completos. El mapa de cobertura debe ser SVG/CSS controlado por el proyecto.

## 12. Estrategia de animaciones

- CSS para transiciones de color, elevación discreta y `transform: scale(1.03)` máximo en tarjetas.
- Motion para reveals de secciones, stagger pequeño en servicios, línea de proceso y trazado de rutas.
- Duraciones entre 300 y 700 ms; sin animaciones decorativas constantes.
- Respetar `prefers-reduced-motion` tanto en CSS como en componentes Motion.
- No usar parallax como requisito de comprensión.
- Reservar la animación de ruta para cobertura/proceso y mantenerla como mejora progresiva.
- Mantener el hero estático, sin vídeo pesado, hasta confirmar disponibilidad de fotografía propia.

## 13. Estrategia SEO técnica

- Metadata en español por ruta, `title`, description, canonical, Open Graph y Twitter.
- Homepage con un único H1 y jerarquía H2/H3 coherente.
- `sitemap.ts` y `robots.ts` generados por Next; excluir rutas de prueba y no crear URLs sin contenido.
- Structured data mínimo: `Organization`/`MovingCompany` solo con datos confirmados, `WebSite`, `Service` en páginas de servicio y `BreadcrumbList` en páginas internas.
- No publicar `LocalBusiness` con coordenadas, dirección postal u horarios no confirmados. El horario publicado sí requiere confirmar si aplica todos los días de lunes a sábado y no domingo, frente al schema actual que afirma lunes a domingo.
- No usar `FAQPage` hasta tener FAQ real y visible.
- Redireccionar o retirar URLs heredadas de prueba después de definir la estrategia de despliegue. Verificar Search Console antes de cambiar códigos de estado.
- Optimizar `next/image`, fuentes locales o `next/font`, `alt`, `sizes`, dimensiones y preload únicamente para la imagen LCP.

## 14. Datos que requieren confirmación antes de implementar

1. ¿La razón social exacta sigue siendo `GALAGOM S.A. de C.V.`?
2. ¿`hola@galagom.com` es el correo operativo y el destinado a derechos ARCO?
3. ¿Debe publicarse el horario `Lun - Sab: 09:00 - 17:00`? El schema actual discrepa al declarar domingo.
4. ¿El teléfono `+52 998 222 5373` recibe WhatsApp? No se habilitará CTA WhatsApp hasta confirmarlo.
5. ¿Cuál es la dirección postal completa, si debe mostrarse?
6. ¿Qué imágenes son fotografías propias de GALAGOM y cuáles tienen licencia para el nuevo sitio?
7. ¿GALAGOM cubre todo Quintana Roo de forma operativa o solo es una frase comercial general?
8. ¿La cobertura nacional/local y la lista del cotizador representan rutas realmente disponibles?
9. ¿“Mudanzas Cancún”, “Mudanzas Nacionales” y “Mudanzas y Fletes” son servicios vigentes de GALAGOM y qué alcance tienen?
10. ¿El cotizador de Mudatodo se debe eliminar, enlazar como tercero o reemplazar definitivamente?
11. ¿Qué endpoint, correo o sistema recibirá el nuevo formulario de cotización?
12. ¿Debe actualizarse el aviso de privacidad para eliminar todos sus placeholders antes de publicación?

## 15. Resultado de Discovery

La propuesta de rediseño puede avanzar técnicamente sin inventar negocio si se limita a los hechos anteriores. La homepage debe ser el núcleo de conversión y presentar transporte, reparto, almacenaje, cobertura en Quintana Roo y 3PL. No hay base suficiente para un blog, FAQs, páginas locales masivas, fichas de flota o métricas adicionales.

**Siguiente fase propuesta:** revisión de este documento y confirmación de los datos de la sección 14. Después, crear la rama `feature/galagom-redesign` e iniciar Foundation, sin comenzar todavía las páginas internas o el envío real del formulario.
