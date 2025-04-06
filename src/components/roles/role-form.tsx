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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GET_ROLE, CREATE_ROLE, UPDATE_ROLE } from "@/graphql/roles";
import { GET_PERMISSIONS } from "@/graphql/permissions";
import { Role, Permission } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "역할명은 2자 이상이어야 합니다.",
  }),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).min(1, {
    message: "최소 하나의 권한을 선택해야 합니다.",
  }),
});

interface RoleFormProps {
  roleId?: string;
}

const RoleForm = ({ roleId }: RoleFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 권한 목록 조회
  const { data: permissionsData } = useQuery(GET_PERMISSIONS, {
    variables: {
      pagination: { page: 1, pageSize: 100 },
      sort: { field: "name", direction: "asc" },
    },
  });

  // 역할 정보 조회 (수정 시)
  const { data: roleData } = useQuery(GET_ROLE, {
    variables: { id: roleId },
    skip: !roleId,
  });

  const [createRole] = useMutation(CREATE_ROLE, {
    onCompleted: () => {
      toast.success("새로운 역할이 생성되었습니다.");
      router.push("/admin/roles");
    },
    onError: (error) => {
      toast.error("역할 생성 실패", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const [updateRole] = useMutation(UPDATE_ROLE, {
    onCompleted: () => {
      toast.success("역할 정보가 수정되었습니다.");
      router.push("/admin/roles");
    },
    onError: (error) => {
      toast.error("역할 수정 실패", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
    },
  });

  useEffect(() => {
    if (roleData?.role) {
      const role = roleData.role;
      form.reset({
        name: role.name,
        description: role.description || "",
        permissionIds: role.permissions.map((permission: Permission) => permission.id),
      });
    }
  }, [roleData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (roleId) {
      updateRole({
        variables: {
          id: roleId,
          input: values,
        },
      });
    } else {
      createRole({
        variables: {
          input: values,
        },
      });
    }
  };

  const permissions = permissionsData?.permissions?.items || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{roleId ? "역할 수정" : "신규 역할 생성"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>역할명</FormLabel>
                  <FormControl>
                    <Input placeholder="역할명" {...field} />
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
                      placeholder="역할에 대한 설명을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissionIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>권한</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value[0]}
                      onValueChange={(value) => field.onChange([value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="권한을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {permissions.map((permission: Permission) => (
                          <SelectItem key={permission.id} value={permission.id}>
                            {permission.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/roles")}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "처리 중..." : roleId ? "수정" : "생성"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { RoleForm }; 