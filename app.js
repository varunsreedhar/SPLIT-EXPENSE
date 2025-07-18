// Table Tennis Club Management System
class TTClubManager {
    constructor() {
        // Initialize data directly from db.js
        this.loadDataFromDB();

        this.currentEditingMember = null;
        this.currentEditingExpense = null;
        this.currentEditingContribution = null;
        this.currentEditingFee = null;
        this.hasUnsavedChanges = false;

        this.initializeApp();
    }

    // Data Management - Direct from db.js file
    loadDataFromDB() {
        console.log('Loading data from db.js file');
        console.log('TTClubDatabase available:', typeof TTClubDatabase !== 'undefined');

        // Load data directly from the global TTClubDatabase object
        if (typeof TTClubDatabase !== 'undefined') {
            console.log('TTClubDatabase found, loading data...');
            console.log('TTClubDatabase.members length:', TTClubDatabase.members ? TTClubDatabase.members.length : 'undefined');

            this.members = [...TTClubDatabase.members]; // Create copies to avoid direct mutation
            this.transactions = [...TTClubDatabase.transactions];
            this.invoices = [...TTClubDatabase.invoices];
            this.activities = [...TTClubDatabase.activities];
            this.expenses = [...TTClubDatabase.expenses];
            this.contributions = [...TTClubDatabase.contributions];
            this.pendingFees = [...TTClubDatabase.pendingFees];
            this.feeYears = [...TTClubDatabase.feeYears];
            this.settings = {...TTClubDatabase.settings};
            this.users = [...TTClubDatabase.users]; // User management
            this.currentUser = TTClubDatabase.currentUser || null;
            this.events = [...TTClubDatabase.events]; // Events and notifications

            console.log('Successfully loaded from db.js:', this.members.length, 'members');
        } else {
            console.error('TTClubDatabase not found! Make sure db.js is loaded before app.js');
            console.log('Available global objects:', Object.keys(window));
            this.initializeEmptyData();
        }
    }

    initializeEmptyData() {
        this.members = [];
        this.transactions = [];
        this.invoices = [];
        this.activities = [];
        this.expenses = [];
        this.contributions = [];
        this.pendingFees = [];
        this.feeYears = [];
        this.settings = {
            clubName: 'Passion Hills Table Tennis Club',
            defaultMembershipFee: 3000,
            defaultAnnualFee: 500,
            currentYear: 2025
        };
    }

    saveAllData(autoDownload = false) {
        // Update the global database object
        if (typeof TTClubDatabase !== 'undefined') {
            TTClubDatabase.members = [...this.members];
            TTClubDatabase.transactions = [...this.transactions];
            TTClubDatabase.invoices = [...this.invoices];
            TTClubDatabase.activities = [...this.activities];
            TTClubDatabase.expenses = [...this.expenses];
            TTClubDatabase.contributions = [...this.contributions];
            TTClubDatabase.pendingFees = [...this.pendingFees];
            TTClubDatabase.feeYears = [...this.feeYears];
            TTClubDatabase.settings = {...this.settings};

            console.log('Data saved to db.js structure');
        }

        // Mark as saved
        this.hasUnsavedChanges = false;
        this.updateSaveStatus();

        // Only auto-download if explicitly requested
        if (autoDownload) {
            this.downloadDatabaseJSON();
        }

        // Show save indicator
        this.showSaveIndicator();

        return true;
    }

    // Reset to original database state
    resetToOriginalData() {
        if (!this.canResetData()) {
            this.showMessage('Access denied. Only super admin (varun) can reset data.', 'error');
            return;
        }

        if (confirm('This will reset all data to the original database state. Are you sure?')) {
            // Reload the page to get fresh data from db.js
            location.reload();
        }
    }



