import moment from './modules/moment.js';

class Expense {
    constructor(date, desc, category, amount) {
        this.date = date;
        this.desc = desc;
        this.category = category;
        this.amount = amount;
    }
}

Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('MM/DD/YYYY')
    }
})

Vue.component('expense-totals', {
    props: ['expenses'],
    created: function () {
        this.calcTotals();
    },
    beforeUpdate: function () {
        this.totals = {};
        this.calcTotals();
    },
    data: function() {
        return {
            totals: {}
        }
    },
    template: `
            <div class="col-2">
                <h3>Totals</h3>
                <div v-for="value, key in totals">
                    <div class="row">
                        <div class="col-6">
                            <strong>{{ key }}</strong>
                        </div>
                         <div class="col-6">
                            \${{ value }}
                         </div>
                    </div>
                </div>
                <div hidden>{{ expenses.length }}</div>

            </div>
          
`,
    methods: {
        calcTotals: function () {

            for (let expense of this.$props.expenses) {
                var category = expense.category != '' ? expense.category : 'Uncategorized';
                if (parseFloat(expense.amount)) {
                    if (typeof this.totals[category] === 'undefined') {
                        this.totals[category] = parseFloat(expense.amount);
                    } else {
                        this.totals[category] = parseFloat(expense.amount) + parseFloat(this.totals[category]);
                    }
                }
            }
        }
    }
})

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
                <expense-element v-for="(expense, index) in expenses" v-bind:expense="expense" v-bind:index="index" :key="index">
                </expense-element>
            </tbody>
        </table>
`
})

Vue.component('expense-element', {
    props: ['expense', 'index'],
    data: function() {
        return {
            edit: 0,
            expenseDate: this.expense.date,
            expenseDesc: this.expense.desc,
            expenseCategory: this.expense.category,
            expenseAmount: this.expense.amount
        }
    },
    template: `
                <tr v-if="!edit">
                    <td >{{ expense.date | formatDate }}</td>
                    <td v-if="!edit">{{ expense.desc }}</td>
                    <td v-if="!edit">{{ expense.category }}</td>
                    <td v-if="!edit">\${{ expense.amount }}</td>
                    <td>
                        <button class="btn btn-warning" v-if="!edit" v-on:click="edit = !edit">Edit</button> 
                        <button class="btn btn-danger" v-if="!edit" v-on:click="$parent.$emit('delete-expense', index)">Delete</button>
                    </td>
                </tr>
                <tr v-else-if="edit">
                    
                    <td colspan="5">
                        <div class="form-group form-row">
                            <div class="col-2">
                                <input type="date" class="form-control" id="expense-date-update" v-model="expenseDate" required>
                            </div>
                            <div class="col-5">
                                <input type="text" class="form-control" id="expense-desc-update" v-model="expenseDesc" required>
                            </div>
                            <div class="col-2">
                                <input type="text" class="form-control" id="expense-category-update" v-model="expenseCategory" size="4" required>
                            </div>
                            <div class="col-1">
                                <input type="text" class="form-control" id="expense-amount-update" v-model="expenseAmount" size="2" required>
                            </div>
                           <div class="col-2">
<!--                                <button class="btn btn-primary" v-on:click="edit = !edit">Save</button> -->
                                <button class="btn btn-primary" v-on:click="editExpense()">Save</button>
                            </div>
                        </div>
                     </td>
                </tr>
`,
    methods: {
        editExpense: function(event) {
            this.edit = !this.edit;
            var expense = new Expense(this.expenseDate, this.expenseDesc, this.expenseCategory, this.expenseAmount);
            this.$parent.$emit('edit-expense', this.index, expense);
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        expenseDate: '',
        expenseDesc: '',
        expenseCategory: '',
        expenseAmount: '',
        expenses: [
            new Expense('2020-06-01', 'Rent', 'Rent', '550'),
            new Expense('2020-06-05', 'Groceries from Food Lion', 'Groceries', '12.50'),
            new Expense('2020-06-10', 'Airfare to Las Vegas', 'Travel', '233.32'),
        ],
    },
    methods: {
        addExpense: function (event) {
            this.expenses.push(new Expense(this.expenseDate, this.expenseDesc, this.expenseCategory, this.expenseAmount));
            this.expenseDate = '';
            this.expenseDesc = '';
            this.expenseCategory = '';
            this.expenseAmount = '';
        },
        deleteExpense: function (expenseIndex) {
            this.expenses.splice(expenseIndex, 1);
        },
        editExpense: function (expenseIndex, expense) {
            console.log('Editing item ' + expenseIndex);
            this.expenses.splice(expenseIndex, 1, expense);
        }
    }
})
