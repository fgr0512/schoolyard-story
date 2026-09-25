# Plano — Sistema de Gestão Escolar

## Objetivo
Criar uma primeira versão funcional, em português, para administrar alunos, equipe escolar, vida acadêmica, documentos e comunicação com responsáveis.

## Entregas
- **Acesso seguro:** entrada por e-mail/senha e Google, com perfis de administrador, professor e funcionário.
- **Painel principal:** visão geral de alunos, turmas, pendências de notas/faltas e ações rápidas.
- **Cadastros:** alunos, responsáveis, professores, funcionários, turmas, séries, disciplinas e anos letivos.
- **Notas e faltas:** diário por turma e disciplina, com lançamentos pelos professores e situação automática do aluno.
- **Histórico escolar:** emissão para conclusão de ciclo ou transferência durante o ano, com versão pronta para impressão.
- **Documentos:** convocação de responsáveis para reunião e declaração de comparecimento, também prontas para impressão.
- **Progressão escolar:** revisão dos resultados e movimentação em lote dos aprovados para a série seguinte.
- **WhatsApp:** abertura de mensagem pronta para o responsável, registrando no sistema que o comunicado foi preparado/enviado.

## Regras e segurança
- Dados escolares serão privados e acessíveis apenas a usuários autenticados.
- Professores poderão lançar dados acadêmicos das turmas; administração gerenciará cadastros, documentos e progressão.
- Funções de acesso ficarão separadas dos dados pessoais para evitar elevação indevida de privilégios.
- A emissão de documentos manterá um registro de data, motivo e responsável pela emissão.

## Direção visual
Interface administrativa clara e acolhedora, com navegação lateral, tabelas legíveis, indicadores de situação e formulários objetivos. O sistema funcionará bem em computador e celular.

## Detalhes técnicos
- Banco de dados integrado para persistência de todos os registros.
- Regras de acesso por usuário e função.
- Documentos gerados em páginas de impressão; o navegador permite imprimir ou salvar em PDF.
- Comunicação via link oficial do WhatsApp com texto preenchido, sem exigir integração paga nesta primeira versão.
