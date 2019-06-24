<template>
  <v-app>
    <v-toolbar app>
     Purchases
      <v-spacer></v-spacer>
      <v-btn
        flat
        @click="exit"
        target="_blank"
      >
        <span class="mr-2">Log out</span>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>
 
<script>
export default {
  name: 'App',
  components: {

  },
  data () {
    return {
      //
    }
  },
methods: {
exit () {
 sessionStorage.removeItem('accessToken');
this.$router.push('/login');
}
}
}
</script>
