const fs = require('fs');
const path = require('path');

// Chemin vers le fichier data.json
const filePath = path.join(__dirname, 'data.json');

// Lecture et affichage du contenu de data.json
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Erreur lors de la lecture du fichier :', err);
        return;
    }
    try {
        const jsonData = JSON.parse(data);
        console.log('Contenu de data.json :', jsonData);
    } catch (parseError) {
        console.error('Erreur lors de l\'analyse du JSON :', parseError);
    }
});

<script>
  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
</script>
