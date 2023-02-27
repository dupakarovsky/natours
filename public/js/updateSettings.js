import { showAlert } from "./alerts";

export const updateSettings = async (data, type) => {
   try {
      const url = type === "data" ? "/api/v1/users/updateMe" : "/api/v1/users/updateMyPassword";

      const response = await axios.request({
         method: "PATCH",
         url: url,
         data: data,
      });

      if (response.data.status === "success") {
         showAlert("success", `${type.toUpperCase()} was updated successfuly`);
      }
   } catch (err) {
      showAlert("error", err.response.data.message);
   }
};
