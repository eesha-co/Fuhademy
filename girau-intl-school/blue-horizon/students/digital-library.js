// Define the app object globally
window.app = {
    init() {
        // Set up subject card click handlers
        document.querySelectorAll('.subject-card').forEach(card => {
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

        // PDF.js is initialized in the HTML file
    },

    showSubject(subject) {
        // Hide all sections first
        document.querySelectorAll('.subject-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected subject section
        const sectionId = `${subject}-section`;
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            section.scrollIntoView({ behavior: 'smooth' });
        }

        // Hide the subject grid
        document.querySelector('.subject-grid').style.display = 'none';
    },

    hideSubject() {
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
            console.log('Starting PDF viewer with path:', path);
            const viewer = document.getElementById('pdfViewer');
            const container = document.getElementById('pdfContainer');
            const title = document.getElementById('pdfTitle');
            
            if (!viewer || !container || !title) {
                throw new Error('PDF viewer elements not found in DOM');
            }
            
            if (typeof pdfjsLib === 'undefined') {
                throw new Error('PDF.js library is not loaded yet. Please try again.');
            }
            
            viewer.style.display = 'block';
            title.textContent = 'Loading PDF...';
            container.innerHTML = `
                <div class="pdf-loading">
                    <i class="fa fa-spinner fa-spin fa-2x"></i>
                    <p>Loading PDF...</p>
                </div>
            `;

            // Construct the URL using relative path and make it absolute
            const fileURL = path.startsWith('http') ? path : window.location.origin + '/' + path;
            console.log('Loading PDF from:', fileURL);
            
            // Create loading task with better cMap handling
            const loadingTask = pdfjsLib.getDocument({
                url: fileURL,
                cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/cmaps/',
                cMapPacked: true,
                verbosity: pdfjsLib.VerbosityLevel.INFOS
            });
            
            console.log('PDF loading task created');
            const pdf = await loadingTask.promise;
            
            const fileName = path.split('/').pop();
            title.textContent = fileName;
            
            container.innerHTML = '<div class="pdf-pages"></div>';
            const pagesContainer = container.querySelector('.pdf-pages');
            
            // Add loading progress indicator
            const progressDiv = document.createElement('div');
            progressDiv.className = 'pdf-loading-progress';
            pagesContainer.appendChild(progressDiv);

            // Load all pages
            for (let i = 1; i <= pdf.numPages; i++) {
                // Update progress
                progressDiv.textContent = `Loading page ${i} of ${pdf.numPages}...`;
                
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
            
            // Remove the progress indicator when done
            progressDiv.remove();
        } catch (error) {
            document.getElementById('pdfContainer').innerHTML = `
                <div class="pdf-loading" style="color: #dc2626;">
                    <i class="fa fa-exclamation-circle fa-2x"></i>
                    <p>Failed to load PDF. Please try again later.</p>
                    <p style="font-size: 0.8em; margin-top: 0.5em;">Error: ${error.message}</p>
                </div>
            `;
            console.error('Error loading PDF:', error);
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
    app.init();
});
