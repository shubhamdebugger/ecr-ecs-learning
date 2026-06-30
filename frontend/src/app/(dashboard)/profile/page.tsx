'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/providers/AuthProvider';
import { updateProfileSchema, changePasswordSchema, UpdateProfileInput, ChangePasswordInput } from '@/lib/validations';
import { profileApi } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { getApiError } from '@/hooks/useUrls';
import { useMutation } from '@tanstack/react-query';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateProfileInput) => profileApi.update(data),
    onSuccess: async () => {
      await refreshUser();
      toast({ title: 'Profile updated successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Update failed', description: getApiError(error), variant: 'destructive' });
    },
  });

  const { mutateAsync: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      profileApi.changePassword(data),
    onSuccess: () => {
      toast({ title: 'Password changed successfully!' });
      passwordForm.reset();
    },
    onError: (error) => {
      toast({ title: 'Failed to change password', description: getApiError(error), variant: 'destructive' });
    },
  });

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account details.</p>
      </div>

      {/* Avatar */}
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Information</CardTitle>
          <CardDescription>Update your name and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) =>
              void profileForm.handleSubmit((d) => void updateProfile(d))(e)
            }
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...profileForm.register('name')} />
              {profileForm.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...profileForm.register('email')} />
              {profileForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {profileForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) =>
              void passwordForm.handleSubmit((d) =>
                void changePassword({ currentPassword: d.currentPassword, newPassword: d.newPassword }),
              )(e)
            }
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...passwordForm.register('currentPassword')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register('newPassword')}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                {...passwordForm.register('confirmNewPassword')}
              />
              {passwordForm.formState.errors.confirmNewPassword && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.confirmNewPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
