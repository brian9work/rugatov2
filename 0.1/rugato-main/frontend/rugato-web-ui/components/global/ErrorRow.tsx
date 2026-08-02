import { Td, Tr } from '@chakra-ui/react'
import React from 'react'

export default function ErrorRow({ colSpan }: { colSpan: number }) {
  return (
    <Tr
      bg="red.900"
    >
        <Td
            colSpan={colSpan}
            py={6}
            textAlign={"center"}
            fontWeight={"bold"}
            fontSize={"x-large"}
            animation={"pulse 1.5s infinite"}
        >Error inesperado</Td>
    </Tr>
  )
}
