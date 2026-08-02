import React from 'react'
import Layout from '../components/Layout'
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text, VStack, useBreakpointValue, useToast } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import Colors from '../contants/Colors';
import { usePost } from '../hooks/Post';
import { LoginRequest, LoginResponse } from '../TypesBackend';
import Service from '../service/service';
import { useRouter } from 'next/router';
import { MyContext } from '../context/Context';

export default function login() {
   const maxWidth = useBreakpointValue({ base: "90%", sm: "400px", md: "md" });
   const padding = useBreakpointValue({ base: "6", md: "8" });
   const toast = useToast();
   const router = useRouter();
   const { changeIdUser, changeName, changeType, changeUsername, changeDate, } = MyContext();

   const { post: login, loading: loadingLogin, error: errorLogin } = usePost<LoginResponse, LoginRequest>()

   const handleLogin = async (values: LoginRequest) => {
      const response = await login(Service.auth.login(), values);

      if (!response?.success) {
         console.error('Error al iniciar sesión:', errorLogin);
         toast({
            title: 'Error al iniciar sesión.',
            description: 'Por favor, verifica tus credenciales e intenta de nuevo.',
            status: 'error',
            duration: 3000,
            isClosable: true,
         })
         return;
      }

      if (response.success) {
         changeIdUser((response?.response?.id || 0).toString());
         changeName(response?.response?.name || '');
         changeType(response?.response?.type || '');
         changeUsername(response?.response?.username || '');
         changeDate(new Date().toLocaleDateString('es-ES'));

         if (response?.response?.type === '1') {
            router.push('/admin/');
            return;
         }
         if (response?.response?.type === '2') {
            router.push('/user/');
            return;
         }
         if (response?.response?.type === '3') {
            router.push('/kitchen/');
            return;
         }
      }
   }

   return (
      <Layout>
         <Flex align="center" justify="center" minH={"100vh"} px={{ base: 4, md: 0 }}>
            <Box
               p={padding}
               maxW={maxWidth}
               w="100%"
               boxShadow="lg"
               borderRadius="xl"
               bg={Colors.bgSecondary}
               color={Colors.text}
               mx="auto"
            >
               <Heading
                  as="h1"
                  mb="6"
                  textAlign="center"
                  fontSize={{ base: "xl", md: "2xl" }}
               >
                  Iniciar Sesión
               </Heading>
               <Formik
                  initialValues={{
                     username: 'cocina',
                     password: '1234'
                  }}
                  onSubmit={(values) => {
                     handleLogin(values);
                  }}
               >
                  {() => (
                     <Form>
                        <VStack spacing={2}>
                           <FormControl id="username">
                              <FormLabel fontSize={{ base: "sm", md: "md" }}>Usuario</FormLabel>
                              <Field
                                 as={Input}
                                 name="username"
                                 placeholder="Usuario"
                                 size={{ base: "md", md: "lg" }}
                              />
                           </FormControl>
                           <FormControl id="password">
                              <FormLabel fontSize={{ base: "sm", md: "md" }}>Contraseña</FormLabel>
                              <Field
                                 as={Input}
                                 name="password"
                                 type="password"
                                 placeholder="Contraseña"
                                 size={{ base: "md", md: "lg" }}
                              />
                           </FormControl>
                           <br />
                           <Button
                              type="submit"
                              colorScheme="green"
                              width="full"
                              size={{ base: "md", md: "lg" }}
                              fontSize={{ base: "sm", md: "md" }}
                              isLoading={loadingLogin}
                              _loading={{ opacity: 0.6, cursor: "not-allowed" }}
                           >
                              Ingresar
                           </Button>
                        </VStack>
                     </Form>
                  )}
               </Formik>
            </Box>
         </Flex>
      </Layout>
   )
}
