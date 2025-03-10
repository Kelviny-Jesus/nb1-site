# NB1 Extension

NB1 Extension é uma aplicação web de gerenciamento de usuários construída com Next.js, React e Tailwind CSS. Ela oferece funcionalidades de autenticação, registro de usuários e um dashboard personalizado.

## Características

- Autenticação de usuários (login e registro)
- Dashboard personalizado com visão geral do perfil
- Gerenciamento de informações pessoais, endereço e preferências culturais
- Design responsivo e moderno usando Tailwind CSS
- Integração com API externa para gerenciamento de dados de usuário

## Tecnologias Utilizadas

- Next.js 14
- React 18
- Tailwind CSS
- Shadcn UI Components
- React Hook Form
- Zod (para validação de esquemas)
- Axios (para requisições HTTP)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
   \`\`\`
   git clone https://github.com/seu-usuario/nb1-extension.git
   cd nb1-extension
   \`\`\`

2. Instale as dependências:
   \`\`\`
   npm install
   # ou
   yarn install
   \`\`\`

3. Configure as variáveis de ambiente:
   Crie um arquivo \`.env.local\` na raiz do projeto e adicione as seguintes variáveis:
   \`\`\`
   NEXT_PUBLIC_API_URL=https://n8n-webhooks.bluenacional.com/webhook/nb1/api
   \`\`\`

## Executando o Projeto

Para iniciar o servidor de desenvolvimento:

\`\`\`
npm run dev
# ou
yarn dev
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## Estrutura do Projeto

- \`/app\`: Contém as páginas e layouts da aplicação
- \`/components\`: Componentes React reutilizáveis
- \`/lib\`: Funções utilitárias e helpers
- \`/public\`: Arquivos estáticos
- \`/styles\`: Estilos globais e configurações do Tailwind

## Principais Componentes

- \`LoginForm\`: Gerencia o processo de login
- \`RegistrationForm\`: Lida com o registro de novos usuários
- \`Dashboard\`: Exibe a visão geral do perfil do usuário
- \`ProfileTab\`: Permite a visualização e edição de informações do perfil

## Contribuindo

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de submeter pull requests.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

