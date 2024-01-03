export const baseUrl = 'http://localhost:5000/api';

export const postRequest = async (url, body) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body
    });

    const response = await res.json()

    console.log(response)
    if (!res.ok) {
        let message;
        message = response.message
        return { error: true, message }
    }
    return response;
}

export const getRequest = async (url) => {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        let message;
        message = data.message
        return { error: true, message }
    }

    return data;

}