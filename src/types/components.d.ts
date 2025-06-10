import type { NavItem } from './navigation';

declare module '@/components/UserMenu' {
  import { FC } from 'react';
  
  interface UserMenuProps {
    user: {
      id: string;
      email?: string;
      name?: string;
      image?: string;
    } | null;
    lang: string;
  }
  
  const UserMenu: FC<UserMenuProps>;
  export default UserMenu;
}

declare module '@/components/MobileMenu' {
  import { FC } from 'react';
  
  interface MobileMenuProps {
    navigation: NavItem[];
    user: {
      id: string;
      email?: string;
      name?: string;
      image?: string;
    } | null;
    lang: string;
  }
  
  const MobileMenu: FC<MobileMenuProps>;
  export default MobileMenu;
}
