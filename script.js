// ==================== EDITOR FUNCTIONALITY ====================

// Document Editor Object
const Editor = {
    currentDocument: 'Document 1',
    documents: {
        'Document 1': '',
        'Document 2': ''
    },
    lastSaved: new Date(),

    // Initialize editor
    init() {
        this.attachEventListeners();
        this.updateWordCount();
    },

    // Attach event listeners
    attachEventListeners() {
        const editor = document.getElementById('editor');
        const docTitle = document.getElementById('doc-title');
        const newDocBtn = document.getElementById('new-doc-btn');
        const docList = document.getElementById('doc-list');

        // Editor input event
        editor.addEventListener('input', (e) => {
            this.saveCurrentDocument(e.target.value);
            this.updateWordCount();
            this.updateStatus('Unsaved changes');
        });

        // Auto-save
        setInterval(() => {
            if (editor.value) {
                this.updateLastSaved();
                this.updateStatus('Saved');
            }
        }, 5000);

        // Document title change
        docTitle.addEventListener('blur', (e) => {
            if (e.target.value.trim()) {
                document.title = e.target.value + ' - Document Editor';
            }
        });

        // New document button
        newDocBtn.addEventListener('click', () => {
            this.createNewDocument();
        });

        // Document list click
        docList.addEventListener('click', (e) => {
            if (e.target.classList.contains('doc-item')) {
                this.switchDocument(e.target.textContent);
                this.updateDocumentList();
            }
        });
    },

    // Save current document
    saveCurrentDocument(content) {
        this.documents[this.currentDocument] = content;
    },

    // Switch to another document
    switchDocument(docName) {
        const editor = document.getElementById('editor');
        this.currentDocument = docName;
        editor.value = this.documents[docName] || '';
        this.updateWordCount();
    },

    // Create new document
    createNewDocument() {
        const docCount = Object.keys(this.documents).length + 1;
        const newDocName = `Document ${docCount}`;
        this.documents[newDocName] = '';
        this.switchDocument(newDocName);
        this.updateDocumentList();
    },

    // Update document list UI
    updateDocumentList() {
        const docList = document.getElementById('doc-list');
        docList.innerHTML = '';
        
        Object.keys(this.documents).forEach(docName => {
            const li = document.createElement('li');
            li.classList.add('doc-item');
            if (docName === this.currentDocument) {
                li.classList.add('active');
            }
            li.textContent = docName;
            docList.appendChild(li);
        });
    },

    // Update word and character count
    updateWordCount() {
        const editor = document.getElementById('editor');
        const text = editor.value;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;

        document.getElementById('word-count').textContent = `Words: ${words}`;
        document.getElementById('char-count').textContent = `Characters: ${chars}`;
    },

    // Update editor status
    updateStatus(status) {
        document.getElementById('status').textContent = status;
    },

    // Update last saved time
    updateLastSaved() {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('last-saved').textContent = `Last saved: ${time}`;
        this.updateStatus('Saved');
    }
};

// ==================== AUTHENTICATION ====================

const Auth = {
    isLoggedIn: false,
    currentUser: 'User',

    // Show login modal
    showLogin() {
        const modal = document.getElementById('login-modal');
        modal.classList.add('show');
    },

    // Hide login modal
    hideLogin() {
        const modal = document.getElementById('login-modal');
        modal.classList.remove('show');
    },

    // Handle login
    login(email) {
        this.isLoggedIn = true;
        this.currentUser = email.split('@')[0];
        document.getElementById('user-name').textContent = this.currentUser;
        this.hideLogin();
    },

    // Handle logout
    logout() {
        this.isLoggedIn = false;
        this.currentUser = 'User';
        document.getElementById('user-name').textContent = 'User';
        this.showLogin();
    }
};

// ==================== UI EVENT HANDLERS ====================

// Login button
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email-input').value;
    if (email.includes('@')) {
        Auth.login(email);
    } else {
        alert('Please enter a valid email');
    }
});

// Logout button
document.getElementById('logout-btn').addEventListener('click', () => {
    Auth.logout();
});

// Text formatting buttons
document.querySelectorAll('.tool-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const editor = document.getElementById('editor');
        if (index === 0) {
            // Bold
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const selected = editor.value.substring(start, end);
            if (selected) {
                const newText = editor.value.substring(0, start) + '**' + selected + '**' + editor.value.substring(end);
                editor.value = newText;
                Editor.saveCurrentDocument(newText);
            }
        } else if (index === 1) {
            // Italic
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const selected = editor.value.substring(start, end);
            if (selected) {
                const newText = editor.value.substring(0, start) + '*' + selected + '*' + editor.value.substring(end);
                editor.value = newText;
                Editor.saveCurrentDocument(newText);
            }
        } else if (index === 2) {
            // Underline
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const selected = editor.value.substring(start, end);
            if (selected) {
                const newText = editor.value.substring(0, start) + '__' + selected + '__' + editor.value.substring(end);
                editor.value = newText;
                Editor.saveCurrentDocument(newText);
            }
        } else if (index === 4) {
            // Save
            Editor.updateLastSaved();
            alert('Document saved!');
        } else if (index === 5) {
            // Share
            alert('Share feature: Copy link to share this document');
        }
    });
});

// ==================== INITIALIZE APP ====================

document.addEventListener('DOMContentLoaded', () => {
    // Show login if not authenticated
    if (!Auth.isLoggedIn) {
        Auth.showLogin();
    }
    
    // Initialize editor
    Editor.init();
});

// Prevent unsaved changes warning
window.addEventListener('beforeunload', (e) => {
    const editor = document.getElementById('editor');
    if (editor.value && Editor.lastSaved < new Date(Date.now() - 5000)) {
        e.preventDefault();
        e.returnValue = '';
    }
});