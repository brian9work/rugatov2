import React from 'react'
import Layout from '../../components/Layout'
import User from '../../components/slider/User'
import { Box, useBreakpointValue } from '@chakra-ui/react'
import HistorialOrders from '../../components/global/HistorialOrders';
import { MyContext } from '../../context/Context';

export default function orders() {
    const fontSize = useBreakpointValue({ base: "md", md: "lg" });
    const { idUser } = MyContext()
    
    return (
        <Box w="100%">
            <Layout>
                <User>
                    <HistorialOrders isUser={true} idUser={idUser}  />
                </User>
            </Layout>
        </Box>
    )
}
