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
  FiPlusCircle
} from 'react-icons/fi'
import Slider from './Slider'
import { MenuItems } from '../../Types'
import { AiOutlineHome } from 'react-icons/ai';

export default function User({ children }: { children?: React.ReactNode }) {
  const menuItems: MenuItems[] = [
    { icon: AiOutlineHome, label: 'Panel de Control', url: '/user', isActive: false },
    { icon: FiClock, label: 'Ordenes', url: '/user/orders', isActive: false },
    { icon: FiMenu, label: 'Menú', url: '/user/menu', isActive: false },
    { icon: FiPlusCircle, label: 'Agregar', url: '/user/add', isActive: false },
  ]

  return (
    <Box w={"100%"} boxShadow="lg" bg={"#111827"}>
      <Slider type="user" menuItems={menuItems}>
        {children}
      </Slider>
    </Box>
  )
}
