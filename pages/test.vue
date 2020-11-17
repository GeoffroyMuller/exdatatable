<template>
  <section>
    <hr/>
    <p>currentPage</p>
    <b-input class="textinput" type="text"
             v-model="currentPage"
             placeholder="currentPage">
    </b-input>
    <p>perPage</p>
    <b-input @input="calculNbPage" class="textinput" type="text"
             v-model="perPage"
             placeholder="perPage">
    </b-input>
    <button @click="this.startPagination">TESTTT</button>

    <b-field lazy-validation>
      <b-input @input="debounce" class="textinput" type="text"
               v-model="first_name"
               placeholder="First Name">
      </b-input>
      <b-input @input="debounce" class="textinput" type="text"
               v-model="last_name"
               placeholder="Last Name">
      </b-input>
      <b-select @input="debounce" class="textinput" v-model="gender" placeholder="Gender">
        <option :value="undefined">Tout</option>
        <option>Male</option>
        <option>Female</option>
      </b-select>
      <b-button @click="searchBase" class="textinput" type="is-primary">Rechercher</b-button>
    </b-field>

    <b-pagination
      :total="this.totalElem"
      v-model="currentPage"
      @change="this.changePerPage"
      :per-page="perPage"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page">
    </b-pagination>

    <b-table
      :data="data"
      :debounce-search="1000"
      :bordered="isBordered"
      :striped="isStriped"
      :narrowed="isNarrowed"
      :hoverable="isHoverable"
      :loading="isLoading"
      :focusable="isFocusable"
      :mobile-cards="hasMobileCards">

      <b-table-column field="id" label="ID" width="40" numeric v-slot="props">
        {{ props.row.id }}
      </b-table-column>

      <b-table-column field="first_name" label="First Name" v-slot="props">
        {{ props.row.first_name }}
      </b-table-column>

      <b-table-column field="last_name" label="Last Name" v-slot="props">
        {{ props.row.last_name }}
      </b-table-column>

      <b-table-column field="date" label="Date" centered v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.date).toLocaleDateString() }}
                </span>
      </b-table-column>

      <b-table-column label="Gender" v-slot="props">
                <span>
                    <b-icon pack="fas"
                            :icon="props.row.gender === 'Male' ? 'mars' : 'venus'">
                    </b-icon>
                    {{ props.row.gender }}
                </span>
      </b-table-column>

    </b-table>


  </section>
</template>

<script>
  export default {
    name: "test",
    data() {
      return {
        isEmpty: false,
        isBordered: false,
        isStriped: false,
        isNarrowed: false,
        isHoverable: false,
        isFocusable: false,
        isLoading: false,
        hasMobileCards: true,

        first_name: '',
        last_name: '',
        gender: undefined,
        time: null,

        perPage: 5,
        totalPage: 0,
        totalElem: 0,
        nbpage: 0,
        currentPage: 1,

        data: [
          {'id': 1, 'first_name': 'Jesse', 'last_name': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male'},
          {'id': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male'},
          {'id': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female'},
          {'id': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male'},
          {'id': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female'}
        ],
        columns: [
          {
            field: 'id',
            label: 'ID',
            width: '100',
            numeric: true,
            searchable: true,
          },
          {
            field: 'first_name',
            label: 'First Name',
            searchable: true,
          },
          {
            field: 'last_name',
            label: 'Last Name',
            searchable: true,
          },
          {
            field: 'date',
            label: 'Date',
            centered: true
          },
          {
            field: 'gender',
            label: 'Gender',
          }
        ]
      }
    },
    async mounted() {
      const data = await this.$axios.get('http://localhost:1337/customers');
      this.$store.commit('setCustomers', data.data);
      this.data = this.$store.state.customers;
      this.calculNbPage();
    },

    methods: {


      async calculNbPage(){
        this.totalElem = (await  this.$axios.get('http://localhost:1337/customers/count')).data;
        this.changePerPage();
      },

      async changePerPage(){

        const data = await this.$axios.get(`http://localhost:1337/customers?`+
          `_start=${this.startPagination()}`+
          `&_limit=${this.perPage}`
        );
        this.data = data.data;
        console.log(data);
      },

      startPagination(){
        return (this.currentPage*this.perPage)-this.perPage;
      },

      async searchBase() {
        const data = await this.$axios
          .get(`http://localhost:1337/customers?`+
            `first_name_contains=${this.first_name}`+
            `&last_name_contains=${this.last_name}`+
            `${this.gender ? `&gender_eq=${this.gender}` : ''}`
          );
        console.log(data);
        this.data = data.data;
      },

      debounce() {
        clearTimeout(this.time);
        this.time = setTimeout(this.searchBase, 500);
      },

      addValue() {

        this.data.push({
            'id': 55,
            'first_name': 'zeu',
            'last_name': 'gou',
            'date': '2016-12-06 14:38:38',
            'gender': 'Female'
          }
        )
      }
    }
  }
</script>
