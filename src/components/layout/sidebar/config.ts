import {Navigation} from '@/typings/navigation.type'
import {
  CalculatorIcon,
  CogIcon,
  HomeIcon,
  UserIcon,
  BellIcon,
  CodeIcon,
  LocationMarkerIcon,
  DocumentTextIcon
} from '@heroicons/vue/outline'

export const navigations: Navigation[] = [
  {
    name: 'Dashboard',
    module: 'DASHBOARD',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Settings',
    module: 'SETTING',
    href: '/setting',
    icon: CogIcon
  },
  {
    name: 'Inspection',
    module: 'INSPECTION',
    href: '/inspection',
    icon: CogIcon
  },
  {
    name: 'Device',
    module: 'Device',
    href: '/device',
    icon: CogIcon
  },
  {
    name: 'Device Type',
    module: 'DEVICE-TYPE',
    href: '/device/type',
    icon: CogIcon
  },
  {
    name: 'Location',
    module: 'LOCATION',
    href: '/location',
    icon: LocationMarkerIcon
  },
  {
    name: 'Article',
    module: 'ARTICLE',
    href: '/article',
    icon: DocumentTextIcon
  },
  {
    name: 'User Security',
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
