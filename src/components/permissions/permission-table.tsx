"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
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
import { GET_PERMISSIONS, DELETE_PERMISSION } from "@/graphql/permissions";
import { GET_CURRENT_USER } from "@/graphql/auth";
import { Permission } from "@/types";

const PermissionTable = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletePermissionId, setDeletePermissionId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 현재 사용자 정보 조회
  const { data: userData } = useQuery(GET_CURRENT_USER);
  const site_id = userData?.me?.user_roles?.[0]?.site?.id;

  const pageSize = 10;

  const { loading, error, data, refetch } = useQuery(GET_PERMISSIONS, {
    variables: { site_id },
    fetchPolicy: "network-only",
    skip: !site_id,
  });

  const [deletePermission] = useMutation(DELETE_PERMISSION, {
    onCompleted: () => {
      toast.success("권한이 성공적으로 삭제되었습니다.");
      refetch();
    },
    onError: (error) => {
      toast.error("권한 삭제 실패", {
        description: error.message,
      });
    },
  });

  const handleDeleteClick = (permissionId: string) => {
    setDeletePermissionId(permissionId);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletePermissionId) {
      deletePermission({
        variables: {
          id: deletePermissionId,
        },
      });
      setIsDialogOpen(false);
      setDeletePermissionId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const permissions = data?.permissions || [];
  const filteredPermissions = search
    ? permissions.filter((permission: Permission) =>
        permission.name.toLowerCase().includes(search.toLowerCase())
      )
    : permissions;

  const totalPages = data?.permissions?.totalPages || 1;

  if (error) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">권한 관리</h2>
        <Button onClick={() => router.push("/admin/permissions/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          신규 권한
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="권한 검색..."
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
              <TableHead>권한명</TableHead>
              <TableHead>설명</TableHead>
              <TableHead>코드</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : filteredPermissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  권한이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredPermissions.map((permission: Permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell>{permission.description || "-"}</TableCell>
                  <TableCell>{permission.code}</TableCell>
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
                          onClick={() => router.push(`/admin/permissions/${permission.id}`)}
                        >
                          편집
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(permission.id)}
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
            <AlertDialogTitle>권한 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 권한을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export { PermissionTable }; 