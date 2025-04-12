 // Configuration de PDF.js
 pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

 // Fonction pour charger et afficher le PDF
 async function renderPDF() {
     const url = 'mumsbirthday.pdf';
     const container = document.getElementById('pdf-container');
     
     try {
         const loadingTask = pdfjsLib.getDocument(url);
         const pdf = await loadingTask.promise;
         
         // Effacer le message de chargement
         container.innerHTML = '';
         
         // Calculer la largeur appropriée en fonction de l'appareil
         const isMobile = window.innerWidth < 768;
         const scale = isMobile ? 0.5 : 0.7;
         
         // Rendre chaque page du PDF
         for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
             const page = await pdf.getPage(pageNum);
             
             // Calculer les dimensions de la page
             const viewport = page.getViewport({ scale });
             
             // Créer un canvas pour chaque page
             const canvasWrapper = document.createElement('div');
             canvasWrapper.className = 'pdf-page';
             canvasWrapper.style.width = `${viewport.width}px`;
             
             const canvas = document.createElement('canvas');
             canvasWrapper.appendChild(canvas);
             container.appendChild(canvasWrapper);
             
             const context = canvas.getContext('2d');
             canvas.height = viewport.height;
             canvas.width = viewport.width;
             
             // Rendre la page dans le canvas
             const renderContext = {
                 canvasContext: context,
                 viewport: viewport
             };
             
             await page.render(renderContext).promise;
         }
     } catch (error) {
         container.innerHTML = `<p>Impossible de charger le PDF. <a href="${url}" download>Téléchargez-le</a> pour le voir.</p>`;
         console.error('Erreur lors du chargement du PDF:', error);
     }
 }

 // Détection du type d'appareil pour optimiser l'affichage
 document.addEventListener("DOMContentLoaded", function() {
     // Lancer le rendu du PDF
     renderPDF();
     
     // Adaptation dynamique des cœurs selon la taille de l'écran
     const isMobile = window.innerWidth <= 600;
     const hearts = document.querySelectorAll('.heart');
     
     hearts.forEach((heart, index) => {
         // Ajustement taille des cœurs selon appareil
         const baseSize = isMobile ? 12 : 18;
         const variance = isMobile ? 5 : 8;
         const size = baseSize + Math.random() * variance;
         
         heart.style.width = `${size}px`;
         heart.style.height = `${size}px`;
         
         // Adaptation de la vitesse d'animation
         const speedFactor = isMobile ? 0.8 : 1; // Un peu plus lent sur mobile
         const durationBase = 12;
         const durationVariance = 6;
         const duration = (durationBase + Math.random() * durationVariance) * speedFactor;
         
         heart.style.animationDuration = `${duration}s`;
         
         // Positionnement optimisé
         const heartSpacing = 100 / (hearts.length + 1);
         heart.style.left = `${(index + 1) * heartSpacing - heartSpacing/2}%`;
         
         // Délai aléatoire pour décaler les animations
         heart.style.animationDelay = `${Math.random() * 5}s`;
         
         // Ajustement des pseudo-éléments
         const styleElement = document.createElement('style');
         styleElement.textContent = `
             .heart:nth-child(${index + 1})::before,
             .heart:nth-child(${index + 1})::after {
                 width: ${size}px;
                 height: ${size}px;
             }
             .heart:nth-child(${index + 1})::before {
                 top: -${size/2}px;
             }
             .heart:nth-child(${index + 1})::after {
                 left: -${size/2}px;
             }
         `;
         document.head.appendChild(styleElement);
     });
 });
 
 
 // Réajuster le PDF lorsque la fenêtre est redimensionnée
 window.addEventListener('resize', function() {
     // Ne réinterpréter le PDF que si la taille de l'écran change significativement
     const newIsMobile = window.innerWidth < 768;
     if ((newIsMobile && !window.wasMobile) || (!newIsMobile && window.wasMobile)) {
         window.wasMobile = newIsMobile;
         renderPDF();
     }
 });
 
 // Initialiser la variable
 window.wasMobile = window.innerWidth < 768;