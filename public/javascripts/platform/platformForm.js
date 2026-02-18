( function () {
    //existingPlatforms is inherited with edit.ejs or new.ejs files which loads this platformForm.js file.
    // Defensive guard (important for boilerplate layout)
    const wrapper = document.querySelector('#platform-wrapper')
    const addBtn = document.getElementById('add-platform')
    if (!wrapper || !addBtn) return;

    let platformCount = 0

    // Read existing platforms (if any)
    // const existingPlatforms = window.existingPlatforms || [];
    // console.log("Platforms:", existingPlatforms);

    function createPlatformInput(value= "") {
        platformCount += 1
        // create container group
        const group = document.createElement('div')
        group.classList.add('input-group', 'mb-2')

        // create a label
        const label = document.createElement('label')
        label.setAttribute('for', `platform-${platformCount}`)
        label.classList.add('form-label','visually-hidden')
        label.textContent='Platform'

        // create an input
        const input = document.createElement('input')
        input.type = 'text'
        input.classList.add('form-control')
        input.id = `platform-${platformCount}`
        input.name = 'course[platform][]'
        input.placeholder = 'Enter Platform'
        input.value = value

        // create remove Button
        const removeBtn = document.createElement('button')
        removeBtn.type = 'button'
        removeBtn.classList.add('btn', 'btn-danger', 'remove-platform')
        removeBtn.textContent = '-'

        // grouping all elements in group div
        group.append(label, input, removeBtn)
        wrapper.appendChild(group)

        updateRemoveButtons()

    }

    // Populate for Edit OR create one empty for Create
    if (existingPlatforms && existingPlatforms.length > 0) {
      existingPlatforms.forEach(platform => createPlatformInput(platform));
    } else {
      createPlatformInput();
    }

    // Add button
    addBtn.addEventListener('click', () => createPlatformInput())

    // Event delegation for remove buttons
    wrapper.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-platform")) {
        e.target.parentElement.remove();
        updateRemoveButtons();
        }
    });

    function updateRemoveButtons() {
        const removeButtons = wrapper.querySelectorAll('.remove-platform')
        removeButtons.forEach(btn => btn.disabled = removeButtons.length === 1)
    }

    updateRemoveButtons()


})()