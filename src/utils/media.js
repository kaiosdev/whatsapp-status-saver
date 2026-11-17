import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from '../constants';

/**
 * Extrai o nome do arquivo de uma URI. As URIs do SAF vêm codificadas
 * (ex.: ".../document/primary%3AAndroid%2Fmedia%2F...%2F.Statuses%2Fabc.jpg"),
 * então decodificamos antes de pegar o que vem depois da última barra.
 */
export function getFileName(uri) {
  let decoded = uri;
  try {
    decoded = decodeURIComponent(uri);
  } catch (e) {
    // URI com escape inválido: usa como está.
  }
  return decoded.split('/').pop() || 'status';
}

export function getExtension(name) {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

/** Retorna 'image', 'video' ou null (arquivos que não são mídia, como .nomedia). */
export function getMediaKind(uri) {
  const ext = getExtension(getFileName(uri));
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  return null;
}

/** Ordena do mais recente para o mais antigo, usando o campo numérico `date`. */
export function sortByRecent(items) {
  return [...items].sort((a, b) => b.date - a.date);
}

/** Separa uma lista já ordenada em imagens e vídeos, preservando a ordem. */
export function splitByKind(items) {
  const images = [];
  const videos = [];
  for (const item of items) {
    (item.kind === 'video' ? videos : images).push(item);
  }
  return { images, videos };
}

/** Nome seguro para arquivo temporário (sem barras, %, etc.). */
export function safeFileName(name) {
  return name.replace(/[^\w.\-]/g, '_');
}
