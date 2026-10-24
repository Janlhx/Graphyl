# Tareas — MVP GraphLearn

## Backend (backend-dev)
- [ ] 1. Crear `backend/main.py` con FastAPI + CORS.
- [ ] 2. Modelo Pydantic `GenerateRequest { text: str }`.
- [ ] 3. Endpoint `POST /api/generate-graph`.
- [ ] 4. Integración LLM opcional (si hay API key) devolviendo JSON estricto.
- [ ] 5. Generador fallback/mock de demo (Ciencia de Datos/IA, ≥ 6 nodos, 4
       categorías, practice con solución).
- [ ] 6. Validación del esquema `graph-schema` antes de responder.
- [ ] 7. `backend/requirements.txt`.

## Frontend (frontend-dev)
- [ ] 8. Scaffold Vite + React + TS en `frontend/`.
- [ ] 9. Configurar TailwindCSS (modo oscuro/moderno).
- [ ] 10. Instalar `@xyflow/react`, `dagre`, `lucide-react`.
- [ ] 11. `lib/colors.ts` y `lib/layout.ts` (dagre `rankdir: TB`).
- [ ] 12. `CustomNode.tsx` con borde/badge por color.
- [ ] 13. `GraphCanvas.tsx` con React Flow + layout dagre.
- [ ] 14. `NodeDrawer.tsx` (contenido markdown, tabla, "Ver Solución").
- [ ] 15. `App.tsx`: textarea + "Generar Ruta" + "Cargar Ejemplo Demo" + fetch
        a la API.

## Integración
- [ ] 16. Verificar que backend arranca (`uvicorn`) y responde JSON válido.
- [ ] 17. Verificar que frontend compila (`vite`) y consume el endpoint.
- [ ] 18. Documentar comandos de arranque.
