# Desafio Angular - Mirante Tecnologia

Projeto desenvolvido como parte do desafio técnico para a Mirante Tecnologia.

A aplicação implementa o módulo de **Outros Créditos/Débitos**, permitindo a consulta e o gerenciamento de lotes e lançamentos utilizando dados mockados.

## Tecnologias utilizadas

- Angular 20
- TypeScript
- PrimeNG 20
- PrimeIcons
- Reactive Forms
- Angular Signals
- RxJS
- SCSS
- Jasmine / Karma

## Requisitos

Antes de executar o projeto, é necessário possuir:

- Node.js
- npm
- Angular CLI

## Instalação

Clone o repositório:

```bash
git clone https://github.com/laura-lorrayne/mirante-desafio-angular.git
```

Acesse a pasta do projeto:

```bash
cd mirante-desafio-angular
```

Instale as dependências:

```bash
npm install
```

## Execução

Para iniciar a aplicação em ambiente de desenvolvimento:

```bash
ng serve
```

Após iniciar o servidor, acesse:

```text
http://localhost:4200
```

## Versão do Angular

O projeto foi desenvolvido utilizando:

```text
Angular 20
```

A aplicação utiliza **Standalone Components**, seguindo a abordagem moderna do Angular.

## Funcionalidades implementadas

A aplicação possui uma tela principal para consulta e gerenciamento de lotes de Outros Créditos/Débitos.

Entre as funcionalidades implementadas estão:

- consulta de lotes;
- filtros por instituição responsável;
- filtros por instituição;
- filtros por situação;
- filtro por intervalo de ID;
- filtro por intervalo de valor;
- filtro por intervalo de data;
- seleção individual de lotes;
- seleção múltipla de lotes;
- paginação;
- confirmação de lotes;
- envio de lotes;
- exclusão de lote;
- visualização de lote;
- alteração de lote;
- visualização de justificativa;
- gerenciamento de lançamentos;
- inclusão de lançamento;
- alteração de lançamento;
- visualização de lançamento;
- exclusão de lançamento;
- duplicação de lançamento;
- busca de conta corrente;
- feedback através de Toast;
- confirmação de exclusão através de ConfirmDialog.

## Validações

Os formulários foram desenvolvidos utilizando **Reactive Forms**.

### Filtros de pesquisa

Foi implementado um validator customizado para os campos de intervalo.

São validadas situações como:

```text
ID inicial <= ID final
Valor inicial <= Valor final
Data inicial <= Data final
```

Caso o intervalo seja inválido, a pesquisa não é realizada.

### Lançamentos

O formulário de lançamento possui validações como:

- conta corrente obrigatória;
- conta corrente deve existir na base mockada;
- valor obrigatório;
- valor deve ser maior que zero;
- histórico obrigatório;
- documento obrigatório;
- situação mantida como Pendente.

### Alteração de lote

O formulário de alteração de lote possui validações para:

- instituição responsável obrigatória;
- instituição obrigatória;
- valor obrigatório;
- valor maior que zero;
- quantidade de lançamentos obrigatória;
- quantidade de lançamentos maior ou igual a zero;
- situação obrigatória.

## Estrutura do projeto

O projeto foi organizado por responsabilidade e funcionalidade.

```text
src/app/
│
├── core/
│   ├── models/
│   │   ├── lote.model.ts
│   │   ├── lote-filtro.model.ts
│   │   ├── lancamento.model.ts
│   │   └── conta-corrente.model.ts
│   │
│   ├── mocks/
│   │   ├── lotes.mock.ts
│   │   └── contas-correntes.mock.ts
│   │
│   └── services/
│       ├── lote.ts
│       └── conta-corrente.ts
│
├── shared/
│   └── validators/
│       └── range.validator.ts
│
└── features/
    └── outros-creditos-debitos/
        │
        ├── pages/
        │   └── consulta-lotes/
        │
        └── components/
            ├── lote-filtros/
            ├── lote-table/
            ├── lote-dialog/
            └── lancamento-dialog/
```

## Decisões técnicas

### Standalone Components

Os componentes foram desenvolvidos utilizando a abordagem standalone do Angular.

Essa decisão evita a necessidade de módulos específicos para cada feature e torna as dependências de cada componente explícitas.

### Reactive Forms

Os formulários da aplicação utilizam **Reactive Forms**.

Essa abordagem foi escolhida por facilitar:

- validações;
- controle de estado dos campos;
- reutilização de formulários;
- habilitação e desabilitação de campos;
- testes unitários.

### Angular Signals

Signals foram utilizados para controlar estados locais da interface.

Entre os estados controlados por Signals estão:

- lotes pesquisados;
- lotes selecionados;
- loading;
- mensagens de erro;
- abertura de dialogs;
- modo de visualização e alteração;
- lançamentos em memória.

Exemplo:

```ts
readonly lotes = signal<Lote[]>([]);
readonly loading = signal(false);
```

Também foram utilizados estados derivados através de `computed()`.

Exemplo:

```ts
readonly possuiUmSelecionado = computed(
  () => this.lotesSelecionados().length === 1,
);
```

### RxJS

RxJS foi utilizado principalmente na camada de serviços.

Como o desafio não possui backend, as operações foram simuladas utilizando Observables.

Exemplo:

```ts
return of(resultado).pipe(
  delay(100),
);
```

Essa abordagem permite simular o comportamento assíncrono de uma API real.

Caso o projeto futuramente seja integrado a um backend, os mocks podem ser substituídos por chamadas HTTP sem necessidade de grandes alterações nos componentes.

