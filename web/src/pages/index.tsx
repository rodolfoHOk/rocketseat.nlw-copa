import { GetStaticProps } from 'next';
import Image from 'next/image';
import { FormEvent, useRef, useState } from 'react';
import appPreviewImage from '../assets/app-nlw-copa-preview.png';
import logoImage from '../assets/logo.svg';
import usersAvatarImage from '../assets/users-avatar-example.png';
import iconCheckImage from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { Toast } from '../components/Toast';
import { Button } from '../components/Button';

interface HomeProps {
  pollCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const createdRef = useRef<{ publish: () => void }>();
  const errorRef = useRef<{ publish: () => void }>();

  const [pollTitle, setPollTitle] = useState('');

  async function createPoll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await api.post<{ code: string }>('/polls', {
        title: pollTitle,
        ownerId: 'cl9yc7mih0000hr3pja9lp1yl',
      });

      const { code } = response.data;
      await navigator.clipboard.writeText(code);

      createdRef.current?.publish();

      setPollTitle('');
    } catch (error) {
      console.error(error);
      errorRef.current?.publish();
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImage} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarImage} alt="" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form className="mt-10 flex gap-2" onSubmit={createPoll}>
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100 placeholder:text-gray-300"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            value={pollTitle}
            onChange={(event) => setPollTitle(event.target.value)}
          />
          <Button title="Criar meu bolão" type="submit" size="CONTENT" />
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 text-gray-100 border-t border-gray-600 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="" />

            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.pollCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="" />

            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel da NLW Copa"
        quality={100}
      />

      <Toast
        ref={createdRef}
        variant="success"
        title="Sucesso"
        description="Bolão criado com sucesso"
      />

      <Toast
        ref={errorRef}
        variant="error"
        title="Erro"
        description="Falha ao criar o bolão, tente novamente"
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [pollCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get<{ count: number }>('/polls/count'),
      api.get<{ count: number }>('/guesses/count'),
      api.get<{ count: number }>('/users/count'),
    ]);

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 10 * 60, // 10 minutes
  };
};
