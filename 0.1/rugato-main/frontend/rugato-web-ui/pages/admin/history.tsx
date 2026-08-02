import React from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/slider/Admin'
import HistorialOrders from '../../components/global/HistorialOrders'
import { Box } from '@chakra-ui/react'
import Nav from '../../components/global/components/Nav'
import { FaRegClock } from "react-icons/fa6";

export default function history() {
    return (
        <Box w="100%">
            <Layout>
                <Admin>
                    <Nav
                        icon={<FaRegClock />}
                        title="Órdenes de hoy"
                        subtitle="Observa las ordenes"
                    />
                    <HistorialOrders idUser={"0"} />
                    {/* <HistorialOrders isUser={true} idUser={"0"} history={true} /> */}
                </Admin>
            </Layout>
        </Box>
    )
}
