import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegistroPontoScreen from './screens/RegistroPontoScreen';
import HistoricoScreen from './screens/HistoricoScreen';
import CadastroScreen from './screens/CadastroScreen'; 

export type RootStackParamList = {
  Login: undefined;
  RegistroPonto: undefined;
  Historico: undefined;
  Cadastro: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegistroPonto" component={RegistroPontoScreen} />
        <Stack.Screen name="Historico" component={HistoricoScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default App;
