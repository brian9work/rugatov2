import React from 'react'
import Layout from '../components/Layout'
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, VStack } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';

export default function login() {
   return (
      <Layout>
         <Flex align="center" justify="center" minH={"100vh"}>
            <Box p="8" maxW="md" w="100%" boxShadow="lg" borderRadius="xl" bg="#1f2937" color="white">
               <Heading as="h1" mb="6" textAlign="center">
                  Iniciar Sesión
               </Heading>
               <Formik
                  initialValues={{
                     username: 'Admin',
                     password: '123'
                  }}
                  onSubmit={(values) => {
                  }}
               >
                  {() => (
                     <Form>
                        <VStack spacing={4}>
                           <FormControl id="username">
                              <FormLabel>Usuario</FormLabel>
                              <Field as={Input} name="username" placeholder="Usuario" />
                           </FormControl>
                           <FormControl id="password">
                              <FormLabel>Contraseña</FormLabel>
                              <Field as={Input} name="password" type="password" placeholder="Contraseña" />
                           </FormControl>
                           <br/>
                           <Button type="submit" colorScheme="green" width="full">
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
