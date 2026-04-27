// Configure a URL do seu backend aqui
const API_URL = "https://seu-backend.onrender.com";

async function carregarNoticias() {
  const container = document.getElementById("noticias");
  const mensagem = document.getElementById("mensagem");

  container.innerHTML = '<div class="loading">⏳ Carregando notícias...</div>';
  mensagem.innerHTML = '';

  try {
    const response = await fetch(`${API_URL}/noticias`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const dados = await response.json();

    if (dados.noticias.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #999;">Nenhuma notícia encontrada</p>';
      return;
    }

    container.innerHTML = dados.noticias.map(noticia => `
      <div class="noticia">
        <h3>${noticia.titulo}</h3>
        <p>${noticia.descricao}</p>
        <div class="noticia-meta">
          <span class="categoria">${noticia.categoria}</span>
          <span>📅 ${noticia.data}</span>
          <span>🆔 ID: ${noticia.id}</span>
        </div>
      </div>
    `).join('');

  } catch (erro) {
    console.error('Erro ao carregar notícias:', erro);
    mensagem.innerHTML = `
      <div class="error">
        ❌ Erro ao conectar ao backend: ${erro.message}
        <br/><small>Verifique se a URL está correta: ${API_URL}</small>
      </div>
    `;
    container.innerHTML = '';
  }
}

async function criarNoticia() {
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const categoria = document.getElementById("categoria").value.trim();
  const mensagem = document.getElementById("mensagem");

  if (!titulo || !descricao) {
    mensagem.innerHTML = '<div class="error">❌ Título e descrição são obrigatórios!</div>';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/noticias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        titulo,
        descricao,
        categoria: categoria || "Geral"
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const dados = await response.json();

    mensagem.innerHTML = '<div class="success">✅ Notícia criada com sucesso!</div>';

    document.getElementById("titulo").value = '';
    document.getElementById("descricao").value = '';
    document.getElementById("categoria").value = '';

    setTimeout(() => {
      carregarNoticias();
      mensagem.innerHTML = '';
    }, 1500);

  } catch (erro) {
    console.error('Erro ao criar notícia:', erro);
    mensagem.innerHTML = `<div class="error">❌ Erro ao criar notícia: ${erro.message}</div>`;
  }
}

// Carregar notícias ao abrir a página
document.addEventListener("DOMContentLoaded", carregarNoticias);