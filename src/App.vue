<template>
  <v-app>
    <div class="d-block">
      <v-toolbar class="grey darken-4">
        <v-toolbar-title class="white--text">List of astronauts</v-toolbar-title>
        <!--p style="color: white">Valid: {{ valid }}</p-->
        
        <v-spacer></v-spacer>
        
        <v-dialog v-model="addDialog" max-width="600px" persistent>
          <template v-slot:activator="{ on }">
            <v-btn class="grey lighten-1 black--text" v-on="on" @click="openReg()">
              Register astronaut
            </v-btn>
          </template>
          <v-card>
            <v-form ref="regform" v-model="valid">
              <v-card-title>
                <span class="headline">Register astronaut</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="First Name"
                        v-model="rawName"
                        :counter="10"
                        :rules="rawNameRules"
                        required
                      ></v-text-field>
                      
                      <v-text-field
                        label="Last Name"
                        v-model="rawSurname"
                        :counter="15"
                        :rules="rawSurnameRules"
                        required
                      ></v-text-field>
                      
                      <v-menu v-model="regpicker" :close-on-content-click="false" min-width="290px">
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            label="Birthdate"
                            v-model="birthdate"
                            placeholder="Touch or click HERE to open a date picker"
                            readonly v-on="on"
                            :rules="[v => !!v || 'Birthdate is required']"
                            required
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="birthdate" @input="regpicker = false"></v-date-picker>
                      </v-menu>
                      
                      <v-select item-text="type" v-model="superskill" :items="skills" label="Super Skill">
                      </v-select>
                      <!--p>{{ regpicker }}</p-->
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled="!valid" class="grey lighten-1 black--text float-right" @click="submitAstronaut()">
                  Add Astronaut
                </v-btn>
                <v-btn class="red darken-1 white--text" @click="cancelReg()">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </div>

    <v-container>
      <v-row>
        <v-col cols="12" md="6" xl="4" v-for="astronaut in astronauts" v-bind:key="astronaut['.key']">
          
          <v-card>
            <div class="cardBg">
              <v-card-text>
                <h2 class="title">{{ astronaut.name }} {{ astronaut.surname }}</h2>
                <p class="text--primary">
                  <span class="font-weight-bold">Birthdate:</span> {{ astronaut.birthdate }}
                </p>
                <p class="text--primary">
                  <span class="font-weight-bold">Super skill:</span> {{ astronaut.superskill }}
                </p>
              </v-card-text>
              <v-card-actions v-if="!astronaut.remove">
                <v-btn class="red darken-1 white--text" @click="setRemoveAstronaut(astronaut['.key'])">
                  Remove
                </v-btn>
                <v-btn class="grey lighten-1 black--text" @click="setEditAstronaut(astronaut['.key'])">
                  Edit
                </v-btn>
              </v-card-actions>
              <v-card-actions v-else>
                <v-btn class="green darken-1 white--text" @click="cancelRemove(astronaut['.key'])">
                  Cancel
                </v-btn>
                <v-btn class="red darken-1 white--text" @click="removeAstronaut(astronaut['.key'])">
                  Really?
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
              
          <v-dialog max-width="600px" v-model="astronaut.edit" persistent>
            <v-card>
              <v-form v-model="valid">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-text-field
                          label="First Name"
                          v-model="astronaut.name"
                          :counter="10"
                          :rules="rawNameRules"
                          required
                        ></v-text-field>

                        <v-text-field
                          label="Last Name"
                          v-model="astronaut.surname"
                          :counter="15"
                          :rules="rawSurnameRules"
                          required
                        ></v-text-field>

                        <v-menu v-model="astronaut.editpicker" :close-on-content-click="false" min-width="290px">
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              label="Birthdate"
                              v-model="astronaut.birthdate"
                              hint="Touch or click on birthdate input to open a date picker"
                              readonly v-on="on"
                              :rules="[v => !!v || 'Birthdate is required']"
                              required
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="astronaut.birthdate" @input="astronaut.editpicker = false"></v-date-picker>
                        </v-menu>
                        
                        <v-select item-text="type" v-model="astronaut.superskill" :items="skills" label="Super Skill">
                        </v-select>
                        <!--p>{{ astronaut.editpicker }}</p-->
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="!valid" class="green darken-1 white--text" @click="saveEdit(astronaut)">
                    Save
                  </v-btn>
                  <v-btn class="red darken-1 white--text" @click="cancelEdit(astronaut['.key'])">
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>

        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { astronautsRef } from './firebase'
