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

document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    const loginLink = document.getElementById('logBtn');
    const editModeButton = document.getElementById('openModal');
    const editModeButton2 = document.getElementById('openModal2');

    if (authToken) {
        loginLink.textContent = 'Logout';
        loginLink.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            window.location.reload(); // Recharge la page actuelle
        });
        editModeButton.style.display = 'block'; // Affiche le bouton "Mode édition"
        editModeButton2.style.display = 'block'; // Affiche le bouton "Mode édition"
    } else {
        loginLink.textContent = 'Login';
        loginLink.href = 'login.html';
        editModeButton.style.display = 'none'; // Masque le bouton "Mode édition"
    }
});