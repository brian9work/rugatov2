import React from 'react'
import { Box, Heading, Text, VStack, useBreakpointValue } from '@chakra-ui/react'
import Colors from '../contants/Colors';

export default function dashboard() {
  const fontSize = useBreakpointValue({ base: "lg", md: "xl" });
  const padding = useBreakpointValue({ base: 4, md: 8 });
  
  return (
    <Box p={padding} w="100%">
      <VStack spacing={6} align="center" justify="center" minH="60vh">
        <Heading 
          as="h1" 
          size={fontSize}
          textAlign="center"
          color={Colors.text}
        >
          Página en construcción
        </Heading>
        <Text 
          fontSize={{ base: "md", md: "lg" }}
          color="gray.300"
          textAlign="center"
        >
          Estamos trabajando para mejorar tu experiencia
        </Text>
      </VStack>
    </Box>
  )
}
