import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { HStack, Text, useToast, VStack } from 'native-base';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';
import { Loading } from '../components/Loading';
import { PollProps } from '../components/PollCard';
import { PollHeader } from '../components/PollHeader';
import { EmptyMyPollList } from '../components/EmptyMyPollList';

interface RouteParams {
  id: string;
}

export function PollDetails() {
  const toast = useToast();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState<PollProps>({} as PollProps);

  async function fetchPoll() {
    try {
      setIsLoading(true);
      const response = await api.get(`/polls/${id}`);
      setPollDetails(response.data.poll);
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code,
    });
  }

  useEffect(() => {
    fetchPoll();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pollDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {pollDetails._count?.participants > 0 ? (
        <VStack>
          <PollHeader data={pollDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>

          {optionSelected === 'guesses' ? (
            <Guesses pollId={pollDetails.id} />
          ) : (
            <Text alignSelf="center" color="gray.100">
              Em breve
            </Text>
          )}
        </VStack>
      ) : (
        <EmptyMyPollList code={pollDetails.code} onShare={handleCodeShare} />
      )}
    </VStack>
  );
}
