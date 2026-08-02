import React from 'react'
import Layout from '../../components/Layout'
import Kitchen from '../../components/slider/Kitchen'
import HistorialOrders from '../../components/global/HistorialOrders'
import { Box } from '@chakra-ui/react'

export default function orders() {
    return (
        <Box w="100%">
            <Layout>
                <Kitchen>
                    <HistorialOrders isUser={true} idUser='0' />
                </Kitchen>
            </Layout>
        </Box>
    )
}
