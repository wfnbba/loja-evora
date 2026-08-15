// Algoritmo determinístico que compõe 1000 nomes femininos brasileiros comuns
// (prenome + inicial de sobrenome), usado apenas para avaliações somente-nota.

const FIRST_NAMES = [
  "Maria", "Ana", "Francisca", "Antônia", "Adriana", "Juliana", "Márcia", "Fernanda", "Patrícia", "Aline",
  "Sandra", "Camila", "Amanda", "Bruna", "Jéssica", "Letícia", "Júlia", "Luciana", "Vanessa", "Mariana",
  "Gabriela", "Vera", "Larissa", "Cláudia", "Daniela", "Rita", "Simone", "Beatriz", "Carla", "Rosa",
  "Isabela", "Débora", "Cristina", "Eliane", "Renata", "Tatiane", "Michele", "Priscila", "Rafaela", "Elaine",
  "Bianca", "Carolina", "Sabrina", "Andreia", "Fabiana", "Monica", "Regina", "Silvana", "Viviane", "Natália",
  "Alessandra", "Cíntia", "Raquel", "Luana", "Tais", "Milena", "Paloma", "Kelly", "Rosana", "Solange",
  "Sônia", "Lúcia", "Marta", "Helena", "Teresa", "Gisele", "Flávia", "Karina", "Elisângela", "Josefa",
  "Iara", "Nathália", "Verônica", "Lorena", "Vitória", "Yasmin", "Emanuelle", "Ingrid", "Jaqueline", "Kátia",
  "Leandra", "Marcela", "Nádia", "Olívia", "Poliana", "Roberta", "Suzana", "Thaís", "Valéria", "Wanessa",
  "Alice", "Laura", "Sophia", "Manuela", "Valentina", "Heloísa", "Cecília", "Eloá", "Lívia", "Clara",
];

const SURNAMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes",
];

export const REVIEW_NAMES: string[] = (() => {
  const list: string[] = [];
  for (let i = 0; i < FIRST_NAMES.length; i++) {
    for (let j = 0; j < SURNAMES.length; j++) {
      const first = FIRST_NAMES[(i + j) % FIRST_NAMES.length] ?? "Maria";
      const last = SURNAMES[(j + i * 3) % SURNAMES.length] ?? "Silva";
      list.push(`${first} ${last.charAt(0)}.`);
    }
  }
  return list;
})();
