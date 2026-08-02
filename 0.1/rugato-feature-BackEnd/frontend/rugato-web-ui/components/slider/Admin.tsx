import {
  Box,
  HStack,
} from '@chakra-ui/react'
import { FaUsers } from "react-icons/fa";
import {
  FiDollarSign,
  FiUsers,
  FiMenu,
  FiClock,
  FiBarChart,
  FiSettings,
} from 'react-icons/fi'
import Slider from './Slider'
import { MenuItems } from '../../Types'
import { AiOutlineHome } from 'react-icons/ai';

export default function Admin({ children }: { children?: React.ReactNode }) {
  const menuItems: MenuItems[] = [
    { icon: AiOutlineHome, label: 'Panel de Control', url: '/admin', isActive: false },
    { icon: FiDollarSign, label: 'Gastos', url: '/admin/expenses', isActive: false },
    { icon: FiUsers, label: 'Empleados', url: '/admin/employees', isActive: false },
    { icon: FiMenu, label: 'Menú', url: '/admin/menu', isActive: false },
    { icon: FiClock, label: 'Historial', url: '/admin/history', isActive: false },
    { icon: FiBarChart, label: 'Reportes', url: '/admin/reports', isActive: false },
    { icon: FaUsers, label: 'Clientes', url: '/admin/clients', isActive: false },
    { icon: FiSettings, label: 'Configuración', url: '/admin/settings', isActive: false },
  ]

  return (
    <Box w={"100%"} boxShadow="lg" bg={"#111827"}>
      <Slider type="admin" menuItems={menuItems}>
        {children}
      </Slider>
    </Box>
  )
}
