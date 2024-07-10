document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                
                localStorage.setItem('authToken', data.token);
                window.location.href = 'index.html';
            } else {
                const errorData = await response.json();
                alert(`Erreur : ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            alert('Erreur de connexion. Veuillez réessayer.');
        }
    });
});