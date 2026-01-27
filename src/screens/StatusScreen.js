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
  ActivityIndicator
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 40) / 3;

export default function StatusScreen() {
  const [statusFiles, setStatusFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Caminho do WhatsApp Status no Android 11+
  const WHATSAPP_STATUS_PATH = FileSystem.documentDirectory + '../.Statuses/';
  const WHATSAPP_BUSINESS_STATUS_PATH = FileSystem.documentDirectory + '../.StatusesBusiness/';

  useEffect(() => {
    loadStatusFiles();
  }, []);

  const loadStatusFiles = async () => {
    try {
      setLoading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'É necessário conceder permissão para acessar os arquivos.'
        );
        setLoading(false);
        return;
      }

      // Tenta buscar arquivos do WhatsApp normal e Business
      let files = [];
      
      try {
        // Para Android 11+, usar o caminho correto do WhatsApp
        const whatsappPath = '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses';
        const whatsappBusinessPath = '/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses';
        
        // Buscar arquivos
        const normalStatus = await getFilesFromDirectory(whatsappPath);
        const businessStatus = await getFilesFromDirectory(whatsappBusinessPath);
        
        files = [...normalStatus, ...businessStatus];
      } catch (error) {
        console.log('Erro ao buscar arquivos:', error);
      }

      // Filtrar apenas imagens e vídeos
      const mediaFiles = files.filter(file => {
        const ext = file.toLowerCase();
        return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || 
               ext.endsWith('.png') || ext.endsWith('.mp4') || 
               ext.endsWith('.gif');
      });

      setStatusFiles(mediaFiles);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
      Alert.alert('Erro', 'Não foi possível carregar os status do WhatsApp.');
      setLoading(false);
    }
  };

  const getFilesFromDirectory = async (dirPath) => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      
      if (!dirInfo.exists) {
        return [];
      }

      const files = await FileSystem.readDirectoryAsync(dirPath);
      return files.map(file => `${dirPath}/${file}`);
    } catch (error) {
      return [];
    }
  };

  const saveStatus = async (filePath) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'É necessário conceder permissão para salvar arquivos.'
        );
        return;
      }

      const fileName = filePath.split('/').pop();
      const fileExtension = fileName.split('.').pop();
      const newPath = `${FileSystem.documentDirectory}${Date.now()}.${fileExtension}`;

      // Copiar arquivo
      await FileSystem.copyAsync({
        from: filePath,
        to: newPath
      });

      // Salvar na galeria
      const asset = await MediaLibrary.createAssetAsync(newPath);
      await MediaLibrary.createAlbumAsync('Status WhatsApp', asset, false);

      Alert.alert('Sucesso!', 'Status salvo na galeria com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar o arquivo.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStatusFiles().then(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => {
    const isVideo = item.toLowerCase().endsWith('.mp4');
    
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => saveStatus(item)}
      >
        <Image
          source={{ uri: `file://${item}` }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {isVideo && (
          <View style={styles.playIconContainer}>
            <Ionicons name="play-circle" size={40} color="white" />
          </View>
        )}
        <View style={styles.downloadIconContainer}>
          <Ionicons name="download" size={24} color="white" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#25D366" />
        <Text style={styles.loadingText}>Carregando status...</Text>
      </View>
    );
  }

  if (statusFiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="images-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>Nenhum status encontrado</Text>
        <Text style={styles.emptySubtext}>
          Certifique-se de que você visualizou alguns status no WhatsApp
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadStatusFiles}>
          <Text style={styles.refreshButtonText}>Atualizar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {statusFiles.length} status encontrados
        </Text>
        <TouchableOpacity onPress={loadStatusFiles}>
          <Ionicons name="refresh" size={24} color="#075E54" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={statusFiles}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
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
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  downloadIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
    paddingHorizontal: 30,
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
