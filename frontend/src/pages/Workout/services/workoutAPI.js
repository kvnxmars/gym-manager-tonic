// ============================================================================

const API_URL = "http://localhost:5000/api";

export const workoutApi = {
    async fetchTemplates(studentNumber) {
        try {
            const response = await fetch(`${API_URL}/templates/${studentNumber}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch templates: ${response.status}`);
            }
            const data = await response.json();
            return data.templates || data || [];
        } catch (error) {
            console.error('Error fetching templates:', error);
            throw error;
        }
    },

    async createTemplate(studentNumber, template) {
        try {
            const payload = {
                studentNumber,
                name: template.name.trim(),
                category: template.category || 'Custom',
                exercises: template.exercises.map(ex => ({
                    name: ex.name.trim(),
                    type: ex.type || 'strength',
                    sets: ex.sets.map(set => ({
                        weight: set.weight || '',
                        reps: set.reps || '',
                        previous: set.previous || '',
                        completed: false
                    }))
                }))
            };

            const response = await fetch(`${API_URL}/templates/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create template: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating template:', error);
            throw error;
        }
    },


    async updateTemplate(studentNumber, templateId, template) {
       try {
        //step 1: update template
        const templatePayload = {
            studentNumber,
            name: template.name.trim(),
        

        };
        const templateRes = await fetch (`${API_URL}/templates/${templateId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(templatePayload),
        });
        
        if (!templateRes.ok) {
            throw new Error(`Failed to update: ${await templateRes.text()}`);
        }

        //update exercises
        for (const ex of template.exercises) {
            const exercisePayload = {
                exerciseName: ex.name.trim()
            };

            const exerciseRes = await fetch(`${API_URL}/templates/${templateId}/${ex.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(exercisePayload),
            });

            if (!exerciseRes.ok) {
                throw new Error(`Failed to update exercise ${ex.id}: ${await exerciseRes.text()}`);
            }

            //update sets for this exercise
            for (const set of exercise.sets) {
                const setPayload = {
                    weight: set.weight || "",
                    reps: set.reps || ""
                };

                const setRes = await fetch(`${API_URL}/templates/${templateId}/${ex.id}/${setIndex}}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(setPayload),
                });

                 if (!setRes.ok) {
                    throw new Error(`Failed to update set ${setIndex}: ${await setRes.text()}`);
                }

            }
        }
        return {message : "Template successfully updated."};
    }catch (error) {
        console.error("Error updating template", error);
        throw error;
    }
},

    async deleteTemplate(studentNumber, templateId) {
        try {
            const response = await fetch(`${API_URL}/templates/${templateId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentNumber })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete template: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting template:', error);
            throw error;
        }
    },

    async saveWorkoutSession(workoutSession) {
        try {
            const response = await fetch(`${API_URL}/workouts/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workoutSession)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save workout: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving workout session:', error);
            throw error;
        }
    },

    async fetchWorkoutHistory(studentNumber) {
        try {
            const response = await fetch(`${API_URL}/workouts/${studentNumber}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch workout history: ${response.status}`);
            }
            const data = await response.json();
            return data.sessions || data || [];
        } catch (error) {
            console.error('Error fetching workout history:', error);
            throw error;
        }
    }
};