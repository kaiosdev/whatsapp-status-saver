// Constantes compartilhadas pelo app.

// Chave do AsyncStorage onde guardamos a pasta (URI do SAF) escolhida pelo usuário.
export const STATUS_DIR_KEY = '@whatsapp_status_dir_uri';

// Chave onde guardamos "quando vimos cada arquivo pela primeira vez" (usado para ordenar).
export const FIRST_SEEN_KEY = '@whatsapp_status_first_seen';

// Nome do álbum da galeria onde os status salvos ficam.
export const ALBUM_NAME = 'Status WhatsApp';

// Pasta onde o seletor de pastas do Android abre por padrão (facilita a escolha).
// É apenas uma sugestão: se o aparelho não aceitar, o seletor abre no local padrão.
export const INITIAL_PICKER_URI =
  'content://com.android.externalstorage.documents/document/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses';

export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
export const VIDEO_EXTENSIONS = ['mp4', '3gp', 'mkv', 'webm'];

export const COLORS = {
  primary: '#075E54',
  accent: '#25D366',
  text: '#333',
  textMuted: '#666',
  textLight: '#999',
  border: '#e0e0e0',
  surface: '#f5f5f5',
  danger: '#d32f2f',
};
