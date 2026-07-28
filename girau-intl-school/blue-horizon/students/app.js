// Define the app object globally
window.app = {
    init() {
        console.log('Initializing app...');
        // Set up subject card click handlers
        document.querySelectorAll('.subject-card').forEach(card => {
            console.log('Setting up click handler for', card.dataset.subject);
            card.addEventListener('click', () => {
                const subject = card.dataset.subject;
                this.showSubject(subject);
            });
        });

        // Set up back button handlers
        document.querySelectorAll('.back-button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideSubject();
            });
        });

        // Initialize PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
        console.log('App initialized');
    },

    showSubject(subject) {
        console.log('Showing subject:', subject);
        // Hide all sections first
        document.querySelectorAll('.subject-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected subject section
        const sectionId = `${subject}-section`;
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            // Scroll to section
            section.scrollIntoView({ behavior: 'smooth' });
        }

        // Hide the subject grid
        document.querySelector('.subject-grid').style.display = 'none';
    },

    hideSubject() {
        console.log('Hiding subject');
        // Hide all sections
        document.querySelectorAll('.subject-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show the subject grid
        document.querySelector('.subject-grid').style.display = 'grid';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async showPdfViewer(path) {
        try {
            const viewer = document.getElementById('pdfViewer');
            const container = document.getElementById('pdfContainer');
            const title = document.getElementById('pdfTitle');
            
            viewer.style.display = 'block';
            title.textContent = 'Loading PDF...';
            container.innerHTML = `
                <div class="pdf-loading">
                    <i class="fa fa-spinner fa-spin fa-2x"></i>
                    <p>Loading PDF...</p>
                </div>
            `;

            // Construct the URL
            const fileURL = path.startsWith('http') ? path : `./${path}`;
            console.log('Loading PDF from:', fileURL);
            
            const loadingTask = pdfjsLib.getDocument(fileURL);
            const pdf = await loadingTask.promise;
            
            const fileName = path.split('/').pop();
            title.textContent = fileName;
            
            container.innerHTML = '<div class="pdf-pages"></div>';
            const pagesContainer = container.querySelector('.pdf-pages');
            
            // Load first 5 pages
            const pagesToLoad = Math.min(5, pdf.numPages);
            for (let i = 1; i <= pagesToLoad; i++) {
                const page = await pdf.getPage(i);
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                
                const pageDiv = document.createElement('div');
                pageDiv.className = 'pdf-page';
                pageDiv.appendChild(canvas);
                
                const pageNum = document.createElement('div');
                pageNum.className = 'page-number';
                pageNum.textContent = `Page ${i} of ${pdf.numPages}`;
                pageDiv.appendChild(pageNum);
                
                pagesContainer.appendChild(pageDiv);
                
                await page.render(renderContext).promise;
            }
            
            if (pdf.numPages > 5) {
                const morePages = document.createElement('div');
                morePages.className = 'more-pages';
                morePages.innerHTML = `<i class="fa fa-info-circle"></i> Showing first 5 pages. Download the PDF to view all ${pdf.numPages} pages.`;
                pagesContainer.appendChild(morePages);
            }
        } catch (error) {
            console.error('Error loading PDF:', error);
            container.innerHTML = `
                <div class="pdf-loading" style="color: #dc2626;">
                    <i class="fa fa-exclamation-circle fa-2x"></i>
                    <p>Failed to load PDF. Please try again later.</p>
                    <p style="font-size: 0.8em; margin-top: 0.5em;">Error: ${error.message}</p>
                </div>
            `;
        }
    },

    closePdfViewer() {
        const viewer = document.getElementById('pdfViewer');
        if (viewer) {
            viewer.style.display = 'none';
            document.getElementById('pdfContainer').innerHTML = '';
            document.getElementById('pdfTitle').textContent = '';
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app');
    app.init();
});
