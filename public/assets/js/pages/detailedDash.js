import {initDatabase} from '../../../../../../../public/assets/js/db/db.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Detailed Dashboard scripts loaded');
    
    try {
        const db = await initDatabase();
        
        db.run(`
            CREATE TABLE IF NOT EXISTS choices (
                Project_Name TEXT,
                Primary_Environmental_Mechanism TEXT,
                Procedure TEXT,
                Environmental_Aspect TEXT,
                Obligation_Number TEXT,
                Obligation TEXT,
                Accountability TEXT,
                Responsibility TEXT,
                ProjectPhase TEXT,
                Action_DueDate TEXT,
                Close_Out_Date TEXT,
                Status TEXT,
                Supporting_Information TEXT,
                General_Comments TEXT,
                Compliance_Comments TEXT,
                NonConformance_Comments TEXT,
                Evidence TEXT,
                PersonEmail TEXT,
                Recurring_Obligation TEXT,
                Recurring_Frequency TEXT,
                Recurring_Status TEXT,
                Recurring_Forcasted_Date TEXT,
                Inspection TEXT,
                Inspection_Frequency TEXT,
                Site_or_Desktop TEXT,
                New_Control_action_required TEXT,
                Obligation_type TEXT
            );
        `);
        // Additional code to interact with the database
    } catch(error) {
        console.error('Error initializing database:', error);
    }
});
