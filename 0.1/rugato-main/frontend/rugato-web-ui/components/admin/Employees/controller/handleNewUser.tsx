import Service from "../../../../service/service";
import { UserPost } from "../../../../TypesBackend";

const handleAddUser = async (
    nuevoUsuario: UserPost,
    addUser: any,
    errorUser: any,
    toast: any,
    onViewOrderClose: any,
    refetchUsers: any
) => {
    const response = await addUser(
        Service.user.add(),
        nuevoUsuario
    )

    if (!response?.success) {
        console.error('Error al guardar el usuario:', errorUser);
        toast({
            title: 'Error al guardar el usuario. El nombre de usuario ya existe.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        return;
    }

    toast({
        title: 'Nuevo usuario guardado.',
        status: 'success',
        duration: 3000,
        isClosable: true,
    });
    onViewOrderClose();

    await refetchUsers();
}

export default handleAddUser;