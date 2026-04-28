import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { colors } from '../src/theme/colors'; // Usando as cores que já criamos!

export default function LandingScreen() {
  const router = useRouter();

  const handleLogin = () => {
    // Usamos replace ao invés de push para que o usuário não consiga 
    // "voltar" para a tela de login pelo botão de voltar do celular
    router.replace('/(rep)'); 
  };

  const handleRegister = () => {
    // Aqui no futuro você enviará para a tela de criar conta
    console.log('Ir para criação de conta');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Ícone de Logo Coração */}
        <View style={styles.logoBox}>
          <FontAwesome name="heart" size={50} color={colors.background} />
        </View>

        {/* Textos Principais */}
        <Text style={styles.title}>
          Farmácia <Text style={styles.titleHighlight}>BioFarma</Text>
        </Text>
        <Text style={styles.subtitle}>Sua gestão de saúde simplificada</Text>

      </View>

      {/* Botões do Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Entrar</Text>
          <Feather name="chevron-right" size={20} color={colors.background} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={handleRegister}
          activeOpacity={0.5}
        >
          <Text style={styles.secondaryButtonText}>Criar conta</Text>
          <Feather name="chevron-right" size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Fundo branco
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoBox: {
    backgroundColor: colors.primary, // Vermelho BioFarma
    width: 120,
    height: 120,
    borderRadius: 30, // Bordas arredondadas como no design
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    // Sombrinha leve
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8, 
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 12,
  },
  titleHighlight: {
    color: colors.primary, // "BioFarma" em vermelho
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16, // Espaçamento entre os botões
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.secondary, 
  },
  secondaryButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});