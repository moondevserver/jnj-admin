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
import { GET_PERMISSION, CREATE_PERMISSION, UPDATE_PERMISSION } from "@/graphql/permissions";
import { GET_CURRENT_USER } from "@/graphql/auth";
import { Permission } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "권한명은 2자 이상이어야 합니다.",
  }),
  code: z.string().min(2, {
    message: "권한 코드는 2자 이상이어야 합니다.",
  }),
  description: z.string().optional(),
});

interface PermissionFormProps {
  permissionId?: string;
}

const PermissionForm = ({ permissionId }: PermissionFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 현재 사용자 정보 조회
  const { data: userData } = useQuery(GET_CURRENT_USER);
  const site_id = userData?.me?.user_roles?.[0]?.site?.id;

  // 권한 정보 조회 (수정 시)
  const { data: permissionData } = useQuery(GET_PERMISSION, {
    variables: { id: permissionId },
    skip: !permissionId,
  });

  const [createPermission] = useMutation(CREATE_PERMISSION, {
    onCompleted: () => {
      toast.success("새로운 권한이 생성되었습니다.");
      router.push("/admin/permissions");
    },
    onError: (error) => {
      toast.error("권한 생성 실패", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const [updatePermission] = useMutation(UPDATE_PERMISSION, {
    onCompleted: () => {
      toast.success("권한 정보가 수정되었습니다.");
      router.push("/admin/permissions");
    },
    onError: (error) => {
      toast.error("권한 수정 실패", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  useEffect(() => {
    if (permissionData?.permission) {
      const permission = permissionData.permission;
      if (!form.formState.isDirty) {
        const defaultValues = {
          name: permission.name,
          code: permission.code,
          description: permission.description || "",
        };
        
        if (JSON.stringify(form.getValues()) !== JSON.stringify(defaultValues)) {
          form.reset(defaultValues);
        }
      }
    }
  }, [permissionData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const input = {
      ...values,
      site_id,
    };

    if (permissionId) {
      updatePermission({
        variables: {
          id: permissionId,
          input,
        },
      });
    } else {
      createPermission({
        variables: {
          input,
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{permissionId ? "권한 수정" : "신규 권한 생성"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>권한명</FormLabel>
                  <FormControl>
                    <Input placeholder="권한명" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>권한 코드</FormLabel>
                  <FormControl>
                    <Input placeholder="예: user:manage" {...field} />
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
                      placeholder="권한에 대한 설명을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/permissions")}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "처리 중..." : permissionId ? "수정" : "생성"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { PermissionForm }; 