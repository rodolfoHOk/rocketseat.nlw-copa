import { GetServerSideProps } from 'next';
import Image from 'next/image';
import appPreviewImage from '../assets/app-nlw-copa-preview.png';
import logoImage from '../assets/logo.svg';
import usersAvatarImage from '../assets/users-avatar-example.png';
import iconCheckImage from '../assets/icon-check.svg';

interface HomeProps {
  count: number;
}

export default function Home(props: HomeProps) {
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
            <span className="text-ignite-500">+12.592</span> pessoas já estão
            usando
          </strong>
        </div>

        <form className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100 placeholder:text-gray-300"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700 transition-colors duration-200"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 text-gray-100 border-t border-gray-600 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="" />

            <div className="flex flex-col">
              <span className="font-bold text-2xl">+2.034</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="" />

            <div className="flex flex-col">
              <span className="font-bold text-2xl">+192.847</span>
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('http://0.0.0.0:3333/pools/count');
  const data = await response.json();

  return {
    props: { count: data.count },
  };
};