### Camada de serviços

A lógica de acesso aos dados foi separada dos componentes através de services.

Os principais services são:

```text
LoteService
ContaCorrenteService
```

O `LoteService` é responsável por operações como:

- pesquisa de lotes;
- alteração de situação;
- alteração de lote;
- exclusão de lote.

O `ContaCorrenteService` é responsável pela busca de contas correntes.

### Dados mockados

O projeto não utiliza backend.

Os dados estão armazenados em arquivos mockados dentro de:

```text
src/app/core/mocks/
```

Durante a execução da aplicação, as alterações são mantidas em memória.

Por exemplo, quando um lote é alterado ou excluído, uma nova pesquisa continua refletindo essa alteração enquanto a aplicação permanecer em execução.

### Componentização

A interface foi dividida em componentes com responsabilidades específicas.

#### ConsultaLotes

Componente principal da tela.

Responsável por:

- pesquisa;
- gerenciamento dos resultados;
- seleção;
- execução das ações;
- abertura dos dialogs.

#### LoteFiltros

Responsável pelo formulário de filtros.

O componente emite os filtros preenchidos para a página principal.

#### LoteTable

Responsável pela apresentação dos resultados.

Possui:

- seleção;
- seleção múltipla;
- paginação;
- formatação dos dados.

#### LoteDialog

Componente reutilizado para:

- Visualizar lote;
- Alterar lote.

O comportamento é controlado através de inputs.

No modo de visualização, os campos ficam bloqueados.

No modo de alteração, os campos permitidos ficam editáveis.

#### LancamentoDialog

Responsável pelo gerenciamento dos lançamentos.

Permite:

- incluir;
- visualizar;
- alterar;
- excluir;
- duplicar.

Os lançamentos são mantidos em memória durante a execução da aplicação.

### PrimeNG

O PrimeNG foi utilizado para construção dos principais elementos da interface.

Entre os componentes utilizados estão:

- Table;
- Dialog;
- ConfirmDialog;
- Toast;
- Button;
- InputText;
- InputNumber;
- Select;
- Checkbox;
- DatePicker;
- Breadcrumb;
- Panel.

### Feedback ao usuário

A aplicação utiliza Toast para apresentar feedback das operações.

São exibidas mensagens para situações como:

- operação realizada com sucesso;
- erro;
- aviso;
- conta corrente encontrada;
- conta corrente não encontrada;
- formulário inválido.

Para operações destrutivas, como exclusão, é utilizado `ConfirmDialog`.

### Internacionalização

O locale `pt-BR` foi registrado na aplicação.

Isso permite a apresentação correta de:

- datas;
- horários;
- moeda brasileira.

Exemplo:

```text
R$ 12.500,50
```

### Responsividade

A interface foi desenvolvida utilizando:

- CSS Grid;
- Flexbox;
- media queries;
- scroll horizontal para tabelas quando necessário.

Os formulários reduzem progressivamente a quantidade de colunas em telas menores.

## Testes unitários

Foram implementados testes unitários para os principais componentes, services e validators da aplicação.

### Componentes testados

- App;
- ConsultaLotes;
- LoteFiltros;
- LoteTable;
- LoteDialog;
- LancamentoDialog.

### Services testados

- LoteService;
- ContaCorrenteService.

### Validators testados

- rangeValidator.

Entre os cenários testados estão:

- criação dos componentes;
- formulários válidos e inválidos;
- intervalo de ID;
- intervalo de valor;
- intervalo de datas;
- pesquisa de lotes;
- filtro por situação;
- atualização de situação;
- alteração de lote;
- exclusão de lote;
- busca de conta corrente;
- conta corrente inexistente;
- inclusão de lançamento;
- duplicação de lançamento;
- seleção individual;
- seleção múltipla;
- abertura dos dialogs;
- emissão de eventos.

## Executando os testes

Para executar os testes em modo interativo:

```bash
ng test
```

Para executar os testes apenas uma vez:

```bash
ng test --watch=false
```

## Build de produção

Para gerar o build de produção:

```bash
ng build
```

Os arquivos gerados serão disponibilizados no diretório:

```text
dist/
```

## Possível integração com backend

A arquitetura foi criada de forma que a camada mockada possa ser substituída futuramente por uma API real.

Os métodos atuais:

```text
pesquisar()
atualizar()
atualizarSituacao()
excluir()
buscarPorNumero()
```

poderiam utilizar `HttpClient` mantendo grande parte dos componentes sem necessidade de alteração.

## Possíveis evoluções

Em um ambiente de produção, o projeto poderia receber evoluções como:

- integração com API REST;
- autenticação;
- autorização por perfil;
- interceptor HTTP;
- tratamento centralizado de erros;
- paginação server-side;
- filtros server-side;
- persistência dos lançamentos em backend;
- logging;
- testes de integração;
- testes E2E;
- pipeline de CI/CD.

## Considerações finais

O projeto foi desenvolvido com foco em organização, componentização e utilização dos recursos modernos do Angular.

As principais decisões técnicas adotadas foram:

- Angular 20;
- Standalone Components;
- Reactive Forms;
- Angular Signals;
- RxJS;
- services separados da camada de apresentação;
- dados mockados;
- validator customizado;
- PrimeNG;
- componentização;
- testes unitários;
- interface responsiva.

A estrutura criada permite uma futura substituição da camada de mocks por uma API real com baixo impacto nos componentes da aplicação.
