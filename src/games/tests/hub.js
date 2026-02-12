// Hub page JavaScript for test navigation
const testFrame = document.getElementById('test-frame');
const welcome = document.getElementById('welcome');
const testLinks = document.querySelectorAll('[data-test]');

testLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove active class from all links
    testLinks.forEach(l => l.classList.remove('active'));

    // Add active class to clicked link
    link.classList.add('active');

    // Load the test
    const testPath = link.getAttribute('data-test');
    testFrame.src = testPath;

    // Show iframe, hide welcome
    welcome.style.display = 'none';
    testFrame.style.display = 'block';
  });
});
