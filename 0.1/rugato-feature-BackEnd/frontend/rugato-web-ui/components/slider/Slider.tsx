import { Box, VStack, HStack, Text, Button, Icon, Divider, Container, IconButton, } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, } from '@chakra-ui/icons'
import { FiDollarSign, FiUsers, FiMenu, FiClock, FiBarChart, FiSettings, } from 'react-icons/fi'
import { MenuItems } from '../../Types'
import { AiOutlineHome } from "react-icons/ai";
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Colors from '../../contants/Colors';
import { useState } from 'react';

export default function Slider(
   { type, menuItems, children }:
      { type: "admin" | "user" | "kitchen", menuItems: MenuItems[], children?: React.ReactNode }
) {
   const [active, setActive] = useState<number>(0);
   const router = useRouter();
   const pathname = router.pathname;
   const colorScheme = type === "admin" ? Colors.green : (type === "kitchen" ? Colors.yellow : Colors.blue);

   menuItems = menuItems.map(item => ({
      ...item,
      isActive: item.url === pathname,
   }));


   return (
      <HStack justify={"flex-start"} alignItems={"flex-start"} spacing={4} minH="100vh">
         <Box bg="#111827" minH="100vh"
            position={"relative"}
            maxW={`${active === 1 ? "350px" : "70px"}`}
            overflow={"hidden"}
            color="white"
            display={"block"}
            shadow={"md"}
            borderRight={"2px solid #2d3748"}
         >
            <Container maxW="sm" p={0}>
               <VStack spacing={0} align="stretch">
                  {active === 1 ?
                     <Box p={2} pb={0} pt={4}>
                        <VStack spacing={2}>
                           <Image
                              src="/logo.webp"
                              alt="Jugos rugato logo"
                              width={700}
                              height={350}
                              priority
                              style={{ width: "100%", height: "70px", objectFit: "contain" }}
                           />
                           <VStack align="start" spacing={0}>
                              <Text fontSize="sm" color="gray.300">
                                 Jugos y Licuados
                              </Text>
                           </VStack>
                        </VStack>
                        <Text
                           fontSize="sm"
                           color="gray.400"
                           fontStyle="italic"
                           mt={2}
                           mb={6}
                        >
                           "Porque disfrutarlo al momento, es darle gusto al paladar"
                        </Text>
                     </Box>
                     : (
                        <Box py={5} display="flex" justifyContent="center" alignItems="center">
                           <Image
                              src="/logo-sm.webp"
                              alt="Jugos rugato logo"
                              width={700}
                              height={350}
                              priority
                              style={{ width: "90%", height: "50px", objectFit: "contain" }}
                           />
                        </Box>
                     )}
                  <Divider borderColor={colorScheme} borderWidth="2px" mb={2} />

                  {/* Menu Section */}
                  <VStack spacing={0} align="stretch" px={2}>
                     {menuItems.map((item, index) => (
                        <Item
                           key={index}
                           icon={item.icon}
                           label={item.label}
                           url={item.url || '#'}
                           isActive={item.isActive}
                           colorScheme={colorScheme}
                           active={active}
                        />
                     ))}
                  </VStack>
               </VStack>
            </Container>
            <HStack gap={4} mt={10}>
               <Link href={"/admin"} passHref>admin</Link>
               <Link href={"/kitchen"} passHref>kitchen</Link>
               <Link href={"/user"} passHref>user</Link>
            </HStack>

            <Box>
               <IconButton
                  aria-label="Toggle Menu"
                  icon={active === 1 ? <ChevronLeftIcon fontSize={"4xl"} /> : <ChevronRightIcon fontSize={"4xl"} />}
                  position="absolute"
                  bottom={4}
                  right={4}
                  zIndex={1000}
                  onClick={() => setActive(active === 1 ? 0 : 1)}
                  colorScheme={colorScheme}
                  variant="solid"
               />
            </Box>
         </Box>
         <Box
            flexGrow={1}
            minH={"100vh"}
            p={6}
            // bg="#1f2937"
            color="white"
         >
            {children}
         </Box>
      </HStack>
   )
}

const Item = (
   { icon, label, isActive, url, colorScheme, active }:
      { icon: React.ElementType, label: string, isActive: boolean, url: string, colorScheme: string, active: number }) => (

   <Box>
      <Link href={url} passHref >
         <Button
            variant="ghost"
            justifyContent="space-between"
            alignItems="center"
            h="55px"
            my={1}
            px={4}
            py={3}
            borderRadius="lg"
            bg={isActive ? colorScheme : "transparent"}
            color={isActive ? "gray.800" : "white"}
            _hover={{
               bg: isActive ? colorScheme : "gray.600"
            }}
            width={"100%"}
         >
            <HStack spacing={active === 1 ? 2 : 10} alignItems="center">
               <Icon as={icon} boxSize={5} />
               <Text fontSize="lg" fontWeight="medium">
                  {label}
               </Text>
            </HStack>
            <ChevronRightIcon boxSize={5} />
         </Button>
      </Link>
   </Box>
);