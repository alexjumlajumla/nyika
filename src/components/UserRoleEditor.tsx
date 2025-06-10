'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

interface UserRoleEditorProps {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserRoleEditor({ user, open, onOpenChange }: UserRoleEditorProps) {
  const router = useRouter();
  const [roles, setRoles] = useState<string[]>(user.roles || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableRoles = [
    { id: 'admin', label: 'Administrator' },
    { id: 'editor', label: 'Editor' },
    { id: 'user', label: 'User' },
  ];

  useEffect(() => {
    if (open) {
      setRoles(user.roles || []);
      setError(null);
    }
  }, [open, user.roles]);

  const handleRoleChange = (roleId: string, checked: boolean) => {
    if (checked) {
      setRoles([...roles, roleId]);
    } else {
      setRoles(roles.filter((role) => role !== roleId));
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/users/roles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          roles
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update roles');
      }
      
      // Refresh the page to show updated roles
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Roles</DialogTitle>
          <DialogDescription>
            Update roles for {user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="space-y-2">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={roles.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleChange(role.id, checked === true)}
                  />
                  <Label htmlFor={`role-${role.id}`} className="text-sm font-medium">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
