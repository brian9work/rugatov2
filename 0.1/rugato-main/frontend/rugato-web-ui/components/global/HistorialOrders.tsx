import { Badge, Box, HStack, IconButton, Spinner, Stack, Switch, Table, Tbody, Td, Text, Thead, Tr, VStack, useDisclosure, useToast } from '@chakra-ui/react'
import { FaRegCalendarAlt } from "react-icons/fa";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Colors from '../../contants/Colors';
import ViewOrder from './HistorialOrders/ViewOrder';
import { TbReload } from "react-icons/tb";
import AgregarOrder from './AgregarOrder';
import Service from '../../service/service';
import { useGet } from '../../hooks/GetWithCallback';
import { CreateOrder, FinancesExpensesRevenueResponse, FinancesRequest } from '../../TypesBackend';
import Order from './Order';
import CompletOrder from './HistorialOrders/CompletOrder';
import { usePut } from '../../hooks/Put';
import ViewProduct from './HistorialOrders/ViewProduct';
import { usePost } from '../../hooks/Post';
import handleAddExpense from '../admin/Expenses/controller/handleAddExpense';
import { useRouter } from 'next/router';

export default function HistorialOrders({ isUser = false, idUser, history = false }: { isUser?: boolean, idUser: string, history?: boolean }) {
  const { isOpen: isViewOrderOpen, onOpen: onViewOrderOpen, onClose: onViewOrderClose } = useDisclosure();
  const { isOpen: isViewProductOpen, onOpen: onViewProductOpen, onClose: onViewProductClose } = useDisclosure();
  const { isOpen: isCompletOrderOpen, onOpen: onCompletOrderOpen, onClose: onCompletOrderClose } = useDisclosure();
  const { put: changeEstatus, loading: loadingChangeEstatus, error: disableUserError } =
    usePut<{ id: string, }, any>()
  const { post, loading: financeLoading, error: financeError } = usePost<FinancesExpensesRevenueResponse, FinancesRequest>()

  const toast = useToast();
  const router = useRouter();
  const isKitchen = router.pathname.includes('kitchen');

  const { data, loading, error, refetch } =
    useGet<CreateOrder[]>(
      Service.orders.getToday()
    );

  const [dataOrders, setDataOrders] = useState<CreateOrder[]>();
  const [count, setCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<CreateOrder | null>(null);
  const [selectProductId, setSelectProductId] = useState<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBellSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(830, ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1245, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.6, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('No se pudo reproducir el sonido de campana:', e);
    }
  }, []);

  const KITCHEN_EXCLUDED_CATEGORIES = [
    "Cocteles",
    "Licuados combinados",
    "Licuados sencillos",
    "Esquimos",
    "Frappes",
    "Jugos Sencillos",
    "Aguas sencillas",
    "Aguas combinadas"
  ];

  useEffect(() => {
    if (data && loading === false) {
      const filtered = isKitchen
        ? data.filter(order => !KITCHEN_EXCLUDED_CATEGORIES.includes(order.categoryName))
        : data;
      const sorted = [...filtered].sort((a, b) => a.orderId - b.orderId).reverse();
      setDataOrders(sorted);

      if (data.length !== count) {
        if (count > 0) {
          playBellSound();
        }
        setCount(data.length);
      }

      if (count === 0) {
        setCount(data.length)
      }
    }
  }, [data, loading]);

  // Agrupa las órdenes en ventanas de 2 minutos según createdAt
  const WINDOW_MS = 2 * 60 * 1000; // 2 minutos en ms

  const groupedOrders = useMemo(() => {
    if (!dataOrders || dataOrders.length === 0) return [];

    // Ordenar por createdAt ascendente para que la diferencia de tiempo sea siempre positiva
    const sorted = [...dataOrders].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const groups: { label: string; orders: CreateOrder[] }[] = [];
    let currentGroup: CreateOrder[] = [];
    let windowStart: number | null = null;

    for (const order of sorted) {
      const orderTime = new Date(order.createdAt).getTime();
      if (windowStart === null) {
        windowStart = orderTime;
      }
      if (orderTime - windowStart <= WINDOW_MS) {
        currentGroup.push(order);
      } else {
        groups.push({
          label: `${new Date(windowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(windowStart + WINDOW_MS).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          orders: currentGroup,
        });
        currentGroup = [order];
        windowStart = orderTime;
      }
    }
    if (currentGroup.length > 0 && windowStart !== null) {
      groups.push({
        label: `${new Date(windowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(windowStart + WINDOW_MS).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        orders: currentGroup,
      });
    }

    // Invertir grupos para mostrar los más recientes primero
    return groups.reverse();
  }, [dataOrders]);

  return (
    <Box>
      <Box bg={Colors.bgSecondary} rounded={"2xl"} p={6} color={Colors.text} minH="70vh">
        <Stack
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={6}
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 4, md: 6 }}
        >
          <VStack alignItems={"flex-start"} gap={0}>
            <HStack spacing={4} alignItems={"center"} justifyItems={"center"} >
              <FaRegCalendarAlt size={30} color={Colors.green} />
              <Text fontSize="2xl" fontWeight={"bold"}>Historial de Pedidos</Text>
            </HStack>
            <Text fontSize="md">Mostrando todas las ordenes pendientes</Text>
          </VStack>

          <HStack alignItems={"center"} width={{ base: "100%", md: "auto" }}>
            <Box border={`1px solid ${Colors.blue}`} rounded={"md"}>
              <IconButton
                aria-label="Revertir"
                icon={<TbReload color={Colors.blue} fontSize={20} />}
                colorScheme='#0000'
                onClick={() => {
                  refetch()
                }}
              />
            </Box>


            {(() => {
              const TOTAL_SECONDS = 15;
              const [seconds, setSeconds] = useState(TOTAL_SECONDS);

              useEffect(() => {
                if (seconds === -1) {
                  setSeconds(TOTAL_SECONDS);
                  refetch();
                  return;
                }
                const timer = setInterval(() => setSeconds(s => s - 1), 1000);
                return () => clearInterval(timer);
              }, [seconds]);

              const progress = ((TOTAL_SECONDS - seconds) / TOTAL_SECONDS) * 100;

              return (
                <Box px={2} py={1} rounded="md" minW={{ base: "85%", md: "110px" }} textAlign="center">
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

        </Stack>

        <AgregarOrder />

        <Box border={"1px"} borderColor="gray.700" rounded={"lg"} overflowX="auto" maxWidth={"1200px"} >
          <Table
            rounded={"md"}
            size="md"
          >
            <Thead>
              <Tr bg={Colors.table.header} color={Colors.table.text}>
                <Td px={2} py={3} >ID</Td>
                <Td px={2} py={3} >Mesero</Td>
                <Td px={2} py={3} >Categoria</Td>
                <Td px={2} py={3} >Producto</Td>
                <Td px={2} py={3} >Estado</Td>
                <Td px={2} py={3} >Servicio</Td>
                <Td px={2} py={3} >Tiempo</Td>
                <Td px={2} py={3} >Mesa</Td>
                <Td px={2} py={3} >Total</Td>
                <Td px={2} py={3} ></Td>
                <Td px={2} py={3} ></Td>
              </Tr>
            </Thead>
            <Tbody>
              {loading && (
                <Tr>
                  <Td colSpan={9}>
                    <Text textAlign={"center"}>Cargando...</Text>
                  </Td>
                </Tr>
              )}
              {error && (
                <Tr>
                  <Td colSpan={9}>
                    <Text textAlign={"center"}>Error al cargar los datos</Text>
                  </Td>
                </Tr>
              )}
              {dataOrders && dataOrders.length === 0 && (
                <Tr>
                  <Td colSpan={9}>
                    <Text textAlign={"center"}>No hay órdenes para mostrar</Text>
                  </Td>
                </Tr>
              )}
              {groupedOrders.length > 0
                ? groupedOrders.map((group, gIdx) => {
                  const groupOrders = isKitchen
                    ? group.orders.filter(order => !KITCHEN_EXCLUDED_CATEGORIES.includes(order.categoryName))
                    : group.orders;

                  if (isKitchen && groupOrders.length === 0) return null;

                  return (
                    <React.Fragment key={gIdx}>
                      <Tr bg="gray.700">
                        <Td colSpan={11} py={1} px={3}>
                          <HStack spacing={2}>
                            <Box w="8px" h="8px" rounded="full" bg={Colors.green} />
                            <Text fontSize="xs" fontWeight="bold" color={Colors.green} letterSpacing="wider">
                              Bloque {gIdx + 1} &nbsp;·&nbsp; {groupOrders.length} orden{groupOrders.length !== 1 ? 'es' : ''}
                            </Text>
                          </HStack>
                        </Td>
                      </Tr>
                      {groupOrders.map((order) => (
                        <Order
                          key={order.orderId}
                          order={order}
                          onViewOrderOpen={onViewOrderOpen}
                          setSelectedOrder={setSelectedOrder}
                          refetch={refetch}
                          isUser={isUser}
                          openCompletOrder={() => {
                            onCompletOrderOpen()
                          }}
                        />
                      ))}
                    </React.Fragment>
                  );
                })
                : dataOrders && dataOrders.map((order) => (
                  <Order
                    key={order.orderId}
                    order={order}
                    onViewOrderOpen={onViewOrderOpen}
                    setSelectedOrder={setSelectedOrder}
                    refetch={refetch}
                    isUser={isUser}
                    openCompletOrder={() => {
                      onCompletOrderOpen()
                    }}
                  />
                ))
              }
            </Tbody>
          </Table>
        </Box>
      </Box>
      <ViewOrder
        isOpen={isViewOrderOpen}
        onClose={onViewOrderClose}
        loading={false}
        selectedOrder={selectedOrder}
        setSelectProductId={setSelectProductId}
        onViewProductOpen={onViewProductOpen}
      />
      <ViewProduct
        isOpen={isViewProductOpen}
        onClose={onViewProductClose}
        productId={selectProductId}
      />
      <CompletOrder
        isOpen={isCompletOrderOpen}
        onClose={onCompletOrderClose}
        onSave={async (save) => {
          await changeEstatus(Service.orders.changeStatus.delivered(selectedOrder?.orderId || 0), save)
          await handleAddExpense(
            {
              quantity: selectedOrder?.total + "",
              reason: `Venta de producto: ${selectedOrder?.dishName}`,
              categoryName: `Venta de producto: ${selectedOrder?.dishName}`,
              userId: 24
            },
            "ingreso",
            toast,
            post,
            financeError,
            () => { },
            () => { }
          )
          onCompletOrderClose();
          toast({
            title: 'Orden entregada.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          refetch();
          // Service.orders.changeStatus.delivered(selectedOrder?.orderId || 0);

        }}
        order={selectedOrder}
        loading={false}
      />

    </Box>

  )
}
