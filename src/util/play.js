async function playQueue(queueObj, queueIndex) {
  const { player } = window.MusicKitInstance;
  try {
    await window.MusicKitInstance.setQueue(
      Object.assign(queueObj, { startPosition: queueIndex - 1 }),
    );
    await player.play();
  } catch (e) {
    console.error(e);
  }
}

export const playAlbum = async ({ id: album }, index = 0) => playQueue({ album }, index);
export const playPlaylist = async ({ id: playlist }, index = 0) => playQueue({ playlist }, index);
export const playSongs = async (songs, index = 0) => playQueue({ items: songs }, index);
export const playSong = async ({ id: song }) => playQueue({ song }, 0);
