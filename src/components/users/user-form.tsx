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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GET_USER, CREATE_USER, UPDATE_USER } from "@/graphql/users";
import { GET_ROLES } from "@/graphql/roles";
import { User, Role } from "@/types";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "사용자명은 2자 이상이어야 합니다.",
  }),
  email: z.string().email({
    message: "유효한 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(6, {
    message: "비밀번호는 6자 이상이어야 합니다.",
  }).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean(),
  roleIds: z.array(z.string()).min(1, {
    message: "최소 하나의 역할을 선택해야 합니다.",
  }),
});

interface UserFormProps {
  userId?: string;
}

const UserForm = ({ userId }: UserFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 역할 목록 조회
  const { data: rolesData } = useQuery(GET_ROLES, {
    variables: {
      pagination: { page: 1, pageSize: 100 },
      sort: { field: "name", direction: "asc" },
    },
  });

  // 사용자 정보 조회 (수정 시)
  const { data: userData } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
  });

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      toast.success("새로운 사용자가 생성되었습니다.");
      router.push("/admin/users");
    },
    onError: (error) => {
      toast.error("사용자 생성 실패", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      toast.success("사용자 정보가 수정되었습니다.");
      router.push("/admin/users");
    },
    onError: (error) => {
      toast.error("사용자 수정 실패", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      isActive: true,
      roleIds: [],
    },
  });

  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      form.reset({
        username: user.username,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        isActive: user.isActive,
        roleIds: user.roles.map((role: Role) => role.id),
      });
    }
  }, [userData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const input = {
      ...values,
      password: values.password || undefined,
    };

    if (userId) {
      updateUser({
        variables: {
          id: userId,
          input,
        },
      });
    } else {
      createUser({
        variables: {
          input,
        },
      });
    }
  };

  const roles = rolesData?.roles?.items || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{userId ? "사용자 수정" : "신규 사용자 생성"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사용자명</FormLabel>
                  <FormControl>
                    <Input placeholder="사용자명" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="이메일" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{userId ? "새 비밀번호 (선택)" : "비밀번호"}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={userId ? "변경하지 않으려면 비워두세요" : "비밀번호"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="이름" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>성</FormLabel>
                    <FormControl>
                      <Input placeholder="성" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">활성 상태</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>역할</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value[0]}
                      onValueChange={(value) => field.onChange([value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="역할을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role: Role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
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
                onClick={() => router.push("/admin/users")}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "처리 중..." : userId ? "수정" : "생성"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { UserForm }; 