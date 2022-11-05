import { GoogleLogo } from 'phosphor-react';
import logoImage from '../../assets/logo.svg';
import Image from 'next/image';
import appPreviewImage from '../../assets/app-nlw-copa-preview.png';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useRef } from 'react';
import { Toast } from '../../components/Toast';
import { useRouter } from 'next/router';

export default function SignIn() {
  const router = useRouter();
  const { signIn, user, isUserLoading } = useAuth();

  const errorRef = useRef<{ publish: () => void }>();

  async function handleSignIn() {
    try {
      await signIn();
    } catch (error) {
      errorRef.current?.publish();
    }
  }

  useEffect(() => {
    if (!isUserLoading && user?.name) {
      router.push('/');
    }
  }, [isUserLoading, user, router]);

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main className="w-full flex flex-col items-center justify-center mx-4">
        <Image src={logoImage} alt="NLW Copa" className="mb-12" />

        <div className="w-full flex">
          <Button
            title="Entrar com o Google"
            variant="SECONDARY"
            icon={<GoogleLogo size={24} weight="bold" />}
            onClick={handleSignIn}
          />
        </div>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed text-center">
          Não utilizamos nenhuma informação além
          <br />
          do seu e-mail para a criação de sua conta
        </p>
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel da NLW Copa"
        quality={100}
      />

      <Toast
        ref={errorRef}
        variant="error"
        title="Erro"
        description="Erro ao tentar logar com o Google"
      />
    </div>
  );
}
