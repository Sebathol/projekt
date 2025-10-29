/**
 * Workflow State Management
 * Handles workflow data and navigation between pages
 */

const WorkflowState = {
  // Get current workflow from sessionStorage
  getCurrentWorkflow() {
    const data = sessionStorage.getItem('current_workflow');
    return data ? JSON.parse(data) : null;
  },

  // Save current workflow to sessionStorage
  setCurrentWorkflow(workflow) {
    sessionStorage.setItem('current_workflow', JSON.stringify(workflow));
  },

  // Clear current workflow
  clearCurrentWorkflow() {
    sessionStorage.removeItem('current_workflow');
  },

  // Pass data to next page
  navigateToNextStep(nextPage, data) {
    // Save data to sessionStorage
    sessionStorage.setItem('workflow_data', JSON.stringify(data));

    // Navigate to next page
    window.location.href = nextPage;
  },

  // Get data from previous step
  getDataFromPreviousStep() {
    const data = sessionStorage.getItem('workflow_data');
    return data ? JSON.parse(data) : null;
  },

  // Clear workflow data
  clearWorkflowData() {
    sessionStorage.removeItem('workflow_data');
  },

  // Save workflow to backend
  async saveToBackend(workflowId, step, data) {
    try {
      const response = await Auth.apiRequest(`/api/workflows/${workflowId}/update`, {
        method: 'POST',
        body: JSON.stringify({ step, data })
      });

      console.log('✅ Workflow saved to backend');
      return response;
    } catch (error) {
      console.error('❌ Save to backend error:', error);
      throw error;
    }
  },

  // Load workflow from backend
  async loadFromBackend(workflowId) {
    try {
      const response = await Auth.apiRequest(`/api/workflows/${workflowId}`);
      return response.workflow;
    } catch (error) {
      console.error('❌ Load from backend error:', error);
      throw error;
    }
  },

  // Start new workflow
  async startNewWorkflow(mode = 'full') {
    try {
      // Check if user has workflows remaining
      const subscription = Auth.getSubscriptionData();

      if (!subscription || subscription.workflowsRemaining <= 0) {
        throw new Error('Workflow-Limit erreicht. Bitte upgraden Sie Ihr Abonnement.');
      }

      // Create new workflow object
      const workflow = {
        mode, // 'full' or 'partial'
        startedAt: new Date().toISOString(),
        currentStep: 'ideas',
        data: {}
      };

      this.setCurrentWorkflow(workflow);

      return workflow;
    } catch (error) {
      console.error('Start new workflow error:', error);
      throw error;
    }
  },

  // Continue existing workflow
  async continueWorkflow(workflowId) {
    try {
      const workflow = await this.loadFromBackend(workflowId);
      this.setCurrentWorkflow(workflow);

      // Navigate to current step
      const stepPages = {
        'ideas': 'ideengenerierung.html',
        'brainstorming': 'brainstorming.html',
        'prd': 'prd.html',
        'prototype': 'prototyp.html'
      };

      const nextPage = stepPages[workflow.current_step] || 'ideengenerierung.html';
      window.location.href = nextPage;
    } catch (error) {
      console.error('Continue workflow error:', error);
      throw error;
    }
  },

  // Complete workflow
  async completeWorkflow() {
    const workflow = this.getCurrentWorkflow();

    if (workflow && workflow.id) {
      // Mark as completed on backend
      await this.saveToBackend(workflow.id, 'prototype', {
        completed: true
      });
    }

    // Clear local data
    this.clearCurrentWorkflow();
    this.clearWorkflowData();

    // Redirect to success page or home
    window.location.href = '/index.html?workflow=completed';
  },

  // Get workflow list from backend
  async getWorkflowList() {
    try {
      const response = await Auth.apiRequest('/api/workflows/list');
      return response.workflows;
    } catch (error) {
      console.error('Get workflow list error:', error);
      throw error;
    }
  },

  // Delete workflow
  async deleteWorkflow(workflowId) {
    try {
      await Auth.apiRequest(`/api/workflows/${workflowId}`, {
        method: 'DELETE'
      });
      console.log('✅ Workflow deleted');
    } catch (error) {
      console.error('Delete workflow error:', error);
      throw error;
    }
  }
};

// Workflow Steps Helper
const WorkflowSteps = {
  steps: [
    { id: 'ideas', name: 'Ideen-Generator', page: 'ideengenerierung.html', icon: '💡' },
    { id: 'brainstorming', name: 'Brainstorming', page: 'brainstorming.html', icon: '🧠' },
    { id: 'prd', name: 'PRD Erstellen', page: 'prd.html', icon: '📄' },
    { id: 'prototype', name: 'Prototyp', page: 'prototyp.html', icon: '💻' }
  ],

  getCurrentStepIndex(stepId) {
    return this.steps.findIndex(s => s.id === stepId);
  },

  getNextStep(currentStepId) {
    const currentIndex = this.getCurrentStepIndex(currentStepId);
    if (currentIndex === -1 || currentIndex === this.steps.length - 1) {
      return null;
    }
    return this.steps[currentIndex + 1];
  },

  getPreviousStep(currentStepId) {
    const currentIndex = this.getCurrentStepIndex(currentStepId);
    if (currentIndex <= 0) {
      return null;
    }
    return this.steps[currentIndex - 1];
  },

  getStepById(stepId) {
    return this.steps.find(s => s.id === stepId);
  },

  // Render progress bar
  renderProgressBar(currentStepId) {
    const currentIndex = this.getCurrentStepIndex(currentStepId);

    return this.steps.map((step, index) => {
      const isActive = index === currentIndex;
      const isCompleted = index < currentIndex;
      const statusClass = isCompleted ? 'completed' : isActive ? 'active' : 'pending';

      return `
        <div class="progress-step ${statusClass}">
          <div class="step-icon">${step.icon}</div>
          <div class="step-name">${step.name}</div>
          <div class="step-indicator"></div>
        </div>
      `;
    }).join('');
  }
};

// Check subscription limit before workflow actions
const checkWorkflowLimit = () => {
  const subscription = Auth.getSubscriptionData();

  if (!subscription) {
    alert('Bitte melden Sie sich an, um fortzufahren.');
    window.location.href = '/auth.html';
    return false;
  }

  if (subscription.workflowsRemaining <= 0) {
    const upgrade = confirm(
      `Workflow-Limit erreicht!\n\n` +
      `Plan: ${subscription.plan}\n` +
      `Workflows verwendet: ${subscription.workflowsUsed} / ${subscription.workflowsLimit}\n\n` +
      `Möchten Sie Ihr Abonnement upgraden?`
    );

    if (upgrade) {
      window.location.href = '/index.html#pricing';
    }

    return false;
  }

  return true;
};

// Display subscription status in UI
const displaySubscriptionStatus = (elementId = 'subscription-status') => {
  const subscription = Auth.getSubscriptionData();
  const element = document.getElementById(elementId);

  if (!element || !subscription) return;

  const statusHTML = `
    <div class="subscription-status">
      <div class="plan-badge plan-${subscription.plan}">${subscription.plan.toUpperCase()}</div>
      <div class="workflows-remaining">
        <span class="count">${subscription.workflowsRemaining}</span> / ${subscription.workflowsLimit} Workflows übrig
      </div>
      ${subscription.daysRemaining < 9999 ? `
        <div class="days-remaining">
          <small>${subscription.daysRemaining} Tage verbleibend</small>
        </div>
      ` : ''}
    </div>
  `;

  element.innerHTML = statusHTML;
};
