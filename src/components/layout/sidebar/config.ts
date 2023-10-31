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
  ShoppingCartIcon,
  UsersIcon,
  DocumentReportIcon,
  CalendarIcon,
  ClipboardListIcon
} from '@heroicons/vue/outline'

export const navigations: Navigation[] = [
  {
    name: 'Dashboard',
    module: 'DASHBOARD',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: CalendarIcon
  },
  {
    name: 'Contract',
    href: '/contract',
    icon: ClipboardListIcon
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
      name: 'Product Category',
      module: 'PRODUCT',
      href: '/product-category'
    },
    {
      name: 'Variant',
      module: 'VARIANT',
      href: '/variant'
    },
    {
      name: 'Variant Category',
      module: 'VARIANT',
      href: '/variant-category'
    }]
  },
  {
    name: 'Project',
    module: 'PROJECT',
    href: '/project',
    icon: PresentationChartLineIcon
  },
  {
    name: 'Quotation',
    module: 'QUOTATION',
    href: '/quotation',
    icon: DocumentReportIcon
  },
  {
    name: 'Purchase',
    module: 'PURCHASE',
    href: '/purchase',
    icon: ShoppingCartIcon
  },
  {
    name: 'Client',
    module: 'CLIENT',
    href: '/client',
    icon: UsersIcon
  },
  {
    name: 'User Access',
    icon: UserIcon,
    children: [
      {
        name: 'User',
        module: 'USER',
        href: '/user'
      },
      {
        name: 'Division',
        module: 'DIVISION',
        href: '/division'
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
      }
    ]
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
