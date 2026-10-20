# Portfólio Matheus Brian

Portfólio pessoal construído com React e Vite.

## Desenvolvimento

```sh
npm install
npm run dev
```

Para validar e gerar a versão de produção:

```sh
npm run lint
npm run build
```

## Organização dos arquivos

- `src/`: aplicação React, componentes, estilos e fontes.
- `public/assets/images/`: imagens publicadas, separadas em `artwork`, `backgrounds`, `profile`, `projects` e `tools`.
- `public/assets/videos/`: vídeos e capas exibidos na galeria.
- `media-source/`: arquivos originais/arquivados que não precisam ser publicados com o site.

Os arquivos em `public/` são copiados diretamente para a versão de produção. Mantenha materiais não usados pelo site em `media-source/` para evitar servi-los aos visitantes.
