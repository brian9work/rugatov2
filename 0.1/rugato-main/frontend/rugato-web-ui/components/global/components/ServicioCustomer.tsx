import { Badge, Box, Text } from '@chakra-ui/react'
import React from 'react'
import Colors from '../../../contants/Colors'

export default function ServicioCustomer({ service }: { service: string }) {

  if (service === "llevar") {
    return (
      <Badge bg={Colors.green} color={"white"} p={1} px={2} rounded="md">
        <Text fontWeight={"bold"}>{service}</Text>
      </Badge>
    )
  }

  return (
      <Badge bg={Colors.blue} color={"white"} p={1} px={2} rounded="md">
      <Text fontWeight={"bold"}>{service}</Text>
    </Badge>
  )
}
