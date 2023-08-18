import { Navigation } from '@/typings/navigation.type'
import {
  CalculatorIcon,
  CogIcon,
  HomeIcon,
  UserIcon,
  BellIcon,
  CodeIcon,
  PresentationChartLineIcon,
  ShoppingBagIcon,
  ShoppingCartIcon
} from '@heroicons/vue/outline'

export const navigations: Navigation[] = [
  {
    name: 'Dashboard',
    module: 'DASHBOARD',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Product',
    module: 'PRODUCT',
    icon: ShoppingBagIcon,
    children: [{
      name: 'Product',
      module: 'PRODUCT',
      href: '/product'
    },
    {
      name: 'Product Variant',
      module: 'PRODUCT',
      href: '/product-variant'
    },
    {
      name: 'Product Category',
      module: 'PRODUCT',
      href: '/product-category'
    }]
  },
  {
    name: 'Project',
    module: 'PROJECT',
    href: '/project',
    icon: PresentationChartLineIcon
  },
  {
    name: 'Sale',
    module: 'SALE',
    href: '/sale',
    icon: ShoppingCartIcon
  },
  {
    name: 'User Access',
    icon: UserIcon,
    children: [{
      name: 'User',
      module: 'USER',
      href: '/user'
    },
    {
      name: 'Role',
      module: 'ROLE',
      href: '/role'
    },
    {
      name: 'Permission',
      module: 'PERMISSION',
      href: '/permission'
    }]
  }
]

export const secondaryNavigations: Navigation[] = [
  {
    name: 'Settings',
    module: 'SETTING',
    href: '/setting',
    icon: CogIcon
  },
  {
    name: 'Maintenance',
    icon: CalculatorIcon,
    children: [{
      name: 'System Log',
      module: 'LOG',
      href: '/log',
      icon: BellIcon
    },
    {
      name: 'Statistic',
      module: 'STATISTIC',
      href: '/statistic',
      icon: CodeIcon
    }]
  }
]
