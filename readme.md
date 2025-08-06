
📂 Proposta de Estrutura Modular Ideal:
Pasta / Arquivo	Função principal
state.ts	Gerencia o estado global (containers, elementos, fundo, seleção)
cadastroEditor.ts	Entrada principal da aplicação / inicialização
previewRenderer.ts	Renderiza toda a interface visual a partir do estado
containerManager.ts	Adição, remoção e drag/resize de containers
fieldManager.ts	Adição e lógica dos campos
fieldRenderer.ts	Renderização visual dos campos nos containers
elementManager.ts	Adição de botões e imagens
textManager.ts	Adição de textos livres
painelEditor.ts	Renderiza painel de propriedades (botão, texto, imagem, etc.)
campoEditor.ts	Renderiza painel lateral dos inputs
guiasFixas.ts	Renderiza e posiciona guias fixas no editor
utils.ts	Funções auxiliares (snapToGrid, ID generator, clamp, etc.)
previewMode.ts	Alterna entre modo edição e visualização final
exportador.ts	Funções de salvamento/exportação de JSON
storage.ts	Salvamento e carregamento local (localStorage e fetch de JSON)





✅ Checklist de Robustez para o Editor Visual de Cadastro
1. Validação e Integridade de Dados
 Validar state completo antes de salvar (containers, elements, campos).

 Impedir duplicação de IDs (campos, botões, textos, etc).

 Garantir que top, left, width, height sejam sempre números válidos.

 Validar existência de campos obrigatórios nos elementos (ex: label, type).

2. Manuseio de Erros
 Try/catch para qualquer operação assíncrona (fetch, leitura de arquivos).

 Exibir mensagens amigáveis no painel lateral em vez de alert.

 Mostrar logs técnicos detalhados apenas se modo debug estiver ativo.

3. Salvamento e Carregamento
 Validar estrutura do configCadastro.json no carregamento.

 Criar fallback automático caso JSON venha corrompido ou incompleto.

 Backup automático local (ex: localStorage) antes de sobrescrever arquivo.

4. Usabilidade
 Adicionar undo/redo (pilha de ações).

 Bloquear movimentação quando elemento estiver sendo redimensionado.

 Suporte a seleção múltipla com Shift ou Ctrl + clique.

 Exibir posição (top/left) e tamanho em tempo real ao arrastar/redimensionar.

 Snap visual com linhas guias e feedback sonoro ao alinhar.

5. Performance
 Debounce no atualizarPreview() em ações frequentes (drag, resize).

 Renderização incremental em vez de redesenhar tudo.

 Testes com centenas de elementos (stress test).

6. Acessibilidade e Navegação
 Navegação por teclado (Tab, setas).

 ARIA attributes nos elementos editáveis.

 Texto alternativo obrigatório em imagens.

7. Modularidade e Escalabilidade
 Separar todos os renderizadores em arquivos por tipo: renderButton, renderImage, renderText, etc.

 Interface comum para todos os elementos (com campos obrigatórios).

 Estrutura extensível para novos tipos de elementos.

8. Exportação e Compatibilidade
 Validar o JSON final antes de exportar.

 Avisar se faltam dados essenciais para o funcionamento do formulário.

 Suporte a múltiplos formatos de exportação (.json, .zip, .png com print do layout).


 