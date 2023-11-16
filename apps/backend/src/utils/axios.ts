import axios from 'axios'

// Get 42 token
export const get42Token = async (code: string) => {
    const body = {
        grant_type: 'authorization_code',
        client_id: process.env.FORTYTWO_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.FORTYTWO_REDIRECT_URI,
    }

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
    const response = await axios.post('https://api.intra.42.fr/oauth/token', body, { headers })

    return response.data.access_token
}

// Get 42 user
export const get42User = async (token: string) => {
    const response = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return response.data
}

// Get 42 token
export const getGithubToken = async (code: string) => {
    const body = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
    }

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
    const response = await axios.post('https://github.com/login/oauth/access_token', body, { headers })

    return response.data.access_token
}

// Get 42 user
export const getGithubUser = async (token: string) => {
    const response = await axios.get('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return response.data
}
