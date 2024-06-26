# Ride API + Testes(JEST)
## Tecnologias utilizadas neste projeto:
- Node.Js
- Express
- Prisma
- TypeScript
- Jest
- Supertest
- Faker
- JWT
- bcryptjs
- Zod
- Morgan
- Winston

# Requisitos

- [Node.js](http://nodejs.org/en/dowload)
- [PostgreSQL](https://www.postgresql.org/dowload/)

## Clonando o Projeto

Executar no terminal:
```bash
    git clone <github template url> <project_name>
```

## Instalando Dependências

Instalar as dependências de desenvolvimento e produção.

entre na pasta principal do projeto e rode o comando:

```
 npm install
```

## Variáveis de ambiente
Duplicar o arquivo `.env.example` e renomear a cópia para `.env`, sobrescrevendo os valores das variáveis de ambiente do arquivo `.env` com as suas credenciais.
Também será necessário a criação do `.env.test`, sobrescrevendo  as variáveis com as credenciais de test para rodar os testes.

O projeto utiliza as seguintes variáveis: 

| Var Name     | Description                             | Required
| --------     | -----------                             |---------
| DATABASE_URL | Credenciais do banco de dados utilizado | obrigatório
| JWT_SECRET | Chave secreta utilizada pela autenticação JWT | obrigatório
| JWT_EXPIRES_IN | Tempo de expiração do token JWT (1ms, 1m, 1h, 1d...) | opcional
| PORT | Porta | opcional
| LOG_LEVEL | Configuração de logger | opcional
| APP_ENV | default 'DEV' | opcional

## Executando as Migrações

Execute a baixo na raiz do projeto:

```
npm run migrate:dev
```

```
npm run migrate:test
```

```
npm run db:seed
```

## Iniciando o servidor
O servidor da API será executado, por padrão, na porta 3000:

```
npm run dev
```

Navegue até `http://localhost:3000` para acessar a API.
Você pode utilizar Postman, Insomnia ou Swagger para realizar as suas requisições.

# Rotas

- Acesse a documentação das rotas em http://localhost:3000/docs.

- Baixe a documentação Swagger utilizando a rota http://localhost:3000/docs/json
