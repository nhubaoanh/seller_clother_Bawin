// import { useMutation, useQuery } from "@tanstack/react-query";
// import { QueryConfig, MutationConfig, ExtractFnReturnType } from "@/lib/react-query";   

// import { loginService, autherization, getUsers } from "@/service/user.service";

// import { IUserSearch } from "@/types/user";

// const CACHE_USER = {
//     SEARCH: "USERS",
//     DETAIL: "USER_DETAIL",
//     DROPDOWN: "USER_DROPDOWN"
// }

// const userSearchUser = ({
//     params,
//     config,
// }: {
//     params: IUserSearch;
//     config?: QueryConfig<typeof getUsers>;
// }) => {
//     return useQuery<ExtractFnReturnType<typeof getUsers>>({
//         ...config,
//         queryKey: [CACHE_USER.SEARCH, params],
//         queryFn: () => getUsers(params),
//     })
// }

// export {
//     CACHE_USER,
//     userSearchUser,
// }