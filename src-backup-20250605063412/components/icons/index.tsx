import { Loader2, Mail, Lock, Eye, EyeOff, Github } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export const Icons = {
  spinner: Loader2,
  mail: Mail,
  lock: Lock,
  eye: Eye,
  eyeOff: EyeOff,
  gitHub: Github,
  google: FcGoogle,
} as const;

export type Icon = keyof typeof Icons;
