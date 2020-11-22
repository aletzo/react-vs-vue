const App = {
    data() {
        return {
            header : 'TODOs',
            filter: 'all',
        }
    },
    methods: {
    },
    template: `
    <todo-header :header="header"></todo-header>
    <todo-filter :filter="filter"></todo-filter>
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

app.component('todo-filter', {
    props: ['filter'],
    template: `
    Show

    <label :class="{ filter: true, selected: filter === 'all' }">
        <input type="radio" name="filter" v-model="filter" v-bind:value="all"> all
    </label>

    <label :class="{ filter: true, selected: filter === 'pending' }">
        <input type="radio" name="filter" v-model="filter" v-bind:value="pending"> pending
    </label>
    `
})

app.component('todo-list', {
    data() {
        return {
            items: [
                { done: false, level: 0, text: 'todo 1'    },
                { done: true,  level: 0, text: 'todo 2'    },
                { done: true,  level: 0, text: 'todo 3'    },
                { done: true,  level: 1, text: 'subtask 1' },
                { done: true,  level: 1, text: 'subtask 2' },
            ]
        }
    },
    methods: {
        onAddItem: function (newItem) {
            this.items.push({
                done: false,
                level: 0,
                text: newItem,
            })
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
    <ol>
        <todo-item 
            v-for="(item, index) in items"
            :index="index"
            :item="item"
            @delete-item="onDeleteItem"
            @drag-item="onDragItem"
        ></todo-item>
    </ol>
    <todo-add @add-item="onAddItem"></todo-add>
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
    <li :class="{ done: item.done, subtask: item.level === 1 }">
        <span @click="dragItem(index)">&vellip;&vellip;</span>
        <label>
            <input type="checkbox" v-model="item.done"> {{index}} {{item.text}}
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

