import Service from "../../../../service/service";

const handleEnableUser = async (
   id: number,
   enableUser: any,
   enableUserError: any,
   toast: any,
   refetchUsers: any
) => {
   const response = await enableUser(
      Service.user.activate(id),
      {}
   )

   if (!response?.success) {
      console.error('Error al activar el usuario:', enableUserError);
      toast({
         title: 'Error al activar el usuario.',
         status: 'error',
         duration: 3000,
         isClosable: true,
      });
      return;
   }

   toast({
      title: 'Usuario activado.',
      status: 'success',
      duration: 3000,
      isClosable: true,
   });

   await refetchUsers();
}

export default handleEnableUser;