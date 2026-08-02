import React from 'react'
import Layout from '../../components/Layout'
import Kitchen from '../../components/slider/Kitchen'
import { Box, VStack, Text, useBreakpointValue, SimpleGrid, Card, CardBody, HStack, Icon } from '@chakra-ui/react'
import Colors from '../../contants/Colors';
import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';
import Nav from '../../components/global/components/Nav';
import { AiOutlineHome } from 'react-icons/ai';

export default function index() {
  const spacing = useBreakpointValue({ base: 4, md: 6 });
  const columnsLinks = useBreakpointValue({ base: 1, sm: 2, md: 3 });

  const quickLinks = [
    { label: 'Órdenes', icon: FiShoppingBag, url: '/kitchen/orders', color: "orange.400", desc: 'Historial de pedidos' },
  ];

  return (
    <Box w="100%">
      <Layout>
        <Kitchen>
          <Nav
            icon={<AiOutlineHome />}
            title="Panel de Control"
            subtitle="Bienvenido de nuevo al sistema de cocina"
          />
          <VStack spacing={spacing} align="stretch" w="100%">
            <Box pt={10}>
              <Text fontSize="xl" fontWeight="bold" mb={6} color={Colors.text}>
                Accesos Rápidos
              </Text>
              <SimpleGrid columns={columnsLinks} spacing={spacing}>
                {quickLinks.map((link) => (
                  <Link key={link.url} href={link.url}>
                    <Card
                      bg={Colors.bgSecondary}
                      border="1px solid"
                      borderColor="transparent"
                      _hover={{
                        transform: 'translateY(-5px)',
                        borderColor: link.color,
                        shadow: 'xl',
                      }}
                      transition="all 0.3s"
                      cursor="pointer"
                    >
                      <CardBody>
                        <HStack spacing={4}>
                          <Box
                            p={3}
                            bg="rgba(255, 255, 255, 0.05)"
                            borderRadius="lg"
                            color={link.color}
                          >
                            <Icon as={link.icon} boxSize={6} />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" fontSize="lg" color={Colors.text}>
                              {link.label}
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                              {link.desc}
                            </Text>
                          </VStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </SimpleGrid>
            </Box>


          </VStack>
        </Kitchen>
      </Layout>
    </Box>
  )
}
