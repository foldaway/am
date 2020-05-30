async function playQueue(queueObj, queueIndex = 0, shuffle = false) {
  const { player } = window.MusicKitInstance;
  player.shuffleMode = shuffle ? 1 : 0;
  try {
    await window.MusicKitInstance.setQueue(
      Object.assign(queueObj, { startPosition: queueIndex - 1 }),
    );
    await player.play();
  } catch (e) {
    console.error(e);
  }
}

export const playAlbum = async ({ id: album }, index, shuffle = false) => playQueue({ album }, index, shuffle);
export const playPlaylist = async ({ id: playlist }, index, shuffle = false) => playQueue({ playlist }, index, shuffle);
export const playSongs = async (songs, index, shuffle = false) => playQueue({ items: songs }, index, shuffle);
export const playSong = async ({ id: song }) => playQueue({ song }, 0);
