import { HStack, Select } from '@chakra-ui/react'
import React from 'react'
import Colors from '../../../contants/Colors'

export default function TypeOfUser(
    { userType, setUserType }:
        { userType: string, setUserType: React.Dispatch<React.SetStateAction<string>>, }
) {

    const typesOfUsers = [
        { value: "0", label: "Ambos" },
        { value: "2", label: "Meseros" },
        { value: "3", label: "Cocina" },
    ]

    return (

        <HStack alignItems={"center"}>
            <Select
                name="userType"
                value={userType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUserType(e.target.value)}
                bg={Colors.bgSecondary}
                color={Colors.text} border={`1px solid ${Colors.blue}`} rounded={"md"} w="200px">
                {typesOfUsers.map((user) => (
                    <option key={user.value} style={{ backgroundColor: Colors.bgSecondary }} value={user.value}>
                        {user.label}
                    </option>
                ))}
            </Select>
        </HStack>
    )
}
