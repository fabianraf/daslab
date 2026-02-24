# DasLab – Der, die, das

App en React + Vite para practicar los artículos definidos en alemán: **der**, **die** y **das**.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # previsualizar el build
```

## Desplegar en Vercel

1. Sube el repo a GitHub (o conecta tu repo en Vercel).
2. En [vercel.com](https://vercel.com): **Add New** → **Project** → importa el repo.
3. Vercel detecta Vite automáticamente; no hace falta cambiar la configuración.
4. **Deploy**.

También puedes usar la CLI:

```bash
npm i -g vercel
vercel
```

El proyecto incluye `vercel.json` con `framework: "vite"` y salida en `dist`.
