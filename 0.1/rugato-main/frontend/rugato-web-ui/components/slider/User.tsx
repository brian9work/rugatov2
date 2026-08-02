import {
  Box,
} from '@chakra-ui/react'
import {
  FiMenu,
  FiClock,
} from 'react-icons/fi'
import Slider from './Slider'
import { MenuItems } from '../../Types'
import { AiOutlineHome } from 'react-icons/ai';
import Colors from '../../contants/Colors';
import { useRouter } from 'next/router';
import { MyContext } from '../../context/Context';
import { isToday } from './isToday';
import { useEffect } from 'react';

export default function User({ children }: { children?: React.ReactNode }) {
  const menuItems: MenuItems[] = [
    { icon: AiOutlineHome, label: 'Panel de Control', url: '/user', isActive: false },
    { icon: FiClock, label: 'Ordenes', url: '/user/orders', isActive: false },
    { icon: FiMenu, label: 'Menú', url: '/user/menu', isActive: false },
  ]
  
    const router = useRouter();
    const { type, date } = MyContext();
  
    useEffect(() => {
      if (type !== '2' || !isToday(date)) {
        router.push('/login/');
      }
    }, [type, date, router]);
  
    if (type !== '2' || !isToday(date)) {
      return null;
    }

  return (
    <Box w={"100%"} boxShadow="lg" bg={Colors.bg}>
      <Slider type="user" menuItems={menuItems}>
        {children}
      </Slider>
    </Box>
  )
}
