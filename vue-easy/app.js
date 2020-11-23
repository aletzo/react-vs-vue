const App = {
    computed: {
        checked: {
            get () {
                return this.item.status === 'done'
            },
            set (val) {
                // set nothing?
            }
        },
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
            header : 'TODOs',
            items: [
                { level: 0, status: 'pending', text: 'todo 1'    },
                { level: 0, status: 'done',    text: 'todo 2'    },
                { level: 0, status: 'done',    text: 'todo 3'    },
                { level: 1, status: 'done',    text: 'subtask 1' },
                { level: 1, status: 'done',    text: 'subtask 2' },
            ],
            newItem: '',
        }
    },
    methods: {
        addItem: function (newItem) {
            this.items.push({
                level: 0,
                status: 'pending',
                text: newItem,
            })

            this.newItem = ''
        },
        changeFilter: function (selectedFilter) {
            this.filter = selectedFilter
        },
        deleteItem: function (itemIndex) {
            this.items = this.items.filter((item, index) => index !== itemIndex)
        },
        dragItem: function (itemIndex) {
            this.items.map((item, index) => {
                if (index === itemIndex) {
                    item.level = item.level === 0 ? 1 : 0
                }
            })
        },
        toggleItem: function (itemIndex) {
            let isParent = false
            let newStatus
            let siblingReached = false

            this.items.map((item, index) => {
                if (index === itemIndex) {
                    newStatus = item.status === 'done' ? 'pending' : 'done'

                    item.status = newStatus

                    isParent = item.level === 0
                }

                if (index > itemIndex && isParent) {

                    if (item.level === 1) {
                        if (!siblingReached) {
                            item.status = newStatus
                        }
                    } else {
                        siblingReached = true
                    }
                }
            })
        },
    }
}

Vue.createApp(App).mount('#app')

