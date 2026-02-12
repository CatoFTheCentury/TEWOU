// Common utilities for all tests
class TestLogger {
  constructor(containerId = 'log') {
    this.container = document.getElementById(containerId);
    this.entries = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const entry = { message, type, timestamp };
    this.entries.push(entry);

    if (this.container) {
      const entryDiv = document.createElement('div');
      entryDiv.className = `log-entry ${type}`;
      entryDiv.textContent = `[${timestamp}] ${message}`;
      this.container.appendChild(entryDiv);
      this.container.scrollTop = this.container.scrollHeight;
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  info(message) {
    this.log(message, 'info');
  }

  success(message) {
    this.log(message, 'success');
  }

  error(message) {
    this.log(message, 'error');
  }

  warning(message) {
    this.log(message, 'warning');
  }

  clear() {
    this.entries = [];
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

class TestStatus {
  constructor(elementId = 'test-status') {
    this.element = document.getElementById(elementId);
    this.tests = {};
  }

  addTest(name, description) {
    this.tests[name] = { description, status: 'running', result: null };
    this.render();
  }

  pass(name, result = '') {
    if (this.tests[name]) {
      this.tests[name].status = 'pass';
      this.tests[name].result = result;
      this.render();
    }
  }

  fail(name, error = '') {
    if (this.tests[name]) {
      this.tests[name].status = 'fail';
      this.tests[name].result = error;
      this.render();
    }
  }

  render() {
    if (!this.element) return;

    const html = Object.entries(this.tests).map(([name, test]) => {
      const statusClass = test.status;
      return `
        <li>
          <strong>${test.description}:</strong>
          <span class="status ${statusClass}">${test.status}</span>
          ${test.result ? `<br><small style="color: #666; margin-left: 150px;">${test.result}</small>` : ''}
        </li>
      `;
    }).join('');

    this.element.innerHTML = html;
  }
}

// Helper to wait for specific duration
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to check if two points are approximately equal
function pointsEqual(p1, p2, tolerance = 0.1) {
  return Math.abs(p1.x - p2.x) < tolerance && Math.abs(p1.y - p2.y) < tolerance;
}

// Helper to check if value is in range
function inRange(value, min, max) {
  return value >= min && value <= max;
}

// Counter for generating unique IDs
let uniqueIdCounter = 0;
function uniqueId(prefix = 'id') {
  return `${prefix}_${uniqueIdCounter++}`;
}
