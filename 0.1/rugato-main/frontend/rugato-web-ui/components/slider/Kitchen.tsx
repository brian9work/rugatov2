import {
  Box,
} from '@chakra-ui/react'
import { FiClock } from 'react-icons/fi'
import Slider from './Slider'
import { MenuItems } from '../../Types'
import { AiOutlineHome } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { MyContext } from '../../context/Context';
import { isToday } from './isToday';
import { useEffect } from 'react';

export default function Kitchen({ children }: { children?: React.ReactNode }) {
  const menuItems: MenuItems[] = [
    { icon: AiOutlineHome, label: 'Panel de Control', url: '/kitchen', isActive: false },
    { icon: FiClock, label: 'Ordenes', url: '/kitchen/orders', isActive: false },
  ]
  
    const router = useRouter();
    const { type, date } = MyContext();
  
    useEffect(() => {
      if (type !== '3' || !isToday(date)) {
        router.push('/login/');
      }
    }, [type, date, router]);
  
    if (type !== '3' || !isToday(date)) {
      return null;
    }

  return (
    <Box w={"100%"} boxShadow="lg" bg={"#111827"}>
      <Slider type="kitchen" menuItems={menuItems}>
        {children}
      </Slider>
    </Box>
  )
}
