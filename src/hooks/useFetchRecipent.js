import { useState,useEffect } from "react";
import { baseUrl, getRequest } from "../utils/service";

export const useFetchRecipent = (chat,user) => {
    const [recipientUser, setIsRecipientUser] = useState(null);
    const [error,setIsError] = useState(null)

    const recipientId = chat?.members?.find((id) => id !== user?._id);

    useEffect(() => {
        const getUser= async () => {
            if(!recipientId) return null

            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

            if(response?.error) {
                return setIsError(response?.error);

            }
            setIsRecipientUser(response)
        }
        getUser()
    },[recipientId])

    return {recipientUser}
}