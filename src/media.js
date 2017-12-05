import CryptoJS from 'crypto-js';
import db from './db';

export function calculateHash(blob) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(blob);
  return new Promise((resolve, reject) => {
    reader.onloadend = function () {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      resolve(CryptoJS.SHA256(wordArray).toString());
    };
    reader.onerror = reject;
  });
}

window.generateHash = async function (node) {
  const req = await fetch(node.src);
  const blob = await req.blob();
  return calculateHash(blob);
};

export async function saveMedia(src) {
  const req = await fetch(src);
  const blob = await req.blob();
  const hash = await calculateHash(blob);
  await db.set(hash, blob);
  try {
    socket.emit('share.file', { hash, blob });
  } catch (ex) {
    console.error(ex);
  }

  return blob;
}

export async function updateMedia({ hash, src }) {
  const exists = await db.exists(hash);
  if (exists) {
    return db.get(hash);
  }

  return saveMedia(src);
}

export async function loadMedia(hash) {
  let media = null;
  try {
    media = await db.get(hash);
  } catch (ex) {
  }

  if (!media) {
    return new Promise((resolve) => {
      socket.emit('request.file', hash);
      socket.on('response.file', (data) => {
        if (data.hash == hash)
          resolve(new Blob([new Uint8Array(data.buffer)]));
      });
    })
  }


  return media;
}
