import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="logo-whatsapp" size={80} color="#25D366" />
        <Text style={styles.appName}>Status Saver</Text>
        <Text style={styles.version}>Versão 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Como usar</Text>
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>
            Abra o WhatsApp e visualize os status que deseja salvar
          </Text>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>
            Volte para este aplicativo e toque em "Status" na aba inferior
          </Text>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>
            Toque no status que deseja salvar - ele será automaticamente salvo na sua galeria
          </Text>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepText}>
            Acesse a aba "Salvos" para ver todos os status baixados
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recursos</Text>
        <View style={styles.featureContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#25D366" />
          <Text style={styles.featureText}>Salva fotos e vídeos</Text>
        </View>
        
        <View style={styles.featureContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#25D366" />
          <Text style={styles.featureText}>Suporta WhatsApp e WhatsApp Business</Text>
        </View>
        
        <View style={styles.featureContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#25D366" />
          <Text style={styles.featureText}>Interface simples e fácil de usar</Text>
        </View>
        
        <View style={styles.featureContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#25D366" />
          <Text style={styles.featureText}>Compartilhe os status salvos</Text>
        </View>
        
        <View style={styles.featureContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#25D366" />
          <Text style={styles.featureText}>Gerenciamento de arquivos salvos</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissões</Text>
        <Text style={styles.permissionText}>
          Este aplicativo precisa de permissão para:
        </Text>
        <View style={styles.permissionItem}>
          <Ionicons name="folder-open" size={20} color="#075E54" />
          <Text style={styles.permissionItemText}>
            Acessar armazenamento para ler os status do WhatsApp
          </Text>
        </View>
        <View style={styles.permissionItem}>
          <Ionicons name="image" size={20} color="#075E54" />
          <Text style={styles.permissionItemText}>
            Salvar fotos e vídeos na galeria
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Importante</Text>
        <Text style={styles.disclaimerText}>
          • Este aplicativo não está afiliado ao WhatsApp Inc.{'\n'}
          • Respeite a privacidade dos outros ao salvar status{'\n'}
          • Os status são salvos localmente no seu dispositivo{'\n'}
          • Certifique-se de ter permissões adequadas antes de compartilhar conteúdo de terceiros
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte para Android 11+</Text>
        <Text style={styles.disclaimerText}>
          Este aplicativo foi otimizado para funcionar no Android 11 e versões superiores, 
          seguindo as novas políticas de armazenamento do Android.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Desenvolvido com ❤️ usando React Native
        </Text>
        <Text style={styles.footerText}>© 2026 Status Saver</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f5f5f5',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#075E54',
    marginTop: 15,
  },
  version: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#075E54',
    marginBottom: 15,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
  permissionText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 15,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 10,
  },
  permissionItemText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    padding: 30,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 5,
  },
});
