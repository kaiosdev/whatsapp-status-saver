import * as MediaLibrary from 'expo-media-library';

let pending = null;

/**
 * Garante a permissão da galeria (necessária para salvar/listar os salvos).
 *
 * O Android só aceita UM pedido de permissão por vez; se duas telas pedirem ao
 * mesmo tempo o segundo falha. Por isso reaproveitamos o pedido em andamento.
 */
export function ensureMediaPermission() {
  if (pending) return pending;

  pending = (async () => {
    try {
      const current = await MediaLibrary.getPermissionsAsync();
      if (current.granted) return true;
      const requested = await MediaLibrary.requestPermissionsAsync();
      return requested.granted;
    } catch (error) {
      console.warn('Falha ao obter permissão da galeria:', error);
      return false;
    } finally {
      pending = null;
    }
  })();

  return pending;
}
