import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipo para a navegação
type RootStackParamList = {
  RegistroPonto: undefined;
  Historico: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'RegistroPonto'>;

// Função para buscar dados do usuário atual
const getCurrentUser = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      console.error('Token JWT não encontrado.');
      return null;
    }

    const response = await axios.get('http://192.168.1.68:8000/users/current', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data; // Retorna os dados do usuário
    } else {
      console.error('Erro ao obter dados do usuário:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return null;
  }
};

const RegistroPontoScreen: React.FC<Props> = ({ navigation }) => {
  const [userData, setUserData] = useState<any>(null);

  // useEffect para buscar os dados do usuário assim que a tela for montada
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserData(user);
      } else {
        console.error('Não foi possível obter os dados do usuário.');
      }
    };

    fetchUserData();
  }, []);

  const handleRegistro = async () => {
    try {
      // Recupera o token JWT armazenado
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        alert('Erro ao recuperar o token. Faça login novamente.');
        return;
      }
  
      // Faz a requisição para registrar o ponto
      const response = await axios.post('http://192.168.1.68:8000/time_logs', {}, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho
        },
      });
  
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Ponto registrado com sucesso!');
      } else {
        Alert.alert('Erro', 'Falha ao registrar o ponto.');
      }
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao conectar com a API.');
    }
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <Text>Bem-vindo, {userData.name || 'Usuário'}!</Text> // Ajuste conforme os dados retornados pela sua API
      ) : (
        <Text>Carregando informações do usuário...</Text>
      )}
      <Text style={styles.title}>Registrar Ponto</Text>
      <Button title="Registrar Ponto" onPress={handleRegistro} />
      <Button title="Ver Histórico" onPress={() => navigation.navigate('Historico')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default RegistroPontoScreen;
