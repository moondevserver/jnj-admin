"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { PlusCircle, Pencil, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  GET_SOCIAL_PROVIDERS,
  DELETE_SOCIAL_PROVIDER,
} from "@/graphql/social-providers";

const SocialProviderTable = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteProviderId, setDeleteProviderId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_SOCIAL_PROVIDERS, {
    variables: {
      search: search || undefined,
    },
    fetchPolicy: "network-only",
  });

  const [deleteSocialProvider] = useMutation(DELETE_SOCIAL_PROVIDER, {
    onCompleted: () => {
      toast.success("소셜 프로바이더가 성공적으로 삭제되었습니다.");
      refetch();
    },
    onError: (error) => {
      toast.error("소셜 프로바이더 삭제 실패", {
        description: error.message,
      });
    },
  });

  const handleDeleteClick = (id: number) => {
    setDeleteProviderId(id);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteProviderId) {
      deleteSocialProvider({
        variables: {
          id: deleteProviderId,
        },
      });
      setIsDialogOpen(false);
      setDeleteProviderId(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    refetch({
      search: e.target.value || undefined,
    });
  };

  const providers = data?.socialProviders || [];

  if (error) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">소셜 인증 관리</h2>
        <Button onClick={() => router.push("/admin/social-providers/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          신규 프로바이더
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로바이더 검색..."
            value={search}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>설명</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>연결된 사용자 수</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : providers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  소셜 프로바이더가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              providers.map((provider: any) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.description}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        provider.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {provider.is_active ? "활성" : "비활성"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {provider.user_social_connections?.length || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">작업 메뉴</span>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/social-providers/${provider.id}`)
                          }
                        >
                          편집
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(provider.id)}
                        >
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>소셜 프로바이더 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 소셜 프로바이더를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { SocialProviderTable }; 