import { useEffect, useState } from 'react';

export default function AuthResult() {
    const [message, setMessage] = useState('Processing authentication…');

    useEffect(() => {
        try {
            const hash = window.location.hash || '';
            const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
            const access = params.get('access');
            const refresh = params.get('refresh');
            const error = params.get('error');

            if (error) {
                setMessage(`Authentication failed: ${error}`);
                return;
            }

            if (access && refresh) {
                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                // Минимальные пользовательские данные — будут подтянуты позже из /profile
                if (!localStorage.getItem('user')) {
                    localStorage.setItem('user', JSON.stringify({ email: '', username: '' }));
                }
                setMessage('Authenticated. Redirecting…');
                setTimeout(() => window.location.replace('/'), 500);
            } else {
                setMessage('No tokens found in callback.');
            }
        } catch {
            setMessage('Unexpected error while processing auth result.');
        }
    }, []);

    return (
        <div style={{display:'grid',placeItems:'center',minHeight:'60vh'}}>
            <div style={{textAlign:'center'}}>
                <h2>{message}</h2>
                <p><a href="/">Back to Home</a></p>
            </div>
        </div>
    );
}


