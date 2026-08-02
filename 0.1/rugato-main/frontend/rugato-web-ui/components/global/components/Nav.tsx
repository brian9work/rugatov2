import { Box, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import Colors from '../../../contants/Colors'

export default function Nav(
  { title, subtitle, icon }: { title?: string, subtitle?: string, icon: React.ReactNode }
) {
  return (
    <HStack mb={10} spacing={5} alignItems={"center"}>
      <Box fontSize={"3rem"} color={Colors.green}>
        {icon}
      </Box>
      <Box>
        <Text fontWeight="bold" fontSize="4xl">{title}</Text>
        <Text>{subtitle}</Text>
      </Box>
    </HStack>
  )
}
