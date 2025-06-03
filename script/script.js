document.addEventListener("DOMContentLoaded", () => {
  fetch("data/data.json")
    .then((res) => res.json())
    .then((data) => {
      const tracks = extractTracks(data);
      const albums = extractAlbums(data);
      generateArtistChart(tracks);
      generateGenreChart(tracks);
      populateSongsTable(tracks);
      displayAlbums(albums);
    });

  document.getElementById("searchInput").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#songsTable tbody tr");
    rows.forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
  });
});

function extractTracks(data) {
  return data.map(item => {
    const track = item;
    const album = track.album;
    const artistNames = track.artists.map(a => a.name).join(", ");
    const genres = track.artists.flatMap(a => a.genres || []);
    return {
      titre: track.name,
      artiste: artistNames,
      album: album.name,
      genres: genres,
      popularity: track.popularity || 0
    };
  });
}

function extractAlbums(data) {
  const albumMap = new Map();
  data.forEach(track => {
    const album = track.album;
    if (!albumMap.has(album.id)) {
      albumMap.set(album.id, {
        nom: album.name,
        artiste: album.artists.map(a => a.name).join(", "),
        nbTitres: album.total_tracks,
        note: album.popularity || 0,
        date: album.release_date,
        image: album.images?.[1]?.url || ""
      });
    }
  });
  return [...albumMap.values()];
}

function generateArtistChart(tracks) {
  const counts = {};
  tracks.forEach(track => {
    track.artiste.split(", ").forEach(name => {
      counts[name] = (counts[name] || 0) + 1;
    });
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const ctx = document.getElementById("artistChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: sorted.map(x => x[0]),
      datasets: [{
        label: "Nombre de morceaux",
        data: sorted.map(x => x[1]),
        backgroundColor: "#007bff"
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true
    }
  });
}

function generateGenreChart(tracks) {
  const genreCounts = {};
  tracks.forEach(track => {
    track.genres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const labels = Object.keys(genreCounts);
  const data = Object.values(genreCounts);
  const colors = labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);

  const ctx = document.getElementById("genreChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function populateSongsTable(tracks) {
  const tbody = document.querySelector("#songsTable tbody");
  tracks.forEach(track => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${track.titre}</td>
      <td>${track.artiste}</td>
      <td>${track.album}</td>
      <td><button class="btn btn-primary btn-sm">🎧 Spotify</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function displayAlbums(albums) {
  const container = document.getElementById("albumsContainer");
  albums.forEach(album => {
    const col = document.createElement("div");
    col.className = "col-md-3 mb-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${album.image}" class="card-img-top" alt="${album.nom}">
        <div class="card-body">
          <h6 class="card-title">${album.nom}</h6>
          <p class="card-text"><small>${album.artiste}</small><br>
          ${album.date}</p>
          <span class="badge bg-primary">${album.nbTitres} titres</span>
          <span class="badge bg-success">${album.note}/100</span>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}
