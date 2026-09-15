import {
  Code, Palette, Atom, Database, GitBranch, Wind, Smartphone, ShoppingCart,
  Layout, Brain, Wrench, Github, Linkedin, Instagram, Mail, Twitter, Youtube,
  Facebook, Globe, Server, FileCode, Cpu, Cloud, Boxes, Layers, Zap, Shield,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Code, Palette, Atom, Database, GitBranch, Wind, Smartphone, ShoppingCart,
  Layout, Brain, Wrench, Github, Linkedin, Instagram, Mail, Twitter, Youtube,
  Facebook, Globe, Server, FileCode, Cpu, Cloud, Boxes, Layers, Zap, Shield,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Code;
}

export const availableIcons = Object.keys(iconMap);
