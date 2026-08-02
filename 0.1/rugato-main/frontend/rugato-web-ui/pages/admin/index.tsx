import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/slider/Admin'
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  useBreakpointValue,
} from '@chakra-ui/react'
import Colors from '../../contants/Colors';
import Nav from '../../components/global/components/Nav'
import { AiOutlineHome } from 'react-icons/ai';
import { FiDollarSign, FiUsers, FiBarChart, FiSettings, FiShoppingBag } from 'react-icons/fi';
import { RiDrinksLine } from 'react-icons/ri';
import { useGet } from '../../hooks/GetWithCallback';
import Service from '../../service/service';
import { FinancesResponse } from '../../TypesBackend';
import { CreateOrder } from '../../TypesBackend';
import Link from 'next/link';

export default function Index() {
  const spacing = useBreakpointValue({ base: 4, md: 6 });
  const columnsStat = useBreakpointValue({ base: 1, sm: 2, lg: 4 });
  const columnsLinks = useBreakpointValue({ base: 1, sm: 2, md: 3 });

  const { data: finances } = useGet<FinancesResponse>(Service.finances.getToday());
  const { data: cashbox } = useGet<number>(Service.finances.getCashboxToday());
  const { data: orders } = useGet<CreateOrder[]>(Service.orders.getToday());

  const [stats, setStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
    pendingOrders: 0,
    cashOnHand: 0
  });

  useEffect(() => {
    if (finances) {
      const sales = finances.revenues?.reduce((acc, curr) => acc + Number(curr.quantity), 0) || 0;
      const expenses = finances.expenses?.reduce((acc, curr) => acc + Number(curr.quantity), 0) || 0;
      setStats(prev => ({
        ...prev,
        totalSales: sales,
        totalExpenses: expenses
      }));
    }
    if (cashbox !== undefined) {
      setStats(prev => ({ ...prev, cashOnHand: cashbox }));
    }
    if (orders) {
      setStats(prev => ({ ...prev, pendingOrders: orders.length }));
    }
  }, [finances, cashbox, orders]);

  const quickLinks = [
    { label: 'Menú', icon: RiDrinksLine, url: '/admin/menu', color: Colors.green, desc: 'Gestiona platillos y precios' },
    { label: 'Gastos', icon: FiDollarSign, url: '/admin/expenses', color: Colors.blue, desc: 'Registra ingresos y egresos' },
    { label: 'Empleados', icon: FiUsers, url: '/admin/employees', color: Colors.yellow, desc: 'Administra tu equipo' },
    { label: 'Reportes', icon: FiBarChart, url: '/admin/reports', color: "purple.400", desc: 'Analiza el rendimiento' },
    { label: 'Órdenes', icon: FiShoppingBag, url: '/admin/history', color: "orange.400", desc: 'Historial de pedidos' },
    { label: 'Configuración', icon: FiSettings, url: '/admin/settings', color: "gray.400", desc: 'Ajustes del sistema' },
  ];

  return (
    <Box w="100%">
      <Layout>
        <Admin>
          <Nav
            icon={<AiOutlineHome />}
            title="Panel de Control"
            subtitle="Bienvenido de nuevo al sistema de administración"
          />

          <VStack spacing={spacing} align="stretch" w="100%">
            {/* Summary Stats */}
            <SimpleGrid columns={columnsStat} spacing={spacing}>
              <StatCard
                label="Ventas de hoy"
                value={`$${stats.totalSales}`}
                icon={FiBarChart}
                color={Colors.green}
                help="Ingresos totales hoy"
              />
              <StatCard
                label="Gastos de hoy"
                value={`$${stats.totalExpenses}`}
                icon={FiDollarSign}
                color={Colors.red}
                help="Egresos totales hoy"
              />
              <StatCard
                label="Dinero en Caja"
                value={`$${stats.cashOnHand}`}
                icon={FiDollarSign}
                color={Colors.blue}
                help="Saldo actual"
              />
              <StatCard
                label="Órdenes Pendientes"
                value={stats.pendingOrders.toString()}
                icon={FiShoppingBag}
                color={Colors.yellow}
                help="Por atender"
              />
            </SimpleGrid>

            {/* Quick Access Section */}
            <Box pt={10}>
              <Text fontSize="2xl" fontWeight="bold" mb={6} color={Colors.text}>
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
        </Admin>
      </Layout>
    </Box>
  )
}

interface StatCardProps {
  label: string;
  value: string;
  icon: any;
  color: string;
  help: string;
}

const StatCard = ({ label, value, icon, color, help }: StatCardProps) => {
  return (
    <Stat
      p={5}
      bg={Colors.bgSecondary}
      borderRadius="xl"
      borderLeft="4px solid"
      borderColor={color}
      shadow="md"
    >
      <HStack justifyContent="space-between">
        <Box>
          <StatLabel color="gray.400" fontWeight="medium">
            {label}
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color={Colors.text}>
            {value}
          </StatNumber>
          <StatHelpText color="gray.500" mb={0}>
            {help}
          </StatHelpText>
        </Box>
        <Box
          p={3}
          bg="rgba(255, 255, 255, 0.05)"
          borderRadius="full"
          color={color}
        >
          <Icon as={icon} boxSize={6} />
        </Box>
      </HStack>
    </Stat>
  )
}
