import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
  Share
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 40) / 3;

export default function SavedScreen() {
  const [savedFiles, setSavedFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSavedFiles();
  }, []);

  const loadSavedFiles = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'É necessário conceder permissão para acessar a galeria.'
        );
        return;
      }

      // Buscar álbum "Status WhatsApp"
      const albums = await MediaLibrary.getAlbumsAsync();
      const statusAlbum = albums.find(album => album.title === 'Status WhatsApp');

      if (statusAlbum) {
        const media = await MediaLibrary.getAssetsAsync({
          album: statusAlbum,
          sortBy: MediaLibrary.SortBy.creationTime,
          mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        });

        setSavedFiles(media.assets);
      } else {
        setSavedFiles([]);
      }
    } catch (error) {
      console.error('Erro ao carregar arquivos salvos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os arquivos salvos.');
    }
  };

  const deleteFile = async (asset) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este arquivo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await MediaLibrary.deleteAssetsAsync([asset]);
              Alert.alert('Sucesso', 'Arquivo excluído com sucesso!');
              loadSavedFiles();
            } catch (error) {
              console.error('Erro ao excluir:', error);
              Alert.alert('Erro', 'Não foi possível excluir o arquivo.');
            }
          },
        },
      ]
    );
  };

  const shareFile = async (asset) => {
    try {
      await Share.share({
        url: asset.uri,
        message: 'Compartilhando status do WhatsApp',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSavedFiles().then(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => {
    const isVideo = item.mediaType === 'video';
    
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.thumbnail}
          onLongPress={() => deleteFile(item)}
        >
          <Image
            source={{ uri: item.uri }}
            style={styles.image}
            resizeMode="cover"
          />
          {isVideo && (
            <View style={styles.playIconContainer}>
              <Ionicons name="play-circle" size={40} color="white" />
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => shareFile(item)}
          >
            <Ionicons name="share-social" size={20} color="#075E54" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteFile(item)}
          >
            <Ionicons name="trash" size={20} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (savedFiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="folder-open-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>Nenhum arquivo salvo</Text>
        <Text style={styles.emptySubtext}>
          Os status salvos aparecerão aqui
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadSavedFiles}>
          <Text style={styles.refreshButtonText}>Atualizar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {savedFiles.length} arquivos salvos
        </Text>
        <TouchableOpacity onPress={loadSavedFiles}>
          <Ionicons name="refresh" size={24} color="#075E54" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={savedFiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#25D366']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#075E54',
  },
  listContent: {
    padding: 5,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    maxWidth: '48%',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: 'white',
  },
  actionButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  refreshButton: {
    marginTop: 20,
    backgroundColor: '#25D366',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