    // Initialize the application
    initializeApp() {
        try {
            this.showLoading();

            // Data is already loaded in constructor via loadDataFromDB()
            console.log('Initializing app with', this.members.length, 'members');

            if (this.members.length === 0) {
                console.error('No members loaded! Check db.js file.');
                this.showMessage('Error: No member data found. Please check db.js file.', 'error');
            }

            // Initialize user authentication
            this.initializeAuth();

            // Initialize notification system
            this.initializeNotifications();

            this.setupNavigation();
            this.setupNavigationDropdowns();
            this.setupSubsectionNavigation();
            this.addMobileDebugging();
            this.setupModals();
            this.setupEventListeners();
            this.setupMobileEnhancements();
            this.updateDashboard();
            this.renderMembers();
            this.updateFeeManagement();
            this.renderPendingFees();
            this.updateSaveStatus();

            // Initialize comprehensive mobile support
            this.initializeMobileSupport();
            this.setupResponsiveHandlers();

            console.log('App initialization completed successfully');
        } catch (error) {
            console.error('Error during app initialization:', error);
            this.showMessage('Error initializing application: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    setupResponsiveHandlers() {
        // Handle window resize and orientation changes
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResponsiveChanges();
            }, 250);
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResponsiveChanges();
            }, 500);
        });
    }

    handleResponsiveChanges() {
        console.log('Handling responsive changes...');

        // Close any open dropdowns
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });

        // Close notification dropdown
        const notificationDropdown = document.getElementById('notification-dropdown');
        if (notificationDropdown) {
            notificationDropdown.style.display = 'none';
        }

        // Update mobile class on body
        if (this.isMobileDevice() || window.innerWidth <= 768) {
            document.body.classList.add('mobile-device');
        } else {
            document.body.classList.remove('mobile-device');
        }
    }

    // Mobile-specific enhancements
    setupMobileEnhancements() {
        // Add touch-friendly interactions
        this.addTouchSupport();

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Prevent zoom on double tap for buttons
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
                e.preventDefault();
            }
        });

        // Add swipe support for navigation (optional)
        this.addSwipeNavigation();

        // Add mobile-specific event delegation for better button handling
        this.addMobileEventDelegation();

        // Add global event delegation for dashboard cards
        this.addDashboardCardDelegation();
    }

    addTouchSupport() {
        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('.btn, .nav-btn, .btn-small, .btn-edit-fee');
        buttons.forEach(btn => {
            // Prevent double-tap zoom on buttons
            btn.addEventListener('touchstart', (e) => {
                btn.style.transform = 'scale(0.95)';
                btn.style.transition = 'transform 0.1s ease';
            }, { passive: true });

            btn.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    btn.style.transform = '';
                    btn.style.transition = '';
                }, 150);
            }, { passive: true });

            // Prevent context menu on long press for action buttons
            if (btn.classList.contains('btn-small') || btn.classList.contains('btn-edit-fee')) {
                btn.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                });
            }
        });

        // Add specific touch handling for collect fee buttons
        this.addCollectFeeButtonTouchSupport();
    }

    addCollectFeeButtonTouchSupport() {
        console.log('Setting up mobile button support...');

        // Handle all buttons with a comprehensive approach
        this.setupMobileButtonSupport();

        // Handle specific buttons that might be dynamically created
        this.setupDynamicButtonSupport();
    }

    setupMobileButtonSupport() {
        console.log('Setting up simplified mobile button support...');

        // Only apply mobile fixes if actually on mobile
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         (window.innerWidth <= 768 && 'ontouchstart' in window);

        if (!isMobile) {
            console.log('Not on mobile device, skipping mobile fixes');
            return;
        }

        console.log('Mobile device detected, applying targeted fixes...');

        // Simple approach: just fix onclick attributes for mobile
        setTimeout(() => {
            this.fixOnclickAttributesForMobile();
        }, 100);
    }

    fixOnclickAttributesForMobile() {
        console.log('Fixing onclick attributes for mobile...');

        // Find all elements with onclick attributes
        const elementsWithOnclick = document.querySelectorAll('[onclick]');

        elementsWithOnclick.forEach((element, index) => {
            console.log(`Fixing onclick element ${index}:`, element.tagName, element.className, element.id);

            const onclickCode = element.getAttribute('onclick');

            // Store original onclick for reference
            if (!element.hasAttribute('data-original-onclick')) {
                element.setAttribute('data-original-onclick', onclickCode);
            }

            // Add touch event listener as supplement (not replacement)
            if (!element.hasAttribute('data-mobile-touch-added')) {
                element.setAttribute('data-mobile-touch-added', 'true');

                element.addEventListener('touchstart', (e) => {
                    // Add visual feedback
                    element.style.opacity = '0.7';
                    element.style.transform = 'scale(0.95)';
                }, { passive: true });

                element.addEventListener('touchend', (e) => {
                    console.log('Touch end on element with onclick:', element.tagName, element.id);

                    // Reset visual feedback
                    element.style.opacity = '';
                    element.style.transform = '';

                    // For mobile browsers, sometimes click events don't fire properly
                    // So we add a backup touch handler
                    if (e.cancelable) {
                        e.preventDefault();

                        // Small delay to prevent double execution
                        setTimeout(() => {
                            try {
                                console.log('Executing onclick via touch:', onclickCode.substring(0, 50) + '...');
                                eval(onclickCode);
                            } catch (error) {
                                console.error('Error executing onclick on touch:', error);
                            }
                        }, 50);
                    }
                }, { passive: false });
            }

            // Ensure the element has proper mobile styling
            element.style.touchAction = 'manipulation';
            element.style.webkitTapHighlightColor = 'transparent';
            element.style.cursor = 'pointer';
            element.style.userSelect = 'none';
            element.style.webkitUserSelect = 'none';
        });

        console.log(`Fixed ${elementsWithOnclick.length} elements with onclick attributes`);
    }

    handleStatCardClick(button) {
        console.log('Stat card clicked:', button.getAttribute('data-navigate'));
        const navigateTo = button.getAttribute('data-navigate');
        const filter = button.getAttribute('data-filter');

        if (navigateTo) {
            this.navigateFromStatCard(navigateTo, filter);
        }
    }

    handleNavButtonClick(button) {
        console.log('Nav button clicked:', button.getAttribute('data-section'));
        const section = button.getAttribute('data-section');

        if (section) {
            this.showSection(section);
        }
    }

    // Navigation method to switch between sections
    showSection(targetSection, subsection = null) {
        console.log('Showing section:', targetSection, 'subsection:', subsection);

        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        // Update active nav button
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === targetSection) {
                btn.classList.add('active');
            }
        });

        // Update active section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSection) {
                section.classList.add('active');
            }
        });

        // Update content based on section
        this.updateSectionContent(targetSection);

        // Handle subsection if provided
        if (subsection) {
            setTimeout(() => {
                this.showSubsection(targetSection, subsection);
            }, 100);
        }
    }

    handleCloseButtonClick(button) {
        console.log('Close button clicked');
        const modal = button.closest('.modal');

        if (modal) {
            modal.style.display = 'none';
            // Re-enable body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }

    handleRegularButtonClick(button) {
        console.log('Regular button clicked:', button.id || button.className);

        // Handle onclick attribute
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            try {
                console.log('Executing onclick:', onclickAttr.substring(0, 100) + '...');
                eval(onclickAttr);
            } catch (error) {
                console.error('Error executing onclick:', error);
            }
        }

        // Handle specific button IDs
        if (button.id) {
            switch (button.id) {
                case 'add-member-btn':
                    this.openMemberModal();
                    break;
                case 'collect-fee-btn':
                    this.openFeeModal();
                    break;
                case 'add-pending-fee-btn':
                    this.openPendingFeeModal();
                    break;
                case 'add-expense-btn':
                    this.openExpenseModal();
                    break;
                case 'add-contribution-btn':
                    this.openContributionModal();
                    break;
                case 'export-json':
                    this.downloadDatabaseJSON();
                    break;
                case 'import-json':
                    document.getElementById('json-file-input').click();
                    break;
                case 'reset-data':
                    this.resetToOriginalData();
                    break;
                case 'manage-fee-years-btn':
                    this.openFeeYearsModal();
                    break;
                default:
                    console.log('Unhandled button ID:', button.id);
            }
        }
    }

    handleGlobalButtonClick(e) {
        const button = e.target.closest('button, .btn');
        if (!button || button.disabled) return;

        console.log('Global button click:', button.id || button.className);

        // Handle onclick attributes for mobile
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            e.preventDefault();
            e.stopPropagation();

            try {
                // Execute the onclick function
                eval(onclickAttr);
                console.log('Executed onclick:', onclickAttr.substring(0, 50) + '...');
            } catch (error) {
                console.error('Error executing onclick:', error);
            }
        }
    }

    handleGlobalButtonTouch(e) {
        const button = e.target.closest('button, .btn');
        if (!button || button.disabled) return;

        console.log('Global button touch:', button.id || button.className);

        // Handle onclick attributes for mobile touch
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            e.preventDefault();
            e.stopPropagation();

            try {
                // Execute the onclick function
                eval(onclickAttr);
                console.log('Executed touch onclick:', onclickAttr.substring(0, 50) + '...');
            } catch (error) {
                console.error('Error executing touch onclick:', error);
            }
        }
    }

    addButtonTouchFeedback(button) {
        button.style.transition = 'all 0.1s ease';
        button.style.transform = 'scale(0.95)';

        if (button.classList.contains('btn-success')) {
            button.style.backgroundColor = '#1e7e34';
        } else if (button.classList.contains('btn-danger')) {
            button.style.backgroundColor = '#c82333';
        } else if (button.classList.contains('btn-primary')) {
            button.style.backgroundColor = '#0056b3';
        } else if (button.classList.contains('btn-secondary')) {
            button.style.backgroundColor = '#545b62';
        } else if (button.classList.contains('btn-warning')) {
            button.style.backgroundColor = '#e0a800';
        }
    }

    removeButtonTouchFeedback(button) {
        setTimeout(() => {
            button.style.backgroundColor = '';
            button.style.transform = '';
            button.style.transition = '';
        }, 150);
    }

    setupDynamicButtonSupport() {
        // Ensure all buttons have proper mobile attributes
        const allButtons = document.querySelectorAll('button, .btn');
        allButtons.forEach(btn => {
            btn.style.touchAction = 'manipulation';
            btn.style.userSelect = 'none';
            btn.style.webkitUserSelect = 'none';
            btn.style.webkitTapHighlightColor = 'transparent';
            btn.style.webkitTouchCallout = 'none';
        });
    }

    addMobileEventDelegation() {
        // Add event delegation for better mobile button handling
        document.body.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.btn-success, .btn-primary, .btn-secondary, .btn-danger, .btn-warning');
            if (target) {
                target.style.opacity = '0.8';
                target.style.transform = 'scale(0.95)';
            }
        }, { passive: true });

        document.body.addEventListener('touchend', (e) => {
            const target = e.target.closest('.btn-success, .btn-primary, .btn-secondary, .btn-danger, .btn-warning');
            if (target) {
                setTimeout(() => {
                    target.style.opacity = '';
                    target.style.transform = '';
                }, 150);
            }
        }, { passive: true });

        // Prevent iOS Safari from showing the magnifying glass on long press
        document.body.addEventListener('touchstart', (e) => {
            if (e.target.closest('button, .btn')) {
                e.target.style.webkitUserSelect = 'none';
                e.target.style.webkitTouchCallout = 'none';
            }
        }, { passive: true });
    }

    handleOrientationChange() {
        // Refresh layout after orientation change
        this.renderMembers();
        this.updateDashboard();

        // Close any open modals on orientation change
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }

    initializeMobileSupport() {
        console.log('Initializing mobile support...');

        // Simple mobile detection
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         (window.innerWidth <= 768 && 'ontouchstart' in window);

        console.log('Mobile detection result:', isMobile);

        if (isMobile) {
            console.log('Mobile device detected, applying simple mobile fixes...');

            // Apply basic mobile fixes
            setTimeout(() => {
                this.addCollectFeeButtonTouchSupport();
                this.fixBasicMobileModals();
            }, 200);

            // Apply mobile modal handlers after a longer delay to ensure all content is rendered
            setTimeout(() => {
                this.addMobileModalHandlers();
                this.setupNavigationMobileSupport();
            }, 500);
        } else {
            console.log('Desktop device, no mobile fixes needed');
        }
    }

    fixBasicMobileModals() {
        console.log('Applying basic mobile modal fixes...');

        // Ensure modals are properly sized for mobile
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.width = '95%';
                modalContent.style.maxHeight = '90vh';
                modalContent.style.overflowY = 'auto';
            }
        });

        // Add specific mobile handlers for modal opening buttons
        this.addMobileModalHandlers();
    }

    addMobileModalHandlers() {
        console.log('Adding comprehensive mobile handlers...');

        // Define ALL buttons that need mobile touch support
        const allButtons = [
            // Modal opening buttons
            { id: 'add-member-btn', func: () => this.openMemberModal() },
            { id: 'collect-fee-btn', func: () => this.openFeeModal() },
            { id: 'add-pending-fee-btn', func: () => this.openPendingFeeModal() },
            { id: 'add-expense-btn', func: () => this.openExpenseModal() },
            { id: 'add-contribution-btn', func: () => this.openContributionModal() },
            { id: 'manage-fee-years-btn', func: () => this.openFeeYearsModal() },

            // Action buttons
            { id: 'export-json', func: () => this.downloadDatabaseJSON() },
            { id: 'import-json', func: () => document.getElementById('json-file-input').click() },
            { id: 'reset-data', func: () => this.resetToOriginalData() },
            { id: 'export-members', func: () => this.exportMembers() },
            { id: 'export-financial', func: () => this.exportFinancialData() },
            { id: 'generate-invoice-btn', func: () => this.generateInvoice() },
            { id: 'backup-data', func: () => this.backupDatabase() },
            { id: 'download-json', func: () => this.downloadDatabaseJSON() },
            { id: 'quick-save', func: () => { this.saveAllData(false); this.showMessage('Data saved successfully!', 'success'); } },

            // Cancel buttons
            { id: 'cancel-member', func: () => document.getElementById('member-modal').style.display = 'none' },
            { id: 'cancel-fee', func: () => document.getElementById('fee-modal').style.display = 'none' },
            { id: 'cancel-expense', func: () => document.getElementById('expense-modal').style.display = 'none' },
            { id: 'cancel-contribution', func: () => document.getElementById('contribution-modal').style.display = 'none' },
            { id: 'cancel-pending-fee', func: () => document.getElementById('pending-fee-modal').style.display = 'none' },
            { id: 'cancel-fee-year', func: () => document.getElementById('fee-years-modal').style.display = 'none' },
            { id: 'cancel-edit-fee', func: () => document.getElementById('edit-member-fee-modal').style.display = 'none' }
        ];

        allButtons.forEach(({ id, func }) => {
            const button = document.getElementById(id);
            if (button) {
                console.log(`Adding mobile handler for button: ${id}`);

                // Remove any existing mobile handlers
                if (button.hasAttribute('data-mobile-handler-added')) {
                    return;
                }
                button.setAttribute('data-mobile-handler-added', 'true');

                // Add comprehensive mobile touch support
                this.addMobileTouchSupport(button, func, id);
            } else {
                console.warn(`Button with id ${id} not found`);
            }
        });

        console.log(`Added mobile handlers for ${allButtons.length} buttons`);

        // Also handle form submit buttons specifically
        this.addMobileFormSupport();
    }

    addMobileTouchSupport(button, func, buttonId) {
        console.log(`Setting up mobile touch support for: ${buttonId}`);

        // Add touch handler that directly calls the function
        button.addEventListener('touchend', (e) => {
            console.log(`Mobile touchend on ${buttonId}`);
            e.preventDefault();
            e.stopPropagation();

            // Add visual feedback
            button.style.opacity = '0.6';
            button.style.transform = 'scale(0.95)';

            // Execute function after brief delay for visual feedback
            setTimeout(() => {
                button.style.opacity = '';
                button.style.transform = '';

                try {
                    console.log(`Executing function for ${buttonId}`);
                    func();
                    console.log(`Successfully executed function for ${buttonId}`);
                } catch (error) {
                    console.error(`Error executing function for ${buttonId}:`, error);
                }
            }, 150);
        }, { passive: false });

        // Add touchstart for immediate visual feedback
        button.addEventListener('touchstart', () => {
            console.log(`Mobile touchstart on ${buttonId}`);
            button.style.opacity = '0.6';
            button.style.transform = 'scale(0.95)';
        }, { passive: true });

        // Ensure proper mobile styling
        button.style.touchAction = 'manipulation';
        button.style.webkitTapHighlightColor = 'transparent';
        button.style.userSelect = 'none';
        button.style.webkitUserSelect = 'none';
        button.style.cursor = 'pointer';
    }

    addMobileFormSupport() {
        console.log('Adding mobile form support...');

        // Define all forms and their submit functions
        const formHandlers = [
            { formId: 'member-form', func: () => this.saveMember(), buttonText: 'Save Member' },
            { formId: 'fee-form', func: () => this.collectFee(), buttonText: 'Collect Fee' },
            { formId: 'expense-form', func: () => this.saveExpense(), buttonText: 'Save Expense' },
            { formId: 'contribution-form', func: () => this.saveContribution(), buttonText: 'Save Contribution' },
            { formId: 'pending-fee-form', func: () => this.savePendingFee(), buttonText: 'Save Pending Fee' },
            { formId: 'add-fee-year-form', func: () => this.addFeeYear(), buttonText: 'Add Fee Year' },
            { formId: 'edit-member-fee-form', func: () => this.updateMemberFee(), buttonText: 'Update Fee' }
        ];

        formHandlers.forEach(({ formId, func, buttonText }) => {
            const form = document.getElementById(formId);
            if (form) {
                console.log(`Adding mobile support for form: ${formId}`);

                // Find the submit button in the form
                const submitButton = form.querySelector('button[type="submit"], input[type="submit"], .btn-primary');

                if (submitButton && !submitButton.hasAttribute('data-mobile-form-added')) {
                    submitButton.setAttribute('data-mobile-form-added', 'true');

                    console.log(`Adding mobile touch support to submit button for ${formId}`);

                    // Add mobile touch support for the submit button
                    this.addMobileTouchSupport(submitButton, () => {
                        console.log(`Mobile form submission for ${formId}`);

                        // Validate form first
                        if (form.checkValidity && !form.checkValidity()) {
                            console.log(`Form ${formId} validation failed`);
                            form.reportValidity();
                            return;
                        }

                        // Execute the form submission function
                        func();
                    }, `form-${formId}`);
                } else if (!submitButton) {
                    console.warn(`No submit button found for form: ${formId}`);
                }
            } else {
                console.warn(`Form not found: ${formId}`);
            }
        });

        console.log('Mobile form support added');
    }

    setupNavigationMobileSupport() {
        console.log('Setting up navigation mobile support...');

        // Only add mobile support if we're actually on mobile
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         (window.innerWidth <= 768 && 'ontouchstart' in window);

        if (!isMobile) {
            console.log('Not on mobile, skipping navigation mobile support');
            return;
        }

        // Handle navigation buttons for mobile only
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(navBtn => {
            if (!navBtn.hasAttribute('data-mobile-nav-added')) {
                navBtn.setAttribute('data-mobile-nav-added', 'true');

                const section = navBtn.getAttribute('data-section');

                // Add touch support that doesn't interfere with click
                navBtn.addEventListener('touchend', (e) => {
                    console.log(`Mobile touch navigation to: ${section}`);

                    // Only prevent default if this is a pure touch event
                    if (e.cancelable && !e.defaultPrevented) {
                        e.preventDefault();

                        // Add visual feedback
                        navBtn.style.opacity = '0.6';
                        navBtn.style.transform = 'scale(0.95)';

                        setTimeout(() => {
                            navBtn.style.opacity = '';
                            navBtn.style.transform = '';

                            this.showSection(section);
                        }, 100);
                    }
                }, { passive: false });

                // Add mobile styling
                navBtn.style.touchAction = 'manipulation';
                navBtn.style.webkitTapHighlightColor = 'transparent';
            }
        });

        // Handle close buttons
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(closeBtn => {
            if (!closeBtn.hasAttribute('data-mobile-close-added')) {
                closeBtn.setAttribute('data-mobile-close-added', 'true');

                this.addMobileTouchSupport(closeBtn, () => {
                    const modal = closeBtn.closest('.modal');
                    if (modal) {
                        console.log('Closing modal via mobile touch');
                        modal.style.display = 'none';
                        // Re-enable body scroll
                        document.body.style.overflow = '';
                        document.body.style.position = '';
                        document.body.style.width = '';
                    }
                }, 'close-button');
            }
        });

        console.log('Mobile navigation and close button support added');
    }

    // User Authentication and Role Management
    initializeAuth() {
        console.log('Initializing authentication system...');

        // Check if user is already logged in (from localStorage)
        const savedUser = localStorage.getItem('ttclub_current_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('User logged in:', this.currentUser.username);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('ttclub_current_user');
            }
        }

        // If no user is logged in, show login modal
        if (!this.currentUser) {
            this.showLoginModal();
        } else {
            this.updateUIForCurrentUser();
        }
    }

    showLoginModal() {
        // Create login modal if it doesn't exist
        if (!document.getElementById('login-modal')) {
            this.createLoginModal();
        }

        document.getElementById('login-modal').style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    createLoginModal() {
        const modalHTML = `
            <div id="login-modal" class="modal" style="z-index: 10000;">
                <div class="modal-content login-modal-content" style="max-width: 400px; margin: 10% auto;">
                    <h2 style="text-align: center; margin-bottom: 2rem; color: #2c3e50;">
                        <i class="fas fa-table-tennis" style="color: #e74c3c;"></i>
                        TT Club Login
                    </h2>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-username">Username:</label>
                            <input type="text" id="login-username" required
                                   placeholder="Enter your username" autocomplete="username">
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password:</label>
                            <input type="password" id="login-password" required
                                   placeholder="Enter your password" autocomplete="current-password">
                        </div>
                        <div class="form-actions">
                            <button type="submit" id="login-submit-btn" class="btn btn-primary login-btn">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                        </div>
                    </form>
                    <div id="login-error" style="color: #e74c3c; text-align: center; margin-top: 1rem; display: none;"></div>
                    <div style="text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; color: #7f8c8d; font-size: 0.85em;">
                        <p><em>Use your username as password for demo access</em></p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Setup login form handler with better mobile support
        const loginForm = document.getElementById('login-form');
        const loginButton = document.getElementById('login-submit-btn');

        // Form submit handler
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleLogin();
        });

        // Button click handler for mobile compatibility
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleLogin();
        });

        // Touch event handlers for mobile
        loginButton.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            loginButton.style.transform = 'scale(0.95)';
            loginButton.style.transition = 'transform 0.1s ease';
        }, { passive: true });

        loginButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => {
                loginButton.style.transform = '';
                this.handleLogin();
            }, 100);
        }, { passive: false });

        // Enter key handler for inputs
        document.getElementById('login-username').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('login-password').focus();
            }
        });

        document.getElementById('login-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleLogin();
            }
        });
    }

    handleLogin() {
        console.log('Handling login...');

        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');
        const loginButton = document.getElementById('login-submit-btn');

        if (!usernameInput || !passwordInput) {
            console.error('Login inputs not found');
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Disable button during processing
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        }

        // Basic validation
        if (!username || !password) {
            this.showLoginError('Please enter both username and password');
            this.resetLoginButton();
            return;
        }

        // Find user
        const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!user) {
            this.showLoginError('User not found');
            this.resetLoginButton();
            return;
        }

        if (!user.isActive) {
            this.showLoginError('User account is disabled');
            this.resetLoginButton();
            return;
        }

        // For demo purposes, use username as password
        if (password !== username) {
            this.showLoginError('Invalid password');
            this.resetLoginButton();
            return;
        }

        // Login successful
        this.currentUser = user;
        this.currentUser.lastLogin = new Date().toISOString();

        // Save to localStorage
        localStorage.setItem('ttclub_current_user', JSON.stringify(this.currentUser));

        // Hide login modal
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.style.display = 'none';
        }
        document.body.style.overflow = '';

        // Update UI
        this.updateUIForCurrentUser();

        this.showMessage(`Welcome back, ${user.name}!`, 'success');
        this.addActivity('User Login', `${user.name} logged in`);

        console.log('Login successful for user:', user.username);
    }

    resetLoginButton() {
        const loginButton = document.getElementById('login-submit-btn');
        if (loginButton) {
            loginButton.disabled = false;
            loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        }
    }

    showLoginError(message) {
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    updateUIForCurrentUser() {
        if (!this.currentUser) return;

        console.log('Updating UI for user:', this.currentUser.username, 'Role:', this.currentUser.role);

        // Add user info to header
        this.addUserInfoToHeader();

        // Update UI based on role
        this.updateUIBasedOnRole();
    }

    addUserInfoToHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        // Remove existing user info
        const existingUserInfo = header.querySelector('.user-info');
        if (existingUserInfo) {
            existingUserInfo.remove();
        }

        const userInfoHTML = `
            <div class="user-info" style="display: flex; align-items: center; gap: 1rem; margin-left: auto;">
                <div class="user-details" style="text-align: right; color: white;">
                    <div style="font-weight: 600;">${this.currentUser.name}</div>
                    <div style="font-size: 0.8em; opacity: 0.8;">${this.getRoleDisplayName()}</div>
                </div>
                <button class="btn btn-secondary btn-small" onclick="ttClub.logout()" title="Logout">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;

        header.insertAdjacentHTML('beforeend', userInfoHTML);
    }

    getRoleDisplayName() {
        switch (this.currentUser.role) {
            case 'super_admin': return 'Super Admin';
            case 'admin': return 'Admin';
            case 'user': return 'User';
            default: return 'Unknown';
        }
    }

    updateUIBasedOnRole() {
        // Hide/show buttons based on role permissions
        const canEditDelete = this.canEditDelete();
        const canCollectFee = this.canCollectFee();
        const canDownloadReports = this.canDownloadReports();
        const canResetData = this.canResetData();

        // Update all buttons based on permissions
        setTimeout(() => {
            const editButtons = document.querySelectorAll('.btn-primary[onclick*="edit"], .btn-primary[onclick*="Edit"], .btn-edit-fee');
            const deleteButtons = document.querySelectorAll('.btn-danger[onclick*="delete"], .btn-danger[onclick*="Delete"]');
            const collectButtons = document.querySelectorAll('.btn-success[onclick*="openFeeModal"], .btn-success[onclick*="Collect"]');
            const reportButtons = document.querySelectorAll('#export-members, #export-financial, #backup-data, #download-json, #export-json');
            const resetButtons = document.querySelectorAll('#reset-data');

            editButtons.forEach(btn => {
                if (canEditDelete) {
                    btn.style.display = '';
                } else {
                    btn.style.display = 'none';
                }
            });

            deleteButtons.forEach(btn => {
                if (canEditDelete) {
                    btn.style.display = '';
                } else {
                    btn.style.display = 'none';
                }
            });

            // Hide/show collect fee buttons
            collectButtons.forEach(btn => {
                if (canCollectFee) {
                    btn.style.display = '';
                } else {
                    btn.style.display = 'none';
                }
            });

            // Hide/show report download buttons
            reportButtons.forEach(btn => {
                if (canDownloadReports) {
                    btn.style.display = '';
                } else {
                    btn.style.display = 'none';
                }
            });

            // Hide/show reset data buttons (only super admin)
            resetButtons.forEach(btn => {
                if (canResetData) {
                    btn.style.display = '';
                } else {
                    btn.style.display = 'none';
                }
            });

            console.log(`Updated ${editButtons.length} edit, ${deleteButtons.length} delete, ${collectButtons.length} collect, ${reportButtons.length} report, and ${resetButtons.length} reset buttons for user: ${this.currentUser.username}`);
        }, 100);
    }

    isAdmin() {
        return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'super_admin');
    }

    isSuperAdmin() {
        return this.currentUser && this.currentUser.role === 'super_admin';
    }

    canEditDelete() {
        // Only admin and super admin users can edit/delete
        return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'super_admin');
    }

    canCollectFee() {
        // Only admin and super admin users can collect fees
        return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'super_admin');
    }

    canDownloadReports() {
        // Only varun, praveen, and binu can download reports
        return this.currentUser && ['varun', 'praveen', 'binu'].includes(this.currentUser.username);
    }

    canResetData() {
        // Only super admin (varun) can reset/clear data
        return this.currentUser && this.currentUser.role === 'super_admin';
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.currentUser = null;
            localStorage.removeItem('ttclub_current_user');

            // Remove user info from header
            const userInfo = document.querySelector('.user-info');
            if (userInfo) {
                userInfo.remove();
            }

            // Show login modal
            this.showLoginModal();

            this.showMessage('Logged out successfully', 'info');
        }
    }

    // Notification System
    initializeNotifications() {
        console.log('Initializing notification system...');

        // Update notification icon and badge
        this.updateNotificationIcon();

        // Set up periodic checks (every 5 minutes)
        setInterval(() => {
            this.updateNotificationIcon();
        }, 5 * 60 * 1000);

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('notification-dropdown');
            const container = document.querySelector('.notification-icon-container');

            if (dropdown && container && !container.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    updateNotificationIcon() {
        const upcomingEvents = this.getUpcomingEvents(7); // Next 7 days
        const badge = document.getElementById('notification-badge');
        const bell = document.querySelector('.notification-bell');

        if (upcomingEvents.length > 0) {
            badge.textContent = upcomingEvents.length;
            badge.style.display = 'flex';
            bell.classList.add('has-notifications');
        } else {
            badge.style.display = 'none';
            bell.classList.remove('has-notifications');
        }

        console.log(`Updated notification icon: ${upcomingEvents.length} upcoming events`);
    }

    getUpcomingEvents(days = 7) {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + days);

        return this.events
            .filter(event => {
                if (!event.isActive) return false;
                const eventDate = new Date(event.date + 'T' + event.time);
                return eventDate >= now && eventDate <= futureDate;
            })
            .sort((a, b) => {
                const dateA = new Date(a.date + 'T' + a.time);
                const dateB = new Date(b.date + 'T' + b.time);
                return dateA - dateB;
            });
    }

    toggleNotificationDropdown() {
        const dropdown = document.getElementById('notification-dropdown');
        const isVisible = dropdown.style.display === 'block';

        if (isVisible) {
            dropdown.style.display = 'none';
        } else {
            this.populateNotificationDropdown();
            this.positionNotificationDropdown();
            dropdown.style.display = 'block';
        }
    }

    positionNotificationDropdown() {
        const dropdown = document.getElementById('notification-dropdown');
        if (!dropdown) return;

        // Check if mobile
        if (this.isMobileDevice() || window.innerWidth <= 768) {
            // Mobile positioning is handled by CSS
            dropdown.classList.add('mobile-positioned');
        } else {
            // Desktop positioning
            dropdown.classList.remove('mobile-positioned');

            // Position relative to notification icon
            const notificationIcon = document.querySelector('.notification-icon-container');
            if (notificationIcon) {
                const rect = notificationIcon.getBoundingClientRect();
                const dropdownRect = dropdown.getBoundingClientRect();

                // Check if dropdown would go off-screen
                if (rect.right - dropdownRect.width < 10) {
                    dropdown.style.right = '10px';
                    dropdown.style.left = 'auto';
                } else {
                    dropdown.style.right = '0';
                    dropdown.style.left = 'auto';
                }
            }
        }
    }

    closeNotificationDropdown() {
        const dropdown = document.getElementById('notification-dropdown');
        dropdown.style.display = 'none';
    }

    populateNotificationDropdown() {
        const upcomingEvents = this.getUpcomingEvents(7); // Next 7 days
        const content = document.getElementById('notification-dropdown-content');

        if (upcomingEvents.length === 0) {
            content.innerHTML = '<div class="no-notifications">No upcoming events in the next 7 days</div>';
            return;
        }

        content.innerHTML = upcomingEvents.map(event => {
            const eventDate = new Date(event.date + 'T' + event.time);
            const timeUntil = this.getTimeUntilEvent(eventDate);

            return `
                <div class="notification-item priority-${event.priority}" onclick="ttClub.viewEventDetails(${event.id})">
                    <div class="notification-item-title">${event.title}</div>
                    <div class="notification-item-description">${event.description}</div>
                    <div class="notification-item-time">${timeUntil}</div>
                </div>
            `;
        }).join('');
    }

    viewEventDetails(eventId) {
        // Close dropdown and navigate to events section
        this.closeNotificationDropdown();
        this.showSection('events');

        // Highlight the specific event (optional enhancement)
        setTimeout(() => {
            const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
            if (eventElement) {
                eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                eventElement.style.background = '#e3f2fd';
                setTimeout(() => {
                    eventElement.style.background = '';
                }, 3000);
            }
        }, 500);
    }

    getTimeUntilEvent(eventDate) {
        const now = new Date();
        const timeDiff = eventDate - now;

        if (timeDiff < 0) return 'Event has passed';

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `In ${days} day${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `In ${hours} hour${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            return `In ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            return 'Starting soon!';
        }
    }

    viewAllEvents() {
        // Close dropdown and navigate to events section
        this.closeNotificationDropdown();
        this.showSection('events');
    }

    // Events Management
    renderEvents() {
        console.log('Rendering events...');

        this.renderUpcomingEvents();
        this.renderAllEvents();
        this.setupEventFilters();
    }

    renderUpcomingEvents() {
        const upcomingEvents = this.getUpcomingEvents(30); // Next 30 days
        const container = document.getElementById('upcoming-events-list');

        if (upcomingEvents.length === 0) {
            container.innerHTML = '<p class="no-events">No upcoming events in the next 30 days.</p>';
            return;
        }

        container.innerHTML = upcomingEvents.map(event => this.createEventHTML(event, true)).join('');
    }

    renderAllEvents() {
        const container = document.getElementById('all-events-list');
        const typeFilter = document.getElementById('event-type-filter')?.value || '';
        const priorityFilter = document.getElementById('event-priority-filter')?.value || '';

        let filteredEvents = this.events.filter(event => event.isActive);

        if (typeFilter) {
            filteredEvents = filteredEvents.filter(event => event.type === typeFilter);
        }

        if (priorityFilter) {
            filteredEvents = filteredEvents.filter(event => event.priority === priorityFilter);
        }

        // Sort by date (newest first)
        filteredEvents.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateB - dateA;
        });

        if (filteredEvents.length === 0) {
            container.innerHTML = '<p class="no-events">No events found matching the selected filters.</p>';
            return;
        }

        container.innerHTML = filteredEvents.map(event => this.createEventHTML(event, false)).join('');
    }

    createEventHTML(event, isUpcoming = false) {
        const eventDate = new Date(event.date + 'T' + event.time);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const canEdit = this.canEditDelete();
        const timeUntil = isUpcoming ? this.getTimeUntilEvent(eventDate) : '';

        return `
            <div class="event-item priority-${event.priority}" data-event-id="${event.id}">
                <div class="event-header">
                    <div class="event-title">${event.title}</div>
                    <div class="event-type ${event.type}">${event.type.replace('_', ' ')}</div>
                </div>
                <div class="event-description">${event.description}</div>
                <div class="event-datetime">
                    <div><i class="fas fa-calendar"></i> ${formattedDate}</div>
                    <div><i class="fas fa-clock"></i> ${formattedTime}</div>
                    ${isUpcoming ? `<div><i class="fas fa-hourglass-half"></i> ${timeUntil}</div>` : ''}
                </div>
                ${canEdit ? `
                    <div class="event-actions">
                        <button class="btn btn-primary btn-small" onclick="ttClub.editEvent(${event.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-small" onclick="ttClub.deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    setupEventFilters() {
        const typeFilter = document.getElementById('event-type-filter');
        const priorityFilter = document.getElementById('event-priority-filter');

        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.renderAllEvents());
        }

        if (priorityFilter) {
            priorityFilter.addEventListener('change', () => this.renderAllEvents());
        }
    }

    openEventModal(eventId = null) {
        if (!this.canEditDelete()) {
            this.showMessage('Access denied. Only admin and super admin users can manage events.', 'error');
            return;
        }

        const modal = document.getElementById('event-modal');
        const title = document.getElementById('event-modal-title');
        const form = document.getElementById('event-form');

        if (eventId) {
            const event = this.events.find(e => e.id === eventId);
            if (!event) {
                this.showMessage('Event not found!', 'error');
                return;
            }

            title.textContent = 'Edit Event';
            document.getElementById('event-title').value = event.title;
            document.getElementById('event-description').value = event.description;
            document.getElementById('event-date').value = event.date;
            document.getElementById('event-time').value = event.time;
            document.getElementById('event-type').value = event.type;
            document.getElementById('event-priority').value = event.priority;

            form.setAttribute('data-event-id', eventId);
        } else {
            title.textContent = 'Add Event';
            form.reset();
            form.removeAttribute('data-event-id');

            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('event-date').value = today;
        }

        modal.style.display = 'block';
    }

    saveEvent() {
        if (!this.canEditDelete()) {
            this.showMessage('Access denied. Only admin and super admin users can manage events.', 'error');
            return;
        }

        const form = document.getElementById('event-form');
        const eventId = form.getAttribute('data-event-id');

        const eventData = {
            title: document.getElementById('event-title').value.trim(),
            description: document.getElementById('event-description').value.trim(),
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            type: document.getElementById('event-type').value,
            priority: document.getElementById('event-priority').value,
            isActive: true,
            createdBy: this.currentUser.username
        };

        if (!eventData.title || !eventData.date || !eventData.time || !eventData.type || !eventData.priority) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (eventId) {
            // Update existing event
            const eventIndex = this.events.findIndex(e => e.id === parseInt(eventId));
            if (eventIndex !== -1) {
                this.events[eventIndex] = { ...this.events[eventIndex], ...eventData };
                this.addActivity('Event Updated', `Updated event: ${eventData.title}`);
                this.showMessage('Event updated successfully!', 'success');
            }
        } else {
            // Add new event
            const newEvent = {
                id: Math.max(...this.events.map(e => e.id), 0) + 1,
                ...eventData,
                createdDate: new Date().toISOString().split('T')[0]
            };

            this.events.push(newEvent);
            this.addActivity('Event Created', `Created new event: ${eventData.title}`);
            this.showMessage('Event created successfully!', 'success');
        }

        this.markDataChanged();
        this.saveAllData();
        this.renderEvents();
        document.getElementById('event-modal').style.display = 'none';
    }

    editEvent(eventId) {
        this.openEventModal(eventId);
    }

    deleteEvent(eventId) {
        if (!this.canEditDelete()) {
            this.showMessage('Access denied. Only admin and super admin users can manage events.', 'error');
            return;
        }

        const event = this.events.find(e => e.id === eventId);
        if (!event) {
            this.showMessage('Event not found!', 'error');
            return;
        }

        if (confirm(`Are you sure you want to delete the event "${event.title}"?`)) {
            this.events = this.events.filter(e => e.id !== eventId);
            this.markDataChanged();
            this.saveAllData();
            this.renderEvents();
            this.addActivity('Event Deleted', `Deleted event: ${event.title}`);
            this.showMessage('Event deleted successfully!', 'success');
        }
    }

    fixMobileModals() {
        console.log('Fixing mobile modals...');

        // Ensure all modals have proper mobile styling
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.zIndex = '9999';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';

            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.margin = '2% auto';
                modalContent.style.width = '96%';
                modalContent.style.maxWidth = 'none';
                modalContent.style.maxHeight = '95vh';
                modalContent.style.overflowY = 'auto';
                modalContent.style.webkitOverflowScrolling = 'touch';
            }
        });

        // Fix close buttons
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.style.fontSize = '2rem';
            btn.style.padding = '1rem';
            btn.style.minWidth = '50px';
            btn.style.minHeight = '50px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.position = 'absolute';
            btn.style.top = '10px';
            btn.style.right = '10px';
            btn.style.background = 'rgba(0,0,0,0.1)';
            btn.style.borderRadius = '50%';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = '1000';
            btn.style.touchAction = 'manipulation';
        });
    }

    fixMobileNavigation() {
        console.log('Fixing mobile navigation...');

        // Ensure navigation buttons work on mobile
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.style.touchAction = 'manipulation';
            btn.style.minHeight = '50px';
            btn.style.minWidth = '50px';
        });
    }

    addMobileScrollFixes() {
        console.log('Adding mobile scroll fixes...');

        // Prevent body scroll when modal is open
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (modal.style.display === 'block') {
                            document.body.style.overflow = 'hidden';
                            document.body.style.position = 'fixed';
                            document.body.style.width = '100%';
                        } else {
                            document.body.style.overflow = '';
                            document.body.style.position = '';
                            document.body.style.width = '';
                        }
                    }
                });
            });

            observer.observe(modal, { attributes: true });
        });
    }

    addUniversalButtonFixes() {
        console.log('Adding universal button fixes...');

        // Apply to all buttons
        const allButtons = document.querySelectorAll('button, .btn, .btn-small, input[type="submit"], input[type="button"]');
        allButtons.forEach(btn => {
            btn.style.webkitAppearance = 'none';
            btn.style.webkitTapHighlightColor = 'transparent';
            btn.style.touchAction = 'manipulation';
            btn.style.userSelect = 'none';
            btn.style.webkitUserSelect = 'none';
            btn.style.webkitTouchCallout = 'none';
            btn.style.position = 'relative';
            btn.style.zIndex = '1';
            btn.style.pointerEvents = 'auto';
        });
    }

    addDashboardCardDelegation() {
        // Add global event delegation for dashboard stat cards
        document.body.addEventListener('click', (e) => {
            const statCard = e.target.closest('.stat-card.clickable');
            if (statCard) {
                console.log('Dashboard card clicked via delegation');
                e.preventDefault();
                e.stopPropagation();

                const navigateTo = statCard.getAttribute('data-navigate');
                const filter = statCard.getAttribute('data-filter');

                console.log('Navigate to:', navigateTo, 'Filter:', filter);

                if (navigateTo) {
                    this.navigateFromStatCard(navigateTo, filter);
                }
            }
        });

        document.body.addEventListener('touchend', (e) => {
            const statCard = e.target.closest('.stat-card.clickable');
            if (statCard) {
                console.log('Dashboard card touched via delegation');
                e.preventDefault();
                e.stopPropagation();

                const navigateTo = statCard.getAttribute('data-navigate');
                const filter = statCard.getAttribute('data-filter');

                console.log('Navigate to:', navigateTo, 'Filter:', filter);

                if (navigateTo) {
                    this.navigateFromStatCard(navigateTo, filter);
                }
            }
        }, { passive: false });

        // Add visual feedback via delegation
        document.body.addEventListener('touchstart', (e) => {
            const statCard = e.target.closest('.stat-card.clickable');
            if (statCard) {
                console.log('Touch start on dashboard card');
                statCard.style.transform = 'scale(0.98)';
                statCard.style.backgroundColor = '#f8f9fa';
                statCard.style.borderColor = '#3498db';
            }
        }, { passive: true });

        document.body.addEventListener('touchend', (e) => {
            const statCard = e.target.closest('.stat-card.clickable');
            if (statCard) {
                console.log('Touch end on dashboard card');
                setTimeout(() => {
                    statCard.style.transform = '';
                    statCard.style.backgroundColor = '';
                    statCard.style.borderColor = '';
                }, 200);
            }
        }, { passive: true });
    }

    addSwipeNavigation() {
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only handle horizontal swipes that are significant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const activeSection = document.querySelector('.section.active');
                const sections = ['dashboard', 'members', 'fees', 'invoices', 'reports'];
                const currentIndex = sections.indexOf(activeSection.id);

                if (diffX > 0 && currentIndex < sections.length - 1) {
                    // Swipe left - next section
                    this.switchToSection(sections[currentIndex + 1]);
                } else if (diffX < 0 && currentIndex > 0) {
                    // Swipe right - previous section
                    this.switchToSection(sections[currentIndex - 1]);
                }
            }

            startX = 0;
            startY = 0;
        });
    }

    switchToSection(sectionId) {
        const targetButton = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }

    showLoading() {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="loading-overlay" style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); display: flex; align-items: center;
                justify-content: center; z-index: 9999; color: white; font-size: 1.2rem;
            ">
                <div style="text-align: center;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <br>Loading Club Data...
                </div>
            </div>
        `);
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Show save indicator instead of auto-downloading
    showSaveIndicator() {
        // Remove any existing indicator
        const existingIndicator = document.getElementById('save-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Create save indicator
        const indicator = document.createElement('div');
        indicator.id = 'save-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 9999;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideInRight 0.3s ease;
            ">
                <i class="fas fa-check-circle"></i>
                Data Saved
            </div>
        `;

        document.body.appendChild(indicator);

        // Auto-remove after 2 seconds
        setTimeout(() => {
            if (indicator && indicator.parentNode) {
                indicator.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (indicator && indicator.parentNode) {
                        indicator.remove();
                    }
                }, 300);
            }
        }, 2000);
    }



    // Navigation Setup
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active section
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
                
                // Update content based on section
                this.updateSectionContent(targetSection);
            });
        });
    }

    // Navigation Dropdown Setup
    setupNavigationDropdowns() {
        console.log('Setting up navigation dropdowns...');

        const navDropdowns = document.querySelectorAll('.nav-dropdown');
        console.log('Found navigation dropdowns:', navDropdowns.length);

        navDropdowns.forEach((dropdown, index) => {
            const toggleBtn = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.nav-dropdown-menu');
            const items = dropdown.querySelectorAll('.nav-dropdown-item');

            console.log(`Setting up dropdown ${index}:`, {
                toggleBtn: !!toggleBtn,
                menu: !!menu,
                items: items.length
            });

            if (!toggleBtn) {
                console.error('Toggle button not found for dropdown', index);
                return;
            }

            // Create toggle function
            const toggleDropdown = (e) => {
                console.log('Toggle dropdown clicked', index);
                e.preventDefault();
                e.stopPropagation();

                // Close other dropdowns
                navDropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });

                // Toggle current dropdown
                const isActive = dropdown.classList.contains('active');
                if (isActive) {
                    dropdown.classList.remove('active');
                    console.log('Dropdown closed');
                } else {
                    dropdown.classList.add('active');
                    console.log('Dropdown opened');
                }
            };

            // Add multiple event listeners for better mobile compatibility
            toggleBtn.addEventListener('click', toggleDropdown);
            toggleBtn.addEventListener('touchend', toggleDropdown, { passive: false });

            // Add visual feedback for mobile
            toggleBtn.addEventListener('touchstart', (e) => {
                toggleBtn.style.backgroundColor = 'rgba(255,255,255,0.1)';
                toggleBtn.style.transform = 'scale(0.98)';
            }, { passive: true });

            toggleBtn.addEventListener('touchcancel', () => {
                toggleBtn.style.backgroundColor = '';
                toggleBtn.style.transform = '';
            }, { passive: true });

            // Handle dropdown item clicks
            items.forEach((item, itemIndex) => {
                console.log(`Setting up dropdown item ${itemIndex}`);

                const handleItemClick = (e) => {
                    console.log('Dropdown item clicked:', itemIndex);
                    e.preventDefault();
                    e.stopPropagation();

                    const section = item.getAttribute('data-section');
                    const subsection = item.getAttribute('data-subsection');

                    console.log('Navigating to:', section, subsection);

                    // Close dropdown
                    dropdown.classList.remove('active');

                    // Show section and subsection
                    this.showSection(section, subsection);

                    // Update active states
                    items.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                };

                // Add multiple event listeners for mobile compatibility
                item.addEventListener('click', handleItemClick);
                item.addEventListener('touchend', handleItemClick, { passive: false });

                // Add visual feedback for mobile
                item.addEventListener('touchstart', () => {
                    item.style.backgroundColor = '#e3f2fd';
                    item.style.transform = 'translateX(3px)';
                }, { passive: true });

                item.addEventListener('touchcancel', () => {
                    item.style.backgroundColor = '';
                    item.style.transform = '';
                }, { passive: true });
            });
        });

        // Close dropdowns when clicking/touching outside
        const closeDropdowns = () => {
            navDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        };

        document.addEventListener('click', closeDropdowns);
        document.addEventListener('touchstart', closeDropdowns, { passive: true });
    }

    // Mobile Debugging
    addMobileDebugging() {
        // Add mobile debugging info
        if (this.isMobileDevice()) {
            console.log('Mobile device detected - adding debugging');

            // Add visual indicator for touch events
            const debugStyle = document.createElement('style');
            debugStyle.textContent = `
                .nav-dropdown.debug-active {
                    background: rgba(255, 0, 0, 0.1) !important;
                    border: 2px solid red !important;
                }
                .nav-dropdown-item.debug-touched {
                    background: rgba(0, 255, 0, 0.2) !important;
                }
            `;
            document.head.appendChild(debugStyle);

            // Add touch debugging to dropdowns
            setTimeout(() => {
                const dropdowns = document.querySelectorAll('.nav-dropdown');
                dropdowns.forEach((dropdown, index) => {
                    const toggleBtn = dropdown.querySelector('.dropdown-toggle');
                    if (toggleBtn) {
                        toggleBtn.addEventListener('touchstart', () => {
                            console.log(`Touch start on dropdown ${index}`);
                            dropdown.classList.add('debug-active');
                        }, { passive: true });

                        toggleBtn.addEventListener('touchend', () => {
                            console.log(`Touch end on dropdown ${index}`);
                            setTimeout(() => {
                                dropdown.classList.remove('debug-active');
                            }, 1000);
                        }, { passive: true });
                    }
                });
            }, 1000);
        }
    }

    // Subsection Navigation Setup
    setupSubsectionNavigation() {
        console.log('Setting up subsection navigation...');

        const subsectionBtns = document.querySelectorAll('.subsection-btn');

        subsectionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const subsection = btn.getAttribute('data-subsection');
                this.showFeeSubsection(subsection);

                // Update active states
                subsectionBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    showSubsection(section, subsection) {
        console.log('Showing subsection:', section, subsection);

        // Hide all subsections for the current section
        const subsections = document.querySelectorAll(`.${section}-subsection`);
        subsections.forEach(sub => {
            sub.classList.remove('active');
        });

        // Show selected subsection
        const targetSubsection = document.getElementById(`${section}-${subsection}`);
        if (targetSubsection) {
            targetSubsection.classList.add('active');
        }

        // Update content based on section and subsection
        this.updateSubsectionContent(section, subsection);
    }

    showFeeSubsection(subsection) {
        this.showSubsection('fee', subsection);
    }

    updateSubsectionContent(section, subsection) {
        console.log('Updating subsection content:', section, subsection);
        switch(section) {
            case 'fee':
                this.updateFeeSubsectionContent(subsection);
                break;
            case 'invoice':
                this.updateInvoiceSubsectionContent(subsection);
                break;
            case 'expense':
                this.updateExpenseSubsectionContent(subsection);
                break;
            case 'contribution':
                this.updateContributionSubsectionContent(subsection);
                break;
        }
    }

    updateFeeSubsectionContent(subsection) {
        switch(subsection) {
            case 'collection':
                this.updateFeeManagement();
                break;
            case 'pending':
                this.renderPendingFees();
                break;
            case 'years':
                this.updateFeeYearsContent();
                break;
            case 'reports':
                this.updateFeeReports();
                break;
        }
    }

    updateInvoiceSubsectionContent(subsection) {
        switch(subsection) {
            case 'generate':
                console.log('Updating invoice generation content');
                break;
            case 'manage':
                this.renderInvoices();
                break;
            case 'templates':
                console.log('Updating invoice templates content');
                break;
            case 'reports':
                this.updateInvoiceReports();
                break;
        }
    }

    updateExpenseSubsectionContent(subsection) {
        switch(subsection) {
            case 'add':
                console.log('Updating expense add content');
                break;
            case 'manage':
                this.renderExpenses();
                break;
            case 'categories':
                this.updateExpenseCategoriesContent();
                break;
            case 'reports':
                this.updateExpenseReports();
                break;
        }
    }

    updateContributionSubsectionContent(subsection) {
        switch(subsection) {
            case 'add':
                console.log('Updating contribution add content');
                break;
            case 'manage':
                this.renderContributions();
                break;
            case 'types':
                this.updateContributionTypesContent();
                break;
            case 'reports':
                this.updateContributionReports();
                break;
        }
    }

    updateExpenseCategoriesContent() {
        const categoriesContent = document.querySelector('#expense-categories .categories-content');
        if (categoriesContent) {
            const categories = ['Equipment', 'Maintenance', 'Events', 'Utilities', 'Other'];
            const categoryStats = {};

            // Calculate category statistics
            categories.forEach(cat => {
                categoryStats[cat] = {
                    count: this.expenses.filter(e => e.category === cat).length,
                    total: this.expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
                };
            });

            categoriesContent.innerHTML = `
                <div class="categories-list">
                    <h4>Current Categories & Usage:</h4>
                    ${categories.map(category => `
                        <div class="category-item">
                            <div class="category-info">
                                <span class="category-name">${category}</span>
                                <span class="category-stats">${categoryStats[category].count} expenses • ₹${categoryStats[category].total.toLocaleString()}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="categories-note">
                    <p><i class="fas fa-info-circle"></i> Categories are currently predefined. Click "Manage Categories" to customize them.</p>
                </div>
            `;
        }
    }

    updateContributionTypesContent() {
        const typesContent = document.querySelector('#contribution-types .contribution-types-content');
        if (typesContent) {
            const types = ['Member', 'External', 'Donation', 'Sponsorship'];
            const typeStats = {};

            // Calculate type statistics
            types.forEach(type => {
                typeStats[type] = {
                    count: this.contributions.filter(c => c.type === type).length,
                    total: this.contributions.filter(c => c.type === type).reduce((sum, c) => sum + c.amount, 0)
                };
            });

            typesContent.innerHTML = `
                <div class="types-list">
                    <h4>Current Types & Usage:</h4>
                    ${types.map(type => `
                        <div class="type-item">
                            <div class="type-info">
                                <span class="type-name">${type} Contribution</span>
                                <span class="type-stats">${typeStats[type].count} contributions • ₹${typeStats[type].total.toLocaleString()}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="types-note">
                    <p><i class="fas fa-info-circle"></i> Types are currently predefined. Click "Manage Types" to customize them.</p>
                </div>
            `;
        }
    }

    updateFeeReports() {
        console.log('Updating fee reports...');

        // Calculate totals
        const totalCollected = this.members.reduce((sum, member) => sum + member.totalPaid, 0);
        const totalPending = this.calculatePendingPayments();
        const collectionRate = totalCollected + totalPending > 0 ?
            Math.round((totalCollected / (totalCollected + totalPending)) * 100) : 0;

        // Update report values
        document.getElementById('total-collections').textContent = `₹${totalCollected.toLocaleString()}`;
        document.getElementById('total-pending').textContent = `₹${totalPending.toLocaleString()}`;
        document.getElementById('collection-rate').textContent = `${collectionRate}%`;
    }

    updateFeeYearsContent() {
        console.log('Updating fee years content...');
        // This can be expanded to show fee year management interface
    }

    exportFeeReport() {
        if (!this.canDownloadReports()) {
            this.showMessage('Access denied. Only authorized users can download reports.', 'error');
            return;
        }

        console.log('Exporting fee report...');

        // Prepare fee report data
        const reportData = [];

        // Add header
        reportData.push(['Member Name', 'Member Type', '2023 Fee', '2024 Fee', '2025 Fee', 'Total Paid', 'Total Pending']);

        // Add member data
        this.members.forEach(member => {
            const fee2023 = member.fees?.find(f => f.year === 2023)?.amount || 0;
            const fee2024 = member.fees?.find(f => f.year === 2024)?.amount || 0;
            const fee2025 = member.fees?.find(f => f.year === 2025)?.amount || 0;
            const totalExpected = fee2023 + fee2024 + fee2025;
            const totalPending = totalExpected - member.totalPaid;

            reportData.push([
                member.name,
                member.isFounder ? 'Founder' : 'Regular',
                fee2023,
                fee2024,
                fee2025,
                member.totalPaid,
                totalPending
            ]);
        });

        // Convert to CSV
        const csvContent = reportData.map(row =>
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `fee_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showMessage('Fee report exported successfully!', 'success');
        this.addActivity('Report Export', 'Exported fee report');
    }

    updateInvoiceReports() {
        console.log('Updating invoice reports...');
        // Calculate invoice statistics
        // This can be expanded with actual invoice data
        document.getElementById('total-invoices').textContent = '0';
        document.getElementById('total-invoice-amount').textContent = '₹0';
        document.getElementById('paid-invoices').textContent = '0';
    }

    updateExpenseReports() {
        console.log('Updating expense reports...');

        const totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const monthlyAverage = totalExpenses > 0 ? Math.round(totalExpenses / 12) : 0;

        // Find top category
        const categoryTotals = {};
        this.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
            categoryTotals[a] > categoryTotals[b] ? a : b, 'None'
        );

        document.getElementById('report-total-expenses').textContent = `₹${totalExpenses.toLocaleString()}`;
        document.getElementById('average-monthly-expense').textContent = `₹${monthlyAverage.toLocaleString()}`;
        document.getElementById('top-expense-category').textContent = topCategory;
    }

    updateContributionReports() {
        console.log('Updating contribution reports...');

        const totalContributions = this.contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
        const averageContribution = this.contributions.length > 0 ?
            Math.round(totalContributions / this.contributions.length) : 0;

        // Find top contributor
        const contributorTotals = {};
        this.contributions.forEach(contribution => {
            contributorTotals[contribution.contributorName] =
                (contributorTotals[contribution.contributorName] || 0) + contribution.amount;
        });

        const topContributor = Object.keys(contributorTotals).reduce((a, b) =>
            contributorTotals[a] > contributorTotals[b] ? a : b, 'None'
        );

        document.getElementById('report-total-contributions').textContent = `₹${totalContributions.toLocaleString()}`;
        document.getElementById('average-contribution').textContent = `₹${averageContribution.toLocaleString()}`;
        document.getElementById('top-contributor').textContent = topContributor;
    }

    exportInvoiceReport() {
        if (!this.canDownloadReports()) {
            this.showMessage('Access denied. Only authorized users can download reports.', 'error');
            return;
        }

        console.log('Exporting invoice report...');
        // This can be expanded with actual invoice data
        this.showMessage('Invoice report export feature coming soon!', 'info');
    }

    exportExpenseReport() {
        if (!this.canDownloadReports()) {
            this.showMessage('Access denied. Only authorized users can download reports.', 'error');
            return;
        }

        console.log('Exporting expense report...');

        // Prepare expense report data
        const reportData = [];
        reportData.push(['Date', 'Description', 'Category', 'Amount', 'Paid By', 'Status', 'Receipt']);

        this.expenses.forEach(expense => {
            reportData.push([
                expense.date,
                expense.description,
                expense.category,
                expense.amount,
                expense.paidBy,
                expense.status,
                expense.receipt || 'No'
            ]);
        });

        // Convert to CSV and download
        const csvContent = reportData.map(row =>
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `expense_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showMessage('Expense report exported successfully!', 'success');
        this.addActivity('Report Export', 'Exported expense report');
    }

    exportContributionReport() {
        if (!this.canDownloadReports()) {
            this.showMessage('Access denied. Only authorized users can download reports.', 'error');
            return;
        }

        console.log('Exporting contribution report...');

        // Prepare contribution report data
        const reportData = [];
        reportData.push(['Date', 'Contributor Name', 'Villa/Location', 'Type', 'Purpose', 'Amount', 'Receipt']);

        this.contributions.forEach(contribution => {
            reportData.push([
                contribution.date,
                contribution.contributorName,
                contribution.villa || contribution.location || '-',
                contribution.type,
                contribution.purpose,
                contribution.amount,
                contribution.receipt || 'No'
            ]);
        });

        // Convert to CSV and download
        const csvContent = reportData.map(row =>
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `contribution_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showMessage('Contribution report exported successfully!', 'success');
        this.addActivity('Report Export', 'Exported contribution report');
    }

    // Category and Type Management
    openCategoriesModal() {
        this.showMessage('Expense Categories Management - Feature coming soon! Currently using predefined categories.', 'info');
        console.log('Opening categories management modal');
        // This can be expanded to show a modal for managing expense categories
    }

    openContributionTypesModal() {
        this.showMessage('Contribution Types Management - Feature coming soon! Currently using predefined types.', 'info');
        console.log('Opening contribution types management modal');
        // This can be expanded to show a modal for managing contribution types
    }

    // Invoice Management Features
    toggleInvoiceFilters() {
        const filtersContainer = document.getElementById('invoice-filters-container');
        if (filtersContainer) {
            const isVisible = filtersContainer.style.display !== 'none';
            filtersContainer.style.display = isVisible ? 'none' : 'block';
        } else {
            // Create filters if they don't exist
            this.createInvoiceFilters();
        }
    }

    createInvoiceFilters() {
        const manageSection = document.getElementById('invoice-manage');
        if (!manageSection) return;

        const filtersHTML = `
            <div id="invoice-filters-container" class="filters-container" style="margin-bottom: 1rem;">
                <div class="filters-row">
                    <input type="text" id="invoice-search" placeholder="Search invoices..." class="search-input">
                    <select id="invoice-status-filter" class="filter-select">
                        <option value="">All Status</option>
                        <option value="Generated">Generated</option>
                        <option value="Sent">Sent</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <select id="invoice-member-filter" class="filter-select">
                        <option value="">All Members</option>
                        ${this.members.map(member =>
                            `<option value="${member.id}">${member.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;

        const invoiceList = document.getElementById('invoice-list');
        if (invoiceList) {
            invoiceList.insertAdjacentHTML('beforebegin', filtersHTML);

            // Add event listeners for filters
            document.getElementById('invoice-search').addEventListener('input', () => this.filterInvoices());
            document.getElementById('invoice-status-filter').addEventListener('change', () => this.filterInvoices());
            document.getElementById('invoice-member-filter').addEventListener('change', () => this.filterInvoices());
        }
    }

    filterInvoices() {
        // This would filter the invoice list based on search and filter criteria
        console.log('Filtering invoices...');
        this.renderInvoices(); // For now, just re-render
    }

    openInvoiceTemplateModal() {
        this.showMessage('Invoice Templates - Feature coming soon! Currently using default template.', 'info');
        console.log('Opening invoice template modal');
        // This can be expanded to show a modal for managing invoice templates
    }

    // Update section content when switching
    updateSectionContent(section) {
        switch(section) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'members':
                this.renderMembers();
                break;
            case 'fees':
                this.updateFeeManagement();
                break;
            case 'invoices':
                this.renderInvoices();
                break;
            case 'expenses':
                this.renderExpenses();
                break;
            case 'contributions':
                this.renderContributions();
                break;
            case 'events':
                this.renderEvents();
                break;
            case 'reports':
                this.updateReports();
                break;
        }
    }

    // Modal Setup
    setupModals() {
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close');

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modals.forEach(modal => modal.style.display = 'none');
            });
        });

        window.addEventListener('click', (e) => {
            modals.forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Add Member Button
        document.getElementById('add-member-btn').addEventListener('click', () => {
            this.openMemberModal();
        });

        // Member Form Submit
        document.getElementById('member-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMember();
        });

        // Cancel Member
        document.getElementById('cancel-member').addEventListener('click', () => {
            document.getElementById('member-modal').style.display = 'none';
        });

        // Collect Fee Button
        document.getElementById('collect-fee-btn').addEventListener('click', () => {
            this.openFeeModal();
        });

        // Fee Form Submit
        document.getElementById('fee-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.collectFee();
        });

        // Cancel Fee
        document.getElementById('cancel-fee').addEventListener('click', () => {
            document.getElementById('fee-modal').style.display = 'none';
        });

        // Search and Filter
        document.getElementById('member-search').addEventListener('input', () => {
            this.filterMembers();
        });

        document.getElementById('status-filter').addEventListener('change', () => {
            this.filterMembers();
        });

        // Export buttons
        document.getElementById('export-members').addEventListener('click', () => {
            this.exportMembers();
        });

        document.getElementById('export-financial').addEventListener('click', () => {
            this.exportFinancialData();
        });

        // Generate Invoice
        document.getElementById('generate-invoice-btn').addEventListener('click', () => {
            this.generateInvoice();
        });

        // Backup and Download
        document.getElementById('backup-data').addEventListener('click', () => {
            this.backupDatabase();
        });

        document.getElementById('download-json').addEventListener('click', () => {
            this.downloadDatabaseJSON();
        });

        // Import JSON
        document.getElementById('import-json').addEventListener('click', () => {
            document.getElementById('json-file-input').click();
        });

        document.getElementById('json-file-input').addEventListener('change', (e) => {
            this.importDatabaseJSON(e.target.files[0]);
        });

        // Quick Save Button
        document.getElementById('quick-save').addEventListener('click', () => {
            this.saveAllData(false);
            this.showMessage('Data saved successfully!', 'success');
        });

        // Expense Management
        document.getElementById('add-expense-btn').addEventListener('click', () => {
            this.openExpenseModal();
        });

        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveExpense();
        });

        document.getElementById('cancel-expense').addEventListener('click', () => {
            document.getElementById('expense-modal').style.display = 'none';
        });

        // Contribution Management
        document.getElementById('add-contribution-btn').addEventListener('click', () => {
            this.openContributionModal();
        });

        document.getElementById('contribution-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContribution();
        });

        document.getElementById('cancel-contribution').addEventListener('click', () => {
            document.getElementById('contribution-modal').style.display = 'none';
        });

        // Search and Filter Events
        document.getElementById('expense-search').addEventListener('input', () => {
            this.filterExpenses();
        });

        document.getElementById('expense-category-filter').addEventListener('change', () => {
            this.filterExpenses();
        });

        document.getElementById('expense-status-filter').addEventListener('change', () => {
            this.filterExpenses();
        });

        document.getElementById('contribution-search').addEventListener('input', () => {
            this.filterContributions();
        });

        document.getElementById('contribution-type-filter').addEventListener('change', () => {
            this.filterContributions();
        });

        // Reset Data Button
        document.getElementById('reset-data').addEventListener('click', () => {
            this.resetToOriginalData();
        });

        // Pending Fee Management
        document.getElementById('add-pending-fee-btn').addEventListener('click', () => {
            this.openPendingFeeModal();
        });

        document.getElementById('pending-fee-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePendingFee();
        });

        document.getElementById('cancel-pending-fee').addEventListener('click', () => {
            document.getElementById('pending-fee-modal').style.display = 'none';
        });

        // Fee Years Management
        document.getElementById('manage-fee-years-btn').addEventListener('click', () => {
            this.openFeeYearsModal();
        });

        document.getElementById('add-fee-year-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addFeeYear();
        });

        document.getElementById('cancel-fee-year').addEventListener('click', () => {
            document.getElementById('fee-years-modal').style.display = 'none';
        });

        // Edit Member Fee
        document.getElementById('edit-member-fee-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateMemberFee();
        });

        document.getElementById('cancel-edit-fee').addEventListener('click', () => {
            document.getElementById('edit-member-fee-modal').style.display = 'none';
        });

        // Events Management
        document.getElementById('add-event-btn').addEventListener('click', () => {
            this.openEventModal();
        });

        document.getElementById('event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });

        document.getElementById('cancel-event').addEventListener('click', () => {
            document.getElementById('event-modal').style.display = 'none';
        });

        // Report Export Buttons
        document.getElementById('export-fee-report').addEventListener('click', () => {
            this.exportFeeReport();
        });

        document.getElementById('export-invoice-report').addEventListener('click', () => {
            this.exportInvoiceReport();
        });

        document.getElementById('export-expense-report').addEventListener('click', () => {
            this.exportExpenseReport();
        });

        document.getElementById('export-contribution-report').addEventListener('click', () => {
            this.exportContributionReport();
        });

        // Category and Type Management Buttons
        document.getElementById('manage-categories-btn').addEventListener('click', () => {
            this.openCategoriesModal();
        });

        document.getElementById('manage-contribution-types-btn').addEventListener('click', () => {
            this.openContributionTypesModal();
        });

        // Invoice Management Buttons
        document.getElementById('filter-invoices').addEventListener('click', () => {
            this.toggleInvoiceFilters();
        });

        document.getElementById('create-template-btn').addEventListener('click', () => {
            this.openInvoiceTemplateModal();
        });

        // Dashboard stat card click events
        this.setupDashboardCardClicks();
    }

    setupDashboardCardClicks() {
        console.log('Setting up dashboard card clicks...');
        const statCards = document.querySelectorAll('.stat-card.clickable');
        console.log('Found stat cards:', statCards.length);

        statCards.forEach((card, index) => {
            console.log(`Setting up card ${index}:`, card.getAttribute('data-navigate'));

            // Remove any existing event listeners by cloning the element
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);

            // Add click event listener to the new element
            const clickHandler = (e) => {
                console.log('Card clicked!', e.type);
                e.preventDefault();
                e.stopPropagation();

                const navigateTo = newCard.getAttribute('data-navigate');
                const filter = newCard.getAttribute('data-filter');

                console.log('Navigate to:', navigateTo, 'Filter:', filter);

                if (navigateTo) {
                    this.navigateFromStatCard(navigateTo, filter);
                } else {
                    console.error('No navigation target found');
                }
            };

            // Add multiple event types for better compatibility
            newCard.addEventListener('click', clickHandler, { passive: false });
            newCard.addEventListener('touchend', clickHandler, { passive: false });

            // Add visual feedback for mobile
            newCard.addEventListener('touchstart', (e) => {
                console.log('Touch start on card');
                newCard.style.transform = 'scale(0.98)';
                newCard.style.backgroundColor = '#f8f9fa';
                newCard.style.borderColor = '#3498db';
            }, { passive: true });

            newCard.addEventListener('touchend', (e) => {
                console.log('Touch end on card');
                setTimeout(() => {
                    newCard.style.transform = '';
                    newCard.style.backgroundColor = '';
                    newCard.style.borderColor = '';
                }, 200);
            }, { passive: true });

            // Add mouse events for desktop
            newCard.addEventListener('mousedown', (e) => {
                console.log('Mouse down on card');
                newCard.style.transform = 'scale(0.98)';
            }, { passive: true });

            newCard.addEventListener('mouseup', (e) => {
                console.log('Mouse up on card');
                setTimeout(() => {
                    newCard.style.transform = '';
                }, 100);
            }, { passive: true });
        });

        console.log('Dashboard card clicks setup complete');
    }

    navigateFromStatCard(section, filter = null) {
        // Navigate to the specified section
        this.showSection(section);

        // Apply filters if specified
        if (filter) {
            switch (section) {
                case 'members':
                    if (filter === 'active') {
                        // Filter to show only active members
                        const statusFilter = document.getElementById('status-filter');
                        if (statusFilter) {
                            statusFilter.value = 'active';
                            this.filterMembers();
                        }
                    }
                    break;
                case 'fees':
                    if (filter === 'pending') {
                        // Scroll to pending fees section
                        setTimeout(() => {
                            const pendingSection = document.querySelector('.pending-fees');
                            if (pendingSection) {
                                pendingSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 300);
                    }
                    break;
            }
        }

        // Show success message
        const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
        const filterText = filter ? ` (${filter})` : '';
        this.showMessage(`Navigated to ${sectionName}${filterText}`, 'info');
    }

    // Dashboard Updates
    updateDashboard() {
        const totalMembers = this.members.length;
        const activeMembers = this.members.filter(m => m.isActive).length;
        const totalCollected = this.members.reduce((sum, m) => sum + m.totalPaid, 0);
        const totalContributions = this.contributions.reduce((sum, c) => sum + c.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const netBalance = totalCollected + totalContributions - totalExpenses;
        const pendingPayments = this.calculatePendingPayments();

        document.getElementById('total-members').textContent = totalMembers;
        document.getElementById('active-members').textContent = activeMembers;
        document.getElementById('total-collected').textContent = `₹${(totalCollected + totalContributions).toLocaleString()}`;
        document.getElementById('pending-payments').textContent = pendingPayments;

        this.renderRecentActivities();

        // Setup dashboard card clicks after updating content with a delay
        setTimeout(() => {
            this.setupDashboardCardClicks();
        }, 100);

        // Update expense and contribution summaries if on those sections
        if (document.getElementById('total-expenses')) {
            this.updateExpenseSummary();
        }
        if (document.getElementById('total-contributions')) {
            this.updateContributionSummary();
        }
    }

    calculatePendingPayments() {
        let pending = 0;
        this.members.forEach(member => {
            if (member.annualFee2023 === 0) pending++;
            if (member.annualFee2024 === 0) pending++;
            if (member.annualFee2025 === 0) pending++;
        });
        return pending;
    }

    renderRecentActivities() {
        const activitiesList = document.getElementById('recent-activities-list');
        const recentActivities = this.activities.slice(-5).reverse();
        
        if (recentActivities.length === 0) {
            activitiesList.innerHTML = '<p>No recent activities</p>';
            return;
        }

        activitiesList.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <strong>${activity.type}</strong>: ${activity.description}
                <br><small>${new Date(activity.timestamp).toLocaleString()}</small>
            </div>
        `).join('');
    }

    // Member Management
    openMemberModal(member = null) {
        const modal = document.getElementById('member-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('member-form');
        
        this.currentEditingMember = member;
        
        if (member) {
            title.textContent = 'Edit Member';
            document.getElementById('member-name').value = member.name;
            document.getElementById('member-villa').value = member.villaNo;
            document.getElementById('member-status').value = member.status;
            document.getElementById('membership-fee').value = member.membershipFee;
        } else {
            title.textContent = 'Add New Member';
            form.reset();
            document.getElementById('membership-fee').value = 3000;
        }
        
        modal.style.display = 'block';
    }

    saveMember() {
        const name = document.getElementById('member-name').value;
        const villaNo = document.getElementById('member-villa').value;
        const status = document.getElementById('member-status').value;
        const membershipFee = parseInt(document.getElementById('membership-fee').value);

        if (this.currentEditingMember) {
            // Edit existing member
            const member = this.members.find(m => m.id === this.currentEditingMember.id);
            member.name = name;
            member.villaNo = villaNo;
            member.status = status;
            member.membershipFee = membershipFee;

            this.addActivity('Member Updated', `Updated details for ${name}`);
        } else {
            // Add new member
            const newMember = {
                id: Date.now(),
                name,
                villaNo,
                status,
                membershipFee,
                annualFee2023: 0,
                annualFee2024: 0,
                annualFee2025: 0,
                totalPaid: membershipFee,
                joinDate: new Date().toISOString().split('T')[0],
                isActive: true
            };

            this.members.push(newMember);
            this.addActivity('Member Added', `Added new member: ${name}`);
        }

        this.markDataChanged();
        this.saveAllData();
        this.renderMembers();
        this.updateDashboard();
        document.getElementById('member-modal').style.display = 'none';
    }

    deleteMember(id) {
        if (!this.canEditDelete()) {
            this.showMessage('Access denied. Only varun, praveen, and binu can delete members.', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete this member?')) {
            const member = this.members.find(m => m.id === id);
            this.members = this.members.filter(m => m.id !== id);
            this.markDataChanged();
            this.saveAllData();
            this.renderMembers();
            this.updateDashboard();
            this.addActivity('Member Deleted', `Deleted member: ${member.name}`);
        }
    }

    renderMembers() {
        const thead = document.getElementById('members-table-header');
        const tbody = document.getElementById('members-table-body');
        const filteredMembers = this.getFilteredMembers();

        console.log('Rendering members:', filteredMembers.length, 'members');

        // Render dynamic headers
        this.renderMembersTableHeader(thead);

        if (filteredMembers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        No members found. ${this.members.length === 0 ? 'Add your first member!' : 'Try adjusting your search or filters.'}
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredMembers.map((member, index) => {
            const isFoundingMember = member.status.includes('FOUNDING MEMBER');
            const isInactive = member.status.includes('Inactive') || !member.isActive;
            const rowClass = isFoundingMember ? 'founding-member-row' : '';
            const inactiveClass = isInactive ? 'inactive-member' : '';

            return `
                <tr class="${rowClass} ${inactiveClass}" data-member-id="${member.id}">
                    <td data-label="Sl No">${index + 1}</td>
                    <td data-label="Name">
                        <div class="member-name">
                            ${isFoundingMember ? '<i class="fas fa-crown founding-icon" title="Founding Member"></i>' : ''}
                            ${member.name}
                            ${isInactive ? '<i class="fas fa-pause-circle inactive-icon" title="Inactive Member"></i>' : ''}
                        </div>
                    </td>
                    <td data-label="Villa">${member.villaNo}</td>
                    <td data-label="Status"><span class="status-badge status-${member.status.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}">${member.status}</span></td>
                    <td data-label="Membership">₹${member.membershipFee.toLocaleString()}</td>
                    ${this.feeYears.sort((a, b) => a.year - b.year).map(feeYear => {
                        const feeKey = `annualFee${feeYear.year}`;
                        const feeAmount = member[feeKey] || 0;
                        return `
                            <td data-label="${feeYear.year}" class="${feeAmount === 0 ? 'unpaid-fee' : 'paid-fee'} fee-cell">
                                <div class="fee-amount-container">
                                    <span class="fee-amount">₹${feeAmount.toLocaleString()}</span>
                                    <button class="btn-edit-fee" onclick="ttClub.editMemberFee(${member.id}, ${feeYear.year}, ${feeAmount})" title="Edit ${feeYear.year} fee">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                        `;
                    }).join('')}
                    <td data-label="Total Paid" class="total-paid">₹${member.totalPaid.toLocaleString()}</td>
                    <td data-label="Actions" class="action-buttons">
                        <button class="btn btn-small btn-primary" onclick="ttClub.openMemberModal(${JSON.stringify(member).replace(/"/g, '&quot;')})" title="Edit Member">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-small btn-danger" onclick="ttClub.deleteMember(${member.id})" title="Delete Member">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        ${this.hasUnpaidFees(member) ?
                            `<button class="btn btn-small btn-success" onclick="ttClub.openFeeModal('${member.id}')" title="Collect Fee">
                                <i class="fas fa-money-bill-wave"></i> Collect
                            </button>` : ''
                        }
                    </td>
                </tr>
            `;
        }).join('');

        // Update member count display
        this.updateMemberCount(filteredMembers.length);

        // Add touch support for dynamically created buttons (mobile)
        setTimeout(() => {
            this.addCollectFeeButtonTouchSupport();
            // Update UI based on user role
            this.updateUIBasedOnRole();
        }, 100);
    }

    hasUnpaidFees(member) {
        // Check if member has any unpaid fees across all fee years
        return this.feeYears.some(feeYear => {
            const feeKey = `annualFee${feeYear.year}`;
            return (member[feeKey] || 0) === 0;
        });
    }

    renderMembersTableHeader(thead) {
        const sortedFeeYears = this.feeYears.sort((a, b) => a.year - b.year);

        thead.innerHTML = `
            <tr>
                <th>Sl No</th>
                <th>Name</th>
                <th>Villa No</th>
                <th>Status</th>
                <th>Membership Fee</th>
                ${sortedFeeYears.map(feeYear =>
                    `<th>Annual Fee ${feeYear.year}</th>`
                ).join('')}
                <th>Total Paid</th>
                <th>Actions</th>
            </tr>
        `;
    }

    updateMemberCount(count) {
        // Add member count to section header if it doesn't exist
        const sectionHeader = document.querySelector('#members .section-header h2');
        if (sectionHeader) {
            const totalMembers = this.members.length;
            const foundingMembers = this.members.filter(m => m.status.includes('FOUNDING MEMBER')).length;
            sectionHeader.innerHTML = `
                Member Management
                <small style="font-weight: normal; color: #7f8c8d; font-size: 0.7em;">
                    (${count} of ${totalMembers} shown • ${foundingMembers} founding members)
                </small>
            `;
        }
    }

    getFilteredMembers() {
        // Get search and filter values with null checks
        const searchElement = document.getElementById('member-search');
        const statusElement = document.getElementById('status-filter');

        const searchTerm = searchElement ? searchElement.value.toLowerCase() : '';
        const statusFilter = statusElement ? statusElement.value : '';

        console.log('Filtering members:', {
            totalMembers: this.members.length,
            searchTerm,
            statusFilter
        });

        return this.members.filter(member => {
            const matchesSearch = !searchTerm ||
                                member.name.toLowerCase().includes(searchTerm) ||
                                member.villaNo.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || member.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }

    filterMembers() {
        this.renderMembers();
    }

    // Add Activity Log
    addActivity(type, description) {
        const activity = {
            id: Date.now(),
            type,
            description,
            timestamp: new Date().toISOString()
        };

        this.activities.push(activity);
        // Save activities without auto-download
        this.saveAllData(false);
    }

    // Show user-friendly messages
    showMessage(message, type = 'info') {
        // Remove any existing message
        const existingMessage = document.getElementById('user-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.id = 'user-message';
        messageDiv.className = `message ${type} show`;
        messageDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
                color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
                border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 9999;
                font-size: 0.9rem;
                max-width: 90%;
                text-align: center;
                animation: slideInDown 0.3s ease;
            ">
                ${message}
            </div>
        `;

        document.body.appendChild(messageDiv);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOutUp 0.3s ease';
                setTimeout(() => {
                    if (messageDiv && messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // Track data changes
    markDataChanged() {
        this.hasUnsavedChanges = true;
        this.updateSaveStatus();
    }

    updateSaveStatus() {
        const saveButton = document.getElementById('quick-save');
        if (saveButton) {
            if (this.hasUnsavedChanges) {
                saveButton.style.background = '#e74c3c';
                saveButton.title = 'You have unsaved changes - Click to save';
                saveButton.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            } else {
                saveButton.style.background = 'rgba(255,255,255,0.2)';
                saveButton.title = 'Data is saved';
                saveButton.innerHTML = '<i class="fas fa-check"></i>';
            }
        }
    }

    // Fee Management
    openFeeModal(memberId = null) {
        if (!this.canCollectFee()) {
            this.showMessage('Access denied. Only admin and super admin users can collect fees.', 'error');
            return;
        }

        const modal = document.getElementById('fee-modal');
        const memberSelect = document.getElementById('fee-member');
        const feeTypeSelect = document.getElementById('fee-type');

        // Populate member dropdown
        memberSelect.innerHTML = '<option value="">Select Member</option>' +
            this.members.map(member =>
                `<option value="${member.id}">${member.name} (Villa ${member.villaNo})</option>`
            ).join('');

        // Populate fee type dropdown with active fee years
        const activeFeeYears = this.feeYears.filter(fy => fy.isActive).sort((a, b) => a.year - b.year);
        feeTypeSelect.innerHTML = '<option value="">Select Fee Type</option>' +
            activeFeeYears.map(feeYear =>
                `<option value="annual_${feeYear.year}">Annual Fee ${feeYear.year} (₹${feeYear.amount})</option>`
            ).join('');

        // Pre-select member if provided
        if (memberId) {
            memberSelect.value = memberId;
            // Trigger change event to update fee amount if needed
            memberSelect.dispatchEvent(new Event('change'));
        }

        // Set default date to today
        document.getElementById('payment-date').value = new Date().toISOString().split('T')[0];

        modal.style.display = 'block';
    }

    collectFee() {
        if (!this.canCollectFee()) {
            this.showMessage('Access denied. Only admin and super admin users can collect fees.', 'error');
            return;
        }

        const memberId = parseInt(document.getElementById('fee-member').value);
        const feeType = document.getElementById('fee-type').value;
        const amount = parseInt(document.getElementById('fee-amount').value);
        const paymentDate = document.getElementById('payment-date').value;

        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        // Update member's fee record dynamically
        if (feeType.startsWith('annual_')) {
            const year = feeType.replace('annual_', '');
            const feeKey = `annualFee${year}`;
            member[feeKey] = amount;
        }

        // Update total paid by summing all fee years
        member.totalPaid = member.membershipFee +
                          this.feeYears.reduce((sum, feeYear) => {
                              const feeKey = `annualFee${feeYear.year}`;
                              return sum + (member[feeKey] || 0);
                          }, 0);

        // Record transaction
        const transaction = {
            id: Date.now(),
            memberId: member.id,
            memberName: member.name,
            type: feeType,
            amount: amount,
            date: paymentDate,
            timestamp: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Collected', `Collected ${feeType.replace('_', ' ')} ₹${amount} from ${member.name}`);

        this.updateDashboard();
        this.updateFeeManagement();
        this.renderMembers();

        document.getElementById('fee-modal').style.display = 'none';
        document.getElementById('fee-form').reset();
    }

    updateFeeManagement() {
        // Calculate fee summaries
        let fee2023Collected = 0, fee2023Pending = 0;
        let fee2024Collected = 0, fee2024Pending = 0;
        let fee2025Collected = 0, fee2025Pending = 0;

        this.members.forEach(member => {
            fee2023Collected += member.annualFee2023;
            fee2024Collected += member.annualFee2024;
            fee2025Collected += member.annualFee2025;

            if (member.annualFee2023 === 0) fee2023Pending += 500;
            if (member.annualFee2024 === 0) fee2024Pending += 500;
            if (member.annualFee2025 === 0) fee2025Pending += 500;
        });

        document.getElementById('fee-2023-collected').textContent = `₹${fee2023Collected.toLocaleString()}`;
        document.getElementById('fee-2023-pending').textContent = `₹${fee2023Pending.toLocaleString()}`;
        document.getElementById('fee-2024-collected').textContent = `₹${fee2024Collected.toLocaleString()}`;
        document.getElementById('fee-2024-pending').textContent = `₹${fee2024Pending.toLocaleString()}`;
        document.getElementById('fee-2025-collected').textContent = `₹${fee2025Collected.toLocaleString()}`;
        document.getElementById('fee-2025-pending').textContent = `₹${fee2025Pending.toLocaleString()}`;

        this.renderPendingFees();
    }

    // Pending Fee Management Methods
    openPendingFeeModal() {
        const modal = document.getElementById('pending-fee-modal');
        const memberSelect = document.getElementById('pending-fee-member');
        const feeTypeSelect = document.getElementById('pending-fee-type');

        // Populate member dropdown
        memberSelect.innerHTML = '<option value="">Select Member</option>' +
            this.members.map(member =>
                `<option value="${member.id}">${member.name} (Villa ${member.villaNo})</option>`
            ).join('');

        // Populate fee type dropdown with active fee years
        const activeFeeYears = this.feeYears.filter(fy => fy.isActive).sort((a, b) => a.year - b.year);
        feeTypeSelect.innerHTML = '<option value="">Select Fee Type</option>' +
            activeFeeYears.map(feeYear =>
                `<option value="Annual Fee ${feeYear.year}">Annual Fee ${feeYear.year} (₹${feeYear.amount})</option>`
            ).join('') +
            `<option value="Membership Fee">Membership Fee</option>
             <option value="Special Assessment">Special Assessment</option>
             <option value="Tournament Fee">Tournament Fee</option>
             <option value="Other">Other</option>`;

        // Set default due date to 30 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        document.getElementById('pending-fee-due-date').value = dueDate.toISOString().split('T')[0];

        modal.style.display = 'block';
    }

    savePendingFee() {
        const memberId = parseInt(document.getElementById('pending-fee-member').value);
        const feeType = document.getElementById('pending-fee-type').value;
        const amount = parseInt(document.getElementById('pending-fee-amount').value);
        const dueDate = document.getElementById('pending-fee-due-date').value;
        const notes = document.getElementById('pending-fee-notes').value;

        const member = this.members.find(m => m.id === memberId);
        if (!member) {
            this.showMessage('Member not found!', 'error');
            return;
        }

        // Check if this pending fee already exists
        const existingPending = this.pendingFees.find(pf =>
            pf.memberId === memberId && pf.feeType === feeType
        );

        if (existingPending) {
            this.showMessage('A pending fee of this type already exists for this member!', 'error');
            return;
        }

        const newPendingFee = {
            id: Date.now(),
            memberId: memberId,
            memberName: member.name,
            memberVilla: member.villaNo,
            feeType: feeType,
            amount: amount,
            dueDate: dueDate,
            notes: notes,
            status: 'Pending',
            createdDate: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        this.pendingFees.push(newPendingFee);
        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Pending Fee Added', `Added pending ${feeType} ₹${amount} for ${member.name}`);
        this.renderPendingFees();
        this.showMessage(`Pending fee added for ${member.name}`, 'success');

        document.getElementById('pending-fee-modal').style.display = 'none';
        document.getElementById('pending-fee-form').reset();
    }

    renderPendingFees() {
        const pendingList = document.getElementById('pending-fees-list');
        if (!pendingList) {
            console.error('Pending fees list element not found');
            return;
        }

        if (this.pendingFees.length === 0) {
            pendingList.innerHTML = '<p class="empty-state">No pending fees added. Click "Add Pending Fee" to create pending fee records.</p>';
            return;
        }

        pendingList.innerHTML = this.pendingFees.map(pending => `
            <div class="pending-item">
                <div class="pending-info">
                    <strong>${pending.memberName}</strong> (Villa ${pending.memberVilla})
                    <br><small>${pending.feeType} - ₹${pending.amount.toLocaleString()}</small>
                    <br><small>Due: ${new Date(pending.dueDate).toLocaleDateString()}</small>
                    ${pending.notes ? `<br><small class="notes">Note: ${pending.notes}</small>` : ''}
                </div>
                <div class="pending-actions">
                    <button class="btn btn-small btn-success" onclick="ttClub.collectPendingFee(${pending.id})" title="Collect Fee">
                        <i class="fas fa-money-bill-wave"></i> Collect
                    </button>
                    <button class="btn btn-small btn-danger" onclick="ttClub.deletePendingFee(${pending.id})" title="Remove Pending Fee">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add mobile touch support for pending fee buttons
        setTimeout(() => {
            this.addCollectFeeButtonTouchSupport();
        }, 100);
    }

    collectPendingFee(pendingId) {
        const pending = this.pendingFees.find(pf => pf.id === pendingId);
        if (!pending) {
            this.showMessage('Pending fee not found!', 'error');
            return;
        }

        const member = this.members.find(m => m.id === pending.memberId);
        if (!member) {
            this.showMessage('Member not found!', 'error');
            return;
        }

        // Update member's fee record based on fee type
        if (pending.feeType === 'Annual Fee 2023') {
            member.annualFee2023 = pending.amount;
        } else if (pending.feeType === 'Annual Fee 2024') {
            member.annualFee2024 = pending.amount;
        } else if (pending.feeType === 'Annual Fee 2025') {
            member.annualFee2025 = pending.amount;
        } else if (pending.feeType === 'Membership Fee') {
            member.membershipFee += pending.amount;
        }

        // Update total paid
        member.totalPaid = member.membershipFee + member.annualFee2023 + member.annualFee2024 + member.annualFee2025;

        // Record transaction
        const transaction = {
            id: Date.now(),
            memberId: member.id,
            memberName: member.name,
            type: pending.feeType.toLowerCase().replace(/\s+/g, '_'),
            amount: pending.amount,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            fromPending: true,
            pendingFeeId: pendingId
        };

        this.transactions.push(transaction);

        // Remove from pending fees
        this.pendingFees = this.pendingFees.filter(pf => pf.id !== pendingId);

        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Pending Fee Collected', `Collected ${pending.feeType} ₹${pending.amount} from ${member.name}`);

        this.updateDashboard();
        this.renderMembers();
        this.renderPendingFees();

        this.showMessage(`Successfully collected ${pending.feeType} ₹${pending.amount} from ${member.name}`, 'success');
    }

    deletePendingFee(pendingId) {
        const pending = this.pendingFees.find(pf => pf.id === pendingId);
        if (!pending) {
            this.showMessage('Pending fee not found!', 'error');
            return;
        }

        if (confirm(`Are you sure you want to remove the pending ${pending.feeType} for ${pending.memberName}?`)) {
            this.pendingFees = this.pendingFees.filter(pf => pf.id !== pendingId);
            this.markDataChanged();
            this.saveAllData();

            this.addActivity('Pending Fee Removed', `Removed pending ${pending.feeType} for ${pending.memberName}`);
            this.renderPendingFees();
            this.showMessage('Pending fee removed successfully', 'success');
        }
    }

    quickCollectFee(memberId, feeType, amount) {
        if (!this.canCollectFee()) {
            this.showMessage('Access denied. Only admin and super admin users can collect fees.', 'error');
            return;
        }

        const member = this.members.find(m => m.id === memberId);
        if (!member) {
            console.error('Member not found:', memberId);
            this.showMessage('Member not found!', 'error');
            return;
        }

        console.log('Quick collecting fee:', { memberId, feeType, amount, member });

        // Convert fee type to the correct format
        let feeTypeKey;
        if (feeType === 'Annual Fee 2023') {
            feeTypeKey = 'annual_2023';
        } else if (feeType === 'Annual Fee 2024') {
            feeTypeKey = 'annual_2024';
        } else if (feeType === 'Annual Fee 2025') {
            feeTypeKey = 'annual_2025';
        } else {
            // Fallback to the old method
            feeTypeKey = feeType.toLowerCase().replace('annual fee ', 'annual_');
        }

        switch(feeTypeKey) {
            case 'annual_2023':
                member.annualFee2023 = amount;
                break;
            case 'annual_2024':
                member.annualFee2024 = amount;
                break;
            case 'annual_2025':
                member.annualFee2025 = amount;
                break;
        }

        member.totalPaid = member.membershipFee + member.annualFee2023 + member.annualFee2024 + member.annualFee2025;

        const transaction = {
            id: Date.now(),
            memberId: member.id,
            memberName: member.name,
            type: feeTypeKey,
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Collected', `Quick collected ${feeType} ₹${amount} from ${member.name}`);

        this.updateDashboard();
        this.updateFeeManagement();
        this.renderMembers();

        this.showMessage(`Successfully collected ${feeType} ₹${amount} from ${member.name}`, 'success');
    }

    // Invoice Management
    generateInvoice() {
        const memberId = prompt('Enter Member ID or select from list:');
        if (!memberId) return;

        const member = this.members.find(m => m.id == memberId || m.name.toLowerCase().includes(memberId.toLowerCase()));
        if (!member) {
            alert('Member not found!');
            return;
        }

        const invoice = {
            id: Date.now(),
            invoiceNumber: `INV-${Date.now()}`,
            memberId: member.id,
            memberName: member.name,
            memberVilla: member.villaNo,
            items: [],
            total: 0,
            date: new Date().toISOString().split('T')[0],
            status: 'Generated'
        };

        // Add pending fees to invoice
        if (member.annualFee2023 === 0) {
            invoice.items.push({ description: 'Annual Fee 2023', amount: 500 });
            invoice.total += 500;
        }
        if (member.annualFee2024 === 0) {
            invoice.items.push({ description: 'Annual Fee 2024', amount: 500 });
            invoice.total += 500;
        }
        if (member.annualFee2025 === 0) {
            invoice.items.push({ description: 'Annual Fee 2025', amount: 500 });
            invoice.total += 500;
        }

        if (invoice.items.length === 0) {
            alert('No pending fees for this member!');
            return;
        }

        this.invoices.push(invoice);
        this.saveData('invoices', this.invoices);
        this.addActivity('Invoice Generated', `Generated invoice ${invoice.invoiceNumber} for ${member.name}`);
        this.renderInvoices();

        // Open print dialog
        this.printInvoice(invoice);
    }

    printInvoice(invoice) {
        const printWindow = window.open('', '_blank');
        const invoiceHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${invoice.invoiceNumber}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .invoice-details { margin-bottom: 20px; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    .items-table th { background-color: #f2f2f2; }
                    .total { text-align: right; font-size: 18px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Passion Hills Table Tennis Club</h1>
                    <h2>Invoice</h2>
                </div>
                <div class="invoice-details">
                    <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${invoice.date}</p>
                    <p><strong>Member:</strong> ${invoice.memberName}</p>
                    <p><strong>Villa No:</strong> ${invoice.memberVilla}</p>
                </div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td>₹${item.amount}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total">
                    <p>Total Amount: ₹${invoice.total}</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.print();
    }

    renderInvoices() {
        const invoiceList = document.getElementById('invoice-list');

        if (this.invoices.length === 0) {
            invoiceList.innerHTML = '<p>No invoices generated yet.</p>';
            return;
        }

        invoiceList.innerHTML = this.invoices.map(invoice => `
            <div class="invoice-item">
                <div class="invoice-info">
                    <h4>${invoice.invoiceNumber}</h4>
                    <p>${invoice.memberName} (Villa ${invoice.memberVilla}) - ₹${invoice.total}</p>
                    <small>Date: ${invoice.date}</small>
                </div>
                <div class="invoice-actions">
                    <button class="btn btn-small btn-primary" onclick="ttClub.printInvoice(${JSON.stringify(invoice).replace(/"/g, '&quot;')})">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button class="btn btn-small btn-danger" onclick="ttClub.deleteInvoice(${invoice.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    deleteInvoice(id) {
        if (confirm('Are you sure you want to delete this invoice?')) {
            this.invoices = this.invoices.filter(inv => inv.id !== id);
            this.saveData('invoices', this.invoices);
            this.renderInvoices();
            this.addActivity('Invoice Deleted', `Deleted invoice`);
        }
    }

    // Reports and Analytics
    updateReports() {
        this.updateFinancialSummary();
        this.updateMemberStatistics();
    }

    updateFinancialSummary() {
        const financialSummary = document.getElementById('financial-summary');

        const totalMembershipFees = this.members.reduce((sum, m) => sum + m.membershipFee, 0);
        const totalAnnualFees2023 = this.members.reduce((sum, m) => sum + m.annualFee2023, 0);
        const totalAnnualFees2024 = this.members.reduce((sum, m) => sum + m.annualFee2024, 0);
        const totalAnnualFees2025 = this.members.reduce((sum, m) => sum + m.annualFee2025, 0);
        const totalMemberFees = totalMembershipFees + totalAnnualFees2023 + totalAnnualFees2024 + totalAnnualFees2025;

        const totalContributions = this.contributions.reduce((sum, c) => sum + c.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalIncome = totalMemberFees + totalContributions;
        const netBalance = totalIncome - totalExpenses;

        const pendingAmount = this.calculateTotalPendingAmount();

        financialSummary.innerHTML = `
            <div class="financial-item">
                <strong>Total Membership Fees:</strong> ₹${totalMembershipFees.toLocaleString()}
            </div>
            <div class="financial-item">
                <strong>Annual Fees 2023:</strong> ₹${totalAnnualFees2023.toLocaleString()}
            </div>
            <div class="financial-item">
                <strong>Annual Fees 2024:</strong> ₹${totalAnnualFees2024.toLocaleString()}
            </div>
            <div class="financial-item">
                <strong>Annual Fees 2025:</strong> ₹${totalAnnualFees2025.toLocaleString()}
            </div>
            <div class="financial-item">
                <strong>Total Contributions:</strong> ₹${totalContributions.toLocaleString()}
            </div>
            <div class="financial-item total-line">
                <strong>Total Income:</strong> ₹${totalIncome.toLocaleString()}
            </div>
            <div class="financial-item">
                <strong>Total Expenses:</strong> ₹${totalExpenses.toLocaleString()}
            </div>
            <div class="financial-item ${netBalance >= 0 ? 'total-line' : 'pending-line'}">
                <strong>Net Balance:</strong> ₹${netBalance.toLocaleString()}
            </div>
            <div class="financial-item pending-line">
                <strong>Pending Fees:</strong> ₹${pendingAmount.toLocaleString()}
            </div>
        `;
    }

    calculateTotalPendingAmount() {
        let pending = 0;
        this.members.forEach(member => {
            if (member.annualFee2023 === 0) pending += 500;
            if (member.annualFee2024 === 0) pending += 500;
            if (member.annualFee2025 === 0) pending += 500;
        });
        return pending;
    }

    updateMemberStatistics() {
        const memberStatistics = document.getElementById('member-statistics');

        const totalMembers = this.members.length;
        const foundingMembers = this.members.filter(m => m.status === 'FOUNDING MEMBER').length;
        const newMembers = this.members.filter(m => m.status === 'NEW MEMBER').length;
        const approvedMembers = this.members.filter(m => m.status === 'APPROVED FOR MEMBERSHIP').length;
        const inactiveMembers = this.members.filter(m => !m.isActive).length;

        memberStatistics.innerHTML = `
            <div class="stat-item">
                <strong>Total Members:</strong> ${totalMembers}
            </div>
            <div class="stat-item">
                <strong>Founding Members:</strong> ${foundingMembers}
            </div>
            <div class="stat-item">
                <strong>New Members:</strong> ${newMembers}
            </div>
            <div class="stat-item">
                <strong>Approved Members:</strong> ${approvedMembers}
            </div>
            <div class="stat-item">
                <strong>Inactive Members:</strong> ${inactiveMembers}
            </div>
        `;
    }

    // Export Functions
    exportMembers() {
        if (!this.canDownloadReports()) {
            this.showMessage('Access denied. Only varun, praveen, and binu can download reports.', 'error');
            return;
        }

        const csvContent = this.generateMembersCSV();
        this.downloadCSV(csvContent, 'tt_club_members.csv');
        this.addActivity('Data Export', 'Exported members data to CSV');
    }

    exportFinancialData() {
        if (!this.canDownloadReports()) {
            this.showMessage('Access denied. Only varun, praveen, and binu can download reports.', 'error');
            return;
        }

        const csvContent = this.generateFinancialCSV();
        this.downloadCSV(csvContent, 'tt_club_financial.csv');
        this.addActivity('Data Export', 'Exported financial data to CSV');
    }

    generateMembersCSV() {
        const headers = ['Sl No', 'Name', 'Villa No', 'Status', 'Membership Fee', 'Annual Fee 2023', 'Annual Fee 2024', 'Annual Fee 2025', 'Total Paid', 'Join Date', 'Active'];

        const rows = this.members.map((member, index) => [
            index + 1,
            member.name,
            member.villaNo,
            member.status,
            member.membershipFee,
            member.annualFee2023,
            member.annualFee2024,
            member.annualFee2025,
            member.totalPaid,
            member.joinDate,
            member.isActive ? 'Yes' : 'No'
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    generateFinancialCSV() {
        const headers = ['Transaction ID', 'Date', 'Member Name', 'Villa No', 'Fee Type', 'Amount'];

        const rows = this.transactions.map(transaction => [
            transaction.id,
            transaction.date,
            transaction.memberName,
            this.members.find(m => m.id === transaction.memberId)?.villaNo || '',
            transaction.type.replace('_', ' ').toUpperCase(),
            transaction.amount
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Backup and Download Functions
    backupDatabase() {
        if (!this.canDownloadReports()) {
            this.showMessage('Access denied. Only varun, praveen, and binu can download reports.', 'error');
            return;
        }

        // Create a backup by downloading the current database
        this.downloadDatabaseJSON();
        this.addActivity('Database Backup', 'Database backup downloaded');
        this.showMessage('Database backup downloaded successfully!', 'success');
    }

    downloadDatabaseJSON() {
        if (!this.canDownloadReports()) {
            this.showMessage('Access denied. Only varun, praveen, and binu can download reports.', 'error');
            return;
        }

        const data = {
            members: this.members,
            transactions: this.transactions,
            invoices: this.invoices,
            activities: this.activities,
            expenses: this.expenses,
            contributions: this.contributions,
            pendingFees: this.pendingFees,
            feeYears: this.feeYears,
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };

        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.setAttribute('href', url);
            link.setAttribute('download', `ttclub_database_${timestamp}.json`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        this.addActivity('Data Export', 'Downloaded complete database JSON');
    }

    // Fee Years Management Methods
    openFeeYearsModal() {
        const modal = document.getElementById('fee-years-modal');
        const currentYear = new Date().getFullYear();

        // Set default year to next year
        document.getElementById('new-fee-year').value = currentYear + 1;

        this.renderCurrentFeeYears();
        modal.style.display = 'block';
    }

    renderCurrentFeeYears() {
        const container = document.getElementById('current-fee-years');

        if (this.feeYears.length === 0) {
            container.innerHTML = '<p class="empty-state">No fee years configured.</p>';
            return;
        }

        // Sort fee years by year
        const sortedYears = [...this.feeYears].sort((a, b) => a.year - b.year);

        container.innerHTML = sortedYears.map(feeYear => `
            <div class="fee-year-item ${!feeYear.isActive ? 'inactive' : ''}">
                <div class="fee-year-info">
                    <strong>${feeYear.year}</strong>
                    <span class="fee-amount">₹${feeYear.amount.toLocaleString()}</span>
                    ${feeYear.description ? `<small>${feeYear.description}</small>` : ''}
                </div>
                <div class="fee-year-actions">
                    <button class="btn btn-small ${feeYear.isActive ? 'btn-warning' : 'btn-success'}"
                            onclick="ttClub.toggleFeeYear(${feeYear.year})"
                            title="${feeYear.isActive ? 'Deactivate' : 'Activate'} this fee year">
                        <i class="fas fa-${feeYear.isActive ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="btn btn-small btn-primary"
                            onclick="ttClub.editFeeYear(${feeYear.year})"
                            title="Edit fee year">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger"
                            onclick="ttClub.deleteFeeYear(${feeYear.year})"
                            title="Delete fee year">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    addFeeYear() {
        const year = parseInt(document.getElementById('new-fee-year').value);
        const amount = parseInt(document.getElementById('new-fee-amount').value);
        const description = document.getElementById('fee-year-description').value || `Annual Fee ${year}`;

        // Check if year already exists
        const existingYear = this.feeYears.find(fy => fy.year === year);
        if (existingYear) {
            this.showMessage(`Fee year ${year} already exists!`, 'error');
            return;
        }

        // Add new fee year
        const newFeeYear = {
            year: year,
            amount: amount,
            description: description,
            isActive: true
        };

        this.feeYears.push(newFeeYear);

        // Add the new fee year columns to all existing members
        this.members.forEach(member => {
            const feeKey = `annualFee${year}`;
            if (!(feeKey in member)) {
                member[feeKey] = 0; // Initialize with 0 (unpaid)
            }
        });

        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Year Added', `Added fee year ${year} with amount ₹${amount}`);
        this.showMessage(`Fee year ${year} added successfully!`, 'success');

        // Refresh displays
        this.renderCurrentFeeYears();
        this.updateFeeManagement();
        this.renderMembers();

        // Reset form
        document.getElementById('add-fee-year-form').reset();
        document.getElementById('new-fee-year').value = new Date().getFullYear() + 1;
    }

    toggleFeeYear(year) {
        const feeYear = this.feeYears.find(fy => fy.year === year);
        if (!feeYear) return;

        feeYear.isActive = !feeYear.isActive;

        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Year Updated', `${feeYear.isActive ? 'Activated' : 'Deactivated'} fee year ${year}`);
        this.showMessage(`Fee year ${year} ${feeYear.isActive ? 'activated' : 'deactivated'}`, 'success');

        this.renderCurrentFeeYears();
        this.updateFeeManagement();
    }

    editFeeYear(year) {
        const feeYear = this.feeYears.find(fy => fy.year === year);
        if (!feeYear) return;

        const newAmount = prompt(`Enter new amount for ${year}:`, feeYear.amount);
        if (newAmount === null) return; // User cancelled

        const amount = parseInt(newAmount);
        if (isNaN(amount) || amount < 0) {
            this.showMessage('Please enter a valid amount', 'error');
            return;
        }

        const newDescription = prompt(`Enter description for ${year}:`, feeYear.description);
        if (newDescription === null) return; // User cancelled

        feeYear.amount = amount;
        feeYear.description = newDescription;

        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Year Updated', `Updated fee year ${year}: ₹${amount} - ${newDescription}`);
        this.showMessage(`Fee year ${year} updated successfully!`, 'success');

        this.renderCurrentFeeYears();
    }

    deleteFeeYear(year) {
        const feeYear = this.feeYears.find(fy => fy.year === year);
        if (!feeYear) return;

        // Check if any member has paid this fee
        const feeKey = `annualFee${year}`;
        const hasPaidMembers = this.members.some(member => member[feeKey] > 0);

        if (hasPaidMembers) {
            if (!confirm(`Some members have already paid fees for ${year}. Deleting this fee year will remove all payment records for this year. Are you sure?`)) {
                return;
            }
        } else {
            if (!confirm(`Are you sure you want to delete fee year ${year}?`)) {
                return;
            }
        }

        // Remove fee year
        this.feeYears = this.feeYears.filter(fy => fy.year !== year);

        // Remove fee year data from all members
        this.members.forEach(member => {
            delete member[feeKey];
            // Recalculate total paid
            member.totalPaid = member.membershipFee +
                              this.feeYears.reduce((sum, fy) => {
                                  const key = `annualFee${fy.year}`;
                                  return sum + (member[key] || 0);
                              }, 0);
        });

        // Remove related transactions
        this.transactions = this.transactions.filter(t => t.type !== `annual_${year}`);

        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Year Deleted', `Deleted fee year ${year}`);
        this.showMessage(`Fee year ${year} deleted successfully!`, 'success');

        // Refresh displays
        this.renderCurrentFeeYears();
        this.updateFeeManagement();
        this.renderMembers();
    }

    // Member Fee Editing Methods
    editMemberFee(memberId, year, currentAmount) {
        if (!this.canEditDelete()) {
            this.showMessage('Access denied. Only varun, praveen, and binu can edit member fees.', 'error');
            return;
        }

        const member = this.members.find(m => m.id === memberId);
        if (!member) {
            this.showMessage('Member not found!', 'error');
            return;
        }

        const modal = document.getElementById('edit-member-fee-modal');

        // Store current editing context
        this.currentEditingFee = {
            memberId: memberId,
            year: year,
            currentAmount: currentAmount
        };

        // Populate modal with member and fee information
        document.getElementById('edit-fee-member-name').textContent = `${member.name} (Villa ${member.villaNo})`;
        document.getElementById('edit-fee-year').textContent = year;
        document.getElementById('edit-fee-current-amount').textContent = currentAmount.toLocaleString();
        document.getElementById('edit-fee-new-amount').value = currentAmount;

        // Reset form
        document.getElementById('edit-fee-reason').value = '';
        document.getElementById('edit-fee-notes').value = '';

        modal.style.display = 'block';
    }

    updateMemberFee() {
        if (!this.currentEditingFee) {
            this.showMessage('No fee editing context found!', 'error');
            return;
        }

        const { memberId, year } = this.currentEditingFee;
        const newAmount = parseInt(document.getElementById('edit-fee-new-amount').value);
        const reason = document.getElementById('edit-fee-reason').value;
        const notes = document.getElementById('edit-fee-notes').value;

        if (newAmount < 0) {
            this.showMessage('Fee amount cannot be negative!', 'error');
            return;
        }

        const member = this.members.find(m => m.id === memberId);
        if (!member) {
            this.showMessage('Member not found!', 'error');
            return;
        }

        // Update member's fee record
        const feeKey = `annualFee${year}`;
        const oldAmount = member[feeKey] || 0;
        member[feeKey] = newAmount;

        // Recalculate total paid
        member.totalPaid = member.membershipFee +
                          this.feeYears.reduce((sum, feeYear) => {
                              const key = `annualFee${feeYear.year}`;
                              return sum + (member[key] || 0);
                          }, 0);

        // Create adjustment transaction record
        const adjustmentTransaction = {
            id: Date.now(),
            memberId: member.id,
            memberName: member.name,
            type: `fee_adjustment_${year}`,
            amount: newAmount - oldAmount, // Can be negative for reductions
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            isAdjustment: true,
            adjustmentReason: reason,
            adjustmentNotes: notes,
            originalAmount: oldAmount,
            newAmount: newAmount
        };

        this.transactions.push(adjustmentTransaction);

        this.markDataChanged();
        this.saveAllData();

        // Log the activity
        const changeDescription = newAmount > oldAmount ?
            `increased from ₹${oldAmount.toLocaleString()} to ₹${newAmount.toLocaleString()}` :
            newAmount < oldAmount ?
            `reduced from ₹${oldAmount.toLocaleString()} to ₹${newAmount.toLocaleString()}` :
            `corrected (no amount change)`;

        this.addActivity('Fee Adjusted',
            `${member.name}'s ${year} fee ${changeDescription}. Reason: ${reason}`);

        // Refresh displays
        this.updateDashboard();
        this.renderMembers();
        this.updateFeeManagement();

        // Show success message
        this.showMessage(
            `Successfully updated ${member.name}'s ${year} fee to ₹${newAmount.toLocaleString()}`,
            'success'
        );

        // Close modal and reset
        document.getElementById('edit-member-fee-modal').style.display = 'none';
        this.currentEditingFee = null;
    }



    // Expense Management Methods
    openExpenseModal(expense = null) {
        const modal = document.getElementById('expense-modal');
        const title = document.getElementById('expense-modal-title');
        const form = document.getElementById('expense-form');

        this.currentEditingExpense = expense;

        if (expense) {
            title.textContent = 'Edit Expense';
            document.getElementById('expense-date').value = expense.date;
            document.getElementById('expense-description').value = expense.description;
            document.getElementById('expense-category').value = expense.category;
            document.getElementById('expense-amount').value = expense.amount;
            document.getElementById('expense-paid-by').value = expense.paidBy;
            document.getElementById('expense-status').value = expense.status;
            document.getElementById('expense-receipt').value = expense.receipt || '';
        } else {
            title.textContent = 'Add New Expense';
            form.reset();
            document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
        }

        modal.style.display = 'block';
    }

    saveExpense() {
        const date = document.getElementById('expense-date').value;
        const description = document.getElementById('expense-description').value;
        const category = document.getElementById('expense-category').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const paidBy = document.getElementById('expense-paid-by').value;
        const status = document.getElementById('expense-status').value;
        const receipt = document.getElementById('expense-receipt').value;

        // Validation
        if (!date || !description || !category || !amount || !paidBy || !status) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (this.currentEditingExpense) {
            // Edit existing expense
            const expense = this.expenses.find(e => e.id === this.currentEditingExpense.id);
            expense.date = date;
            expense.description = description;
            expense.category = category;
            expense.amount = amount;
            expense.paidBy = paidBy;
            expense.status = status;
            expense.receipt = receipt;

            this.addActivity('Expense Updated', `Updated expense: ${description}`);
            this.showMessage('Expense updated successfully!', 'success');
        } else {
            // Add new expense
            const newExpense = {
                id: Date.now(),
                date,
                description,
                category,
                amount,
                paidBy,
                status,
                receipt,
                timestamp: new Date().toISOString()
            };

            this.expenses.push(newExpense);
            this.addActivity('Expense Added', `Added new expense: ${description} - ₹${amount}`);
            this.showMessage('Expense added successfully!', 'success');
        }

        this.markDataChanged();
        this.saveAllData();
        this.renderExpenses();
        this.updateDashboard();
        document.getElementById('expense-modal').style.display = 'none';

        // Navigate to manage expenses to show the new entry
        this.showSubsection('expense', 'manage');
    }

    deleteExpense(id) {
        if (!this.canEditDelete()) {
            this.showMessage('Access denied. Only varun, praveen, and binu can delete expenses.', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete this expense?')) {
            const expense = this.expenses.find(e => e.id === id);
            this.expenses = this.expenses.filter(e => e.id !== id);
            this.markDataChanged();
            this.saveAllData();
            this.renderExpenses();
            this.updateDashboard();
            this.addActivity('Expense Deleted', `Deleted expense: ${expense.description}`);
        }
    }

    renderExpenses() {
        const tbody = document.getElementById('expenses-table-body');
        const filteredExpenses = this.getFilteredExpenses();

        tbody.innerHTML = filteredExpenses.map(expense => `
            <tr>
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td>₹${expense.amount.toLocaleString()}</td>
                <td>${expense.paidBy}</td>
                <td><span class="status-badge status-${expense.status.toLowerCase()}">${expense.status}</span></td>
                <td>${expense.receipt ? '✓' : '-'}</td>
                <td class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="ttClub.openExpenseModal(${JSON.stringify(expense).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="ttClub.deleteExpense(${expense.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        this.updateExpenseSummary();

        // Update UI based on user role
        setTimeout(() => {
            this.updateUIBasedOnRole();
        }, 50);
    }

    getFilteredExpenses() {
        const searchTerm = document.getElementById('expense-search')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('expense-category-filter')?.value || '';
        const statusFilter = document.getElementById('expense-status-filter')?.value || '';

        return this.expenses.filter(expense => {
            const matchesSearch = expense.description.toLowerCase().includes(searchTerm) ||
                                expense.paidBy.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || expense.category === categoryFilter;
            const matchesStatus = !statusFilter || expense.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }

    filterExpenses() {
        this.renderExpenses();
    }

    updateExpenseSummary() {
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthExpenses = this.expenses
            .filter(e => {
                const expenseDate = new Date(e.date);
                return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, e) => sum + e.amount, 0);
        const pendingReimbursements = this.expenses
            .filter(e => e.status === 'Pending')
            .reduce((sum, e) => sum + e.amount, 0);

        document.getElementById('total-expenses').textContent = `₹${totalExpenses.toLocaleString()}`;
        document.getElementById('month-expenses').textContent = `₹${monthExpenses.toLocaleString()}`;
        document.getElementById('pending-reimbursements').textContent = `₹${pendingReimbursements.toLocaleString()}`;
    }

    // Contribution Management Methods
    openContributionModal(contribution = null) {
        const modal = document.getElementById('contribution-modal');
        const title = document.getElementById('contribution-modal-title');
        const form = document.getElementById('contribution-form');

        this.currentEditingContribution = contribution;

        if (contribution) {
            title.textContent = 'Edit Contribution';
            document.getElementById('contribution-date').value = contribution.date;
            document.getElementById('contribution-name').value = contribution.contributorName;
            document.getElementById('contribution-location').value = contribution.villa || contribution.location || '';
            document.getElementById('contribution-type').value = contribution.type;
            document.getElementById('contribution-purpose').value = contribution.purpose;
            document.getElementById('contribution-amount').value = contribution.amount;
            document.getElementById('contribution-receipt').value = contribution.receipt || '';
        } else {
            title.textContent = 'Add New Contribution';
            form.reset();
            document.getElementById('contribution-date').value = new Date().toISOString().split('T')[0];
        }

        modal.style.display = 'block';
    }

    saveContribution() {
        const date = document.getElementById('contribution-date').value;
        const contributorName = document.getElementById('contribution-name').value;
        const villa = document.getElementById('contribution-location').value; // Changed to villa to match rendering
        const type = document.getElementById('contribution-type').value;
        const purpose = document.getElementById('contribution-purpose').value;
        const amount = parseFloat(document.getElementById('contribution-amount').value);
        const receipt = document.getElementById('contribution-receipt').value;

        // Validation
        if (!date || !contributorName || !villa || !type || !purpose || !amount) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (this.currentEditingContribution) {
            // Edit existing contribution
            const contribution = this.contributions.find(c => c.id === this.currentEditingContribution.id);
            contribution.date = date;
            contribution.contributorName = contributorName;
            contribution.villa = villa; // Changed to villa
            contribution.type = type;
            contribution.purpose = purpose;
            contribution.amount = amount;
            contribution.receipt = receipt;

            this.addActivity('Contribution Updated', `Updated contribution from ${contributorName}`);
            this.showMessage('Contribution updated successfully!', 'success');
        } else {
            // Add new contribution
            const newContribution = {
                id: Date.now(),
                date,
                contributorName,
                villa, // Changed to villa
                type,
                purpose,
                amount,
                receipt,
                timestamp: new Date().toISOString()
            };

            this.contributions.push(newContribution);
            this.addActivity('Contribution Added', `Added new contribution from ${contributorName} - ₹${amount}`);
            this.showMessage('Contribution added successfully!', 'success');
        }

        this.markDataChanged();
        this.saveAllData();
        this.renderContributions();
        this.updateDashboard();
        document.getElementById('contribution-modal').style.display = 'none';

        // Navigate to manage contributions to show the new entry
        this.showSubsection('contribution', 'manage');
    }

    deleteContribution(id) {
        if (!this.canEditDelete()) {
            this.showMessage('Access denied. Only varun, praveen, and binu can delete contributions.', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete this contribution?')) {
            const contribution = this.contributions.find(c => c.id === id);
            this.contributions = this.contributions.filter(c => c.id !== id);
            this.markDataChanged();
            this.saveAllData();
            this.renderContributions();
            this.updateDashboard();
            this.addActivity('Contribution Deleted', `Deleted contribution from ${contribution.contributorName}`);
        }
    }

    renderContributions() {
        const tbody = document.getElementById('contributions-table-body');
        if (!tbody) {
            console.error('Contributions table body not found');
            return;
        }

        const filteredContributions = this.getFilteredContributions();
        console.log('Rendering contributions:', filteredContributions.length);

        if (filteredContributions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                        <i class="fas fa-hand-holding-usd" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        No contributions found. Click "Add Contribution" to create the first entry.
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = filteredContributions.map(contribution => `
                <tr>
                    <td>${new Date(contribution.date).toLocaleDateString()}</td>
                    <td>${contribution.contributorName}</td>
                    <td>${contribution.villa || contribution.location || '-'}</td>
                    <td><span class="status-badge type-${contribution.type.toLowerCase().replace(' ', '-')}">${contribution.type}</span></td>
                    <td>${contribution.purpose}</td>
                    <td>₹${contribution.amount.toLocaleString()}</td>
                    <td>${contribution.receipt ? '✓' : '-'}</td>
                    <td class="action-buttons">
                        <button class="btn btn-small btn-primary" onclick="ttClub.openContributionModal(${JSON.stringify(contribution).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="ttClub.deleteContribution(${contribution.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        this.updateContributionSummary();

        // Update UI based on user role
        setTimeout(() => {
            this.updateUIBasedOnRole();
        }, 50);
    }

    getFilteredContributions() {
        const searchTerm = document.getElementById('contribution-search')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('contribution-type-filter')?.value || '';

        return this.contributions.filter(contribution => {
            const location = contribution.villa || contribution.location || '';
            const matchesSearch = contribution.contributorName.toLowerCase().includes(searchTerm) ||
                                location.toLowerCase().includes(searchTerm) ||
                                contribution.purpose.toLowerCase().includes(searchTerm);
            const matchesType = !typeFilter || contribution.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }

    filterContributions() {
        this.renderContributions();
    }

    updateContributionSummary() {
        const totalContributions = this.contributions.reduce((sum, c) => sum + c.amount, 0);
        const memberContributions = this.contributions
            .filter(c => c.type === 'Member')
            .reduce((sum, c) => sum + c.amount, 0);
        const externalContributions = this.contributions
            .filter(c => c.type === 'External' || c.type === 'Donation' || c.type === 'Sponsorship')
            .reduce((sum, c) => sum + c.amount, 0);

        document.getElementById('total-contributions').textContent = `₹${totalContributions.toLocaleString()}`;
        document.getElementById('member-contributions').textContent = `₹${memberContributions.toLocaleString()}`;
        document.getElementById('external-contributions').textContent = `₹${externalContributions.toLocaleString()}`;
    }

    // Import JSON Database
    importDatabaseJSON(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                // Validate the imported data structure
                if (this.validateImportedData(importedData)) {
                    // Confirm before importing
                    if (confirm('This will replace all current data. Are you sure you want to import this database?')) {
                        this.members = importedData.members || [];
                        this.transactions = importedData.transactions || [];
                        this.invoices = importedData.invoices || [];
                        this.activities = importedData.activities || [];
                        this.expenses = importedData.expenses || [];
                        this.contributions = importedData.contributions || [];
                        this.pendingFees = importedData.pendingFees || [];
                        this.feeYears = importedData.feeYears || [];
                        this.settings = importedData.settings || this.getDefaultSettings();

                        // Save imported data
                        this.saveAllData();

                        // Refresh all views
                        this.updateDashboard();
                        this.renderMembers();
                        this.updateFeeManagement();
                        this.renderInvoices();
                        this.renderExpenses();
                        this.renderContributions();
                        this.updateReports();

                        this.addActivity('Data Import', `Imported database from ${file.name}`);
                        alert('Database imported successfully!');
                    }
                } else {
                    alert('Invalid JSON file format. Please select a valid TT Club database file.');
                }
            } catch (error) {
                console.error('Error importing JSON:', error);
                alert('Error reading JSON file. Please check the file format.');
            }
        };

        reader.readAsText(file);
    }

    validateImportedData(data) {
        // Check if the imported data has the required structure
        return data &&
               typeof data === 'object' &&
               Array.isArray(data.members) &&
               Array.isArray(data.transactions) &&
               Array.isArray(data.invoices) &&
               Array.isArray(data.activities) &&
               Array.isArray(data.expenses) &&
               Array.isArray(data.contributions) &&
               (data.pendingFees === undefined || Array.isArray(data.pendingFees));
    }
}

// Initialize the application
let ttClub;

function initializeApp() {
    console.log('Attempting to initialize app...');
    console.log('TTClubDatabase available:', typeof TTClubDatabase !== 'undefined');

    if (typeof TTClubDatabase !== 'undefined') {
        try {
            ttClub = new TTClubManager();
            console.log('TTClubManager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize TTClubManager:', error);
            showInitError('Failed to initialize application: ' + error.message);
        }
    } else {
        console.log('TTClubDatabase not ready, retrying...');
        setTimeout(initializeApp, 50); // Retry after 50ms
    }
}

function showInitError(message) {
    // Remove loading screen if it exists
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.remove();

    // Show error message
    document.body.insertAdjacentHTML('beforeend', `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                   background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                   text-align: center; z-index: 10000;">
            <h3 style="color: #e74c3c; margin-bottom: 1rem;">Initialization Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Reload Page
            </button>
        </div>
    `);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting initialization...');
    initializeApp();
});
