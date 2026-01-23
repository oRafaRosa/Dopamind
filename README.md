# Dopamind RPG

Um RPG gamificado para desenvolvimento pessoal e produtividade.

## Configuração do Supabase

1. **Crie um projeto no Supabase:**
   - Acesse [supabase.com](https://supabase.com) e crie uma conta
   - Crie um novo projeto

2. **Configure as variáveis de ambiente:**
   - Copie o arquivo `.env` e renomeie para `.env.local`
   - Preencha com suas chaves do Supabase:
     ```
     VITE_SUPABASE_URL=https://seu-projeto.supabase.co
     VITE_SUPABASE_ANON_KEY=sua-chave-anonima
     ```

3. **Execute o schema SQL:**
   - No painel do Supabase, vá para SQL Editor
   - Execute o conteúdo do arquivo `supabase_schema.sql`

4. **Configure Authentication:**
   - No painel do Supabase, vá para Authentication > Settings
   - Configure os provedores de auth desejados (Email, Google, etc.)

## Executar Localmente

**Pré-requisitos:** Node.js

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente (veja acima)

3. Execute o app:
   ```bash
   npm run dev
   ```

## Funcionalidades

- Sistema de tarefas gamificado
- Sistema de XP e níveis
- Estatísticas de personagem (STR, INT, FOC, SPI, CHA)
- Desafios e conquistas
- Histórico de progresso
- Sistema de créditos

## Estrutura do Banco

- `profiles`: Perfis dos usuários
- `tasks`: Tarefas diárias
- `challenges`: Desafios disponíveis
- `challenge_participants`: Participação em desafios
- `xp_history`: Histórico de XP
- `badges`: Conquistas desbloqueadas
- `day_logs`: Logs diários de atividade
