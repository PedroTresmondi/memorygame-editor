// src/main.ts
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>PHYGITAL MEMORY CREATOR</h1>
  <ul>
    <li><a href="/creator/cadastroEditor.html">Editor de Cadastro</a></li>
    <li><a href="/creator/configuracaoEditor.html">Editor de Jogo</a></li>
    <li><a href="/cadastro/cadastro.html">Tela de Cadastro</a></li>
    <li><a href="/game/game.html">Jogar</a></li>
  </ul>
`;
