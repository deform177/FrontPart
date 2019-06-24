<template>
    <v-form ref="form"
            v-model="valid"
            lazy-validation>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">

                            <v-toolbar dark color="red">
                                <v-toolbar-title>Registration</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text>
                                <v-text-field v-model="username"
                                              :rules="nameRules"
                                              label="Name"
                                              required></v-text-field>
                                <v-text-field v-model="password"
                                              :rules="emailRules"
                                              label="E-mail"
                                              required></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red" @click="validate">Registration</v-btn>
                                <v-btn color="primary" @click="login">Login</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-form>
</template>

<script>
    import axios from 'axios'

    export default {
        data: () => ({
            valid: true,
            name: '',
            nameRules: [
                v => !!v || 'Login is required',
                v => (v && v.length <= 20) || 'Login must be less than 20 characters'
            ],
            email: '',
            emailRules: [
                v => !!v || 'Password is required',
                v => (v && v.length <= 25) || 'Login must be less than 25 characters'
            ]
        }),

        methods: {
            validate() {
                if (this.$refs.form.validate()) {

                    const data = new URLSearchParams();
                    data.append('username', this.username);
                    data.append('password', this.password);

                    axios.post('http://localhost:50625/api/account/registry', data, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    }).then(response => (this.$router.push('/login')));
                }
            },
            login() {
                this.$router.push('/login')
            }
        }
    }
</script>