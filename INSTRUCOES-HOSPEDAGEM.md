# Instruções de Hospedagem no GitHub Pages

## Resumo
Siga estes passos para colocar sua aplicação no ar gratuitamente.

---

## Passo 1: Criar Conta no GitHub
1. Acesse: https://github.com/signup
2. Preencha: email, senha e nome de usuário
3. Confirme o email

---

## Passo 2: Criar Repositório
1. Acesse: https://github.com/new
2. **Repository name**: `roterizador`
3. **Description**: `Sistema de otimização de rotas para transportadora`
4. Selecione: **Public**
5. **NÃO** marque nenhuma opção de inicialização
6. Clique: **Create repository**

---

## Passo 3: Upload dos Arquivos
1. No repositório criado, clique em **"uploading an existing file"** (ou "Add file" → "Upload files")
2. Abra a pasta `roterizador` no seu computador
3. Selecione TODOS os arquivos:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `motorista.html`
   - `motorista.css`
   - `motorista.js`
   - `README.md`
4. Arraste para a área de upload no GitHub
5. Clique: **Commit changes**

---

## Passo 4: Ativar GitHub Pages
1. No repositório, clique em **Settings** (engrenagem no topo)
2. Menu lateral → **Pages**
3. **Source**: Deploy from a branch
4. **Branch**: `main` → `/ (root)`
5. Clique: **Save**
6. Aguarde 1-2 minutos (recarregue a página)

---

## Passo 5: Acessar a Aplicação

### Página Principal (Administrador)
```
https://SEU-USUARIO.github.io/roterizador/
```

### Página do Motorista (ex: Veículo 1)
```
https://SEU-USUARIO.github.io/roterizador/motorista.html?veiculo=1
```

### Página do Motorista (ex: Veículo 2)
```
https://SEU-USUARIO.github.io/roterizador/motorista.html?veiculo=2
```

---

## Enviar Link para Motoristas

1. Copie o link do veículo desejado
2. Envie por WhatsApp, email ou SMS
3. O motorista abre no celular e vê sua rota

---

## Atualizações Futuras

Sempre que modificar os arquivos:
1. Acesse o repositório no GitHub
2. Clique em cada arquivo modificado
3. Clique no ícone de lápis (Edit)
4. Faça as alterações
5. Clique: **Commit changes**

---

## Suporte

Se tiver dificuldades, verifique:
- [Documentação oficial do GitHub Pages](https://docs.github.com/pt/pages)
- O repositório está como **Public**
- O branch está como **main**
- O GitHub Pages está ativado em Settings → Pages
