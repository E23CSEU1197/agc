document.addEventListener('DOMContentLoaded', () => {
    const attendedInput = document.getElementById('attended');
    const totalInput = document.getElementById('total');
    const targetInput = document.getElementById('target');
    const calculateBtn = document.getElementById('calculate');
    const resultDiv = document.getElementById('result');
    
    calculateBtn.addEventListener('click', calculateGoal);
    
    // Also calculate on Enter key
    [attendedInput, totalInput, targetInput].forEach(input => {
        input.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                calculateGoal();
            }
        });
    });
    
    function calculateGoal() {
        // Get input values
        const attended = parseFloat(attendedInput.value);
        const total = parseFloat(totalInput.value);
        const targetPercentage = parseFloat(targetInput.value);
        
        // Reset result styles
        resultDiv.classList.remove('success', 'error');
        
        // Validate inputs
        if (isNaN(attended) || isNaN(total) || isNaN(targetPercentage)) {
            showError("Please enter all values");
            return;
        }
        
        if (attended < 0 || total < 0 || targetPercentage < 0 || targetPercentage > 100) {
            showError("Please enter valid values");
            return;
        }
        
        if (attended > total) {
            showError("Classes attended cannot be more than total classes");
            return;
        }
        
        // Convert percentage to decimal
        const targetDecimal = targetPercentage / 100;
        
        // Apply formula: X = ((P⋅T) - A) / (1 - P)
        let futureClasses;
        
        try {
            if (targetDecimal === 1) {
                // Special case: For 100% target, you need to attend all remaining classes
                const currentPercentage = (attended / total) * 100;
                if (currentPercentage < 100) {
                    showError("You cannot achieve 100% attendance since you've already missed classes");
                    return;
                } else {
                    futureClasses = "∞ (infinity)";
                }
            } else {
                futureClasses = Math.ceil(((targetDecimal * total) - attended) / (1 - targetDecimal));
                
                // Check if result is negative (already achieved)
                if (futureClasses < 0) {
                    const currentPercentage = (attended / total) * 100;
                    showSuccess(`You've already achieved ${targetPercentage}%! Current attendance: ${currentPercentage.toFixed(2)}%`);
                    return;
                }
            }
            
            showSuccess(`You need to attend ${futureClasses} future classes continuously to achieve ${targetPercentage}% attendance`);
            
        } catch (error) {
            showError("Calculation error. Please check your inputs.");
        }
    }
    
    function showError(message) {
        resultDiv.classList.add('error');
        resultDiv.innerHTML = `<p>${message}</p>`;
    }
    
    function showSuccess(message) {
        resultDiv.classList.add('success');
        resultDiv.innerHTML = `<p>${message}</p>`;
    }
}); 