let jogador;
let campo;
let cidade;
let sementes = [];
let plantas = [];
let pontuacao = 0;
let tempoDeCrescimento = 0;
let estado = 'campo'; // O estado inicial é o campo

function setup() {
  createCanvas(800, 600);
  jogador = new Jogador(); // Cria o boneco
  campo = new Area('campo', 100, height - 100, 600, 200);
  cidade = new Area('cidade', 100, 50, 600, 200);
}

function draw() {
  background(135, 206, 235); // Cor do céu

  if (estado === 'campo') {
    campo.display();
    jogador.display();
    jogador.move();
    tempoDeCrescimento++;
    
    // Gerenciar o plantio e crescimento das sementes
    for (let i = sementes.length - 1; i >= 0; i--) {
      sementes[i].display();
      sementes[i].grow();
      if (sementes[i].size >= sementes[i].maxSize) {
        plantas.push(sementes[i].toPlanta());
        sementes.splice(i, 1);
      }
    }

    // Mostrar e coletar plantas
    for (let i = plantas.length - 1; i >= 0; i--) {
      plantas[i].display();
      if (dist(plantas[i].x, plantas[i].y, jogador.x, jogador.y) < plantas[i].size / 2 + jogador.size / 2) {
        pontuacao += plantas[i].getPontos();
        plantas.splice(i, 1); // Colher a planta
      }
    }
  } else if (estado === 'cidade') {
    cidade.display();
    textSize(24);
    fill(0);
    text('Pontuação: ' + pontuacao, 10, 30);
    text('Vender Colheitas', width / 2 - 100, height / 2);

    if (dist(jogador.x, jogador.y, width / 2, height / 2) < jogador.size) {
      // Vender as colheitas e ir para o campo
      pontuacao += plantas.length * 2; // Ganho por venda
      plantas = [];
      estado = 'campo';
    }
  }

  // Verificar transição entre o campo e a cidade
  if (dist(jogador.x, jogador.y, campo.x + campo.width - 10, campo.y + campo.height - 10) < jogador.size) {
    estado = 'cidade';
  }
}

// Classe do jogador (com boneco)
class Jogador {
  constructor() {
    this.x = 50;
    this.y = height - 150;
    this.size = 30; // Tamanho da cabeça
    this.bodyHeight = 50; // Altura do corpo
    this.speed = 5;
  }

  display() {
    // Corpo (um retângulo)
    fill(255, 215, 0); // Cor do corpo
    rect(this.x - 15, this.y, 30, this.bodyHeight);

    // Cabeça (círculo)
    fill(255, 224, 185); // Cor da pele
    ellipse(this.x, this.y - this.bodyHeight / 2, this.size * 2, this.size * 2); // Cabeça
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }
    // Limitar movimento dentro da tela
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }
}

// Classe da área (campo ou cidade)
class Area {
  constructor(nome, x, y, w, h) {
    this.nome = nome;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  display() {
    if (this.nome === 'campo') {
      fill(34, 139, 34); // Cor verde para o campo
      rect(this.x, this.y, this.width, this.height);
    } else if (this.nome === 'cidade') {
      fill(200, 200, 200); // Cor cinza para a cidade
      rect(this.x, this.y, this.width, this.height);
    }
  }
}

// Classe da semente
class Semente {
  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.size = 5;
    this.tipo = tipo;
    this.maxSize = tipo === 'comum' ? 30 : tipo === 'rapida' ? 20 : 40; // Diferentes tamanhos finais
    this.growthRate = tipo === 'comum' ? 0.1 : tipo === 'rapida' ? 0.3 : 0.05; // Diferentes taxas de crescimento
  }

  display() {
    if (this.tipo === 'comum') {
      fill(255, 223, 0); // Cor amarela para a semente comum
    } else if (this.tipo === 'rapida') {
      fill(0, 255, 0); // Cor verde para a semente rápida
    } else {
      fill(255, 0, 0); // Cor vermelha para a semente especial
    }
    ellipse(this.x, this.y, this.size, this.size);
  }

  grow() {
    this.size += this.growthRate;
  }

  toPlanta() {
    return new Planta(this.x, this.y, this.tipo);
  }
}

// Classe da planta
class Planta {
  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.size = tipo === 'comum' ? 30 : tipo === 'rapida' ? 25 : 40;
    this.tipo = tipo;
  }

  display() {
    if (this.tipo === 'comum') {
      fill(34, 139, 34); // Planta comum (verde)
    } else if (this.tipo === 'rapida') {
      fill(0, 255, 0); // Planta rápida (verde clara)
    } else {
      fill(255, 69, 0); // Planta especial (vermelho)
    }
    ellipse(this.x, this.y, this.size, this.size);
  }

  getPontos() {
    if (this.tipo === 'comum') {
      return 1; // Planta comum dá 1 ponto
    } else if (this.tipo === 'rapida') {
      return 2; // Planta rápida dá 2 pontos
    } else {
      return 3; // Planta especial dá 3 pontos
    }
  }
}

// Função para plantar uma semente no campo
function keyPressed() {
  if (key === ' ') { // Tecla espaço para plantar
    if (estado === 'campo') {
      let tipoSemente = random(['comum', 'rapida', 'especial']);
      sementes.push(new Semente(jogador.x, jogador.y, tipoSemente));
    }
  }
}
