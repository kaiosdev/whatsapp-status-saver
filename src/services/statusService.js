import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STATUS_DIR_KEY, FIRST_SEEN_KEY, INITIAL_PICKER_URI } from '../constants';
import { getFileName, getMediaKind, sortByRecent } from '../utils/media';

const { StorageAccessFramework } = FileSystem;

// ---------------------------------------------------------------------------
// Pasta escolhida pelo usuário (permissão persistente do Android)
// ---------------------------------------------------------------------------

export async function getStoredDirUri() {
  try {
    return await AsyncStorage.getItem(STATUS_DIR_KEY);
  } catch (e) {
    return null;
  }
}

export async function storeDirUri(uri) {
  await AsyncStorage.setItem(STATUS_DIR_KEY, uri);
}

export async function clearStoredDirUri() {
  try {
    await AsyncStorage.removeItem(STATUS_DIR_KEY);
  } catch (e) {
    // sem problema
  }
}

/**
 * Abre o seletor de pastas do Android. O expo-file-system já pede ao sistema
 * para MANTER a permissão (takePersistableUriPermission), então basta guardar
 * a URI para não perguntar de novo nas próximas aberturas.
 * Retorna a URI da pasta ou null se o usuário cancelar.
 */
export async function pickStatusDirectory() {
  let result;
  try {
    result = await StorageAccessFramework.requestDirectoryPermissionsAsync(INITIAL_PICKER_URI);
  } catch (e) {
    // Alguns aparelhos recusam a URI inicial; tenta sem ela.
    result = await StorageAccessFramework.requestDirectoryPermissionsAsync();
  }
  return result.granted ? result.directoryUri : null;
}

/** True quando o erro indica que o Android revogou a permissão da pasta. */
export function isPermissionError(error) {
  const message = String((error && error.message) || error || '');
  return /permission|security|denied|denial|not granted|isn't readable/i.test(message);
}

// ---------------------------------------------------------------------------
// Listagem e ordenação
// ---------------------------------------------------------------------------

async function readFirstSeen() {
  try {
    const raw = await AsyncStorage.getItem(FIRST_SEEN_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
}

/**
 * Lista as mídias da pasta de status, do mais recente para o mais antigo.
 *
 * O Android não informa a data de modificação de arquivos acessados via SAF
 * (e os nomes dos status do WhatsApp são hashes, sem data). Por isso registramos
 * o momento em que cada arquivo foi visto pela primeira vez e ordenamos por isso.
 * Como os status somem em 24h, os registros de arquivos que não existem mais
 * são descartados a cada leitura.
 */
export async function listStatusMedia(dirUri) {
  const uris = await StorageAccessFramework.readDirectoryAsync(dirUri);

  const firstSeen = await readFirstSeen();
  const now = Date.now();
  const nextSeen = {};
  const items = [];
  let offset = 0;

  for (const uri of uris) {
    const kind = getMediaKind(uri);
    if (!kind) continue;

    let date = firstSeen[uri];
    if (typeof date !== 'number') {
      // +offset mantém uma ordem estável entre arquivos descobertos juntos.
      date = now + offset;
      offset += 1;
    }
    nextSeen[uri] = date;
    items.push({ uri, kind, name: getFileName(uri), date });
  }

  // Só limpa o histórico se a leitura trouxe algo (evita apagar tudo numa falha momentânea).
  if (uris.length > 0) {
    try {
      await AsyncStorage.setItem(FIRST_SEEN_KEY, JSON.stringify(nextSeen));
    } catch (e) {
      // ordenar é um extra; não deve quebrar a listagem
    }
  }

  return sortByRecent(items);
}
