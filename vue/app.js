const App = {
    data() {
        return {
            header : 'TODOs',
        }
    },
    methods: {
    },
    template: `
    <todo-header :header="header"></todo-header>
    <todo-list></todo-list>
    `
}

const app = Vue.createApp(App)

app.component('todo-header', {
    props: ['header'],
    template: `
    <h1>{{ header }}</h1>
    `
})

app.component('todo-list', {
    computed: {
        filteredItems() {
            if (this.filter === 'all') {
                return this.items
            }

            return this.items.filter(item => item.status === this.filter)
        }
    },
    data() {
        return {
            filter: 'all',
            items: [
                { level: 0, status: 'pending', text: 'todo 1'    },
                { level: 0, status: 'done',    text: 'todo 2'    },
                { level: 0, status: 'done',    text: 'todo 3'    },
                { level: 1, status: 'done',    text: 'subtask 1' },
                { level: 1, status: 'done',    text: 'subtask 2' },
            ]
        }
    },
    methods: {
        onAddItem: function (newItem) {
            this.items.push({
                level: 0,
                status: 'pending',
                text: newItem,
            })
        },
        onChangeFilter: function (selectedFilter) {
            this.filter = selectedFilter
        },
        onDeleteItem: function (itemIndex) {
            this.items = this.items.filter((item, index) => index !== itemIndex)
        },
        onDragItem: function (itemIndex) {
            this.items.map((item, index) => {
                if (index === itemIndex) {
                    item.level = item.level === 0 ? 1 : 0
                }
            })
        }
    },
    template: `
    <todo-filter
        @change-filter="onChangeFilter"
        ></todo-filter>
    <ol>
        <todo-item 
            v-for="(item, index) in filteredItems"
            :index="index"
            :item="item"
            @delete-item="onDeleteItem"
            @drag-item="onDragItem"
        ></todo-item>
    </ol>
    <todo-add @add-item="onAddItem"></todo-add>
    `
})

app.component('todo-filter', {
    data() {
        return {
            filter: 'all'
        }
    },
    methods: {
        changeFilter: function (filter) {
            this.$emit('change-filter', filter)
        }
    },
    template: `
    <div>
        Show

        <label :class="{ filter: true, selected: filter === 'all' }">
            <input
                type="radio" 
                name="filter"
                v-model="filter"
                @click="changeFilter('all')"
                value="all"
            > all
        </label>

        <label :class="{ filter: true, selected: filter === 'done' }">
            <input
                type="radio"
                name="filter"
                v-model="filter"
                @click="changeFilter('done')"
                value="done"
            > done
        </label>

        <label :class="{ filter: true, selected: filter === 'pending' }">
            <input
                type="radio"
                name="filter"
                v-model="filter"
                @click="changeFilter('pending')"
                value="pending"
            > pending
        </label>
    </div>
    `
})

app.component('todo-item', {
    methods: {
        deleteItem: function (index) {
            this.$emit('delete-item', index)
        },
        dragItem: function(index) {
            this.$emit('drag-item', index)
        }
    },
    props: ['index', 'item'],
    template: `
    <li :class="{ done: item.status === 'done', subtask: item.level === 1 }">
        <span @click="dragItem(index)">&vellip;&vellip;</span>
        <label>
            <input type="checkbox" v-model="item.done">{{item.text}}
        </label>
        <button @click="deleteItem(index)">x</button>
    </li>
    `
})

app.component('todo-add', {
    data() {
        return {
            newItem: '',
        }
    },
    methods: {
        addItem: function () {
            this.$emit('add-item', this.newItem)

            this.newItem = ''
        }
    },
    template: `
        <input type="text" @keyup.enter="addItem" v-model="newItem" placeholder="add item">
    `
})

app.mount('#app')

