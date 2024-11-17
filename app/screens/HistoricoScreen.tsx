import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoricoScreen: React.FC = () => {
  const [timeLogs, setTimeLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para buscar registros de pontos
  const fetchTimeLogs = async () => {
    try {
      // Recupera o token JWT armazenado
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        alert('Erro ao recuperar o token. Faça login novamente.');
        return;
      }

      // Faz a requisição para a API
      const response = await axios.get('http://192.168.1.68:8000/time_logs', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setTimeLogs(response.data); // Armazena os registros de pontos no estado
      } else {
        Alert.alert('Erro', 'Falha ao buscar registros de pontos.');
      }
    } catch (error) {
      console.error('Erro ao buscar registros de pontos:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao conectar com a API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeLogs(); // Chama a função quando o componente for montado
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Carregando registros de pontos...</Text>
      ) : (
        <FlatList
          data={timeLogs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>Usuário ID: {item.user_id}</Text>
              <Text>Ação: {item.action}</Text>
              <Text>Data/Hora: {item.timestamp}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default HistoricoScreen;
