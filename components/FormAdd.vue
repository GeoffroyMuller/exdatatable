<template>

  <section>
    <b-field lazy-validation>
      <b-input class="textinput" type="text"
               v-model="first_name"
               placeholder="First Name">
      </b-input>
      <b-input class="textinput" type="text"
               v-model="last_name"
               placeholder="Last Name">
      </b-input>
      <b-select class="textinput" v-model="gender" placeholder="Gender">
        <option>Male</option>
        <option>Female</option>
      </b-select>
      <b-button @click="addCustomer" class="textinput" type="is-primary">Ajouter</b-button>
    </b-field>
  </section>

</template>

<script>
  export default {
    name: "FormAdd",
    data() {
      return {
        first_name: null,
        last_name: null,
        gender: null,
      }
    },
    methods: {

      async addCustomer() {
        if (this.first_name && this.last_name && this.gender) {
          console.log("valu:" + this.first_name + ":" + this.last_name + ":" + this.gender);
          try {
            await this.$axios.post('http://localhost:1337/customers', {
                first_name: this.first_name,
                last_name: this.last_name,
                gender: this.gender
              }
            );
            const data = await this.$axios.get('http://localhost:1337/customers');
            console.log(data);
            this.$store.commit('setCustomers', data.data);
            this.validToast();
          } catch (e) {
            console.log(e);
          }
        } else {
          this.dangerToast();
        }
      },

      dangerToast() {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Error ISNULL >> first_name: ${this.first_name} | last_name: ${this.last_name} | gender: ${this.gender} `,
          position: 'is-bottom',
          type: 'is-danger'
        })
      },

      validToast() {
        this.$buefy.toast.open({
          message: 'success',
          type: 'is-success'
        })
      }


    }
  }
</script>

<style>

  .textinput {
    margin: 10px;
  }

</style>
