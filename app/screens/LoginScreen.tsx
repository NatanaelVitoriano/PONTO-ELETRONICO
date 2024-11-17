import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo o tipo de props para a navegação
type RootStackParamList = {
  Login: undefined;
  RegistroPonto: undefined;
  Cadastro: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Função para salvar o token
const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('jwt_token', token);
  } catch (error) {
    console.error('Erro ao salvar o token JWT:', error);
  }
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Função para buscar dados do usuário atual
  const handleLogin = async () => {
    if (username && password) {
      try {
        // Dados a serem enviados conforme sua estrutura de requisição
        const data = {
          username: username,
          password: password,
        };
        const response = await axios.post('http://192.168.1.68:8000/users/login', qs.stringify(data), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
  
        // Ajuste conforme a estrutura da resposta da sua API
        if (response.status === 200) {
          await saveToken(response.data.access_token); // Salva o token após login bem-sucedido
          navigation.navigate('RegistroPonto');
        } else if (response.status === 401) {
          alert('Login ou senha inválidos.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Erro gerado pelo axios (erro de rede, timeout, erro de resposta, etc.)
          if (error.response) {
            // O servidor respondeu com um status diferente de 2x
            if (error.response.status === 401) {
              Alert.alert('Não autorizado','Login ou senha inválidos.');
            } else if (error.response.status === 400) {
              alert('Requisição inválida. Por favor, verifique os dados enviados.');
            } else {
              alert(`Erro inesperado: ${error.response.status} - ${error.response.statusText}`);
            }
          } else if (error.request) {
            // A requisição foi feita, mas não houve resposta
            alert('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
          } else {
            alert(`Erro na requisição: ${error.message}`);
          }
        } else {
          // Erro desconhecido (não relacionado ao axios)
          alert('Ocorreu um erro inesperado. Por favor, tente novamente.');
        }
      }
    } else {
      alert('Por favor, insira nome de usuário e senha.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
    color: 'blue',
  },
});

export default LoginScreen;