"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { LOGIN } from "@/graphql/auth";

const formSchema = z.object({
  email: z.string().email({
    message: "유효한 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(6, {
    message: "비밀번호는 최소 6자 이상이어야 합니다.",
  }),
});

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data.login.token) {
        localStorage.setItem("token", data.login.token);
        toast.success("로그인 성공", {
          description: "관리자 대시보드로 이동합니다.",
        });
        router.push("/admin/users");
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Login Error:', error);
      toast.error("로그인 실패", {
        description: `${error.message}\n${JSON.stringify(error.graphQLErrors, null, 2)}`,
      });
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const currentUrl = new URL(window.location.href);
    const input = {
      email: values.email,
      password: values.password,
      site_domain: `${currentUrl.hostname}${currentUrl.port ? `:${currentUrl.port}` : ''}`,
      page_path: currentUrl.pathname
    };
    console.log('Login Mutation Input:', input);
    
    login({
      variables: {
        input
      },
    });
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>관리자 계정으로 로그인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="이메일 주소" {...field} />
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
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="비밀번호" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="link" onClick={() => router.push("/auth/forgot-password")}>
          비밀번호 찾기
        </Button>
        <Button variant="link" onClick={() => router.push("/auth/register")}>
          회원가입
        </Button>
      </CardFooter>
    </Card>
  );
};

export { LoginForm }; 