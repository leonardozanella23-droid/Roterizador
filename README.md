# Roterizador - Transportadora SP

Aplicação web para otimização de rotas de entrega em São Paulo.

## Como Hospedar no GitHub Pages

### Passo 1: Criar conta no GitHub
1. Acesse https://github.com
2. Crie uma conta gratuita (ou faça login se já tiver)

### Passo 2: Criar um novo repositório
1. Clique no botão **"New"** (Novo repositório)
2. Nomeie como: `roterizador`
3. Marque como **Public** (Público)
4. **NÃO** marque "Add a README file"
5. Clique em **"Create repository"**

### Passo 3: Fazer upload dos arquivos
1. Na página do repositório, clique em **"uploading an existing file"**
2. Arraste TODOS os arquivos da pasta `roterizador`:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `motorista.html`
   - `motorista.css`
   - `motorista.js`
3. Clique em **"Commit changes"**

### Passo 4: Ativar GitHub Pages
1. Vá em **Settings** (Configurações) do repositório
2. No menu lateral, clique em **Pages**
3. Em "Source", selecione **"Deploy from a branch"**
4. Em "Branch", selecione **main** e **/ (root)**
5. Clique em **Save**
6. Aguarde 1-2 minutos

### Passo 5: Acessar
Sua aplicação estará disponível em:
```
https://seu-usuario.github.io/roterizador/
```

Para a página do motorista:
```
https://seu-usuario.github.io/roterizador/motorista.html?veiculo=1
```

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Página principal (administração) |
| `styles.css` | Estilos da página principal |
| `app.js` | Lógica da aplicação |
| `motorista.html` | Página do motorista |
| `motorista.css` | Estilos da página do motorista |
| `motorista.js` | Lógica da página do motorista |

## Funcionalidades

- Cadastro de clientes com geocodificação
- Otimização de rotas (Nearest Neighbor + 2-opt)
- Visualização no mapa com rotas pelas ruas (OSRM)
- Tempo estimado por veículo
- Página do motorista com lista ordenada de entregas
- Exportação CSV/JSON
