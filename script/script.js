fetch('chemin/vers/ton/fichier.json') // requête vers le fichier JSON
  .then(response => response.json()) // convertir la réponse textuelle en JSON
  .then(data => {
    // traiter les données
    console.log(data);
  });

// Graphique des artistes
const ctxArtist = document.getElementById('artistChart');

new Chart(ctxArtist, {
  type: 'bar',
  data: {
    labels: ['Ado', 'SCANDAL', 'Zarame', 'HepuPiano', 'Superfly', 'TRUE', '芽兎めう', 'Yorushika', 'NEKI', 'Tao Tsuchiya'],
    datasets: [{
      label: 'Nombre de morceaux',
      data: [10, 7, 3, 2, 2, 2, 1, 1, 1, 1],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true
      }
    }
  }
});

// Graphique des genres
const ctxGenre = document.getElementById('genreChart');

new Chart(ctxGenre, {
  type: 'pie',
  data: {
    labels: ['animé', 'j-pop', 'j-rock', 'vocaloid', 'indie japonaise', 'variété française', 'chanson', 'Autres'],
    datasets: [{
      label: 'Genres musicaux',
      data: [30, 25, 15, 10, 7, 5, 3, 5],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#BA68C8',
        '#4DB6AC', '#FFD54F', '#81C784', '#B0BEC5'
      ]
    }]
  }
});
