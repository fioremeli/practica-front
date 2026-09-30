/**
 * EXIMIA CODE · Discos con Spotify bajo demanda
 * Patrón facade: el iframe se crea sólo al pulsar ▶.
 */
(function () {
  'use strict';

  /* MULTIMEDIA: el iframe de Spotify sólo se crea al solicitarlo, reduciendo carga inicial. */
    document.querySelectorAll('.spotify-facade').forEach(function (card) {
      const button = card.querySelector('.play-btn');

      button?.addEventListener('click', function () {
        const spotifyId = card.dataset.spotifyId;
        const media = card.querySelector('.album-media');
        if (!media) return;

        if (!spotifyId) {
          const query = encodeURIComponent(
            card.dataset.spotifyQuery || card.querySelector('.album-title')?.textContent || 'Spotify'
          );
          window.open('https://open.spotify.com/search/' + query, '_blank', 'noopener');
          return;
        }

        if (media.querySelector('iframe')) return;

        const iframe = document.createElement('iframe');
        iframe.loading = 'lazy';
        iframe.title = 'Reproductor de Spotify';
        iframe.src = 'https://open.spotify.com/embed/album/' + spotifyId + '?utm_source=generator';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        media.replaceChildren(iframe);
      });
    });
})();
