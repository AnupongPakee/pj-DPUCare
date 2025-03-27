import { create_report } from "./API"
// Function for App.jsx
// Function for Register.jsx
// Function for Login.jsx
// Function for Chat.jsx
// Function for Admin.jsx
// Functions for Toast.jsx
export const handleToast = (check, data) => {
    if (check == true) {
        create_report(data)
            .then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
    } else {
        window.location.reload();
        return;
    };
}