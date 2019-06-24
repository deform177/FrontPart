<template>
    <div>
        <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-form ref="form"
                    v-model="valid"
                    lazy-validation>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">New Purchase</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field v-model="editedItem.purchase" label="Purchase" disabled></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field v-model="editedItem.name" label="Name" :rules="nameRules"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field v-model="editedItem.date" label="Date" :rules="deteRules"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field v-model="editedItem.price" label="Price" :rules="priceRules"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md12>
                                        <v-text-field v-model="editedItem.details" label="Details"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-form>
        </v-toolbar>
        <v-data-table :headers="headers"
                      :items="purchases"
                      class="elevation-1"
                      :rows-per-page-items="[5,10,25]">
            <template v-slot:items="props">
                <td>{{ props.item.purchase }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.date }}</td>
                <td>{{ props.item.details }}</td>
                <td>{{ props.item.price }}</td>
                <td class="justify-center layout px-0">
                    <v-icon small
                            class="mr-2"
                            @click="editItem(props.item)">
                        edit
                    </v-icon>
                    <v-icon small
                            @click="deleteItem(props.item)">
                        delete
                    </v-icon>
                </td>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
        </v-data-table>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        data: () => ({
            valid: true,
            nameRules: [
                v => !!v || 'Login is required',
                v => (v && v.length <= 50) || 'Name must be less than 50 characters'
            ],
            deteRules: [
                v => /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s([0-1][0-9]:[0-5][0-9]|2[0-3]:[0-5][0-9])$/.test(v) || "Wrond format. Requared YYYY-mm-dd HH:mm"
            ],
            priceRules: [
                v => /^[0-9]{1,7},[0-9]{1,2}$/.test(v) || "Wrond format. Requared XXXXXXX,XX"
            ],
            dialog: false,
            headers: [
                { text: 'purchase', value: 'purchase', align: 'left' },
                {
                    text: 'name',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                { text: 'date', value: 'date', align: 'left' },
                { text: 'details', value: 'details', align: 'left' },
                { text: 'price', value: 'price', align: 'left' },

                { text: 'Actions', value: 'purchase', sortable: false }
            ],
            purchases: [],
            editedIndex: -1,
            editedItem: {
                purchase: 0,
                name: '',
                date: '',
                details: ''
            },
            defaultItem: {
                purchase: 0,
                name: '',
                date: '',
                details: ''
            }
        }),
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Purchase' : 'Edit Purchase'
            }
        },
        watch: {
            dialog(val) {
                val || this.close()
            }
        },

        mounted() {
            this.initialize()
        },
        methods: {
            initialize() {
                axios
                    .post('http://localhost:50625/api/values/getpurchase', {}, { headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken') } }).then(response => (this.purchases = response.data)).catch(response => (this.$router.push('/login')));
            },

            editItem(item) {
                this.editedIndex = this.purchases.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem(item) {

                const index = this.purchases.indexOf(item)
                const data = new URLSearchParams();
                data.append('purchaseid', item.purchase);
                axios.post('http://localhost:50625/api/values/deletepurchase', data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken') },
                }
                ).then(response => (this.purchases.splice(index, 1)));
            },

            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },

            save() {
                if (this.$refs.form.validate()) {
                    const data = new URLSearchParams();
                    data.append('purchaseid', this.editedItem.purchase);
                    data.append('name', this.editedItem.name);
                    data.append('date', this.editedItem.date);
                    data.append('details', this.editedItem.details);
                    data.append('price', this.editedItem.price.toString());

                    var purchaseid = '';
                    axios.post('http://localhost:50625/api/values/addpurchase', data, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken') },
                    }
                    ).catch(response => (alert('wrong'))).then(response => (this.editedItem.purchase = response.data.purchaseid));
                    if (this.editedIndex > -1) {
                        Object.assign(this.purchases[this.editedIndex], this.editedItem)
                    } else {

                        //this.editedItem.purchase = parseInt(purchaseid);
                        this.purchases.push(this.editedItem)
                    }
                    this.close()
                }
            }
        },
    }
</script>