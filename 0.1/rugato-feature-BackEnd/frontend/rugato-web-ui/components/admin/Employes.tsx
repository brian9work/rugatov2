import { Box, Card, HStack, IconButton, Select, Table, Tbody, Td, Text, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import React from 'react'
import Colors from '../../contants/Colors'
import {
	FiUsers,
} from 'react-icons/fi'
import AddEmployee from './Employees/AddEmployee'
import ButtonsComponents from '../global/ButtonsComponents'
import TypeOfUser from './Employees/TypeOfUser'
import TypesOfStatus from './Employees/TypesOfStatus'

export default function Employes() {
	const { isOpen: isViewOrderOpen, onOpen: onViewOrderOpen, onClose: onViewOrderClose } = useDisclosure();
	const [userType, setUserType] = React.useState("1")
	const [userStatus, setUserStatus] = React.useState("1")

	const usersData = [
		{ id: 1, nombre: "Juan Perez", telefono: "123456789", usuario: "juanp", contraseña: "password", tipo: "1", estatus: 1 },
		{ id: 2, nombre: "Maria Gomez", telefono: "987654321", usuario: "mariag", contraseña: "password", tipo: "2", estatus: 0 },
	]

	return (
		<Box bg={Colors.bgSecondary} rounded={"2xl"} p={6} color="white" minH="70vh">
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
						<Text fontSize="md" color="white" fontWeight="bold">Agregar Usuario</Text>
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
							<Td></Td>
						</Tr>
					</Thead>
					<Tbody>
						{usersData.map(user => (
							<Tr key={user.id} _hover={{ bg: Colors.bg }}>
								<Td>{user.id}</Td>
								<Td>{user.nombre}</Td>
								<Td>{user.telefono}</Td>
								<Td>{user.usuario}</Td>
								<Td w="200px">
									<HStack spacing={2} alignItems="center">
										{user.estatus === 1 && (
											<>
												<ButtonsComponents.Edit onClick={() => { }} />
												<ButtonsComponents.Delete onClick={() => { }} />
											</>
										)}
										{user.estatus === 0 && (
											<>
												<ButtonsComponents.Revert onClick={() => { }} />
											</>
										)}
									</HStack>
									<HStack spacing={2} alignItems="center">
									</HStack>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>


			<AddEmployee
				isOpen={isViewOrderOpen}
				onClose={onViewOrderClose}
				onSave={() => { }}
				loading={false}
			/>

		</Box>
	)
}
