import { Box, HStack, Table, Tbody, Td, Text, Thead, Tr, useDisclosure, VStack, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Colors from '../../../contants/Colors'
import { FiUsers, } from 'react-icons/fi'
import AddEmployee from './AddEmployee'
import ButtonsComponents from '../../global/ButtonsComponents'
import TypeOfUser from './TypeOfUser'
import TypesOfStatus from './TypesOfStatus'
import Service from '../../../service/service'
import { User } from '../../../Types'
import { useGet } from '../../../hooks/GetWithCallback'
import SkeletonRow from '../../global/SkeletonRow'
import ErrorRow from '../../global/ErrorRow'
import { usePost } from '../../../hooks/Post'
import { UserPost, UserResponse } from '../../../TypesBackend'
import { usePut } from '../../../hooks/Put'
import handleAddUser from './controller/handleNewUser'
import handleDisableUser from './controller/handleDisableUser'
import handleEnableUser from './controller/handleEnableUser'

export default function Employes() {
   const toast = useToast();
   const { isOpen: isViewOrderOpen, onOpen: onViewOrderOpen, onClose: onViewOrderClose } = useDisclosure();
   const [userType, setUserType] = React.useState("0")
   const [userStatus, setUserStatus] = React.useState("2")
   const {
      data,
      loading: cargandoUsers,
      error: error,
      refetch: refetchUsers,
   } = useGet<User[]>(Service.user.getAll());
   // (userStatus === "2" ? Service.user.getAll() : userStatus === "1" ? Service.user.getActive() : Service.user.getInactive());

   const { post: addUser, loading: loadingUser, error: errorUser } = usePost<UserResponse, UserPost>()
   const { put: disableUser, loading: loadingDisableUser, error: disableUserError } = usePut<UserResponse, any>()
   const { put: enableUser, loading: loadingEnableUser, error: enableUserError } = usePut<UserResponse, any>()

   const [users, setUsers] = React.useState<User[]>([]);

   useEffect(() => {
      setUsers([]);
      if (data) {
         setUsers(data);
      }
   }, [data, userStatus]);

   const filterUsers = users.filter(user => {
      const typeMatch = userType === "0" || user.type === userType;
      const statusMatch = userStatus === "2" || user.is_active.toString() === userStatus;
      return typeMatch && statusMatch;
   });

   return (
      <Box bg={Colors.bgSecondary} rounded={"2xl"} p={6} color={Colors.text} minH="70vh">
         <HStack justifyContent={"space-between"} alignItems={"center"} mb={6}>
            <VStack alignItems={"flex-start"} gap={0}>
               <HStack spacing={4} alignItems={"center"} justifyItems={"center"} >
                  <FiUsers size={30} color={Colors.green} />
                  <Text fontSize="2xl" fontWeight={"bold"}>Usuarios</Text>
               </HStack>
            </VStack>
            <TypeOfUser userType={userType} setUserType={setUserType} />
         </HStack>

         <HStack spacing={4} alignItems={"center"} mb={6} justifyContent={"space-between"}>
            <TypesOfStatus userStatus={userStatus} setUserStatus={setUserStatus} />
            <Box>
               <Box bg={Colors.green} rounded={"xl"} py={2} px={4} w="fit-content" ml={"auto"} cursor="pointer" onClick={onViewOrderOpen}>
                  <Text fontSize="md" color={Colors.text} fontWeight="bold">Agregar Usuario</Text>
               </Box>
            </Box>
         </HStack>

         <Box border={"1px"} borderColor="gray.700" rounded={"lg"} overflowX="auto">
            <Table
               rounded={"md"}
               size="md"
            >
               <Thead>
                  <Tr bg={Colors.table.header} color={Colors.table.text}>
                     <Td>ID</Td>
                     <Td>Nombre</Td>
                     <Td>Telefono</Td>
                     <Td>Usuario</Td>
                     <Td>Acrónimo</Td>
                     <Td>Tipo</Td>
                     <Td>Creado</Td>
                     <Td></Td>
                  </Tr>
               </Thead>
               <Tbody>
                  {cargandoUsers && <SkeletonRow colSpan={8} />}
                  {error && <ErrorRow colSpan={8} />}
                  {filterUsers.map(user => (
                        <Tr key={user.id} _hover={{ bg: Colors.bg }}>
                           <Td>{user.id}</Td>
                           <Td>{user.name} {user.lastname}</Td>
                           <Td>{user.phone}</Td>
                           <Td>{user.user}</Td>
                           <Td>{user.acronym.toUpperCase()}</Td>
                           <Td>{
                              user.type === "1" ? <Text fontWeight={"bold"} color={Colors.green}>Admin</Text> :
                                 user.type === "2" ? <Text fontWeight={"bold"} color={Colors.blue}>Usuario</Text> :
                                    user.type === "3" ? <Text fontWeight={"bold"} color={Colors.yellow}>Cocina</Text> :
                                       "Desconocido"
                              }</Td>
                           <Td>{
                              user.created_at.split("T")[0].split("-")[2] + "/" +
                              user.created_at.split("T")[0].split("-")[1] + "/" +
                              user.created_at.split("T")[0].split("-")[0]
                           }</Td>
                           <Td w="200px">
                              <HStack spacing={2} alignItems="center">
                                 {user.is_active === 1 && (
                                    <>
                                       <ButtonsComponents.Edit onClick={() => {
                                          // handleDisableUser(user.id);
                                       }} />
                                       <ButtonsComponents.DesactivateUser onClick={() => {
                                          handleDisableUser(user.id, disableUser, disableUserError, toast, refetchUsers);
                                       }} />
                                    </>
                                 )}
                                 {user.is_active === 0 && (
                                    <>
                                       <ButtonsComponents.Revert onClick={() => {
                                          handleEnableUser(user.id, enableUser, enableUserError, toast, refetchUsers);
                                       }} />
                                       {/* <ButtonsComponents.Delete onClick={() => {
                                          handleDeleteUser(user.id, deleteUser, deleteUserError, toast, refetchUsers);
                                        }} /> */}
                                    </>
                                 )}
                              </HStack>
                              <HStack spacing={2} alignItems="center">
                              </HStack>
                           </Td>
                        </Tr>
                     ))
                  }
               </Tbody>
            </Table>
         </Box>

         <AddEmployee
            isOpen={isViewOrderOpen}
            loadingUser={loadingUser}
            onClose={onViewOrderClose}
            onSave={(values) => {
               handleAddUser(values, addUser, errorUser, toast, onViewOrderClose, refetchUsers);
            }}
            loading={false}
         />

      </Box>
   )
}
