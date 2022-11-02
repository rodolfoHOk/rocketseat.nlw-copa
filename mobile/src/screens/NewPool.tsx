import { Heading, VStack } from 'native-base';
import { Header } from '../components/Header';
import Logo from '../assets/logo.svg';

export function NewPool() {
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa e compartilhe com amigos!
        </Heading>
      </VStack>
    </VStack>
  );
}
