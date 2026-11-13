# Samuel Camacho Arq

Portafolio de arquitectura de Samuel Camacho. El hero pasa de su render a una versión realista con el scroll, los proyectos clave tienen un control "Su render / Realista" con transición de celosías, modo día y noche, y un PDF imprimible generado desde la misma web.

**En vivo:** https://samuel-camacho-arq.vercel.app

> Proyecto hecho por PagX Studio para Samuel Camacho.

## Stack

Astro 7 · GSAP + ScrollTrigger + SplitText · Lenis · Playwright (PDF)

Sitio 100 % estático, con tres niveles de animación (alto, medio y estático) y soporte para `prefers-reduced-motion`.

## Correr en local

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # salida estática en dist/
```

Requiere Node 22.12 o superior. `packages/motion` es el reloj de scroll compartido de PagX: GSAP y Lenis se mueven con un solo ticker.

## Licencia

© 2026 Esteban Muñoz · [PagX Studio](https://pagxstudio.com). Todos los derechos reservados. Ver [LICENSE](LICENSE).
