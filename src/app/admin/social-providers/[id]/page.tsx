import SocialProviderForm from '@/components/social-providers/social-provider-form';

interface Props {
  params: {
    id: string;
  };
}

export default function SocialProviderEditPage({ params }: Props) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">소셜 프로바이더 수정</h1>
      <SocialProviderForm id={parseInt(params.id, 10)} />
    </div>
  );
} 