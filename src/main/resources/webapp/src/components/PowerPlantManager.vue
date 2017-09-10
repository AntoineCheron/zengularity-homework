<template>
  <div id="power-plant-manager">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <div id="filters">
            <h2 class="dashboard-card-title">Filters</h2>
            <form>
              <!-- SEARCH INPUT -->
              <div class="field">
                <label class="label">Search by name</label>
                <div class="control has-icons-left has-icons-right">
                  <input v-model="searchByName" class="input" type="text" placeholder="Write the name here">
                  <span class="icon is-small is-left">
                    <i class="fa fa-search"></i>
                  </span>
                </div>
              </div>
              <!-- SORT BY DROPDOWN -->
              <div class="field">
                <label class="label">Sort by</label>
                <div class="control">
                  <div class="select">
                    <select v-model="sortBy">
                      <option value='capacityDown'>Capacity (High to Low)</option>
                      <option value='capacityUp'>Capacity (Low to High)</option>
                      <option value='name'>Name</option>
                      <option value='storage'>Storage level</option>
                    </select>
                  </div>
                </div>
              </div>
              <!-- PRODUCTION STATE DROPDOWN -->
              <div class="field">
                <label class="label">Production state</label>
                <div class="control">
                  <div class="select">
                    <select v-model="productionState">
                      <option value='both'>Both</option>
                      <option value='producing'>Producing</option>
                      <option value='consuming'>Consuming</option>
                    </select>
                  </div>
                </div>
              </div>
              <!-- NATURE DROPDOWN -->
              <div class="field">
                <label class="label">Nature</label>
                <div class="control">
                  <div class="select">
                    <select v-model="nature">
                    <!-- TODO : remove the hard coding -->
                      <option value='all'>All</option>
                      <option value='hydroelectric'>Hydroelectric</option>
                      <option value='solar'>Solar</option>
                      <option value='windmill'>Windmill</option>
                      <option value='nuclear'>Nuclear</option>
                      <option value='gas'>Gas</option>
                      <option value='biomass'>Biomass</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div id="manager-table">
            <h2 class="dashboard-card-title">Power plants</h2>
            <p>When a power plant is not producing, it is consuming.</p>
            <!-- Table containing the data -->
            <table style="width:100%">
              <tr>
                <th>Name</th>
                <th>Nature</th> 
                <th>Capacity in kWh</th>
                <th>State</th>
                <th>Storage level</th>
                <th>Actions</th>
              </tr>
              <tr v-for="pp in filteredPowerPlantsArray">
                <td>{{ pp.name }}</td>
                <td>{{ pp.type }}</td> 
                <td>{{ pp.capacity }}</td>
                <td class="state-td">
                  <span class="icon is-small" v-if="pp.producing"><i class="fa fa-arrow-up green-text"></i></span>
                  <span class="icon is-small" v-if="!pp.producing"><i class="fa fa-arrow-down red-text"></i></span>
                </td>
                <td>{{ pp.storage }}%</td>
                <td class="buttons">
                  <button @click="remove(pp)" class="remove-button"><span class="icon is-small"><i class="fa fa-trash purple-text"></i></span> remove</button>
                  <button class="prodButton" @click="turnProductionOff(pp)" v-if="pp.producing"><span class="icon is-small"><i class="fa fa-stop-circle red-text"></i></span> Turn production off</button>
                  <button class="prodButton" @click="turnProductionOn(pp)" v-if="!pp.producing"><span class="icon is-small"><i class="fa fa-play green-text"></i></span> Turn production on</button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex';

export default {
  data() {
    return {
      searchByName: '',
      sortBy: 'capacityDown',
      productionState: 'both',
      nature: 'all',
    };
  },
  computed: {
    powerplants() {
      return this.$store.state.powerplants.map((powerplant) => {
        powerplant.storage = this.$store.getters
          .getPowerPlantCurrentStoragePercentage(powerplant.powerPlantId);
        return powerplant;
      });
    },
    filteredPowerPlantsArray() {
      return this.powerplants
        // Apply the Search By Name filter
        .filter(powerPlant => powerPlant.name.toLowerCase()
          .includes(this.searchByName.toLowerCase()))
        // Apply the production state filter
        .filter(powerPlant =>
          this.productionState === 'both' || powerPlant.state.toLowerCase() === this.productionState.toLowerCase())
        // Apply the nature filter
        .filter(powerPlant =>
          this.nature === 'all' || powerPlant.nature.toLowerCase() === this.nature.toLowerCase())
        // Apply the sort by filter
        .sort((a, b) => {
          let res;
          if (this.sortBy === 'capacityDown') res = a.capacity < b.capacity;
          else if (this.sortBy === 'capacityUp') res = b.capacity < a.capacity;
          else if (this.sortBy === 'name') res = a.name.toLowerCase() > b.name.toLowerCase();
          else if (this.sortBy === 'storage') res = a.storage < b.storage;
          return res;
        });
    },
  },
  methods: {
    remove(powerPlant) {
      if (confirm(`Are you sure you want to delete powerplant ${powerPlant.name}`)) {
        this.$store.dispatch('removePowerPlant', powerPlant);
      }
    },
    turnProductionOff(powerPlant) {
      this.$store.dispatch('turnProductionOff', powerPlant);
    },
    turnProductionOn(powerPlant) {
      this.$store.dispatch('turnProductionOn', powerPlant);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/css/var';

#power-plant-manager {
  .tile.is-child {
    padding: 35px;
  }

  #filters {
    margin-bottom: 26px;

    h2 {
      margin-bottom: 20px;
    }

    form {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: space-between;

      .select::after {
        border-color: $green !important;
      }

      .field {
        .label {
          text-transform: uppercase;
          font-size: 11px;
        }
      }
    }
  }

  #manager-table {
    p {
      margin-bottom: 10px;
      font-size: 11px;
    }

    table {
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;

      tr {
        border-bottom: 1px solid $light-grey;
      }

      th {
        color: $grey;
        padding: 5px 0;
      }

      td {
        padding: 5px 0;

        &.state-td span {
          margin-left: 8px;
        }
      }

      button {
        border: none;
        padding: 0;
        background: none;
        text-transform: capitalize;
        font-size: 13px;
        font-weight: 600;

        &:hover {
          cursor: pointer;
        }

        &:focus {
          outline: none;
          background: none;
        }
      }

      .buttons {
        .prodButton {
          margin-left: 30px;
        }
      }
    }
  }
}
</style>