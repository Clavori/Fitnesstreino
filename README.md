# FORJA — Aplicativo Web Mobile-First (PWA) para Academia

Aplicativo web mobile-first (PWA) em português do Brasil focado em constância, execução biomecânica correta, alimentação, calendário de frequência e ranking competitivo.

## Funcionalidades Implementadas

1. **Cadastro e Perfil Completo** (`src/components/tabs/ProfileTab.tsx`)
   - Login com E-mail/Senha e Google OAuth (integrado ao Supabase Auth + modo offline imediato).
   - Upload de foto de perfil ou captura direta pela câmera do celular (`capture="user"`).
   - Configuração de nome, idade, peso, altura, objetivo (*Emagrecer*, *Ganhar Massa*, *Manter o Shape*) e nível (*Iniciante*, *Intermediário*, *Avançado*).

2. **Treino do Dia + Cronômetro de Descanso** (`src/components/tabs/HomeTab.tsx` & `src/components/RestTimerBar.tsx`)
   - Mostra o treino do dia e permite navegar/editar qualquer dia da semana (Segunda a Domingo).
   - Marcação de séries concluídas, edição de carga (`kg`) e repetições em tempo real.
   - Cronômetro flutuante automático entre as séries com controles de `-15s`, `+15s` e `Pular`.
   - Botão **Finalizar Treino (+180 PTS)** que registra automaticamente a presença no calendário, incrementa o streak, soma pontos no ranking e gera o card compartilhável.

3. **Boneco Demonstrando o Exercício + Biblioteca com 42 Exercícios** (`src/components/ExerciseMannequin.tsx` & `src/data/exercises.ts`)
   - Avatar biomecânico 2D em SVG articulado rodando em loop a 60fps com destaque luminoso nos músculos trabalhados e controle de câmera lenta (`0.5x Slow`).
   - 42 exercícios divididos em 7 grupos musculares (*Peito, Costas, Pernas, Ombros, Bíceps, Tríceps e Abdômen*) com busca e filtro.
   - Músculos primários/secundários, dicas de postura correta e erros comuns a evitar em todos os exercícios.

4. **Alimentação para Manter o Shape & Hidratação** (`src/components/tabs/NutritionTab.tsx`)
   - Cálculo automático de calorias, proteínas, carboidratos, gorduras e água conforme peso, altura, idade e objetivo.
   - Plano alimentar diário sugerido (Café da manhã, Almoço, Lanche, Jantar e Ceia) + adição de alimentos extras.
   - Rastreador de hidratação com botões rápidos (`+250ml`, `+500ml`, `+750ml`) e aviso legal destacando que são sugestões educativas.

5. **Calendário de Frequência & Streak** (`src/components/tabs/CalendarTab.tsx`)
   - Calendário mensal com marcação verde para dias treinados, azul para descanso e vermelho para faltas.
   - Contador de sequência de dias seguidos (*Streak*), recorde pessoal e check-in automático ou manual.

6. **Ranking com Foto, Pódio Top 3 e Grupos** (`src/components/tabs/RankingTab.tsx`)
   - Ranking Geral e Semanal com filtro por Academia ou Grupo de Amigos (via código de convite, ex.: `FORJA-HQ`, `MONSTROS-26`).
   - Pódio em destaque para o Top 3 (Ouro, Prata e Bronze) com fotos e barra inferior fixa mostrando a posição do usuário o tempo todo.

---

## Como Rodar Localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **(Opcional) Configure o Supabase:**
   - O aplicativo já funciona **100% imediatamente** com dados iniciais de exemplo (*Seed Data* + persistência no navegador) sem precisar configurar chaves.
   - Para conectar ao seu projeto Supabase em nuvem, copie o arquivo `.env.example` para `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - No painel do [Supabase](https://supabase.com), abra o **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
   - Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no seu `.env.local`.

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` no navegador (ou pelo celular na mesma rede Wi-Fi).

---

## Como Fazer o Deploy (GitHub + Vercel)

1. **Suba o código para o GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: FORJA fitness PWA completo"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/forja-fitness-pwa.git
   git push -u origin main
   ```

2. **Publique na Vercel:**
   - Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório do GitHub.
   - Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (caso esteja usando o banco em nuvem).
   - Clique em **Deploy**. Em menos de 1 minuto seu PWA estará online com HTTPS e pronto para ser instalado na tela inicial do celular ("Adicionar à tela de início").
