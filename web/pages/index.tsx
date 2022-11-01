import { GetServerSideProps } from 'next';

interface HomeProps {
  count: number;
}

export default function Home(props: HomeProps) {
  return <h1>Contagem de Bolões: {props.count}</h1>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('http://0.0.0.0:3333/pools/count');
  const data = await response.json();

  return {
    props: { count: data.count },
  };
};
