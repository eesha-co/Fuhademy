// Chemistry Titration Practical Simulator - Main Application Logic

class TitrationSimulator {
    constructor() {
        this.currentQuestion = null;
        this.currentStep = 1;
        this.buretteLevel = 0; // 0-25 cm³
        this.flaskContents = {
            base: false,
            indicator: false,
            acid: 0
        };
        // Available reagents and user selections
        this.availableAcids = [
            { id: 'HCl', name: 'Hydrochloric acid', color: '#ffd34d' },
            { id: 'H2SO4', name: 'Sulfuric acid', color: '#ffd9b3' },
            { id: 'CH3COOH', name: 'Acetic acid', color: '#ffe6a7' }
        ];
        this.availableBases = [
            { id: 'NaOH', name: 'Sodium hydroxide', color: '#c2f0ff' },
            { id: 'KOH', name: 'Potassium hydroxide', color: '#bfe9ff' },
            { id: 'NH3', name: 'Ammonia', color: '#d6f5d6' }
        ];
        this.acidType = this.availableAcids[0].id;
        this.baseType = this.availableBases[0].id;
        this.isRinsed = false;
        this.isFilled = false;
        this.buretteAttached = false;
        this.titrationCount = 0;
        this.currentTitration = 'rough';
        this.releasing = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupBuretteScale();
        this.loadQuestion();
        this.setupTitrationTableCalculations();
    }

