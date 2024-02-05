'use client'
const BASE_URL = 'http://localhost:80/';

export const fetchCases = async () => {
    const response = await fetch(`${BASE_URL}cases`, {
        
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}` // Include JWT token if authenticated
        },
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data
        
    } else {
        throw new Error('Failed to fetch cases');
    }
};
export const fetchUserCases = async (id: string) => {
    const response = await fetch(`${BASE_URL}cases/${id}`, {
        
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}` // Include JWT token if authenticated
        },
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data
        
    } else {
        throw new Error('Failed to fetch cases');
    }
};

export const createCase = async (newCase: { title: string; description: string; user_id: string}) => {
    const response = await fetch(`${BASE_URL}case`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`, // Include JWT token if authenticated
        },
        body: JSON.stringify(newCase),
    });

    if (response.ok) {
        const data = await response.json();
        alert('Comment successfully added')
        return data;
    } else {
        throw new Error('Failed to create case');
    }
};

export const fetchCaseDetails = async (id: string) => {
    const response = await fetch(`${BASE_URL}/cases/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token if authenticated
        },
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Failed to fetch case details');
    }
};

export const fetchComments = async (id: string) => {
    const response = await fetch(`${BASE_URL}comments/${id.case_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`, // Include JWT token if authenticated
        }
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
    } else {
        throw new Error('Failed to fetch comments details');
    }
};

export const addComment = async ( newComment: {case_id: string, user_id: string, comment: string, likes: number}) => {
    const response = await fetch(`${BASE_URL}comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`, // Include JWT token if authenticated
        },
        body: JSON.stringify(newComment),
    });

    if (response.ok) {
        const data = await response.json();
        alert('Comment successfully added')
        return data;
    } else {
        throw new Error('Failed to add comment');
    }
};

export const addLike = async ( comment_id: string) => {
    const response = await fetch(`${BASE_URL}like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`, // Include JWT token if authenticated
        },
        body: JSON.stringify({
            "comment_id":comment_id,
            "user_id":
            localStorage.getItem('user_id')
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Failed to like comment');
    }
};