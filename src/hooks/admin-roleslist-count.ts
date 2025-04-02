import { CreateApiClient } from "@/service/api-client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/constant";


const API_URL = `${API_BASE_URL}/v1/admin/role-count`;

export const useAdminRolesListCount = () => {
    const navigate = useNavigate(); 
    const { callApiWithAuth } = CreateApiClient(navigate);
    const { data, isLoading, error } = useQuery<{ data: any }>({
        queryKey: ["admin-roles-count"],
        queryFn:() =>
            callApiWithAuth({ url: API_URL }),
        retry: false,
    });
    const rolesUserCount = data?.data || [];

    return { rolesUserCount, isLoading, error };
}
