import {atom} from "recoil";

export const UserState = atom({
    key: "UserState",
    default: {
        nguoiDungId : "",
        dongHoId: "",
        hoTen: "",
        roleId: "",
        roleCode: "",
        anhDaiDien: "",
        function: [{}],
        actions: [{}],
        customs: [{}],
    },
});