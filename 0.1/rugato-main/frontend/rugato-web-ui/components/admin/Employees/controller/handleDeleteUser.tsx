import Service from "../../../../service/service";

const handleDeleteUser = async (
    id: number,
    deleteUser: any,
    deleteUserError: any,
    toast: any,
    refetchUsers: any
) => {
    const response = await deleteUser(
        Service.user.delete(id)
    )

    if (!response?.success) {
        console.error('Error al eliminar el usuario:', deleteUserError);
        toast({
            title: 'Error al eliminar el usuario.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        return;
    }

    toast({
        title: 'Usuario eliminado.',
        status: 'success',
        duration: 3000,
        isClosable: true,
    });

    await refetchUsers();
}

export default handleDeleteUser;