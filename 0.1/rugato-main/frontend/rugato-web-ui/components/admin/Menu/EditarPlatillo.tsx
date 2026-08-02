import React from 'react'
import { Box, Button, Card, Divider, Flex, FormControl, FormErrorMessage, FormLabel, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spacer, Spinner, Table, Tbody, Td, Text, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import { Formik, Form, Field, FormikValues } from 'formik';
import Colors from '../../../contants/Colors'
import ModalComponent from '../../global/components/ModalComponent';
import OptionCategoriesData from '../../global/data/OptionCategoriesData';
import ButtonsComponents from '../../global/ButtonsComponents';
import SearchIngrediente from '../../global/data/SearchIngrediente';
import { Product, ProductBuilds, ProductExtras, ProductIngredients } from '../../../Types';
import { usePut } from '../../../hooks/Put';
import { BuildsPropsRequest, BuildsPropsResponse, ExtrasPropsRequest, ExtrasPropsResponse, IngredientsPropsRequest, IngredientsPropsResponse, MenuProps } from './MenuTypes';
import Service from '../../../service/service';
import { usePost } from '../../../hooks/Post';
import { useDelete } from '../../../hooks/Delete';

export default function EditarPlatillo(
    { isOpen, onClose, onSave, platillo }:
        { isOpen: boolean; onClose: () => void; onSave: (values: FormikValues) => void; platillo: Product | null; }
) {
    const plat = usePut<Product, MenuProps>()

    const handleSave = async (values: FormikValues) => {
        const response = await plat.put(
            Service.menu.UpdatePlatillo.platillo(platillo ? platillo.id + "" : "0"),
            {
                category_id: values.category,
                name: values.name,
                price: values.price,
                price_ch: values.price_ch,
                price_med: values.price_med,
                price_gde: values.price_gde,
                description: values.description,
                is_active: "1",
            } as MenuProps
        )

        if (!response?.success) {
            console.error('Error al guardar el platillo:', plat.error);
            return;
        }

        console.log(response);
        alert("Platillo guardado");

    }

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            size='3xl'
            header={`Editar  "${platillo?.name}"`}
        >
            <Formik
                initialValues={{
                    id: platillo ? platillo.id : 0,
                    name: platillo ? platillo.name : '',
                    category: platillo ? platillo.category : '15',
                    price: platillo ? platillo.price : 0,
                    price_ch: platillo ? platillo.price_ch : 0,
                    price_med: platillo ? platillo.price_med : 0,
                    price_gde: platillo ? platillo.price_gde : 0,
                    description: platillo ? platillo.description : '',
                    ingredients: platillo?.ingredients.map(i => i.id) as number[],
                    ingredientsList: platillo?.ingredients as ProductIngredients[] || [],
                    extras: platillo?.extras as ProductExtras[] || [],
                    builds: platillo?.builds as ProductBuilds[] || [],
                }}
                // validationSchema={validationSchema}
                onSubmit={(values) => {
                    handleSave(values);
                }}
            >
                {({ errors, touched, setFieldValue, values }) => (
                    <Form>
                        <VStack spacing={4} px={3} align="stretch">
                            <VStack spacing={2}>
                                <FormControl>
                                    <FormLabel>Nombre *</FormLabel>
                                    <Field name="name" as={Input} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Categoria *</FormLabel>
                                    <Field name="category" as={Select}>
                                        <OptionCategoriesData value={values.category} />
                                    </Field>
                                </FormControl>
                                {["5", "6", "10", "14"].includes(values.category) && (
                                    <FormControl>
                                        <FormLabel>Precio *</FormLabel>
                                        <Field name="price" as={Input} type="number" />
                                    </FormControl>
                                )}
                                <FormControl>
                                    <FormLabel>Descripcion * </FormLabel>
                                    <Field name="description" as={Input} type="text" />
                                </FormControl>
                                {values.category !== "0" && (
                                    <>
                                        {["1", "2", "3", "4", "7", "8", "12", "13"].includes(values.category) ? (
                                            <>
                                                <Divider my={3} />
                                                <HStack width={"100%"}>
                                                    <FormControl>
                                                        <FormLabel>Precio Chico</FormLabel>
                                                        <Field name="price_ch" as={Input} type="number" />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Precio Mediano</FormLabel>
                                                        <Field name="price_med" as={Input} type="number" />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Precio Grande</FormLabel>
                                                        <Field name="price_gde" as={Input} type="number" />
                                                    </FormControl>
                                                </HStack>
                                            </>
                                        ) : (
                                            <>
                                                {["9", "11"].includes(values.category) && (
                                                    <VStack width={"100%"} spacing={4}>
                                                        <Divider my={3} />
                                                        <ArmadosComponent values={values} setFieldValue={setFieldValue} />
                                                    </VStack>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}

                                <Divider my={3} />

                                <IngredientesComponent
                                    id={values.id}
                                    values={values}
                                    setFieldValue={setFieldValue}
                                />
                                <Divider my={3} />

                                <ExtrasComponent values={values} setFieldValue={setFieldValue} />

                                {values.category !== "0" && (
                                    <ModalFooter p={0} width={"100%"}>
                                        <HStack
                                            alignItems={"flex-end"}
                                            justifyContent={"flex-end"}
                                            width={"100%"}
                                        >
                                            <Button
                                                mt={3}
                                                type='submit'
                                                background={Colors.green}
                                                _hover={{ background: Colors.green, transform: "scale(1.05)" }}
                                            >
                                                Guardar
                                            </Button>
                                        </HStack>
                                    </ModalFooter>
                                )}
                            </VStack>
                        </VStack>
                    </Form>
                )}
            </Formik>
        </ModalComponent>
    )
}


const ExtrasComponent = (
    { values, setFieldValue }:
        { values: FormikValues, setFieldValue: (field: string, value: any) => void }
) => {
    const [newExtraName, setNewExtraName] = React.useState("");
    const [newExtraPrice, setNewExtraPrice] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const extDel = useDelete()
    const extras = usePost<ExtrasPropsResponse, ExtrasPropsRequest>()

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este extra?")) {
            return;
        }
        const response = await extDel.del(
            Service.menu.DeletePlatillo.extras(id)
        );
        if (!response?.success) {
            console.error("Error deleting extra");
        }
        setFieldValue("extras", values.extras.filter((ex: any) => ex.id + "" !== id));
        alert("Extra eliminado");
    }

    const handleAddExtra = async () => {
        setLoading(true);
        const response = await extras.post(
            Service.menu.AddPlatillo.extras(),
            {
                name: newExtraName,
                price: newExtraPrice,
                menu_id: values.id
            } as ExtrasPropsRequest
        );
        if (!response?.success) {
            console.error("Error adding extra");
        }
        values.extras.push({
            id: response?.response?.id,
            name: response?.response?.name,
            price: response?.response?.price
        });
        setNewExtraName("");
        setNewExtraPrice(1);
        setLoading(false);
    }

    return (
        <VStack spacing={2} align="stretch" width={"100%"}>
            <Text fontWeight={"bold"}>Extras:</Text>
            <VStack alignItems={"stretch"} spacing={1} mb={4}>
                {values.extras.map((extra: any, index: number) => (
                    <Box
                        width={"100%"}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                        p={0}
                        m={0}
                        _hover={{ bg: Colors.bgSecondary }}
                    >
                        <Text width={"100%"}>{extra.name}</Text>
                        <Text width={"50px"}>${extra.price}</Text>
                        <ButtonsComponents.Delete onClick={() => {
                            handleDelete(extra.id + "");
                        }} />
                    </Box>
                ))}
            </VStack>
            {loading &&
                <Flex justifyContent={"center"} width={"100%"}>
                    <Spinner size="xl" />
                </Flex>
            }
            <HStack>
                <Input
                    type="text"
                    placeholder='Nombre del extra'
                    width={"100%"}
                    value={newExtraName}
                    onChange={(e) => setNewExtraName(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder='Precio'
                    width={"100px"}
                    value={newExtraPrice}
                    onChange={(e) => setNewExtraPrice(Number(e.target.value))}
                />
                <Button
                    border={"1px solid"}
                    borderColor={Colors.green}
                    background={"#0000"}
                    _hover={{ transform: "scale(1.05)" }}
                    textColor={Colors.green}
                    px={8}
                    onClick={() => {
                        handleAddExtra();
                    }}>
                    Agregar
                </Button>
            </HStack>

        </VStack>
    )
}

const ArmadosComponent = (
    { values, setFieldValue }:
        { values: FormikValues, setFieldValue: (field: string, value: any) => void }
) => {
    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState(1);
    const [maximo, setMaximo] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const [selectedIngredient, setSelectedIngredient] = React.useState<any[]>([]);

    const builds = usePost<BuildsPropsResponse, BuildsPropsRequest>()
    const deleteBuild = useDelete()

    const handleAddArmado = async () => {
        setLoading(true);
        const armadoResponse = await builds.post(
            Service.menu.AddPlatillo.builds(),
            {
                menu_id: values.id,
                name: name,
                ingredientsList: selectedIngredient.join(" - "),
                maximo: maximo.toString(),
            } as BuildsPropsRequest
        );
        if (!armadoResponse?.success) {
            console.error('Error al guardar el build:', builds.error);
            return;
        }
        console.log(armadoResponse);
        const newBuild = {
            id: armadoResponse.response?.id,
            name: name.trim(),
            ingredients: armadoResponse.response?.ingredientsList,
            price: price,
            maximo: maximo
        };
        setFieldValue("builds", [...values.builds, newBuild]);
        // setName("");
        // setPrice(1);
        // setMaximo(1);
        // setSelectedIngredient([]);
        setLoading(false);
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este armado?")) {
            return;
        }
        const response = await deleteBuild.del(
            Service.menu.DeletePlatillo.builds(id)
        );
        if (!response?.success) {
            console.error("Error deleting build");
        }
    }

    return (
        <VStack spacing={2} align="stretch" width={"100%"}>
            <Text fontWeight={"bold"}>Armados:</Text>
            <VStack alignItems={"stretch"} spacing={1} mb={4}>
                {values.builds.map((build: any, index: number) => (
                    <HStack key={index} justify="space-between"
                        _hover={{ bg: Colors.bgSecondary }}
                    >
                        <VStack align="start" spacing={1}>
                            <Text fontWeight="bold">{build.name}</Text>
                            <Text fontSize="sm" color="gray.500">
                                {build.ingredients}
                            </Text>
                        </VStack>
                        <HStack spacing={2} width={"100px"}>
                            <Box width={"80px"}>
                                <Text fontSize="sm" >Max: {build.maximo}</Text>
                            </Box>
                            <ButtonsComponents.Delete onClick={() => {
                                handleDelete(build.id + "");
                                setFieldValue("builds", values.builds.filter((_: any, i: number) => i !== index));
                            }} />
                        </HStack>
                    </HStack>
                ))}
            </VStack>
            {loading &&
                <Flex justifyContent={"center"} width={"100%"}>
                    <Spinner size="xl" />
                </Flex>
            }
            <VStack alignItems={"stretch"} spacing={3} mb={4}>
                <FormControl>
                    <FormLabel>Nombre / Categoria</FormLabel>
                    <Input
                        placeholder='Nombre'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
                <SearchIngrediente
                    selectedIngredient={selectedIngredient}
                    setSelectedIngredient={setSelectedIngredient}
                />
                {selectedIngredient.length > 0 && (
                    <>
                        <HStack wrap={"wrap"} spacing={2}>
                            {selectedIngredient.map(ing => (
                                <Text
                                    cursor={"pointer"}
                                    p={2}
                                    background={Colors.bgSecondary}
                                    width={"fit-content"}
                                    key={ing.id}
                                    rounded={"md"}
                                    onClick={() => {
                                        setSelectedIngredient(selectedIngredient.filter(i => i.id !== ing.id));
                                    }}
                                >
                                    {ing}
                                </Text>
                            ))}
                        </HStack>
                    </>
                )}
                <FormControl>
                    <FormLabel>Maximo</FormLabel>
                    <Input
                        placeholder='Maximo'
                        value={maximo}
                        onChange={(e) => setMaximo(Number(e.target.value))}
                    />
                </FormControl>
                <HStack alignItems={"flex-end"} justifyContent={"flex-end"} width={"100%"}>
                    <Button
                        border={"1px solid"}
                        borderColor={Colors.green}
                        background={"#0000"}
                        _hover={{ transform: "scale(1.05)" }}
                        textColor={Colors.green}
                        px={8}
                        onClick={() => {
                            if (name.trim() && selectedIngredient.length > 0) {
                                handleAddArmado();
                            }
                        }}>
                        Agregar
                    </Button>
                </HStack>
            </VStack>
        </VStack>
    )
}

const IngredientesComponent = (
    { id, values, setFieldValue }:
        { id: number, values: FormikValues, setFieldValue: (field: string, value: any) => void }
) => {
    const [newIngredientName, setNewIngredientName] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const ingPut = usePost<IngredientsPropsResponse, IngredientsPropsRequest>()
    const handlePost = async () => {
        setLoading(true);
        const response = await ingPut.post(
            Service.menu.AddPlatillo.ingredients(),
            {
                name: newIngredientName,
                category_id: values.category,
                menu_id: values.id
            } as IngredientsPropsRequest
        );
        if (!response?.success) {
            console.error("Error updating ingredient");
        }
        values.ingredientsList.push({
            id: response?.response?.id,
            name: response?.response?.name
        });
        setNewIngredientName("");
        setLoading(false);
    }

    return (
        <VStack spacing={2} align="stretch" width={"100%"}>
            <Text fontWeight={"bold"}>Ingredientes:</Text>
            <VStack alignItems={"stretch"} spacing={1} mb={0}>
                <Box>
                    {values.ingredientsList.map((ing: { id: number, name: string }) => {
                        return (
                            <IngredientItem
                                key={ing.id}
                                ingredient={ing}
                            />
                        )
                    })}
                </Box>
            </VStack>
            {loading &&
                <Flex justifyContent={"center"} width={"100%"}>
                    <Spinner size="xl" />
                </Flex>
            }
            <HStack mt={5}>
                <Input
                    type="text"
                    placeholder='nombre'
                    value={newIngredientName}
                    onChange={(e) => setNewIngredientName(e.target.value)}
                />
                <Button
                    border={"1px solid"}
                    borderColor={Colors.green}
                    background={"#0000"}
                    _hover={{ transform: "scale(1.05)" }}
                    textColor={Colors.green}
                    px={8}
                    onClick={() => {
                        if (newIngredientName.trim()) {
                            handlePost();
                        }
                    }}>
                    Agregar
                </Button>
            </HStack>
        </VStack>
    );
}

const IngredientItem = (
    { ingredient }:
        { ingredient: ProductIngredients; }
) => {
    const ingDel = useDelete()
    const [hidden, setHidden] = React.useState(false);

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este ingrediente?")) {
            return;
        }
        const response = await ingDel.del(
            Service.menu.DeletePlatillo.ingredients(ingredient.id + "")
        );
        if (!response?.success) {
            console.error("Error deleting ingredient");
        }
        alert("Ingrediente eliminado");
        setHidden(true);
    }

    return (
        <Box
            width={"100%"}
            style={{
                display: hidden ? 'none' : 'flex',
                alignItems: 'center'
            }}
            p={0}
            m={0}
            mb={1}
            _hover={{ bg: Colors.bgSecondary }}
        >
            <Text width={"100%"}>{ingredient.name}</Text>
            <ButtonsComponents.Delete onClick={handleDelete} />
        </Box>
    )

}