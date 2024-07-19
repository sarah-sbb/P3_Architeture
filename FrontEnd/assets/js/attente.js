
/******* ADD PHOTO *******/
// Fonction pour créer un nouvel élément de projet dans la galerie principale
function addProjectToGallery(project) {
    // Ajoutez le projet à la galerie principale
    createProjectCard(project);
    // Ajoutez le projet à la galerie modale
    createModalProjectCard(project);
}

// Fonction 'loadPhotoForm' pour inclure l'ajout du nouveau projet à la galerie
async function loadPhotoForm() {
    try {
        const categories = await fetchCategories();
        const form = createPhotoForm(categories);
        const modalForm = document.getElementById('modalForm');
        modalForm.innerHTML = ''; // Efface le contenu existant
        modalForm.appendChild(form);

        // Ajouter un écouteur pour soumettre le formulaire
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const inputTitle = document.getElementById('title');
            const selectCategorie = document.getElementById('select-categories');
            const imageFile = document.getElementById('images').files[0];

            const title = inputTitle.value;
            const categoryId = selectCategorie.value;

            if (!title || !categoryId || !imageFile) {
                console.error('Veuillez remplir tous les champs du formulaire.');
                return;
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', categoryId);
            formData.append('image', imageFile);

            try {
                const newProject = await createNewProject(formData);
                addProjectToGallery(newProject); // Ajouter la nouvelle carte de projet à la galerie principale
                closeModal(event); // Fermer la modale après soumission
            } catch (error) {
                console.error('Error creating new project:', error);
            }
        });

        // Activer/Désactiver le bouton de soumission en fonction de la validité du formulaire
        const submitButton = form.querySelector('input[type="submit"]');

        // Fonction pour vérifier si tous les champs sont remplis
        function checkFormValidity() {
            const title = document.getElementById('title').value.trim();
            const category = document.getElementById('select-categories').value.trim();
            const image = document.getElementById('images').files.length > 0;

            if (title && category && image) {
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '#1D6154'; // Changer la couleur en vert
            } else {
                submitButton.disabled = true;
                submitButton.style.backgroundColor = '#A7A7A7'; // Changer la couleur en gris
            }
        }

        // Ajouter des écouteurs d'événements aux champs du formulaire
        form.addEventListener('input', checkFormValidity);
        form.addEventListener('change', checkFormValidity);
    } catch (error) {
        console.error('Error loading photo form:', error);
    }
}

// Fonction pour récupérer les catégories depuis l'API
function fetchCategories() {
    return fetch(`${catchAPIurl}/categories`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des catégories');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            return []; // Retourner un tableau vide en cas d'erreur
        });
}

// Fonction pour créer le formulaire de photo avec les catégories
function createPhotoForm(categories) {
    const form = document.createElement('form');
    form.setAttribute('action', 'post');

    const labelPhotoDiv = document.createElement('div');
    labelPhotoDiv.classList.add('label-photo');

    const img = document.createElement('img');
    img.setAttribute('src', 'assets/icons/picture.png');
    img.setAttribute('alt', '');
    img.setAttribute('id', 'previewImage');
    img.classList.add('preview-image'); // Ajout de la classe CSS

    const label = document.createElement('label');
    label.setAttribute('for', 'images');
    label.classList.add('addImg');

    const span = document.createElement('span');
    span.textContent = '+ Ajouter une photo';

    const inputFile = document.createElement('input');
    inputFile.setAttribute('type', 'file');
    inputFile.setAttribute('id', 'images');

    // Ajouter un écouteur d'événement pour afficher l'aperçu de l'image
    inputFile.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                img.setAttribute('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    label.appendChild(span);
    label.appendChild(inputFile);

    label.appendChild(span);
    label.appendChild(inputFile);

    const p = document.createElement('p');
    p.textContent = 'jpg, png : 4mo max';

    labelPhotoDiv.appendChild(img);
    labelPhotoDiv.appendChild(label);
    labelPhotoDiv.appendChild(p);

    const labelTitle = document.createElement('label');
    labelTitle.setAttribute('for', 'title');
    labelTitle.textContent = 'Titre';

    const inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.setAttribute('id', 'title');

    const labelCategorie = document.createElement('label');
    labelCategorie.setAttribute('for', 'categorie');
    labelCategorie.textContent = 'Catégorie';

    const selectCategorie = document.createElement('select');
    selectCategorie.setAttribute('name', 'categories');
    selectCategorie.setAttribute('id', 'select-categories');

    const optionDefault = document.createElement('option');
    optionDefault.setAttribute('value', '');
    optionDefault.textContent = 'Choisir votre catégorie';
    selectCategorie.appendChild(optionDefault);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.setAttribute('value', category.id);
        option.textContent = category.name;
        selectCategorie.appendChild(option);
    });

    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('value', 'Valider');
    submitButton.disabled = true; // Désactiver le bouton par défaut

    form.appendChild(labelPhotoDiv);
    form.appendChild(labelTitle);
    form.appendChild(inputTitle);
    form.appendChild(labelCategorie);
    form.appendChild(selectCategorie);
    form.appendChild(submitButton);

    return form;
}

// Fonction pour créer un nouveau projet via l'API
async function createNewProject(formData) {
    const authToken = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(`${catchAPIurl}/works`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        throw new Error('Erreur lors de la création du projet');
    }
}