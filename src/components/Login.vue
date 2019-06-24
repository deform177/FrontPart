<template>
    <v-form ref="form"
            v-model="valid"
            lazy-validation>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>Login form</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text>
                                <v-text-field v-model="username" prepend-icon="person" name="login" label="Login" type="text" :rules="usernameRules" required></v-text-field>
                                <v-text-field v-model="password" prepend-icon="lock" name="password" label="Password" id="password" :rules="passwordRules" type="password"></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="login">Login</v-btn>
                                <v-btn color="primary" @click="registration">Registration</v-btn>
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
            username: '',
            usernameRules: [
                v => !!v || 'Login is required',
                v => (v && v.length <= 20) || 'Login must be less than 20 characters'
            ],
            password: '',
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length <= 25) || 'Password must be less than 25 characters'
            ],
        }),
        methods: {
            login() {
                if (this.$refs.form.validate()) {
                    const data = new URLSearchParams();
                    data.append('username', this.username);
                    data.append('password', this.password);
                    axios
                        .post('http://localhost:50625/api/account/token', data, {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        }).then(response => (sessionStorage.setItem('accessToken', response.data.access_token), this.$router.push('/dataTable')));
                }
            },
            registration() {
                this.$router.push('/registration')
            }
        }
    }
</script>