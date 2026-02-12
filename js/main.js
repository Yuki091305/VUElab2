Vue.component('note-card', {
    props: ['title', 'items'],
    template: `
        <div class="card">
            <h3>{{ title }}</h3>
            <ul>
                <li v-for="(item, index) in items" :key="index">
                    {{ item }}
                </li>
            </ul>
        </div>
    `
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
        }
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
        }
    },
    computed: {
        isInvalidCard() {
            const itemsValid = this.newCard.items.filter(i => i.trim() !== '').length >= 3;
            return !this.newCard.title || !itemsValid;
        }
    }
});