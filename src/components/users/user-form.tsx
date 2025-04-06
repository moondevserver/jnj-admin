"use client";

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GET_USER, UPDATE_USER } from '@/graphql/users';

const formSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  profile_image: z.string().optional(),
  is_active: z.boolean(),
  metadata: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  id: string;
}

export default function UserForm({ id }: Props) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      profile_image: '',
      is_active: true,
      metadata: '',
    },
  });

  const { data, loading: queryLoading } = useQuery(GET_USER, {
    variables: { id },
  });

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      toast.success('사용자 정보가 수정되었습니다.');
      router.push('/admin/users');
    },
    onError: (error) => {
      toast.error('오류가 발생했습니다.', {
        description: error.message,
      });
    },
  });

  useEffect(() => {
    if (data?.user) {
      const { email, first_name, last_name, profile_image, is_active, metadata } = data.user;
      form.reset({
        email,
        first_name: first_name || '',
        last_name: last_name || '',
        profile_image: profile_image || '',
        is_active,
        metadata: metadata ? JSON.stringify(metadata, null, 2) : '',
      });
    }
  }, [data, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const input = {
        ...values,
        metadata: values.metadata ? JSON.parse(values.metadata) : null,
      };

      await updateUser({
        variables: {
          id,
          input,
        },
      });
    } catch (error) {
      toast.error('오류가 발생했습니다.', {
        description: 'metadata가 올바른 JSON 형식인지 확인해주세요.',
      });
    }
  };

  const loading = queryLoading || updateLoading;
  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={form.watch('profile_image')}
                alt={form.watch('email')}
              />
              <AvatarFallback>
                {getInitials(form.watch('first_name'), form.watch('last_name'))}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-medium">프로필 이미지</h2>
              <p className="text-sm text-muted-foreground">
                사용자의 프로필 이미지 URL을 입력하세요.
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input {...field} type="email" disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
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
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>성</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="profile_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>프로필 이미지 URL</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metadata"
            render={({ field }) => (
              <FormItem>
                <FormLabel>메타데이터</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={loading}
                    rows={10}
                    placeholder="JSON 형식으로 입력해주세요."
                  />
                </FormControl>
                <FormDescription>
                  사용자와 관련된 추가 정보를 JSON 형식으로 입력하세요.
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
                    이 사용자 계정을 활성화 또는 비활성화합니다.
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
              onClick={() => router.push('/admin/users')}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              수정
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
} 