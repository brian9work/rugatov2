import {
  Box,
  HStack,
} from '@chakra-ui/react'
import { FaUsers } from "react-icons/fa";
import { FiClock } from 'react-icons/fi'
import Slider from './Slider'
import { MenuItems } from '../../Types'
import { AiOutlineHome } from 'react-icons/ai';

export default function Kitchen({ children }: { children?: React.ReactNode }) {
  const menuItems: MenuItems[] = [
    { icon: AiOutlineHome, label: 'Panel de Control', url: '/kitchen', isActive: false },
    { icon: FiClock, label: 'Ordenes', url: '/kitchen/orders', isActive: false },
  ]

  return (
    <Box w={"100%"} boxShadow="lg" bg={"#111827"}>
      <Slider type="kitchen" menuItems={menuItems}>
        {children}
      </Slider>
    </Box>
  )
}
