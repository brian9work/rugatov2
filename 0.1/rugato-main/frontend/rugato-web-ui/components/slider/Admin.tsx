import { Box, HStack, } from '@chakra-ui/react'
import { FiDollarSign, FiUsers, FiClock, FiBarChart, FiSettings, } from 'react-icons/fi'
import Slider from './Slider'
import { MenuItems } from '../../Types'
import { AiOutlineHome } from 'react-icons/ai';
import { MyContext } from '../../context/Context';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isToday } from './isToday';
import { RiDrinksLine } from 'react-icons/ri';

export default function Admin({ children }: { children?: React.ReactNode }) {
  const menuItems: MenuItems[] = [
    { icon: AiOutlineHome, label: 'Panel de Control', url: '/admin', isActive: false },
    { icon: FiDollarSign, label: 'Gastos', url: '/admin/expenses', isActive: false },
    { icon: FiUsers, label: 'Empleados', url: '/admin/employees', isActive: false },
    { icon: RiDrinksLine, label: 'Menú', url: '/admin/menu', isActive: false },
    { icon: FiClock, label: 'Órdenes', url: '/admin/history', isActive: false },
    { icon: FiBarChart, label: 'Reportes', url: '/admin/reports', isActive: false },
    { icon: FiSettings, label: 'Configuración', url: '/admin/settings', isActive: false },
  ]

  const router = useRouter();
  const { type, date } = MyContext();

  useEffect(() => {
    if (type !== '1' || !isToday(date)) {
      router.push('/login/');
    }
  }, [type, date, router]);

  if (type !== '1' || !isToday(date)) {
    return null;
  }

  return (
    <Box w={"100%"} boxShadow="lg" bg={"#111827"}>
      <Slider type="admin" menuItems={menuItems}>
        <Box maxW={"1200px"} width="100%" minW={"300px"} mx="auto">
          {children}
        </Box>
      </Slider>
    </Box>
  )
}