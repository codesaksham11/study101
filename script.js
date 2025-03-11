document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const labels = document.querySelectorAll('.category-label');

    labels.forEach(label => {
        label.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = label.getAttribute('data-href');
        });
    });

    startBtn.addEventListener('click', () => {
        const checked = document.querySelectorAll('input[type="checkbox"]:checked');
        if (checked.length > 0) {
            alert('Please select subcategories from individual division pages!');
        } else {
            alert('Select at least one category!');
        }
    });
});
