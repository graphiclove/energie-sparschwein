import PreisWaechterClient from './PreisWaechterClient';

type PreisWaechterPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function PreisWaechterPage({ searchParams }: PreisWaechterPageProps) {
  const { email } = await searchParams;

  return <PreisWaechterClient initialEmail={email ?? ''} />;
}