    setupEventListeners() {
        // Help button
        document.querySelector('[data-testid="button-help"]').addEventListener('click', () => {
            document.getElementById('helpModal').classList.add('active');
        });

        document.getElementById('closeHelpModal').addEventListener('click', () => {
            document.getElementById('helpModal').classList.remove('active');
        });

        // Burette controls
        document.getElementById('rinseBtn').addEventListener('click', () => this.rinseBurette());
        document.getElementById('fillBtn').addEventListener('click', () => this.fillBurette());
        
        const releaseBtn = document.getElementById('releaseBtn');
        releaseBtn.addEventListener('mousedown', () => this.startReleasingAcid());
        releaseBtn.addEventListener('mouseup', () => this.stopReleasingAcid());
        releaseBtn.addEventListener('mouseleave', () => this.stopReleasingAcid());
        releaseBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startReleasingAcid();
        });
        releaseBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopReleasingAcid();
        });

        // (modal removed) If a close button exists remove modal behavior
        const closeBtn = document.getElementById('closeBuretteModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const modal = document.getElementById('buretteModal');
                modal && modal.classList.remove('active');
            });
        }

        // Populate reagent selects (acid & base) and wire change handlers
        const acidSelect = document.getElementById('acidSelect');
        const baseSelect = document.getElementById('baseSelect');

        if (acidSelect) {
            acidSelect.innerHTML = '';
            this.availableAcids.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.id;
                opt.textContent = `${a.name} (${a.id})`;
                acidSelect.appendChild(opt);
            });
            acidSelect.value = this.acidType;
            acidSelect.addEventListener('change', (e) => {
                this.acidType = e.target.value;
                // update visual color in control panel if present
                const selected = this.availableAcids.find(x => x.id === this.acidType);
                const attachedLiquid = document.querySelector('#buretteClamp .burette-liquid');
                const controlLiquid = document.getElementById('liquidLevel');
                if (selected) {
                    if (attachedLiquid) attachedLiquid.style.background = selected.color;
                    if (controlLiquid) controlLiquid.style.background = selected.color;
                }
            });
        }

        if (baseSelect) {
            baseSelect.innerHTML = '';
            this.availableBases.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.id;
                opt.textContent = `${b.name} (${b.id})`;
                baseSelect.appendChild(opt);
            });
            baseSelect.value = this.baseType;
            baseSelect.addEventListener('change', (e) => {
                this.baseType = e.target.value;
            });
        }

        // Submit button
        document.getElementById('submitBtn').addEventListener('click', () => this.submitPractical());

        // Result modal buttons
        document.getElementById('nextQuestionBtn').addEventListener('click', () => this.loadNextQuestion());
        document.getElementById('retryBtn').addEventListener('click', () => this.retryPractical());

        // Clicking on the clamp toggles the inline control panel visibility
        const clamp = document.getElementById('buretteClamp');
        if (clamp) {
            // make clamp keyboard-accessible and add ARIA
            clamp.setAttribute('tabindex', '0');
            clamp.setAttribute('role', 'button');
            clamp.setAttribute('aria-label', 'Burette clamp. Press Enter to open controls.');

            clamp.addEventListener('click', () => {
                const controlPanel = document.getElementById('buretteControlPanel');
                if (!controlPanel) return;
                controlPanel.classList.toggle('visible');
            });

            clamp.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    const controlPanel = document.getElementById('buretteControlPanel');
                    if (!controlPanel) return;
                    controlPanel.classList.toggle('visible');
                }
            });
        }
    }

    setupDragAndDrop() {
        const apparatusItems = document.querySelectorAll('.apparatus-item');
        const labCanvas = document.getElementById('labCanvas');
        const buretteClamp = document.getElementById('buretteClamp');
        let scrollInterval = null;
        let draggedItem = null; // For Firefox/touch fallback

        // Guidance tooltip
        const guidance = document.createElement('div');
        guidance.className = 'burette-guidance';
        guidance.textContent = 'Drop burette here to attach';
        if (buretteClamp) buretteClamp.appendChild(guidance);

        // Auto-scroll handler: uses viewport thresholds so it works regardless of container positioning
        const handleAutoScroll = (e) => {
            const scrollSpeed = 10; // slightly reduced for smoother scrolling
            const scrollZone = 100; // slightly reduced for more precise control
            const y = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            // If an interval already exists, don't create another
            if (scrollInterval) return;

            if (y < scrollZone) {
                scrollInterval = setInterval(() => {
                    window.scrollBy({ top: -scrollSpeed, behavior: 'smooth' });
                }, 16);
            } else if (y > window.innerHeight - scrollZone) {
                scrollInterval = setInterval(() => {
                    window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
                }, 16);
            }
        };

        const clearAutoScroll = () => {
            if (scrollInterval) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
        };

        // Touch event handlers
        const handleTouchStart = (e, item) => {
            e.preventDefault();
            draggedItem = item;
            item.style.opacity = '0.5';
            
            if (item.dataset.apparatus === 'burette') {
                guidance.style.opacity = '1';
            }

            labCanvas && labCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            if (!draggedItem) return;

            const touch = e.touches[0];
            handleAutoScroll(e);

            // Update drop target feedback
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
            if (dropTarget) {
                const isValidDrop = dropTarget.closest('#buretteClamp') && 
                                  draggedItem.dataset.apparatus === 'burette' &&
                                  !this.buretteAttached;

                if (dropTarget.closest('#buretteClamp')) {
                    buretteClamp.classList.add(isValidDrop ? 'hover-valid' : 'hover-invalid');
                } else {
                    buretteClamp.classList.remove('hover-valid', 'hover-invalid');
                }
            }
        };

        const handleTouchEnd = (e) => {
            if (!draggedItem) return;

            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

            clearAutoScroll();
            draggedItem.style.opacity = '1';
            guidance.style.opacity = '0';

            if (dropTarget) {
                const apparatus = draggedItem.dataset.apparatus;
                if (dropTarget.closest('#buretteClamp') && apparatus === 'burette') {
                    this.attachBurette();
                } else if (dropTarget.closest('#labCanvas')) {
                    this.handleApparatusDrop(apparatus, touch.clientX, touch.clientY);
                }
            }

            buretteClamp.classList.remove('hover-valid', 'hover-invalid');
            draggedItem = null;
        };

        // Attach event listeners to apparatus items
        apparatusItems.forEach(item => {
            // Standard drag events
            item.addEventListener('dragstart', (e) => {
                try { 
                    e.dataTransfer.setData('apparatus', e.target.dataset.apparatus);
                    // For Firefox compatibility
                    e.dataTransfer.setData('text/plain', '');
                } catch (err) { /* ignore */ }
                
                item.style.opacity = '0.5';
                draggedItem = item;
                
                if (item.dataset.apparatus === 'burette') {
                    guidance.style.opacity = '1';
                }

                labCanvas && labCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            item.addEventListener('dragend', (e) => {
                item.style.opacity = '1';
                guidance.style.opacity = '0';
                draggedItem = null;
                clearAutoScroll();
            });

            // Touch events for mobile support
            item.addEventListener('touchstart', (e) => handleTouchStart(e, item));
            item.addEventListener('touchmove', handleTouchMove);
            item.addEventListener('touchend', handleTouchEnd);
            item.addEventListener('touchcancel', handleTouchEnd);
        });

        // Global drag events
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            handleAutoScroll(e);
        }, { passive: false });

        document.addEventListener('drop', (e) => {
            clearAutoScroll();
        });

        // Canvas drop handling
        labCanvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        labCanvas.addEventListener('drop', (e) => {
            e.preventDefault();
            clearAutoScroll();
            const apparatus = draggedItem?.dataset.apparatus || e.dataTransfer.getData('apparatus');
            this.handleApparatusDrop(apparatus, e.clientX, e.clientY);
            draggedItem = null;
        });

        // Clamp-specific handling
        if (buretteClamp) {
            buretteClamp.addEventListener('dragover', (e) => {
                e.preventDefault();
                const apparatus = draggedItem?.dataset.apparatus || e.dataTransfer.getData('apparatus');
                if (apparatus === 'burette' && !this.buretteAttached) {
                    buretteClamp.classList.add('hover-valid');
                    buretteClamp.classList.remove('hover-invalid');
                } else {
                    buretteClamp.classList.add('hover-invalid');
                    buretteClamp.classList.remove('hover-valid');
                }
            });

            buretteClamp.addEventListener('dragleave', (e) => {
                buretteClamp.classList.remove('hover-valid', 'hover-invalid');
            });

            buretteClamp.addEventListener('drop', (e) => {
                e.preventDefault();
                clearAutoScroll();
                const apparatus = draggedItem?.dataset.apparatus || e.dataTransfer.getData('apparatus');
                if (apparatus === 'burette') {
                    this.attachBurette();
                }
                buretteClamp.classList.remove('hover-valid', 'hover-invalid');
                draggedItem = null;
            });
        }
    }

    handleApparatusDrop(apparatus, x, y) {
        console.log(`Dropped ${apparatus} apparatus`);
        
        if (apparatus === 'flask') {
            this.addFlask();
        } else if (apparatus === 'pipette') {
            // Create a persistent pipette in the lab area at the drop location
            const labCanvas = document.getElementById('labCanvas');
            if (!labCanvas) return;

            const rect = labCanvas.getBoundingClientRect();
            const pipette = document.createElement('div');
            pipette.className = 'apparatus-item pipette-item';
            pipette.dataset.apparatus = 'pipette';
            // Basic visual for pipette (small vertical element)
            pipette.style.cssText = `position:absolute; width:12px; height:80px; background:linear-gradient(#eee,#ddd); border:1px solid #bbb; border-radius:6px; left:${x - rect.left - 6}px; top:${y - rect.top - 40}px; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:50;`;

            // Add an icon/label inside for accessibility
            const label = document.createElement('span');
            label.textContent = 'Pipette';
            label.style.cssText = 'font-size:10px; color:#333; writing-mode:vertical-rl; transform:rotate(180deg); pointer-events:none; opacity:0.85;';
            pipette.appendChild(label);

            // Clicking the pipette will perform the pipetting action (draw and dispense 25 cm³)
            pipette.addEventListener('click', (ev) => {
                ev.stopPropagation();
                this.usePipette(pipette);
            });

            // Allow the created pipette to be removed on double-click (user control)
            pipette.addEventListener('dblclick', (ev) => {
                ev.stopPropagation();
                pipette.remove();
            });

            labCanvas.appendChild(pipette);

            // Make pipette keyboard-accessible and add ARIA
            pipette.setAttribute('tabindex', '0');
            pipette.setAttribute('role', 'button');
            pipette.setAttribute('aria-label', 'Pipette: click to pipette 25 cubic centimetres. Double-click to remove. Use arrow keys to move.');

            // Keyboard controls: Enter to use, Delete to remove, arrows to nudge
            pipette.addEventListener('keydown', (ev) => {
                const step = ev.shiftKey ? 10 : 4;
                let left = parseFloat(pipette.style.left) || 0;
                let top = parseFloat(pipette.style.top) || 0;
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    this.usePipette(pipette);
                } else if (ev.key === 'Delete' || ev.key === 'Backspace') {
                    ev.preventDefault();
                    pipette.remove();
                } else if (ev.key === 'ArrowLeft') {
                    ev.preventDefault();
                    left -= step; pipette.style.left = `${left}px`;
                } else if (ev.key === 'ArrowRight') {
                    ev.preventDefault();
                    left += step; pipette.style.left = `${left}px`;
                } else if (ev.key === 'ArrowUp') {
                    ev.preventDefault();
                    top -= step; pipette.style.top = `${top}px`;
                } else if (ev.key === 'ArrowDown') {
                    ev.preventDefault();
                    top += step; pipette.style.top = `${top}px`;
                }
            });

            // Pointer drag support so the user can move the pipette after placing
            let dragging = false;
            let startX = 0, startY = 0, origLeft = 0, origTop = 0;
            pipette.addEventListener('pointerdown', (ev) => {
                ev.preventDefault();
                pipette.setPointerCapture(ev.pointerId);
                dragging = true;
                startX = ev.clientX; startY = ev.clientY;
                origLeft = parseFloat(pipette.style.left) || 0;
                origTop = parseFloat(pipette.style.top) || 0;
                pipette.classList.add('dragging');
            });

            pipette.addEventListener('pointermove', (ev) => {
                if (!dragging) return;
                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;
                pipette.style.left = `${origLeft + dx}px`;
                pipette.style.top = `${origTop + dy}px`;
            });

            pipette.addEventListener('pointerup', (ev) => {
                if (dragging) {
                    dragging = false;
                    try { pipette.releasePointerCapture(ev.pointerId); } catch (e) {}
                    pipette.classList.remove('dragging');
                }
            });
        } else if (apparatus === 'indicator') {
            this.addIndicator();
        }
    }

    attachBurette() {
        if (!this.buretteAttached) {
            const clamp = document.getElementById('buretteClamp');
            const controlPanel = document.getElementById('buretteControlPanel');
            
            // Add attached burette with animation
            const burette = document.createElement('div');
            burette.className = 'burette-element';
            burette.innerHTML = `
                <div class="burette-body" style="
                    width: 40px; 
                    height: 200px; 
                    background: linear-gradient(to right, rgba(255,255,255,0.9), rgba(230,230,230,0.9));
                    border: 2px solid #666;
                    border-radius: 4px;
                    margin-top: 10px;
                    position: relative;
                    overflow: hidden;
                ">
                    <div class="burette-liquid" style="position:absolute; left:0; right:0; bottom:0; height:0%; background: #ffd34d; transition: height 900ms ease;"></div>
                    <div class="burette-meniscus" style="position:absolute; left:0; right:0; height:6px; bottom:0; transform:translateY(50%); opacity:0; transition: opacity 300ms;"></div>
                    <div class="burette-scale" style="
                        position: absolute;
                        right: 2px;
                        top: 10px;
                        bottom: 10px;
                        width: 12px;
                        background: rgba(0,0,0,0.05);
                        border-radius: 2px;
                    "></div>
                    <div class="burette-tip" style="
                        position: absolute;
                        bottom: -10px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 4px;
                        height: 15px;
                        background: #666;
                        border-radius: 0 0 2px 2px;
                    "></div>
                    <div class="burette-sparkles" style="position:absolute; inset:0; pointer-events:none; overflow:visible;"></div>
                </div>
            `;
            
            clamp.innerHTML = '';
            clamp.appendChild(burette);
            clamp.classList.add('with-burette');
            
            // Show the control panel
            controlPanel.classList.add('visible');
            
            // Update state and complete step
            this.buretteAttached = true;
            this.completeStep(1);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #2ecc71;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 1000;
                animation: fadeInOut 2s ease-in-out forwards;
            `;
            successMessage.textContent = 'Burette successfully attached! Use the controls on the right to operate it.';
            document.body.appendChild(successMessage);
            
            // Remove message after animation
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 2000);
            
            console.log('Burette attached to retort stand');
        }
    }

    addFlask() {
        // Create a visible flask on the lab canvas so the pipette can target it
        const labCanvas = document.getElementById('labCanvas');
        if (!labCanvas) return;

        let flaskElem = document.getElementById('flaskOnCanvas');
        if (!flaskElem && this.currentStep >= 2) {
            flaskElem = document.createElement('div');
            flaskElem.id = 'flaskOnCanvas';
            flaskElem.className = 'flask-element';
            flaskElem.setAttribute('tabindex', '0');
            flaskElem.setAttribute('role', 'img');
            flaskElem.setAttribute('aria-label', 'Conical flask on work surface');

            // Position the flask near the bottom-center of the canvas
            const rect = labCanvas.getBoundingClientRect();
            const left = Math.max(20, rect.width / 2 - 40);
            const top = Math.max(40, rect.height - 160);

            flaskElem.style.cssText = `position:absolute; width:80px; height:100px; left:${left}px; top:${top}px; background:linear-gradient(#fff,#f3f3f8); border:2px solid #cfcfd6; border-bottom-left-radius:40px 20px; border-bottom-right-radius:40px 20px; border-top-left-radius:14px 10px; border-top-right-radius:14px 10px; box-shadow:0 6px 18px rgba(0,0,0,0.08); display:flex; align-items:flex-end; justify-content:center; padding-bottom:8px; z-index:40;`;

            // Inner liquid indicator
            const inner = document.createElement('div');
            inner.className = 'flask-liquid';
            inner.style.cssText = 'width:70%; height:0%; background:#ffe680; border-radius:6px; transition:height 500ms ease;';
            flaskElem.appendChild(inner);

            labCanvas.appendChild(flaskElem);

            console.log('Flask placed on work surface');
        }
    }

    usePipette(pipetteElem) {
        // If pipetteElem is provided, animate the pipette moving to the flask and back
        if (this.currentStep >= 4 && !this.flaskContents.base) {
            // If there's a visual flask on the canvas, animate towards it
            const flaskElem = document.querySelector('.flask-element') || document.getElementById('flaskOnCanvas');

            if (pipetteElem && flaskElem) {
                try {
                    const pipRect = pipetteElem.getBoundingClientRect();
                    const fRect = flaskElem.getBoundingClientRect();
                    const dx = (fRect.left + fRect.width / 2) - (pipRect.left + pipRect.width / 2);
                    const dy = (fRect.top + fRect.height / 2) - (pipRect.top + pipRect.height / 2) - 10; // slight offset above center

                    // Respect reduced-motion preference
                    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    const animDuration = prefersReduced ? 120 : 420; // faster and short by default; shorter on reduced-motion

                    pipetteElem.style.transition = `transform ${animDuration}ms cubic-bezier(0.2,0.8,0.2,1)`;
                    pipetteElem.style.transform = `translate(${dx}px, ${dy}px) rotate(-8deg)`;

                    // small delay to simulate drawing base
                    setTimeout(() => {
                        // flash the flask and raise inner liquid to ~40% for visual feedback
                        flaskElem.classList && flaskElem.classList.add('flash-add');
                        const inner = flaskElem.querySelector('.flask-liquid');
                        if (inner) {
                            inner.style.height = '40%';
                            const baseObj = this.availableBases.find(b => b.id === this.baseType) || this.availableBases[0];
                            if (baseObj) inner.style.background = baseObj.color;
                        }

                        setTimeout(() => {
                            flaskElem.classList && flaskElem.classList.remove('flash-add');
                            // return pipette to original position
                            pipetteElem.style.transform = '';
                            setTimeout(() => {
                                pipetteElem.style.transition = '';
                            }, 200);
                        }, Math.max(300, animDuration));
                    }, Math.max(200, animDuration));
                } catch (err) {
                    // If animation fails, fall back to immediate effect
                    console.warn('Pipette animation failed: ', err);
                }
            }

            this.flaskContents.base = true;
            this.completeStep(4);
            console.log('Pipetted 25 cm³ of base into flask');
            const baseObj = this.availableBases.find(b => b.id === this.baseType) || this.availableBases[0];
            alert(`25 cm³ of ${baseObj.name} (${baseObj.id}) added to the flask!`);
        } else if (this.flaskContents.base) {
            alert('Base already present in the flask.');
        } else {
            alert('You cannot pipette right now. Follow the steps in order.');
        }
    }

    addIndicator() {
        if (this.flaskContents.base && !this.flaskContents.indicator) {
            this.flaskContents.indicator = true;
            this.completeStep(5);
            console.log('Added 3 drops of indicator to flask');
            alert('3 drops of methyl orange indicator added! Solution is now yellow.');
        }
    }

    setupBuretteScale() {
        const scaleMarks = document.getElementById('scaleMarks');
        scaleMarks.innerHTML = '';
        
        for (let i = 0; i <= 25; i += 5) {
            const mark = document.createElement('div');
            mark.className = 'scale-mark';
            mark.textContent = i.toFixed(1);
            scaleMarks.appendChild(mark);
        }
    }

    rinseBurette() {
        if (!this.buretteAttached) {
            alert('Please attach the burette to the retort stand first!');
            return;
        }

        if (!this.isRinsed) {
            this.isRinsed = true;
            this.completeStep(2);

            // Helper function to create sparkle animation
            const addSparkles = (container) => {
                if (!container) return;
                // create several sparkle nodes at random positions with staggered timing
                const count = 12; // increased for more visual impact
                const created = [];
                
                for (let i = 0; i < count; i++) {
                    const s = document.createElement('span');
                    s.className = 'sparkle';
                    
                    // random position across the width and height
                    const left = 4 + Math.random() * 32;
                    const top = 10 + Math.random() * 160;
                    
                    // Add slight delay to each sparkle for cascade effect
                    s.style.animationDelay = `${i * 50}ms`;
                    s.style.left = `${left}px`;
                    s.style.top = `${top}px`;
                    
                    container.appendChild(s);
                    created.push(s);
                }

                // Remove after longest animation + delay finishes
                setTimeout(() => {
                    created.forEach(n => n.remove());
                }, 600 + count * 50);
            };

            // Add sparkles to both burette views
            const sparkleContainers = [
                document.querySelector('#buretteClamp .burette-sparkles'),
                document.querySelector('#buretteControlPanel .burette-sparkles')
            ];

            sparkleContainers.forEach(container => addSparkles(container));
            // Update visuals and show message about which acid was used
            const acidObj = this.availableAcids.find(a => a.id === this.acidType) || this.availableAcids[0];
            const attachedLiquid = document.querySelector('#buretteClamp .burette-liquid');
            const controlLiquid = document.getElementById('liquidLevel');
            if (acidObj) {
                if (attachedLiquid) attachedLiquid.style.background = acidObj.color;
                if (controlLiquid) controlLiquid.style.background = acidObj.color;
            }

            const msg = document.createElement('div');
            msg.style.cssText = 'position:fixed; top:18px; left:50%; transform:translateX(-50%); background:#3498db; color:#fff; padding:8px 14px; border-radius:4px; z-index:1100;';
            msg.textContent = `Rinsed burette with ${acidObj.name} (${acidObj.id})`;
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 1600);

            console.log(`Burette rinsed with ${acidObj.id}`);
        }
    }

    fillBurette() {
        if (!this.isRinsed) {
            alert('Please rinse the burette first!');
            return;
        }

        if (!this.isFilled) {
            // Visual fill animation: briefly show liquid rising then settle at reading 0.00
            this.isFilled = true;

            // Target reading is 0.00
            this.buretteLevel = 0;

            // Update attached burette liquid if present
            const attachedLiquid = document.querySelector('#buretteClamp .burette-liquid');
            const attachedMeniscus = document.querySelector('#buretteClamp .burette-meniscus');

            if (attachedLiquid) {
                // start from full then animate to current percentage to simulate filling
                attachedLiquid.style.transition = 'none';
                attachedLiquid.style.height = '100%';
                attachedMeniscus && (attachedMeniscus.style.opacity = '1');

                // force reflow then animate
                // eslint-disable-next-line no-unused-expressions
                attachedLiquid.offsetHeight;
                const percentage = (this.buretteLevel / 25) * 100;
                attachedLiquid.style.transition = 'height 700ms ease';
                attachedLiquid.style.height = `${percentage}%`;
                // hide meniscus if empty
                setTimeout(() => {
                    attachedMeniscus && (attachedMeniscus.style.opacity = percentage > 0 ? '1' : '0');
                }, 900);

                // add a subtle filled hover effect on the attached element
                const attachedElem = document.querySelector('#buretteClamp .burette-element');
                if (attachedElem) {
                    attachedElem.classList.add('filled-hover');
                    setTimeout(() => attachedElem.classList.remove('filled-hover'), 1200);
                }
            }

            // Apply selected acid color to control & attached liquid
            const acidObj = this.availableAcids.find(a => a.id === this.acidType) || this.availableAcids[0];
            const controlLiquid = document.getElementById('liquidLevel');
            if (acidObj) {
                if (attachedLiquid) attachedLiquid.style.background = acidObj.color;
                if (controlLiquid) controlLiquid.style.background = acidObj.color;
            }

            // Update control panel display (if open)
            this.updateBuretteDisplay();
            this.completeStep(3);
            console.log('Burette filled to 0.00 cm³ mark');
        }
    }

    startReleasingAcid() {
        if (!this.isFilled) {
            alert('Please fill the burette first!');
            return;
        }

        // Don't block release if flask is missing base/indicator; instead prompt user
        const missing = [];
        if (!this.flaskContents.base) missing.push('base');
        if (!this.flaskContents.indicator) missing.push('indicator');
        if (missing.length) {
            const proceed = confirm(`Flask is missing: ${missing.join(' and ')}. Release acid anyway?`);
            if (!proceed) return;
        }

        this.releasing = true;
        this.releaseAcid();
        this.completeStep(6);
    }

    stopReleasingAcid() {
        this.releasing = false;
    }

    releaseAcid() {
        if (!this.releasing) return;

        this.buretteLevel += 0.05;
        
        if (this.buretteLevel >= 25) {
            this.buretteLevel = 25;
            this.releasing = false;
            alert('Burette empty! Please refill.');
            return;
        }

        this.updateBuretteDisplay();
        this.flaskContents.acid = this.buretteLevel;

        // Check for color change (endpoint simulation)
        if (this.shouldShowEndpoint()) {
            this.releasing = false;
            this.showEndpoint();
        }

        if (this.releasing) {
            setTimeout(() => this.releaseAcid(), 100);
        }
    }

    shouldShowEndpoint() {
        // Simulate endpoint at approximately correct titre
        const expectedTitre = 18 + Math.random() * 2; // Simulated range 18-20 cm³
        return this.buretteLevel >= expectedTitre - 0.5 && this.buretteLevel <= expectedTitre + 0.5;
    }

    showEndpoint() {
        const acidObj = this.availableAcids.find(a => a.id === this.acidType) || this.availableAcids[0];
        alert(`Color change detected using ${acidObj.name} (${acidObj.id})!\nCurrent reading: ${this.buretteLevel.toFixed(2)} cm³\n\nRecord your reading in the table!`);
        console.log(`Endpoint reached at ${this.buretteLevel.toFixed(2)} cm³ using ${acidObj.id}`);
    }

    updateBuretteDisplay() {
        const liquidLevel = document.getElementById('liquidLevel');
        const meniscus = document.getElementById('meniscus');
        const reading = document.getElementById('buretteReading');

        const percentage = (this.buretteLevel / 25) * 100;
        if (liquidLevel) {
            liquidLevel.style.height = `${percentage}%`;
        }
        if (meniscus) {
            meniscus.style.top = `${100 - percentage}%`;
        }
        if (reading) {
            reading.textContent = `${this.buretteLevel.toFixed(2)} cm³`;
        }

        // Also update the attached burette (on the clamp) if present
        const attachedLiquid = document.querySelector('#buretteClamp .burette-liquid');
        const attachedMeniscus = document.querySelector('#buretteClamp .burette-meniscus');
        if (attachedLiquid) {
            attachedLiquid.style.height = `${percentage}%`;
        }
        if (attachedMeniscus) {
            attachedMeniscus.style.top = `${100 - percentage}%`;
            attachedMeniscus.style.opacity = percentage > 0 ? '1' : '0';
        }
    }

    setupTitrationTableCalculations() {
        const inputs = ['finalRough', 'final1st', 'final2nd', 'final3rd', 
                       'initialRough', 'initial1st', 'initial2nd', 'initial3rd'];

        inputs.forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => this.calculateVolumes());
        });
    }

    calculateVolumes() {
        const titrations = ['Rough', '1st', '2nd', '3rd'];
        const volumes = [];

        titrations.forEach(name => {
            const final = parseFloat(document.getElementById(`final${name}`).value) || 0;
            const initial = parseFloat(document.getElementById(`initial${name}`).value) || 0;
            const volume = final - initial;
            
            document.getElementById(`volume${name}`).textContent = volume.toFixed(2);
            volumes.push(volume);
        });

        // Calculate average (excluding rough, using 1st, 2nd, 3rd)
        const validVolumes = volumes.slice(1).filter(v => v > 0);
        if (validVolumes.length > 0) {
            const average = validVolumes.reduce((a, b) => a + b, 0) / validVolumes.length;
            document.getElementById('averageVolume').textContent = `${average.toFixed(2)} cm³`;
            
            // Enable calculations section if we have an average
            if (validVolumes.length >= 2) {
                this.showCalculations(average);
            }
        }
    }

    showCalculations(averageVolume) {
        const calculationsDiv = document.getElementById('calculationsInputs');
        
        if (!this.currentQuestion) return;

        // Extract calculation requirements from question
        calculationsDiv.innerHTML = `
            <div class="calc-field">
                <label for="concA">Concentration of A (mol dm⁻³):</label>
                <input type="number" step="0.001" id="concA" placeholder="0.000" data-testid="input-calc-conc-a" />
            </div>
            <div class="calc-field">
                <label for="concB">Concentration of B (mol dm⁻³):</label>
                <input type="number" step="0.001" id="concB" placeholder="0.000" data-testid="input-calc-conc-b" />
            </div>
            <div class="calc-field">
                <label for="calc3">Additional Calculation (if required):</label>
                <input type="number" step="0.01" id="calc3" placeholder="0.00" data-testid="input-calc-3" />
            </div>
        `;

        // Enable submit button
        document.getElementById('submitBtn').disabled = false;
    }

    completeStep(stepNumber) {
        this.currentStep = Math.max(this.currentStep, stepNumber);
        this.updateStepDisplay();
        this.updateProgress();
    }

    updateStepDisplay() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('completed', 'active');
            
            if (stepNum < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNum === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    updateProgress() {
        const progress = (this.currentStep / 6) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    }

    async loadQuestion() {
        try {
            const response = await fetch('/api/question');
            const data = await response.json();
            
            if (data.question) {
                this.currentQuestion = data.question;
                this.displayQuestion(data.question);
            }
        } catch (error) {
            console.error('Error loading question:', error);
            document.getElementById('questionContent').innerHTML = '<p class="error">Failed to load question. Please refresh the page.</p>';
        }
    }

    displayQuestion(question) {
        const content = document.getElementById('questionContent');
        
        // Format the question text (basic HTML rendering)
        let html = `<div class="question-text">`;
        html += `<h3>${question.title}</h3>`;
        html += question.content.split('\n\n').map(para => `<p>${para}</p>`).join('');
        html += `</div>`;
        
        content.innerHTML = html;
    }

    async submitPractical() {
        // Gather all data
        const data = {
            questionId: this.currentQuestion?.id,
            titrations: {
                rough: {
                    final: parseFloat(document.getElementById('finalRough').value) || 0,
                    initial: parseFloat(document.getElementById('initialRough').value) || 0
                },
                first: {
                    final: parseFloat(document.getElementById('final1st').value) || 0,
                    initial: parseFloat(document.getElementById('initial1st').value) || 0
                },
                second: {
                    final: parseFloat(document.getElementById('final2nd').value) || 0,
                    initial: parseFloat(document.getElementById('initial2nd').value) || 0
                },
                third: {
                    final: parseFloat(document.getElementById('final3rd').value) || 0,
                    initial: parseFloat(document.getElementById('initial3rd').value) || 0
                }
            },
            calculations: {
                concA: parseFloat(document.getElementById('concA')?.value) || 0,
                concB: parseFloat(document.getElementById('concB')?.value) || 0,
                calc3: parseFloat(document.getElementById('calc3')?.value) || 0
            }
        };

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            this.showResults(result);
        } catch (error) {
            console.error('Error submitting practical:', error);
            alert('Failed to submit practical. Please try again.');
        }
    }

    showResults(result) {
        document.getElementById('scoreValue').textContent = Math.round(result.score);
        
        const feedbackContent = document.getElementById('feedbackContent');
        let feedbackHTML = '<ul>';
        
        result.feedback.forEach(item => {
            const className = item.correct ? 'correct' : 'incorrect';
            feedbackHTML += `<li class="${className}">${item.message}</li>`;
        });
        
        feedbackHTML += '</ul>';
        
        if (result.improvements && result.improvements.length > 0) {
            feedbackHTML += '<h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem;">How to Improve:</h4><ul>';
            result.improvements.forEach(tip => {
                feedbackHTML += `<li style="background: hsl(40, 90%, 95%); color: hsl(40, 90%, 20%);">${tip}</li>`;
            });
            feedbackHTML += '</ul>';
        }
        
        feedbackContent.innerHTML = feedbackHTML;
        
        document.getElementById('resultModal').classList.add('active');
    }

    loadNextQuestion() {
        document.getElementById('resultModal').classList.remove('active');
        this.resetPractical();
        this.loadQuestion();
    }

    retryPractical() {
        document.getElementById('resultModal').classList.remove('active');
        this.resetPractical();
    }

    resetPractical() {
        // Reset all state
        this.currentStep = 1;
        this.buretteLevel = 0;
        this.flaskContents = { base: false, indicator: false, acid: 0 };
        this.isRinsed = false;
        this.isFilled = false;
        
        // Clear inputs
        document.querySelectorAll('input[type="number"]').forEach(input => {
            if (input.id.startsWith('initial')) {
                input.value = '0.00';
            } else {
                input.value = '';
            }
        });

        // Reset calculations
        document.getElementById('calculationsInputs').innerHTML = '<p>Complete the titration to enter calculations</p>';
        document.getElementById('submitBtn').disabled = true;

        // Reset display
        this.updateStepDisplay();
        this.updateProgress();
        this.calculateVolumes();
    }
}

// Initialize the simulator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.simulator = new TitrationSimulator();
});
