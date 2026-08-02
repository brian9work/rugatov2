import React from 'react'
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import './style.css'
import Colors from '../contants/Colors';

export default function Layout({ children }: { children: React.ReactNode }) {
   const isMobile = useBreakpointValue({ base: true, md: false });
   return (
      <Flex direction="column" minH="100vh" w="100%">
         <Box
            flex="1"
            bg={Colors.bg}
            w="100%"
            overflow="hidden"
            pt={isMobile ? 20 : 4}
         >
            {children}
         </Box>
      </Flex>
   )
}