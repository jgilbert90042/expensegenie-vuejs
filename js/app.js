class Expense {
    constructor(date, desc, category, amount) {
        this.date = date;
        this.desc = desc;
        this.category = category;
        this.amount = amount;
    }
}

Vue.component('expense-table', {
    props: ['expenses'],
    template: `
        <table class="table table-hover">
            <thead class="thead-light">
                <tr>
                    <th>Date</th>
                    <th>Desc</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <expense-element v-for="(expense, index) in expenses" v-bind:expense="expense" :key="index" v-on="$listeners">
                </expense-element>
            </tbody>
        </table>
`
})

Vue.component('expense-element', {
    props: ['expense', 'index'],
    data: function() {
        return {
            edit: 0
        }
    },
    template: `
                    <tr>
                    <td v-if="!edit">{{ expense.date }}</td>
                    <td v-if="edit"><input type="date" class="form-control" id="expense-date" v-model="expense.date"></td>
                    <td v-if="!edit">{{ expense.desc }}</td>
                    <td v-if="edit"><input type="text" class="form-control" id="expense-desc" v-model="expense.desc"></td>
                    <td v-if="!edit">{{ expense.category }}</td>
                    <td v-if="edit"><input type="text" class="form-control" id="expense-category" v-model="expense.category"></td>
                    <td v-if="!edit">\${{ expense.amount }}</td>
                    <td v-if="edit"><input type="text" class="form-control" id="expense-amount" v-model="expense.amount"></td>
                    <td>
                        <button class="btn btn-warning" v-if="!edit" v-on:click="edit = !edit">Edit</button> 
                        <button class="btn btn-danger" v-if="!edit" v-on:click="$emit('delete-expense', index)">Delete</button>
                        <button class="btn btn-primary" v-if="edit" v-on:click="edit = !edit">Save</button>
                    </td>
                </tr>
`
})

var app = new Vue({
    el: '#app',
    data: {
        expenseDate: '',
        expenseDesc: '',
        expenseCategory: '',
        expenseAmount: '',
        expenses: [
            new Expense('2001-01-01', 'This guy made me give him something.', '', '3.50'),
            new Expense('2002-01-01', 'This guy made me give him something again.', '', '3.50'),
            new Expense('2003-01-01', 'This guy made me give him something yet again.', '', '3.50'),
        ]
    },
    methods: {
        addExpense: function (event) {
            app.expenses.push(new Expense(app.expenseDate, app.expenseDesc, app.expenseCategory, app.expenseAmount));
            app.expenseDate = '';
            app.expenseDesc = '';
            app.expenseCategory = '';
            app.expenseAmount = '';
        },
        deleteExpense: function (expenseIndex) {
            app.expenses.splice(expenseIndex, 1);
        }
    }
})
