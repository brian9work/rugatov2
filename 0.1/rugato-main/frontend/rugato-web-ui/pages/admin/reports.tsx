import React from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/slider/Admin'
import { Box, Text, useBreakpointValue } from '@chakra-ui/react'
import { FiBarChart } from 'react-icons/fi';
import Nav from '../../components/global/components/Nav';
import Report from '../../components/admin/Report/Report';

export default function reports() {
    const fontSize = useBreakpointValue({ base: "md", md: "lg" });

    return (
        <Box w="100%">
            <Layout>
                <Admin>
                    <Nav
                        icon={<FiBarChart />}
                        title="Reportes"
                        subtitle="Administra los reportes del sistema"
                    />
                    <Report />
                </Admin>
            </Layout>
        </Box>
    )
}
