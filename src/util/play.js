async function playQueue(queueObj, queueIndex) {
  const { player } = window.MusicKitInstance;
  try {
    await window.MusicKitInstance.setQueue(queueObj);
    await player.changeToMediaAtIndex(queueIndex);
    await player.play();
  } catch (e) {
    console.error(e);
  }
}

export const playAlbum = async ({ id: album }, index = 0) => playQueue({ album }, index);
export const playPlaylist = async ({ id: playlist }, index = 0) => playQueue({ playlist }, index);
export const playSong = async (items, index = 0) => playQueue({ items: items.slice(index) }, 0);
