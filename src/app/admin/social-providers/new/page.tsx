import SocialProviderForm from '@/components/social-providers/social-provider-form';

export default function SocialProviderNewPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">소셜 프로바이더 생성</h1>
      <SocialProviderForm />
    </div>
  );
} 