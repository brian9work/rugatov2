import { Box, HStack, IconButton, Table, Tbody, Td, Text, Thead, Tr, VStack, useDisclosure } from '@chakra-ui/react'
import { FaRegCalendarAlt } from "react-icons/fa";
import React, { useEffect, useState } from 'react'
import Colors from '../../contants/Colors';
import Estatus from './HistorialOrders/Estatus';
import { EstatusType } from '../../Types';
import ViewOrder from './HistorialOrders/ViewOrder';
import HandleViewOrder from './HistorialOrders/controller/HandleViewOrder';
import AcceptOrder from './HistorialOrders/AcceptOrder';
import HandleAcceptOrder from './HistorialOrders/controller/HandleAcceptOrder';
import { TbReload } from "react-icons/tb";
import ButtonsComponents from './ButtonsComponents';

const tableData = [
  { id: 1, mesero: "Juan Perez", cliente: "Maria Lopez", estado: "pendiente", hora: "10:00 AM", total: "$50.00" },
  { id: 2, mesero: "Pedro Sanchez", cliente: "Laura Jimenez", estado: "preparando", hora: "11:30 AM", total: "$80.00" },
  { id: 3, mesero: "Luis Martinez", cliente: "Sofia Torres", estado: "listo", hora: "11:00 AM", total: "$60.00" },
  { id: 4, mesero: "Ana Gomez", cliente: "Carlos Ruiz", estado: "entregado", hora: "10:30 AM", total: "$75.00" },

  { id: 5, mesero: "Juan Perez", cliente: "Maria Lopez", estado: "pendiente", hora: "10:00 AM", total: "$50.00" },
  { id: 6, mesero: "Claudia Ramirez", cliente: "Javier Morales", estado: "cancelado", hora: "12:00 PM", total: "$40.00" },
];

export default function HistorialOrders() {
  const { isOpen: isViewOrderOpen, onOpen: onViewOrderOpen, onClose: onViewOrderClose } = useDisclosure();
  const { isOpen: isAcceptOrderOpen, onOpen: onAcceptOrderOpen, onClose: onAcceptOrderClose } = useDisclosure();

  return (
    <>
      <Box bg={Colors.bgSecondary} rounded={"2xl"} p={6} color="white" minH="70vh">
        <HStack justifyContent={"space-between"} alignItems={"center"} mb={6}>
          <VStack alignItems={"flex-start"} gap={0}>
            <HStack spacing={4} alignItems={"center"} justifyItems={"center"} >
              <FaRegCalendarAlt size={30} color={Colors.green} />
              <Text fontSize="2xl" fontWeight={"bold"}>Historial de Pedidos</Text>
            </HStack>
            <Text fontSize="md">Mostrando todas las ordenes pendientes</Text>
          </VStack>

          <HStack alignItems={"center"}>
            <Box border={`1px solid ${Colors.blue}`} rounded={"md"}>
              <IconButton
                aria-label="Revertir"
                icon={<TbReload color={Colors.blue} fontSize={20} />}
                colorScheme='#0000'
                onClick={() => { }}
              />
            </Box>

          {(() => {
            const TOTAL_SECONDS = 60;
            const [seconds, setSeconds] = useState(TOTAL_SECONDS);

            useEffect(() => {
              if (seconds === -1) {
                setSeconds(TOTAL_SECONDS);
                return;
              }
              const timer = setInterval(() => setSeconds(s => s - 1), 1000);
              return () => clearInterval(timer);
            }, [seconds]);

            const progress = ((TOTAL_SECONDS - seconds) / TOTAL_SECONDS) * 100;

            return (
              <Box px={2} py={1} rounded="md" minW="90px" textAlign="center">
                <Text fontSize="md" color={Colors.green} fontWeight="bold">
                  {Math.floor(seconds / 60)
                    .toString()
                    .padStart(2, '0')}
                  :
                  {(seconds % 60).toString().padStart(2, '0')}
                </Text>
                <Box mt={1}>
                  <Box
                    h="6px"
                    w="100%"
                    bg="gray.600"
                    rounded="full"
                    overflow="hidden"
                  >
                    <Box
                      h="100%"
                      bg={Colors.green}
                      style={{
                        width: `${100 - progress}%`,
                        transition: "width 1s linear"
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })()}
            
          </HStack>

        </HStack>
        <Box border={"1px"} borderColor="gray.700" rounded={"lg"} overflowX="auto">
          <Table
            rounded={"md"}
            size="md"
          >
            <Thead>
              <Tr bg={Colors.table.header} color={Colors.table.text}>
                <Td>ID</Td>
                <Td>Mesero</Td>
                <Td>Cliente</Td>
                <Td>Estado</Td>
                <Td>Hora</Td>
                <Td>Total</Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((order) => (
                <Tr
                  key={order.id}
                  _hover={{ bg: Colors.bg }}
                >
                  <Td>{order.id}</Td>
                  <Td>{order.mesero}</Td>
                  <Td>{order.cliente}</Td>
                  <Td>
                    <Estatus estatus={order.estado as EstatusType} />
                  </Td>
                  <Td>{order.hora}</Td>
                  <Td>{order.total}</Td>
                  <Td w="50px">
                    <ButtonsComponents.View onClick={() => HandleViewOrder(onViewOrderOpen)} />
                  </Td>
                  <Td>
                    <HStack spacing={2} alignItems="center">
                      {order.estado === 'pendiente' && (
                        <>
                          <ButtonsComponents.Delete onClick={() => { }} />
                          <ButtonsComponents.Complete onClick={() => HandleAcceptOrder(onAcceptOrderOpen)} />
                        </>
                      )}
                      {order.estado === 'entregado' && (
                        <>
                        </>
                      )}
                      {order.estado === 'listo' && (
                        <>
                          <ButtonsComponents.Print onClick={() => { }} />
                        </>
                      )}
                      {order.estado === 'preparando' && (
                        <>
                          <ButtonsComponents.Delete onClick={() => { }} />
                          <ButtonsComponents.Complete onClick={() => HandleAcceptOrder(onAcceptOrderOpen)} />
                        </>
                      )}
                      {order.estado === 'cancelado' && (
                        <>
                          <ButtonsComponents.Revert onClick={() => { }} />
                        </>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <ViewOrder
        isOpen={isViewOrderOpen}
        onClose={onViewOrderClose}
        onSave={() => { }}
        loading={false}
      />
      <AcceptOrder
        isOpen={isAcceptOrderOpen}
        onClose={onAcceptOrderClose}
        onSave={() => { }}
        loading={false}
      />
    </>

  )
}