//import DatePicker from './components/DatePicker.vue'

export default {
  name: 'app',
  /*components: {
    DatePicker
  },*/
  data() {
    return {
      addDialog: false,
      valid: false,
      rawName: '',
      rawNameRules: [
        v => !!v || 'First name is required',
        v => /^[a-z]+$/i.test(v) || 'First name must contain only English alphabet letters',
        v => (v && v.length >= 3) || 'First name must be equal or more than 3 characters',
        v => (v && v.length <= 10) || 'First name must be less than or equal 10 characters',
      ],
      rawSurname: '',
      rawSurnameRules: [
        v => !!v || 'Last name is required',
        v => /^[a-z]+$/i.test(v) || 'Last name must contain only English alphabet letters',
        v => (v && v.length >= 3) || 'Last name must be equal or more than 3 characters',
        v => (v && v.length <= 15) || 'Last name must be less than or equal 15 characters',
      ],
      regpicker: false,
      birthdate: '',
      superskill: 'Kills aliens by one hand',
      astronauts: [],
      skills: [
        { type: 'Kills aliens by one hand' },
        { type: 'Repairs computer HAL3000' },
        { type: 'Withstands one hour without oxygen' },
        { type: 'Lived ten years on ISS' },
        { type: 'Lived twenty years on planet Mars' }
      ]
    }
  },
  /*watch: { ... Options for birthdate type calendar
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },*/
  computed: {
    name: function() {
      return this.rawName.charAt(0).toUpperCase() + this.rawName.slice(1).toLowerCase()
    },
    surname: function() {
      return this.rawSurname.charAt(0).toUpperCase() + this.rawSurname.slice(1).toLowerCase()
    }
  },
  firebase: {
    astronauts: astronautsRef
  },
  methods: {
    /*save (date) { ... Options for birthdate type calendar
        this.$refs.menu.save(date)
    },*/
    openReg() {
      this.valid = false;
    },
    cancelReg() {
      this.rawName = '';
      this.rawSurname = '';
      this.birthdate = '';
      this.superskill = 'Kills aliens by one hand';
      this.addDialog = false;
      this.$refs.regform.resetValidation();
    },
    submitAstronaut() {
      astronautsRef.push({
        name: this.name,
        surname: this.surname,
        birthdate: this.birthdate,
        superskill: this.superskill,
        edit: false,
        remove: false,
        editpicker: false
      });
      this.rawName = '';
      this.rawSurname = '';
      this.birthdate = '';
      this.superskill = 'Kills aliens by one hand';
      this.addDialog = false;
      this.$refs.regform.resetValidation();
    },
    setRemoveAstronaut(key) {
      astronautsRef.child(key).update({ remove: true })
    },
    cancelRemove(key) {
      astronautsRef.child(key).update({ remove: false })
    },
    removeAstronaut(key) {
      astronautsRef.child(key).remove();
    },
    setEditAstronaut(key) {
      astronautsRef.child(key).update({
        edit: true
      });
      this.valid = true;
    },
    cancelEdit(key) {
      astronautsRef.child(key).update({
        edit: false
      });
      //this.valid = false;
    },
    saveEdit(astro) {
      const key = astro['.key'];
      astronautsRef.child(key).set({
        name: astro.name.charAt(0).toUpperCase() + astro.name.slice(1).toLowerCase(),
        surname: astro.surname.charAt(0).toUpperCase() + astro.surname.slice(1).toLowerCase(),
        birthdate: astro.birthdate,
        superskill: astro.superskill,
        edit: false,
        remove: false,
        editpicker: false
      });
      //this.valid = false;
    }
  }
}
</script>

<style>
  .cardBg {
    background: url("./assets/astronaut.png") no-repeat right;
  }
</style>