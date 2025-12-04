import Swal from "sweetalert2";
import { deleteUser } from "@services/user.service";

async function confirmDeleteUser() {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  return result.isConfirmed;
}

async function confirmAlert() {
  await Swal.fire({
    title: "Usuario eliminado",
    text: "El usuario ha sido eliminado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar el usuario",
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

export const useDeleteUser = (fetchUsers) => {
  const handleDeleteUser = async (userId) => {
    try {
      const isConfirmed = await confirmDeleteUser();
      if (isConfirmed) {
        const response = await deleteUser(userId);
        if (response) {
          confirmAlert();
          await fetchUsers();
        }
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      confirmError();
    }
  };

  return { handleDeleteUser };
};

export default useDeleteUser;
