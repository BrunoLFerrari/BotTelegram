# Bot de Atendimento no Telegram

Este é um bot de atendimento desenvolvido para o Telegram, utilizando Node.js, node-telegram-bot-api, e o ORM Prisma para integração com um banco de dados SQLite.

## Funcionalidades

- Responde automaticamente às mensagens recebidas, fornecendo informações sobre o horário comercial da empresa.
- Solicita o e-mail do usuário fora do horário comercial e o armazena no banco de dados para posterior contato.
- Reinicia o atendimento após o registro do e-mail válido ou quando o usuário inicia uma nova conversa.

## Requisitos

- [Node.js](https://nodejs.org/en/download)
- [Conta no Telegram](https://web.telegram.org/k/)
- Criar um BOT no [Bot Father](https://t.me/botfather)

## Como Configurar

1. Clone este repositório:
   ```
   git clone 
   ```

2. Abra a pasta do projeto com sua IDE.

3. Instale as dependências do projeto:
   ```
   npm install
   ```
4. Coloque o TOKEN do seu bot no código bot.js

5. Faça migração do banco de dados:
   ```
   npx prisma migrate dev
   ```

6. Execute o bot:
   ```
   node ./src/bot.js
   ```
