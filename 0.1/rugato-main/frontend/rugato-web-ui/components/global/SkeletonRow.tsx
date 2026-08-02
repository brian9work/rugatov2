import { Td, Tr } from '@chakra-ui/react'
import React from 'react'

export default function SkeletonRow({ colSpan }: { colSpan: number }) {
  return (
    <Tr
      bg="gray.700"
      
    >
        <Td
            colSpan={colSpan}
            py={6}
            textAlign={"center"}
            fontWeight={"bold"}
            fontSize={"x-large"}
            animation={"pulse 1.5s infinite"}
        >Cargando</Td>
    </Tr>
  )
}
