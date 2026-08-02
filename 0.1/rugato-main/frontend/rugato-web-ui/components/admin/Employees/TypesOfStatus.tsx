import { HStack, Select } from '@chakra-ui/react'
import React from 'react'
import Colors from '../../../contants/Colors'

export default function TypesOfStatus(
    { userStatus, setUserStatus }:
        { userStatus: string, setUserStatus: React.Dispatch<React.SetStateAction<string>>, }
) {

    const typesOfStatus = [
		{ value: "2", label: "Todos" },
		{ value: "1", label: "Activos" },
		{ value: "0", label: "Inactivos" },
	]

    return (

        <HStack alignItems={"center"}>
            <Select
                name="userStatus"
                value={userStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUserStatus(e.target.value)}
                bg={Colors.bgSecondary}
                color={Colors.text} border={`1px solid ${Colors.blue}`} rounded={"md"} w="200px">
                {typesOfStatus.map((status) => (
                    <option key={status.value} style={{ backgroundColor: Colors.bgSecondary }} value={status.value}>
                        {status.label}
                    </option>
                ))}
            </Select>
        </HStack>
    )
}
