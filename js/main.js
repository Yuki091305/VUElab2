Vue.component('note-card', {
    props: ['title', 'items', 'checkedItems'],
    template: `
        <div class="card">
            <h3>{{ title }}</h3>
            <ul>
                <li v-for="(item, index) in items" :key="index">
                    <input 
                        type="checkbox" 
                        v-model="checkedItems" 
                        :value="index"
                        @change="$emit('item-checked', index)"
                    >
                    {{ item }}
                </li>
            </ul>
            <div class="progress">
                {{ progress }}% Complete
            </div>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
        </div>
    `,
    computed: {
        progress() {
            return Math.round((this.checkedItems.length / this.items.length) * 100);
        }
    }
});

let app = new Vue({
    el: '#app',
    data: {
        newCard: {
            title: '',
            items: ['', '', '']
        },
        columns: {
            first: [],
            second: [],
            third: []
        },
        isFirstColumnLocked: false,
    },
    methods: {
        addItem() {
            if (this.newCard.items.length < 5) {
                this.newCard.items.push('');
            }
        },
        removeItem(index) {
            if (this.newCard.items.length > 3) {
                this.newCard.items.splice(index, 1);
            }
        },
        addNewCard() {
            if (this.isInvalidCard) return;
            
            this.columns.first.push({
                id: Date.now(),
                title: this.newCard.title,
                items: this.newCard.items.filter(item => item.trim() !== ''),
                checkedItems: []
            });
            
            this.resetNewCard();
        },
        resetNewCard() {
            this.newCard = {
                title: '',
                items: ['', '', '']
            };
        },
        handleItemChecked(cardId, index) {
            const card = this.findCard(cardId);
            if (!card.checkedItems.includes(index)) {
                card.checkedItems.push(index);
                this.checkProgress(card);
            }
        },
        findCard(id) {
            // Find card in all columns
        },
        checkProgress(card) {
            const progress = card.checkedItems.length / card.items.length;
            
            if (this.isFirstColumnLocked && progress > 0.5) {
                return; // Skip if locked
            }
        },
        moveCard(card, from, to) {
            this.columns[from] = this.columns[from].filter(c => c.id !== card.id);
            this.columns[to].push(card);
            if (to === 'second' && this.columns.second.length >= 5) {
                this.isFirstColumnLocked = true;
            }
            if (from === 'second' && to === 'third') {
                this.isFirstColumnLocked = false;
            }
        },
        isInFirstColumn(card) {
            return this.columns.first.some(c => c.id === card.id);
        },
        isInSecondColumn(card) {
            return this.columns.second.some(c => c.id === card.id);
        },
        checkProgress(card) {
    const progress = card.checkedItems.length / card.items.length;
    
    if (progress > 0.5 && this.isInFirstColumn(card)) {
        this.moveCard(card, 'first', 'second');
    } else if (progress === 1 && this.isInSecondColumn(card)) {
        this.moveCard(card, 'second', 'third');
    }
    
    // Prevent duplicate moves
    if (progress === 1 && this.isInFirstColumn(card)) {
        this.moveCard(card, 'first', 'second');
    }
}
    },
    computed: {
        isInvalidCard() {
            const itemsValid = this.newCard.items.filter(i => i.trim() !== '').length >= 3;
            return !this.newCard.title || !itemsValid;
        },
        isAddButtonDisabled() {
            return this.isFirstColumnLocked || this.columns.first.length >= 3;
        },
        columnClasses() {
        return {
            'locked': this.isFirstColumnLocked
        };
    }
    }
});