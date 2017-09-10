<template>
  <div id="add-power-plant-modal" class="modal" :class="isActiveClass">
    <div class="modal-background"></div>
    <div class="modal-content">
      <!-- Any other Bulma elements you want -->
      <div class="card is-marginless">
        <div class="columns is-marginless">
          <div class="column is-half left">
            <div>
              <h1 class="green-text">Add a new power plant</h1>
            </div>
            <div class="middle">
              <!-- Form to enter the new power plant informaiton -->
              <form>
                <div class="field">
                  <p class="control has-icons-left">
                    <input v-model="name" class="input" type="text" placeholder="Name">
                    <span class="icon is-small is-left">
                      <i class="fa fa-bolt"></i>
                    </span>
                  </p>
                </div>
                <div class="field">
                  <div class="control has-icons-left">
                    <div class="select">
                      <select v-model="type">
                      <!-- TODO : remove the hard coding -->
                        <option disabled value=''>Type of power plant</option>
                        <option value='hydroelectric'>Hydroelectric</option>
                        <option value='solar'>Solar</option>
                        <option value='windmill'>Windmill</option>
                        <option value='nuclear'>Nuclear</option>
                        <option value='gas'>Gas</option>
                        <option value='biomass'>Biomass</option>
                      </select>
                    </div>
                    <div class="icon is-small is-left"><i class="fa fa-industry"></i></div>
                  </div>
                </div>
                <div class="field">
                  <p class="control has-icons-left">
                    <input v-model="capacity" class="input" type="text" placeholder="Capacity in kWh">
                    <span class="icon is-small is-left">
                      <i class="fa fa-battery-full"></i>
                    </span>
                  </p>
                </div>
              </form>
            </div>
            <div>
              <button class="button green-button" @click="add">add</button>
              <p v-if="error != ''" class="error-label">{{ error }}</p>
            </div>
          </div>
          <div class="column is-half add-thumbnail" :id="thumbnailId">
            <p>{{ type }}</p>
          </div>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close"></button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: '',
        capacity: '',
        type: '',
        error: '',
      };
    },
    props: {
      isActive: Boolean,
    },
    computed: {
      isActiveClass() {
        return this.isActive ? 'is-active' : '';
      },
      thumbnailId() { return this.type === '' ? '' : `${this.type}-thumbnail`; },
    },
    methods: {
      add() {
        if (this.name !== '' && this.capacity !== '' && this.type !== '') {
          this.error = '';
          this.$store.dispatch('addPowerPlant', {
            name: this.name,
            capacity: this.capacity,
            type: this.type,
          });
          this.close();
        } else if (this.name === '') {
          this.error = 'Name should not be empty';
        } else if (this.capacity === '') {
          this.error = 'Capacity should not be empty';
        } else {
          this.error = 'Please choose a powerplant type';
        }
      },
      close() {
        this.$emit('closeAddPowerPlantModal');
      },
    },
  };
</script>

<style lang="scss" scoped>
@import 'src/assets/css/var';

.left {
  padding: 80px 40px;

  h1 {
    line-height: 1;
  }

  form {
    .select::after {
      border-color: $green !important;
    }

    .select {
      max-width: 100%;
      min-width: 100%;

      select{
        max-width: 100%;
        min-width: 100%;
      }
    }
  }

  .middle {
    margin: 30px 0;
  }
}

.add-thumbnail {
  background-size: cover;
  background-image: url('../assets/img/type/windmill.jpg');

  &> p {
      font-size: 36px;
      font-weight: bold;
      color: white;
      width: 100px;
      position: relative;
      top: calc(100% - 65px);
      left: 20px;
      text-transform: capitalize;
  }
}

#hydroelectric-thumbnail {
  background-image: url('../assets/img/type/hydroelectric.jpg');
}

#solar-thumbnail {
  background-image: url('../assets/img/type/solar.jpg');
}

#windmill-thumbnail {
  background-image: url('../assets/img/type/windmill.jpg');
}

#gas-thumbnail {
  background-image: url('../assets/img/type/gas.jpg');
}

#biomass-thumbnail {
  background-image: url('../assets/img/type/biomass.jpg');
}

#nuclear-thumbnail {
  background-image: url('../assets/img/type/nuclear.jpg');
}
</style>