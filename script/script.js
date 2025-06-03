fetch('data/data.json') // Charge le fichier JSON local
  .then(response => response.json())
  .then(data => {
    // === Traitement des données ===
    const artistCount = {};
    const genreCount = {};

    data.forEach(entry => {
      // Compter les artistes (à partir des artistes du morceau)
      if (entry.artists) {
        entry.artists.forEach(artist => {
          const name = artist.name;
          artistCount[name] = (artistCount[name] || 0) + 1;

          // Compter les genres de chaque artiste
          if (artist.genres) {
            artist.genres.forEach(genre => {
              genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
          }
        });
      }
    });

    // === Création du graphique des artistes ===
    const sortedArtists = Object.entries(artistCount).sort((a, b) => b[1] - a[1]);
    const artistLabels = sortedArtists.map(entry => entry[0]);
    const artistData = sortedArtists.map(entry => entry[1]);

    const ctxArtist = document.getElementById('artistChart').getContext('2d');
    new Chart(ctxArtist, {
      type: 'bar',
      data: {
        labels: artistLabels,
        datasets: [{
          label: 'Nombre de morceaux',
          data: artistData,
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

      // === Création du graphique des albums ===
      const albumCount = {};

      data.forEach(entry => {
        const albumName = entry.album?.name || 'Inconnu';
        albumCount[albumName] = (albumCount[albumName] || 0) + 1;
      });
  
      const sortedAlbums = Object.entries(albumCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
      const albumLabels = sortedAlbums.map(entry => entry[0]);
      const albumData = sortedAlbums.map(entry => entry[1]);
  
      const ctxAlbum = document.getElementById('albumChart').getContext('2d');
      new Chart(ctxAlbum, {
        type: 'bar',
        data: {
          labels: albumLabels,
          datasets: [{
            label: 'Nombre de morceaux par album',
            data: albumData,
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
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
  

    // === Création du graphique des genres ===
    const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
    const genreLabels = sortedGenres.map(entry => entry[0]);
    const genreData = sortedGenres.map(entry => entry[1]);

    const ctxGenre = document.getElementById('genreChart').getContext('2d');
    new Chart(ctxGenre, {
      type: 'pie',
      data: {
        labels: genreLabels,
        datasets: [{
          label: 'Genres musicaux',
          data: genreData,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#BA68C8',
            '#4DB6AC', '#FFD54F', '#81C784', '#B0BEC5'
          ]
        }]
      }
    });
  })
  .catch(error => {
    console.error("Erreur de chargement ou de traitement du fichier JSON :", error);
  });


