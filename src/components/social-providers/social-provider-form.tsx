'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import {
  GET_SOCIAL_PROVIDER,
  CREATE_SOCIAL_PROVIDER,
  UPDATE_SOCIAL_PROVIDER,
} from '@/graphql/social-providers';

const formSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  description: z.string().optional(),
  is_active: z.boolean(),
  settings: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  id?: number;
}

export default function SocialProviderForm({ id }: Props) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
      settings: '',
    },
  });

  const { data, loading: queryLoading } = useQuery(GET_SOCIAL_PROVIDER, {
    variables: { id },
    skip: !id,
  });

  const [createSocialProvider, { loading: createLoading }] = useMutation(
    CREATE_SOCIAL_PROVIDER,
    {
      onCompleted: () => {
        toast.success('소셜 프로바이더가 생성되었습니다.');
        router.push('/admin/social-providers');
      },
      onError: (error) => {
        toast.error('오류가 발생했습니다.', {
          description: error.message,
        });
      },
    }
  );

  const [updateSocialProvider, { loading: updateLoading }] = useMutation(
    UPDATE_SOCIAL_PROVIDER,
    {
      onCompleted: () => {
        toast.success('소셜 프로바이더가 수정되었습니다.');
        router.push('/admin/social-providers');
      },
      onError: (error) => {
        toast.error('오류가 발생했습니다.', {
          description: error.message,
        });
      },
    }
  );

  useEffect(() => {
    if (data?.socialProvider) {
      const { name, description, is_active, settings } = data.socialProvider;
      form.reset({
        name,
        description: description || '',
        is_active,
        settings: settings ? JSON.stringify(settings, null, 2) : '',
      });
    }
  }, [data, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const input = {
        ...values,
        settings: values.settings ? JSON.parse(values.settings) : null,
      };

      if (id) {
        await updateSocialProvider({
          variables: {
            id,
            input,
          },
        });
      } else {
        await createSocialProvider({
          variables: {
            input,
          },
        });
      }
    } catch (error) {
      toast.error('오류가 발생했습니다.', {
        description: '설정 JSON이 올바른 형식인지 확인해주세요.',
      });
    }
  };

  const loading = queryLoading || createLoading || updateLoading;

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="settings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>설정</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={loading}
                    rows={10}
                    placeholder="JSON 형식으로 입력해주세요."
                  />
                </FormControl>
                <FormDescription>
                  예시: {'\n'}
                  {JSON.stringify(
                    {
                      client_id: 'your-client-id',
                      client_secret: 'your-client-secret',
                      callback_url: 'http://localhost:3000/auth/callback',
                      project_name: 'your-project-name',
                    },
                    null,
                    2
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>활성화</FormLabel>
                  <FormDescription>
                    이 소셜 프로바이더를 사용할 수 있도록 설정합니다.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/social-providers')}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {id ? '수정' : '생성'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
} 