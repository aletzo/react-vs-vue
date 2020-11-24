const classList = classes => {
  return Object
    .entries(classes)
    .filter(entry => entry[1])
    .map(entry => entry[0])
    .join(' ');
}

class TodoHeader extends React.Component {
  render() {
    return (
    <h1>{this.props.header}</h1>
    );
  }
}

class TodoFilterRadio extends React.Component {
    render() {
        const { filter, value } = this.props

        return (
        <label
            className={
                classList({
                    filter: true,
                    selected: filter === value
                })
            }
        >
            <input
                type="radio" 
                name="filter"
                value={value}
                onChange={this.props.onChangeFilter}
                defaultChecked={filter === value}
            /> {value}
        </label>
        );
    }
}

class TodoFilter extends React.Component {
    render() {
        const filter = this.props.filter

        return (
        <p>
            Show

            <TodoFilterRadio
                filter={this.props.filter}
                onChangeFilter={this.props.onChangeFilter}
                value='all'
            />

            <TodoFilterRadio
                filter={this.props.filter}
                onChangeFilter={this.props.onChangeFilter}
                value='done'
            />

            <TodoFilterRadio
                filter={this.props.filter}
                onChangeFilter={this.props.onChangeFilter}
                value='pending'
            />
        </p>
        );
    }
}

class TodoItem extends React.Component {
  render() {
    const { item } = this.props

    return (
    <li
        className={
            classList({
                done: item.status === 'done',
                subtask: item.level === 1 
            })
        }
    >
        <span onClick={this.props.onDragItem}>⋮⋮</span>
        <label>
            <input 
                type="checkbox"
                onChange={this.props.onToggleItem}
                defaultChecked={item.status === 'done'}
                checked={item.status === 'done'}
            /> {item.index} {item.text}
        </label>
        <button onClick={this.props.onDeleteItem}>x</button>
    </li>
    );
  }
}

class TodoAdd extends React.Component {
  render() {
    return (
    <input 
        onKeyDown={this.props.onAddItem}
        type="text"
        placeholder="add item"
    />
    );
  }
}

class TodoList extends React.Component {
    render() {
        const filteredItems = this.props.items
            .filter(item => {
                const filter = this.props.filter

                if (filter === 'all') {
                    return true
                }

                return item.status === filter
            })

        return (
        <React.Fragment>
            <ol>
            {filteredItems.map((item, index) => (
                <TodoItem 
                    key={index}
                    item={item}
                    onDeleteItem={() => { this.props.onDeleteItem(item.index) }}
                    onDragItem={() => { this.props.onDragItem(item.index) }}
                    onToggleItem={() => { this.props.onToggleItem(item.index) }}
                 />
            ))}
            </ol>
            <TodoAdd
                onAddItem={this.props.onAddItem}
                newItem={this.props.newItem}
            />
        </React.Fragment>
        );
    }
}

class TodoApp extends React.Component {
    constructor(props) {
        super(props)

        this.onAddItem = this.onAddItem.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
        this.onDragItem = this.onDragItem.bind(this);
        this.onToggleItem = this.onToggleItem.bind(this);

        this.state = { 
            filter: 'all',
            items: [
                { index: 0, level: 0, status: 'pending', text: 'todo 1'    },
                { index: 1, level: 0, status: 'done',    text: 'todo 2'    },
                { index: 2, level: 0, status: 'done',    text: 'todo 3'    },
                { index: 3, level: 1, status: 'done',    text: 'subtask 1' },
                { index: 4, level: 1, status: 'done',    text: 'subtask 2' },
            ],
            newItem: '',
        }
    }

    onAddItem (event) {
        if (event.key !== 'Enter') {
            return;
        }

        const items = this.state.items
        
        items.push({
            index: items.length,
            level: 0,
            status: 'pending',
            text: event.target.value,
        })

        event.target.value = ''

        this.setState({ items })
    }

    onChangeFilter (event) {
        this.setState({filter: event.target.value});
    }

    onDeleteItem (itemIndex) {
        const items = this.state.items
            .filter((item, index) => index !== itemIndex)
            .map((item, index) => {
                item.index = index 

                return item
            })

        this.setState({ items })
    }

    onDragItem (itemIndex) {
        const items = this.state.items

        items.map((item, index) => {
            if (index === itemIndex) {
                item.level = item.level === 0 ? 1 : 0
            }
        })

        this.setState({ items })
    }

    onToggleItem (itemIndex) {
        let isParent = false
        let newStatus
        let siblingReached = false

        const items = this.state.items

        items.map((item, index) => {
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

        this.setState({ items })
    }

    render() {
        return (
        <React.Fragment>
            <TodoHeader header="TODOs" />
            <TodoFilter 
                filter={this.state.filter}
                onChangeFilter={this.onChangeFilter}
            />
            <TodoList
                filter={this.state.filter}
                items={this.state.items}
                newItem={this.state.newItem}

                onAddItem={this.onAddItem}
                onDeleteItem={this.onDeleteItem}
                onDragItem={this.onDragItem}
                onToggleItem={this.onToggleItem}
            />
        </React.Fragment>
        )
    }
}

ReactDOM.render(
    <TodoApp />,
    document.getElementById('app')
);

