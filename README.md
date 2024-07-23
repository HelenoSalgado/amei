# AMEI

Esta é uma API REST desenvolvida para facilitar a integração de uma função de curtidas e views em uma página isolada. O javascript no frontend é mínimo e não prejudica o carregamento da página; a performance é exatamente a mesma anterior a implementação.

## Cloudflare Workers

O código executável está hospedado em trabalhadores cloudflare, afim de aumentar a disponiblidade e reduzir o tempo de resposta.

## Cloudflare D1 

O serviço de banco de dados escolhido também é da cloudflare, isso facilitou a integração com workers e contribuiu para um melhor desempenho da aplicação. Como descrito na documentação, o D1 é "O banco de dados SQL sem servidor nativo da Cloudflare".

## Cache API

Um sistema simples de cache fornecido pelo próprio Workers também foi utilizado, específicamente no endpoint `/likes/:slug` do método GET, isso reduziu o tempo de resposta de 270 milissegundos para algo em torno de 50 milissegundos. Veja:

### *Antes*
![Antes do cache](/assets/after.png)

### *Depois*
![Depos do cache](/assets/before.png)

*Obs*: Se não fosse o trabalho de armazenar em cache o recurso da primeira solicitação, o tempo de resposta seria um pouco menor. Por isso os 270 milissegundos é um tempo de resposta mais justo, sem o uso da API de cache.