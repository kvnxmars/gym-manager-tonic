// API Configuration
const API_URL = "http://localhost:5000/api/templates";
const STUDENT_NUMBER = localStorage.getItem("studentNumber") || "";

class WorkoutTemplateAPI {
  constructor() {
    this.baseURL = API_URL;
    this.studentNumber = STUDENT_NUMBER;
  }

  async fetchTemplates() {
    const response = await fetch(`${this.baseURL}/${this.studentNumber}`);
    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }
    const data = await response.json();
    return data.templates || [];
  }

  async createTemplate(templateData) {
    const response = await fetch(`${this.baseURL}/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ...templateData,
        studentNumber: this.studentNumber 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create template');
    }
    
    const data = await response.json();
    return data.template;
  }

  async updateTemplate(templateId, templateData) {
    const response = await fetch(`${this.baseURL}/${templateId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        ...templateData,
        studentNumber: this.studentNumber 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update template');
    }
    
    const data = await response.json();
    return data.template;
  }

  async deleteTemplate(templateId) {
    const response = await fetch(`${this.baseURL}/${templateId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete template');
    }
    
    return true;
  }

  // Utility method to get student number (useful for localStorage keys)
  getStudentNumber() {
    return this.studentNumber;
  }

  // Method to update student number (useful when user changes)
  setStudentNumber(newStudentNumber) {
    this.studentNumber = newStudentNumber;
  }
}

// Export singleton instance
export const workoutTemplateAPI = new WorkoutTemplateAPI();

// Export class for testing or multiple instances
export { WorkoutTemplateAPI };