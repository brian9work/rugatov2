import Service from "../../../../service/service";

const handleDisableUser = async (
   id: number,
   disableUser: any,
   disableUserError: any,
   toast: any,
   refetchUsers: any
) => {
   const response = await disableUser(
      Service.user.desactivate(id),
      {}
   )

   if (!response?.success) {
      console.error('Error al desactivar el usuario:', disableUserError);
      toast({
         title: 'Error al desactivar el usuario.',
         status: 'error',
         duration: 3000,
         isClosable: true,
      });
      return;
   }

   toast({
      title: 'Usuario desactivado.',
      status: 'success',
      duration: 3000,
      isClosable: true,
   });

   await refetchUsers();
}

export default handleDisableUser;