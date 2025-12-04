import { editUser } from "../../services/user.service";
import Swal from "sweetalert2";

async function editUserInfo(user) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Usuario",
    html: `
    <div>
      <label for="swal2-input1">Nombre de usuario</label>  
      <input id="swal2-input1" class="swal2-input" placeholder="Nombre de usuario" value = "${user.username}">
    </div>
    <div>
      <label for="swal2-input2">Correo electrónico</label>
      <input id="swal2-input2" class="swal2-input" placeholder="Correo electrónico" value = "${user.email}">
    </div>
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      const username = document.getElementById("swal2-input1").value;
      const email = document.getElementById("swal2-input2").value;

      if (!username || !email) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return false;
      }

      if (username.length < 3 || username.length > 30) {
        Swal.showValidationMessage(
          "El nombre de usuario debe tener entre 3 y 30 caracteres"
        );
        return false;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        Swal.showValidationMessage(
          "El nombre de usuario solo puede contener letras, números y guiones bajos"
        );
        return false;
      }

      if (!email || email.length < 15 || email.length > 50) {
        Swal.showValidationMessage(
          "El correo electrónico debe tener entre 15 y 50 caracteres"
        );
        return false;
      }

      if (!/^[a-zA-Z0-9._%+-]+@gmail\.(com|cl)$/.test(email)) {
        Swal.showValidationMessage(
          "Por favor, ingresa un correo de Gmail válido (@gmail.com o @gmail.cl)"
        );
        return false;
      }
      return { username, email };
    },
  });
  if (formValues) {
    return {
      username: formValues.username,
      email: formValues.email,
    };
  }
}

export const useEditUser = (fetchUsers) => {
  const handleEditUser = async (userId, user) => {
    try {
      const formValues = await editUserInfo(user);
      if (!formValues) return;

      const response = await editUser(userId, formValues);
      if (response) {
        await fetchUsers();
      }
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  return { handleEditUser };
};

export default useEditUser;
