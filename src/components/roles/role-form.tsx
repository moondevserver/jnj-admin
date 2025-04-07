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

// 다중 선택을 위한 커스텀 Select 컴포넌트
const MultiSelect = ({ value, onChange, options, placeholder }: {
  value: string[];
  onChange: (value: string[]) => void;
  options: { id: string; name: string }[];
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionId: string) => {
    const newValue = value.includes(optionId)
      ? value.filter(id => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {value.length > 0
          ? options
              .filter(option => value.includes(option.id))
              .map(option => option.name)
              .join(", ")
          : placeholder}
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1">
          {options.map(option => (
            <div
              key={option.id}
              className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
                value.includes(option.id) ? "bg-accent text-accent-foreground" : ""
              }`}
              onClick={() => handleSelect(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
  const { data: permissionsData } = useQuery(GET_PERMISSIONS);
  const permissions = permissionsData?.permissions || [];

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
    if (roleData?.role && !form.formState.isDirty) {
      const role = roleData.role;
      const defaultValues = {
        name: role.name,
        description: role.description || "",
        permissionIds: role.permissions.map((permission: Permission) => permission.id),
      };
      
      // 현재 폼 값과 새로운 값이 다를 때만 reset 실행
      if (JSON.stringify(form.getValues()) !== JSON.stringify(defaultValues)) {
        form.reset(defaultValues);
      }
    }
  }, [roleData]);

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
                    <MultiSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={permissions}
                      placeholder="권한을 선택하세요"
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