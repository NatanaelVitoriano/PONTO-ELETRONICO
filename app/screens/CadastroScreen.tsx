import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const CadastroScreen: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleCadastro = async () => {
    // Validações básicas
    if (!name || !userName || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Faz a requisição para a API de cadastro
      const response = await axios.post('http://192.168.1.68:8000/users/', {
        name: name,
        user_name: userName,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) { // Supondo que a criação retorna status 201
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Erro gerado pelo axios (erro de rede, timeout, erro de resposta, etc.)
            if (error.response) {
                if (error.response.status === 400) {
                    Alert.alert('Usuario já existe', 'Nome de usuário já existe');
                    }
                }
            }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>
      <TextInput
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Nome de Usuário"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Cadastrar" onPress={handleCadastro} />
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
});

export default CadastroScreen;
