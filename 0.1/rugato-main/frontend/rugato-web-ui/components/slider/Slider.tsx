import { Box, VStack, HStack, Text, Button, Icon, Divider, Container, IconButton, useBreakpointValue, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, HamburgerIcon } from '@chakra-ui/icons'
import { FiDollarSign, FiUsers, FiMenu, FiClock, FiBarChart, FiSettings, } from 'react-icons/fi'
import { MenuItems } from '../../Types'
import { AiOutlineHome } from "react-icons/ai";
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Colors from '../../contants/Colors';
import { useState } from 'react';
import { LuLogIn } from 'react-icons/lu';

export default function Slider(
   { type, menuItems, children }:
      { type: "admin" | "user" | "kitchen", menuItems: MenuItems[], children?: React.ReactNode }
) {
   const [active, setActive] = useState<number>(0)
   // (localStorage.getItem("sidebarActive") === "1" ? 1 : 0);
   const router = useRouter();
   const pathname = router.pathname;
   const colorScheme = type === "admin" ? Colors.green : (type === "kitchen" ? Colors.yellow : Colors.blue);
   const { isOpen, onOpen, onClose } = useDisclosure();

   // Responsive breakpoints
   const isMobile = useBreakpointValue({ base: true, md: false });
   const sidebarWidth = useBreakpointValue({
      base: "100%",
      md: active === 1 ? "350px" : "70px"
   });

   menuItems = [...menuItems, {
      icon: LuLogIn, label: 'Salir', url: '/login', isActive: false
   }];
   menuItems = menuItems.map(item => ({
      ...item,
      isActive: item.url === pathname,
   }));

   const SidebarContent = ({ closeDrawer }: { closeDrawer: () => void }) => (
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
                     <Text fontSize="sm" color={Colors.text}>
                        Jugos y Licuados
                     </Text>
                  </VStack>
               </VStack>
               <Text
                  fontSize="sm"
                  color={Colors.text}
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
                  onClose={closeDrawer}
               />
            ))}
         </VStack>

         {!isMobile && (
            <Box>
               <IconButton
                  aria-label="Toggle Menu"
                  icon={active === 1 ? <ChevronLeftIcon fontSize={"4xl"} /> : <ChevronRightIcon fontSize={"4xl"} />}
                  position="absolute"
                  bottom={4}
                  right={4}
                  zIndex={1000}
                  onClick={() => {
                     setActive(active === 1 ? 0 : 1)
                     // localStorage.setItem("sidebarActive", active === 1 ? "0" : "1")
                  }}
                  colorScheme={colorScheme}
                  variant="solid"
               />
            </Box>
         )}
      </VStack>
   );

   return (
      <HStack justify={"flex-start"} alignItems={"flex-start"} spacing={0} minH="100vh" w="100%">
         {/* Mobile Drawer */}
         {isMobile ? (
            <Box>
               <Box
                  position="fixed"
                  top={0}
                  left={0}
                  px={4}
                  py={2}
                  zIndex={1001}
                  width={"100%"}
                  background={Colors.bg}
                  shadow={"md"}
                  borderBottom={"0.5px solid"}
                  borderColor={"#FFF"}
               >
                  <IconButton
                     aria-label="Open Menu"
                     icon={<HamburgerIcon fontSize={"3xl"} />}
                     onClick={onOpen}
                     colorScheme={colorScheme}
                     background={Colors.bgSecondary}
                     variant="solid"
                     size={"3xl"}
                  />
               </Box>
               <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
                  <DrawerOverlay />
                  <DrawerContent bg={Colors.bg} color={Colors.text}>
                     <DrawerCloseButton color={Colors.text} />
                     <DrawerHeader borderBottomWidth="1px" borderColor={colorScheme}>
                        <Image
                           src="/logo.webp"
                           alt="Jugos rugato logo"
                           width={700}
                           height={350}
                           priority
                           style={{ width: "100%", height: "50px", objectFit: "contain" }}
                        />
                     </DrawerHeader>
                     <DrawerBody p={0}>
                        <SidebarContent closeDrawer={onClose} />
                     </DrawerBody>
                  </DrawerContent>
               </Drawer>
            </Box>
         ) : (
            /* Desktop Sidebar */
            <Box bg={Colors.bg} minH="100vh"
               position={"relative"}
               maxW={sidebarWidth}
               w={sidebarWidth}
               overflow={"hidden"}
               color={Colors.text}
               display={"block"}
               shadow={"md"}
               borderRight={"2px solid #2d3748"}
               transition="max-width 0.3s ease"
            >
               <Container maxW="sm" p={0}>
                  <SidebarContent closeDrawer={onClose} />
               </Container>
            </Box>
         )}

         {/* Main Content */}
         <Box
            flexGrow={1}
            minH={"100vh"}
            p={{ base: 4, md: 6 }}
            color={Colors.text}
            w={sidebarWidth}
         >
            {children}
         </Box>
      </HStack>
   )
}

const Item = (
   { icon, label, isActive, url, colorScheme, active, onClose }:
      { icon: React.ElementType, label: string, isActive: boolean, url: string, colorScheme: string, active: number, onClose?: () => void }) => (

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
            color={isActive ? "gray.800" : Colors.text}
            _hover={{
               bg: isActive ? colorScheme : "gray.600"
            }}
            width={"100%"}
            onClick={onClose}
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