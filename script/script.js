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
    const album = item.album;
    const artists = item.artists;
    return {
      titre: item.name,
      artiste: artists.map(a => a.name).join(", "),
      album: album.name,
      genres: artists.flatMap(a => a.genres || []),
      popularity: item.popularity || 0,
      preview_url: item.preview_url,
      duration_ms: item.duration_ms,
      spotify_url: item.external_urls?.spotify,
      image: album.images?.[0]?.url || ""
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
  tbody.innerHTML = "";
  tracks.forEach((track, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${track.titre}</td>
      <td>${track.artiste}</td>
      <td>${track.album}</td>
      <td><button class="btn btn-primary btn-sm" data-index="${index}">🎧 Spotify</button></td>
    `;
    tr.querySelector("button").addEventListener("click", () => showTrackModal(track));
    tbody.appendChild(tr);
  });
}

function showTrackModal(track) {
  const modalTitle = document.getElementById("trackModalTitle");
  const modalBody = document.getElementById("trackModalBody");

  const preview = track.preview_url
    ? `<audio class="w-100 mb-3" controls src="${track.preview_url}"></audio>`
    : `<div class="mb-3 text-muted">Aucun extrait disponible</div>`;

  const duration = Math.floor((track.duration_ms || 0) / 60000) + ":" +
    String(Math.floor(((track.duration_ms || 0) % 60000) / 1000)).padStart(2, "0");

  const genresHTML = (track.genres?.length ? track.genres : ["inconnu"]).map(g =>
    `<span class="badge bg-secondary me-1">${g}</span>`
  ).join("");

  modalTitle.innerText = track.titre;
  modalBody.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <img src="${track.image}" class="img-fluid mb-3" alt="${track.album}">
        <p class="mb-1"><strong>Album :</strong><br>${track.album}</p>
        <p><strong>Popularité :</strong> <span class="badge bg-success">${track.popularity}/100</span></p>
      </div>
      <div class="col-md-8">
        ${preview}
        <p><strong>Durée :</strong> ${duration}</p>
        <p><strong>Artiste(s) :</strong><br>${track.artiste}</p>
        <p><strong>Genres :</strong><br>${genresHTML}</p>
        <a class="btn btn-success" href="${track.spotify_url}" target="_blank">Ouvrir dans Spotify</a>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById("trackModal"));
  modal.show();
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
