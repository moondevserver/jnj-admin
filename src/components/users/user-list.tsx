'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/graphql/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';

export default function UserList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data, loading } = useQuery(GET_USERS, {
    variables: { search },
  });

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="이름, 이메일로 검색..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push('/admin/users/new')}>
          <PlusIcon className="h-4 w-4 mr-2" />
          사용자 추가
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.users.map((user: any) => (
            <Card
              key={user.id}
              className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => router.push(`/admin/users/${user.id}`)}
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.profile_image} alt={user.email} />
                  <AvatarFallback>
                    {getInitials(user.first_name, user.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {user.first_name || user.last_name
                        ? `${user.first_name || ''} ${user.last_name || ''}`
                        : user.email}
                    </div>
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        user.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.is_active ? '활성' : '비활성'}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  {user.metadata && (
                    <div className="text-xs text-muted-foreground mt-2">
                      마지막 로그인:{' '}
                      {user.metadata.last_login
                        ? new Date(user.metadata.last_login).toLocaleString('ko-KR')
                        : '없음'}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 