fetch('data/data.json')
  .then(res => res.json())
  .then(data => {
    const artistCount = {};
    const genreCount = {};
    const albumCount = {};
    const trackLabels = [];
    const trackDetails = [];

    data.forEach(entry => {
      // Artistes
      entry.artists.forEach(artist => {
        artistCount[artist.name] = (artistCount[artist.name] || 0) + 1;

        if (artist.genres) {
          artist.genres.forEach(genre => {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
          });
        }
      });

      // Albums
      const albumName = entry.album?.name || "Inconnu";
      albumCount[albumName] = (albumCount[albumName] || 0) + 1;

      // Morceaux
      trackLabels.push(entry.title);
      trackDetails.push(entry); // Stocke l'objet complet pour la modale
    });

    // Charts
    createBarChart("topArtistsChart", artistCount, "Top artistes", 8);
    createPieChart("genresChart", genreCount, "Genres", 6);
    createBarChart("albumsChart", albumCount, "Top albums", 8);

    createTrackChart("tracksChart", trackLabels, trackDetails);
  });

function createBarChart(id, dataObj, label, limit) {
  const sorted = Object.entries(dataObj).sort((a, b) => b[1] - a[1]).slice(0, limit);
  new Chart(document.getElementById(id), {
    type: 'bar',
    data: {
      labels: sorted.map(e => e[0]),
      datasets: [{
        label: label,
        data: sorted.map(e => e[1]),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: { x: { beginAtZero: true } }
    }
  });
}

function createPieChart(id, dataObj, label, limit) {
  const sorted = Object.entries(dataObj).sort((a, b) => b[1] - a[1]).slice(0, limit);
  new Chart(document.getElementById(id), {
    type: 'pie',
    data: {
      labels: sorted.map(e => e[0]),
      datasets: [{
        label: label,
        data: sorted.map(e => e[1]),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ]
      }]
    }
  });
}

function createTrackChart(id, labels, details) {
  const ctx = document.getElementById(id);
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Morceaux',
        data: Array(labels.length).fill(1),
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }]
    },
    options: {
      indexAxis: 'y',
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const i = elements[0].index;
          showModal(details[i]);
        }
      },
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { beginAtZero: true, display: false }
      }
    }
  });
}

function showModal(track) {
  const modalLabel = document.getElementById('trackModalLabel');
  const details = document.getElementById('trackDetails');
  modalLabel.textContent = track.title;

  let artistList = track.artists.map(a => a.name).join(", ");
  let genres = track.artists.flatMap(a => a.genres || []).join(", ");
  let album = track.album?.name || "Inconnu";

  details.innerHTML = `
    <p><strong>Artiste(s) :</strong> ${artistList}</p>
    <p><strong>Album :</strong> ${album}</p>
    <p><strong>Genres :</strong> ${genres}</p>
  `;

  const modal = new bootstrap.Modal(document.getElementById('trackModal'));
  modal.show();
}
