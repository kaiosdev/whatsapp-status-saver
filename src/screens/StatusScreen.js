import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import MediaTabs from '../components/MediaTabs';
import MediaThumb from '../components/MediaThumb';
import { ALBUM_NAME, COLORS } from '../constants';
import { ensureMediaPermission } from '../services/permissions';
import {
  getStoredDirUri,
  storeDirUri,
  clearStoredDirUri,
  pickStatusDirectory,
  listStatusMedia,
  isPermissionError,
} from '../services/statusService';
import { splitByKind, safeFileName } from '../utils/media';

// phase: 'loading' | 'needs-permission' | 'ready' | 'error'
export default function StatusScreen() {
  const isFocused = useIsFocused();
  const [dirUri, setDirUri] = useState(null);
  const [phase, setPhase] = useState('loading');
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [savingUri, setSavingUri] = useState(null);

  const mounted = useRef(true);
  const loadId = useRef(0);

  // 1) Ao abrir o app: recupera a pasta já autorizada. NÃO validamos a URI com
  //    getInfoAsync (ele sempre diz "não existe" para pastas SAF e fazia o app
  //    pedir a permissão de novo a cada abertura). A leitura da pasta, em
  //    loadStatus, é o teste real.
  useEffect(() => {
    mounted.current = true;
    (async () => {
      const stored = await getStoredDirUri();
      if (!mounted.current) return;
      if (stored) {
        setDirUri(stored);
      } else {
        setPhase('needs-permission');
      }
    })();
    return () => {
      mounted.current = false;
    };
  }, []);

  // 2) Lê a pasta. loadId descarta respostas antigas se duas leituras se sobrepuserem.
  const loadStatus = useCallback(async () => {
    if (!dirUri) return;
    const id = ++loadId.current;
    // Só mostra o "Carregando..." quando ainda não há lista (evita a tela piscar ao voltar para a aba).
    setPhase((current) => (current === 'ready' ? current : 'loading'));

    try {
      const media = await listStatusMedia(dirUri);
      if (!mounted.current || id !== loadId.current) return;
      setItems(media);
      setPhase('ready');
    } catch (error) {
      console.warn('Erro ao carregar status:', error);
      if (!mounted.current || id !== loadId.current) return;

      if (isPermissionError(error)) {
        // O Android realmente revogou o acesso: aí sim pedimos a pasta de novo.
        await clearStoredDirUri();
        setDirUri(null);
        setItems([]);
        setPhase('needs-permission');
      } else {
        // Erro passageiro: mantém a permissão salva e deixa o usuário tentar de novo.
        setPhase('error');
      }
    } finally {
      if (mounted.current && id === loadId.current) setRefreshing(false);
    }
  }, [dirUri]);

  // Recarrega sempre que a aba volta ao foco (ex.: depois de ver status novos no WhatsApp).
  useEffect(() => {
    if (isFocused && dirUri) loadStatus();
  }, [isFocused, dirUri, loadStatus]);

  const chooseFolder = async () => {
    try {
      const uri = await pickStatusDirectory();
      if (!uri) {
        Alert.alert('Permissão Negada', 'Você precisa selecionar a pasta de status para continuar.');
        return;
      }
      await storeDirUri(uri);
      setItems([]);
      setPhase('loading');
      setDirUri(uri);
    } catch (error) {
      console.warn('Erro ao escolher pasta:', error);
      Alert.alert('Erro', 'Não foi possível abrir o seletor de pastas. Tente novamente.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStatus();
  };

  const saveStatus = async (item) => {
    if (savingUri) return; // evita toques repetidos enquanto salva
    setSavingUri(item.uri);
    let tempPath = null;

    try {
      const granted = await ensureMediaPermission();
      if (!granted) {
        Alert.alert('Permissão Negada', 'É necessário permitir acesso à galeria para salvar.');
        return;
      }

      tempPath = `${FileSystem.cacheDirectory}${safeFileName(item.name)}`;
      await FileSystem.copyAsync({ from: item.uri, to: tempPath });

      const asset = await MediaLibrary.createAssetAsync(tempPath);
      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
      }

      Alert.alert('Sucesso!', 'Status salvo na galeria com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar o arquivo.');
    } finally {
      if (tempPath) {
        FileSystem.deleteAsync(tempPath, { idempotent: true }).catch(() => {});
      }
      if (mounted.current) setSavingUri(null);
    }
  };

  const { images, videos } = useMemo(() => splitByKind(items), [items]);

  const renderItem = useCallback(
    ({ item, size }) => (
      <TouchableOpacity activeOpacity={0.8} onPress={() => saveStatus(item)}>
        <MediaThumb uri={item.uri} isVideo={item.kind === 'video'} size={size}>
          <View style={styles.downloadBadge}>
            {savingUri === item.uri ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="download" size={22} color="white" />
            )}
          </View>
        </MediaThumb>
      </TouchableOpacity>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [savingUri]
  );

  // ----------------------------- Telas -----------------------------

  if (phase === 'loading') {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (phase === 'needs-permission') {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="folder-open-outline" size={80} color="#ccc" />
        <Text style={styles.title}>Permissão Necessária</Text>
        <Text style={styles.bodyText}>
          Para acessar os status do WhatsApp no Android 11+, você precisa nos dar permissão à pasta de status. Isso é
          feito uma única vez.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={chooseFolder}>
          <Text style={styles.primaryButtonText}>Permitir Acesso</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          Na tela seguinte, navegue até a pasta:{'\n'}
          <Text style={styles.bold}>Android &gt; media &gt; com.whatsapp &gt; WhatsApp &gt; Media &gt; .Statuses</Text>
          {'\n'}e toque em "Usar esta pasta".
        </Text>
      </View>
    );
  }

  if (phase === 'error') {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
        <Text style={styles.title}>Não foi possível carregar</Text>
        <Text style={styles.bodyText}>Sua permissão continua salva. Tente carregar novamente.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={loadStatus}>
          <Text style={styles.primaryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={chooseFolder}>
          <Text style={styles.linkButtonText}>Escolher a pasta novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="images-outline" size={80} color="#ccc" />
        <Text style={styles.title}>Nenhum status encontrado</Text>
        <Text style={styles.bodyText}>
          Veja algum status no WhatsApp e volte aqui. Se mesmo assim nada aparecer, confira se a pasta escolhida é a{' '}
          <Text style={styles.bold}>.Statuses</Text>.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={onRefresh}>
          <Text style={styles.primaryButtonText}>Atualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={chooseFolder}>
          <Text style={styles.linkButtonText}>Trocar pasta</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarText}>Mais recentes primeiro</Text>
        <TouchableOpacity onPress={chooseFolder} style={styles.toolbarButton} accessibilityLabel="Trocar pasta">
          <Ionicons name="folder-open-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <MediaTabs
        images={images}
        videos={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.uri}
        extraData={savingUri}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toolbarText: { fontSize: 13, color: COLORS.textMuted },
  toolbarButton: { padding: 8 },
  downloadBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 5,
  },
  loadingText: { marginTop: 10, fontSize: 16, color: COLORS.textMuted },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginTop: 20, marginBottom: 10, textAlign: 'center' },
  bodyText: { fontSize: 15, color: COLORS.textMuted, textAlign: 'center', marginBottom: 25, lineHeight: 22, paddingHorizontal: 20 },
  bold: { fontWeight: 'bold' },
  primaryButton: { backgroundColor: COLORS.accent, paddingHorizontal: 40, paddingVertical: 14, borderRadius: 30 },
  primaryButtonText: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  linkButton: { marginTop: 16, padding: 8 },
  linkButtonText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  hint: { marginTop: 20, textAlign: 'center', color: COLORS.textLight, paddingHorizontal: 10, lineHeight: 20 },
});
