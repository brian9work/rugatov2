import React, { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react';
import './style.css'

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <Flex direction="column" minH="100vh">
         <Box flex="1" bg="#111827">
            {children}
         </Box>
      </Flex>
   )

}