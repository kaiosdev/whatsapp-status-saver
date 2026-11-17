import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import MediaTabs from '../components/MediaTabs';
import MediaThumb from '../components/MediaThumb';
import { ALBUM_NAME, COLORS } from '../constants';
import { ensureMediaPermission } from '../services/permissions';
import { splitByKind, getExtension } from '../utils/media';

const PAGE_SIZE = 100;

// Busca TODOS os itens do álbum (o padrão da biblioteca é só 20 por chamada),
// do mais recente para o mais antigo.
async function fetchAllSaved() {
  const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
  if (!album) return [];

  const all = [];
  let after;
  let hasNext = true;
  while (hasNext) {
    const page = await MediaLibrary.getAssetsAsync({
      album,
      first: PAGE_SIZE,
      after,
      sortBy: MediaLibrary.SortBy.creationTime, // chave sozinha = mais recente primeiro
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
    });
    all.push(...page.assets);
    hasNext = page.hasNextPage;
    after = page.endCursor;
  }

  return all
    .map((asset) => ({
      asset,
      uri: asset.uri,
      id: asset.id,
      kind: asset.mediaType === MediaLibrary.MediaType.video ? 'video' : 'image',
      date: asset.creationTime || 0,
    }))
    .sort((a, b) => b.date - a.date);
}

export default function SavedScreen() {
  const isFocused = useIsFocused();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadSaved = useCallback(async () => {
    try {
      const granted = await ensureMediaPermission();
      if (!granted) {
        Alert.alert('Permissão Negada', 'É necessário conceder permissão para acessar a galeria.');
        if (mounted.current) setItems([]);
        return;
      }
      const saved = await fetchAllSaved();
      if (mounted.current) setItems(saved);
    } catch (error) {
      console.error('Erro ao carregar arquivos salvos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os arquivos salvos.');
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  // Recarrega toda vez que a aba ganha foco: o que acabou de ser salvo já aparece.
  useEffect(() => {
    if (isFocused) loadSaved();
  }, [isFocused, loadSaved]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSaved();
  };

  const deleteFile = (item) => {
    Alert.alert('Confirmar Exclusão', 'Deseja realmente excluir este arquivo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await MediaLibrary.deleteAssetsAsync([item.asset]);
            Alert.alert('Sucesso', 'Arquivo excluído com sucesso!');
            loadSaved();
          } catch (error) {
            console.error('Erro ao excluir:', error);
            Alert.alert('Erro', 'Não foi possível excluir o arquivo.');
          }
        },
      },
    ]);
  };

  // O Share nativo do React Native ignora `url` no Android (só enviava o texto).
  // Copiamos o arquivo para o cache e abrimos o menu de compartilhar com ele de verdade.
  const shareFile = async (item) => {
    let tempPath = null;
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Indisponível', 'O compartilhamento não está disponível neste aparelho.');
        return;
      }
      const ext = getExtension(item.asset.filename || '') || (item.kind === 'video' ? 'mp4' : 'jpg');
      tempPath = `${FileSystem.cacheDirectory}share_${item.id}.${ext}`;
      await FileSystem.copyAsync({ from: item.uri, to: tempPath });
      await Sharing.shareAsync(tempPath, {
        mimeType: item.kind === 'video' ? 'video/*' : 'image/*',
        dialogTitle: 'Compartilhar status',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o arquivo.');
    } finally {
      if (tempPath) FileSystem.deleteAsync(tempPath, { idempotent: true }).catch(() => {});
    }
  };

  const { images, videos } = useMemo(() => splitByKind(items), [items]);

  const renderItem = useCallback(
    ({ item, size }) => (
      <View style={[styles.card, { width: size }]}>
        <TouchableOpacity activeOpacity={0.9} onLongPress={() => deleteFile(item)}>
          <MediaThumb uri={item.uri} isVideo={item.kind === 'video'} size={size} />
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => shareFile(item)} accessibilityLabel="Compartilhar">
            <Ionicons name="share-social" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => deleteFile(item)} accessibilityLabel="Excluir">
            <Ionicons name="trash" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="folder-open-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>Nenhum arquivo salvo</Text>
        <Text style={styles.emptySubtext}>Os status salvos aparecerão aqui</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Atualizar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{items.length} arquivos salvos · mais recentes primeiro</Text>
      </View>
      <MediaTabs
        images={images}
        videos={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  header: {
    padding: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerText: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  card: { borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' },
  actions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 4 },
  actionButton: { padding: 8 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMuted, marginTop: 20 },
  emptySubtext: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginTop: 10 },
  refreshButton: { marginTop: 20, backgroundColor: COLORS.accent, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  refreshButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
