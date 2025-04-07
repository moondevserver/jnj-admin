"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { GET_SITE, CREATE_SITE, UPDATE_SITE } from "@/graphql/sites";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "사이트명은 2자 이상이어야 합니다.",
  }),
  domain: z.string().url({
    message: "올바른 도메인 주소를 입력해주세요.",
  }),
  description: z.string().optional(),
  is_active: z.boolean(),
  settings: z.string().optional(),
});

interface SiteFormProps {
  siteId?: string;
}

const SiteForm = ({ siteId }: SiteFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data: siteData, loading: siteLoading } = useQuery(GET_SITE, {
    variables: { id: siteId },
    skip: !siteId,
  });

  const [createSite] = useMutation(CREATE_SITE, {
    onCompleted: () => {
      toast.success("새로운 사이트가 생성되었습니다.");
      router.push("/admin/sites");
    },
    onError: (error) => {
      toast.error("사이트 생성 실패", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const [updateSite] = useMutation(UPDATE_SITE, {
    onCompleted: () => {
      toast.success("사이트 정보가 수정되었습니다.");
      router.push("/admin/sites");
    },
    onError: (error) => {
      toast.error("사이트 수정 실패", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      domain: "",
      description: "",
      is_active: true,
      settings: "",
    },
  });

  useEffect(() => {
    if (siteData?.site) {
      const { name, domain, description, is_active, settings } = siteData.site;
      form.reset({
        name,
        domain,
        description: description || "",
        is_active,
        settings: settings ? JSON.stringify(settings, null, 2) : "",
      });
    }
  }, [siteData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const input = {
        ...values,
        settings: values.settings ? JSON.parse(values.settings) : null,
      };

      if (siteId) {
        await updateSite({
          variables: {
            id: siteId,
            input,
          },
        });
      } else {
        await createSite({
          variables: {
            input,
          },
        });
      }
    } catch (error) {
      toast.error("설정 JSON 형식이 올바르지 않습니다.");
      setIsLoading(false);
    }
  };

  if (siteId && siteLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{siteId ? "사이트 수정" : "신규 사이트 생성"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사이트명</FormLabel>
                  <FormControl>
                    <Input placeholder="사이트명" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>도메인</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      type="url"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="사이트에 대한 설명을 입력하세요"
                      {...field}
                    />
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
                      placeholder="JSON 형식으로 설정을 입력하세요"
                      className="font-mono"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
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
                    <div className="text-sm text-muted-foreground">
                      이 사이트를 활성화 또는 비활성화합니다.
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/sites")}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {siteId ? "수정" : "생성"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { SiteForm }; 