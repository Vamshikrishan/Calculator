class Calculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.previousOperand = '';
        this.currentOperand = '';
        this.operation = null;
        this.updateDisplay();
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '';
        this.operation = null;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    append(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Convert × to * and ÷ to / for calculation
        if (number === '×') number = '*';
        if (number === '÷') number = '/';
        
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
            case '×':
                computation = prev * current;
                break;
            case '/':
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatNumber(computation);
        this.operation = null;
        this.previousOperand = '';
        this.updateDisplay();
    }

    square() {
        if (this.currentOperand === '') return;
        
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = this.formatNumber(current * current);
        this.updateDisplay();
    }

    squareRoot() {
        if (this.currentOperand === '') return;
        
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        if (current < 0) {
            alert('Cannot calculate square root of negative number!');
            return;
        }
        
        this.currentOperand = this.formatNumber(Math.sqrt(current));
        this.updateDisplay();
    }

    reciprocal() {
        if (this.currentOperand === '') return;
        
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        if (current === 0) {
            alert('Cannot divide by zero!');
            return;
        }
        
        this.currentOperand = this.formatNumber(1 / current);
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentOperand === '') return;
        
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = this.formatNumber(current * -1);
        this.updateDisplay();
    }

    formatNumber(number) {
        // Format number to 2 decimal places if it's a decimal, otherwise keep it as is
        const stringNumber = number.toString();
        const intDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let intDisplay;

        if (isNaN(intDigits)) {
            intDisplay = '';
        } else {
            intDisplay = intDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${intDisplay}.${decimalDigits}`;
        } else {
            return intDisplay;
        }
    }

    updateDisplay() {
        this.displayElement.value = this.currentOperand || '0';
        
        // Display previous operand with operation
        const previousDisplay = document.getElementById('previous-operand');
        let displayOperation = '';
        
        if (this.operation != null) {
            displayOperation = ` ${this.operation}`;
        }
        
        previousDisplay.innerText = `${this.formatNumber(this.previousOperand)} ${displayOperation}`.trim();
    }
}

// Initialize calculator when DOM is loaded
const displayElement = document.getElementById('display');
const calculator = new Calculator(displayElement);

// Keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') {
        calculator.append(e.key);
    } else if (e.key === '.') {
        calculator.append('.');
    } else if (e.key === '+' || e.key === '-') {
        calculator.chooseOperation(e.key);
    } else if (e.key === '*') {
        calculator.chooseOperation('×');
    } else if (e.key === '/') {
        e.preventDefault();
        calculator.chooseOperation('÷');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
    } else if (e.key === 'Backspace') {
        calculator.delete();
    } else if (e.key.toLowerCase() === 'c') {
        calculator.clear();
    }
});
