import React from 'react'
import { CreateOrder } from '../../TypesBackend';
import { getCategoriaByName } from '../data/CategoriesData';
import { Badge, HStack, Td, Text, Tr } from '@chakra-ui/react';
import GetEstatus from './components/GetEstatus';
import LongAgo from './components/LongAgo';
import ButtonsComponents from './ButtonsComponents';
import Colors from '../../contants/Colors';
import Service from '../../service/service';
import { usePut } from '../../hooks/Put';
import ServicioCustomer from './components/ServicioCustomer';

export default function Order(
  { order, onViewOrderOpen, setSelectedOrder, refetch, isUser, openCompletOrder }:
    {
      order: CreateOrder,
      onViewOrderOpen: () => void,
      setSelectedOrder: (order: CreateOrder) => void,
      refetch: () => void,
      isUser: boolean,

      openCompletOrder: () => void
    }
) {
  const { put: changeEstatus, loading: loadingChangeEstatus, error: disableUserError } =
    usePut<{ id: string, }, any>()

  const handleChangeEstatus = async (id: number, status: string) => {
    let url = "";
    switch (status) {
      case 'en preparacion':
        url = Service.orders.changeStatus.inPreparation(id);
        break;
      case 'cancelado':
        url = Service.orders.changeStatus.canceled(id);
        break;
      case 'completado':
        url = Service.orders.changeStatus.completed(id);
        break;
      case 'entregado':
        url = Service.orders.changeStatus.delivered(id);
        break;
      default:
        url = Service.orders.changeStatus.revert(id);
        break;
    }

    await changeEstatus(url, {})
    refetch();
  }

  if (isUser && order.statusName === 'completado') {
    return null
  }

  if (order.statusName === 'cancelado') {
    return null;
  }


  const categoria = getCategoriaByName(order.categoryName);
  return (
    <Tr
      key={order.orderId}
    >
      <Td px={2} py={3}>
        <Text fontWeight={"bold"}>
          #{order.orderId}
        </Text>
      </Td>
      <Td px={2} py={3}>{order.userName}</Td>
      <Td px={0} py={3} w={"fit-content"}>
        <Badge bg={categoria.bg} color={categoria.color} p={1} px={2} rounded="md">
          {categoria.acronym}
        </Badge>
      </Td>
      <Td px={2} py={3}>
        {order.dishName}</Td>
      <Td px={2} py={3}>
        <GetEstatus value={order.statusName + ""} />
      </Td>
      <Td px={2} py={3}>
        <ServicioCustomer service={order.service} />
      </Td>
      <Td px={2} py={3}>
        <LongAgo time={order.createdAt} />
      </Td>
      <Td px={2} py={3}>
        {order.coustumer}
      </Td>
      <Td px={2} py={3} fontWeight={"bold"} color={order.statusName === 'cancelado' ? Colors.red : Colors.green}>${order.total}</Td>
      <Td px={2} py={3} w="50px">
        <ButtonsComponents.View onClick={() => {
          onViewOrderOpen()
          setSelectedOrder(order)
        }} />
      </Td>

      {!isUser && (
        <Td px={2} py={3}>
          <HStack spacing={2} alignItems="center">
            {order.statusName === 'pendiente' && (
              <>
                <ButtonsComponents.Delete loading={loadingChangeEstatus} onClick={() => {
                  handleChangeEstatus(order.orderId, 'cancelado')
                }} />
                <ButtonsComponents.Complete loading={loadingChangeEstatus} onClick={() => {
                  handleChangeEstatus(order.orderId, 'en preparacion')
                  // onAcceptOrderOpen()
                  // setSelectedOrder(order)
                }} />
              </>
            )}
            {order.statusName === 'entregado' && (
              <>
              </>
            )}
            {order.statusName === 'completado' && (
              <>
                <ButtonsComponents.Delivery loading={loadingChangeEstatus} onClick={() => {
                  openCompletOrder()
                  setSelectedOrder(order)
                }} />
              </>
            )}
            {order.statusName === 'en preparacion' && (
              <>
                <ButtonsComponents.Delete loading={loadingChangeEstatus} onClick={() => {
                  handleChangeEstatus(order.orderId, 'cancelado')
                }} />
                <ButtonsComponents.Complete loading={loadingChangeEstatus} onClick={() => {
                  handleChangeEstatus(order.orderId, 'completado')
                  // HandleAcceptOrder(onAcceptOrderOpen)
                }} />
              </>
            )}
            {order.statusName === 'cancelado' && (
              <>
                <ButtonsComponents.Revert loading={loadingChangeEstatus} onClick={() => {
                  handleChangeEstatus(order.orderId, '')
                }} />
              </>
            )}
          </HStack>
        </Td>
      )}
      {isUser && (
        <Td px={2} py={3}>
          <HStack spacing={2} alignItems="center">
            {order.statusName === 'pendiente' && (
              <>
                <ButtonsComponents.Pending loading={loadingChangeEstatus} onClick={() => {
                  handleChangeEstatus(order.orderId, 'en preparacion')
                }} />
                <ButtonsComponents.Delete loading={loadingChangeEstatus} onClick={() => {
                  handleChangeEstatus(order.orderId, 'cancelado')
                }} />
              </>
            )}
            {order.statusName === 'completado' && (
              <>
                <ButtonsComponents.Delivery loading={loadingChangeEstatus} onClick={() => {
                  handleChangeEstatus(order.orderId, 'entregado')
                }} />
              </>
            )}
            {order.statusName === 'en preparacion' && (
              <>
                <ButtonsComponents.Complete loading={loadingChangeEstatus} onClick={() => {
                  handleChangeEstatus(order.orderId, 'completado')
                  // HandleAcceptOrder(onAcceptOrderOpen)
                }} />
              </>
            )}
            {order.statusName === 'cancelado' && (
              <>
                <ButtonsComponents.Revert loading={loadingChangeEstatus} onClick={() => {
                  handleChangeEstatus(order.orderId, '')
                }} />
              </>
            )}
          </HStack>
        </Td>
      )}

    </Tr>)
}
