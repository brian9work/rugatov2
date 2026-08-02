import React from 'react'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import Colors from '../../../contants/Colors'

export default function ModalComponent(
   { isOpen, onClose, children, header, size="6xl", responsive="xl" }: 
   { isOpen: boolean; onClose: () => void; children: React.ReactNode; header: string; size?: string; responsive?: string }
) {

   return (
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: responsive, md: size }}>
         <ModalOverlay />
         <ModalContent bg={Colors.bg} color={Colors.text} pb={3}>
            <ModalHeader>{header}</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={{ base: 1, md: 4 }}>
               {children}
            </ModalBody>
         </ModalContent>
      </Modal>

   )
}
