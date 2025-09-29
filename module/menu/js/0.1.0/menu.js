/**
 * pageTemplate Vue Component
 * Auto-generated component file
 */

const { reactive, computed, onMounted } = Vue || window.Vue || {};

const pageTemplateComponent = {
  name: 'pageTemplate',
  
  template: `
    <div class="pagetemplate-container">
      <div class="component-header">
        <h2>{{ componentTitle }}</h2>
        <div class="status-indicator" :class="{ 'online': state.connected }">
          {{ state.connected ? 'Online' : 'Offline' }}
        </div>
      </div>
      
      <div class="component-content">
        <div v-if="state.loading" class="loading">
          Loading pageTemplate...
        </div>
        
        <div v-else class="data-display">
          <div class="info-card">
            <h3>Component Info</h3>
            <p>Name: {{ componentTitle }}</p>
            <p>Status: {{ state.connected ? 'Ready' : 'Initializing' }}</p>
            <p>Last Update: {{ formatTime(state.lastUpdate) }}</p>
          </div>
          
          <div class="actions">
            <button @click="refreshData" class="btn-refresh">
              🔄 Refresh
            </button>
            <button @click="toggleConnection" class="btn-toggle">
              {{ state.connected ? 'Disconnect' : 'Connect' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  
  setup() {
    const state = reactive({
      loading: true,
      connected: false,
      lastUpdate: new Date(),
      data: null
    });
    
    const componentTitle = computed(() => {
      return componentName.charAt(0).toUpperCase() + componentName.slice(1);
    });
    
    const loadData = async () => {
      state.loading = true;
      
      try {
        // Simulate data loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        state.data = {
          timestamp: new Date().toISOString(),
          status: 'operational'
        };
        
        state.connected = true;
        state.lastUpdate = new Date();
        
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        state.loading = false;
      }
    };
    
    const refreshData = () => {
      loadData();
    };
    
    const toggleConnection = () => {
      state.connected = !state.connected;
      state.lastUpdate = new Date();
    };
    
    const formatTime = (date) => {
      return date ? date.toLocaleTimeString() : '--';
    };
    
    onMounted(() => {
      loadData();
    });
    
    return {
      state,
      componentTitle,
      refreshData,
      toggleConnection,
      formatTime
    };
  }
};

export default pageTemplateComponent;
