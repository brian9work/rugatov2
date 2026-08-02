import React from 'react'
import { Box, Button, Card, HStack, IconButton, Input, Select, Table, Tbody, Td, Text, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import Colors from '../../contants/Colors'
import ModalComponent from './components/ModalComponent'
import SelectedOrder from './menu/SelectedOrder';

export default function AgregarOrder() {
   const { isOpen, onOpen, onClose } = useDisclosure();
   return (
      <Box>
         <HStack
            alignItems={"flex-end"}
            justifyContent={"flex-end"}
            width={"100%"}
            my={3}
         >
            <Button
               colorScheme='teal'
               background={Colors.green}
               color={"#000"}
               fontWeight={"bold"}
               _hover={{ transform: "scale(1.05)" }}
               onClick={onOpen}
            >
               Agregar Orden
            </Button>
         </HStack>
         <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            header="Agregar Orden"
            size="5xl"
            responsive={"sm"}
         >
            <SelectedOrder />
         </ModalComponent>
      </Box>
   )
}
